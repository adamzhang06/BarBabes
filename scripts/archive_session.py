"""
Archive completed session data from MongoDB to Snowflake at end of night
for long-term safety research.
Run via cron or scheduler (e.g. daily 4am).
"""
import os
from datetime import datetime, timedelta

# Optional: load from backend env
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", "backend", ".env"))
except ImportError:
    pass

MONGODB_URI = os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
SNOWFLAKE_ACCOUNT = os.environ.get("SNOWFLAKE_ACCOUNT")
SNOWFLAKE_USER = os.environ.get("SNOWFLAKE_USER")
SNOWFLAKE_PASSWORD = os.environ.get("SNOWFLAKE_PASSWORD")
SNOWFLAKE_WAREHOUSE = os.environ.get("SNOWFLAKE_WAREHOUSE", "COMPUTE_WH")
SNOWFLAKE_DATABASE = os.environ.get("SNOWFLAKE_DATABASE", "SAFEROUND_ARCHIVE")
SNOWFLAKE_SCHEMA = os.environ.get("SNOWFLAKE_SCHEMA", "PUBLIC")


def run_archive():
    if not all([SNOWFLAKE_ACCOUNT, SNOWFLAKE_USER, SNOWFLAKE_PASSWORD]):
        print("Snowflake credentials not set. Set SNOWFLAKE_ACCOUNT, USER, PASSWORD.")
        return 0

    try:
        from pymongo import MongoClient
        import snowflake.connector
    except ImportError as e:
        print(f"Install pymongo and snowflake-connector-python: {e}")
        return 0

    # Sessions "completed" = older than end of previous calendar day
    end_of_yesterday = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    start_cutoff = end_of_yesterday - timedelta(days=7)  # archive last 7 days of completed

    client = MongoClient(MONGODB_URI)
    db = client.get_database("saferound")

    # Collect completed drink records and any session summary you maintain
    drinks_cursor = db.drinks.find({"timestamp": {"$lt": end_of_yesterday, "$gte": start_cutoff}})
    sessions_to_archive = []
    for doc in drinks_cursor:
        doc["_id"] = str(doc["_id"])
        if isinstance(doc.get("timestamp"), datetime):
            doc["timestamp"] = doc["timestamp"].isoformat()
        sessions_to_archive.append(doc)

    if not sessions_to_archive:
        print("No completed sessions to archive.")
        return 0

    conn = snowflake.connector.connect(
        account=SNOWFLAKE_ACCOUNT,
        user=SNOWFLAKE_USER,
        password=SNOWFLAKE_PASSWORD,
        warehouse=SNOWFLAKE_WAREHOUSE,
        database=SNOWFLAKE_DATABASE,
        schema=SNOWFLAKE_SCHEMA,
    )
    cur = conn.cursor()
    try:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS archive_drinks (
                id VARCHAR,
                drink_id VARCHAR,
                user_id VARCHAR,
                alcohol_grams FLOAT,
                timestamp VARCHAR,
                archived_at TIMESTAMP_NTZ
            )
        """)
        archived_at = datetime.utcnow().isoformat()
        for row in sessions_to_archive:
            cur.execute(
                """INSERT INTO archive_drinks (id, drink_id, user_id, alcohol_grams, timestamp, archived_at)
                   VALUES (%s, %s, %s, %s, %s, %s)""",
                (
                    row.get("_id"),
                    row.get("drink_id"),
                    row.get("user_id"),
                    row.get("alcohol_grams"),
                    row.get("timestamp"),
                    archived_at,
                ),
            )
        conn.commit()
        print(f"Archived {len(sessions_to_archive)} drink records to Snowflake.")
    finally:
        cur.close()
        conn.close()

    # Optional: remove archived docs from MongoDB to save space
    # ids = [ObjectId(s["_id"]) for s in sessions_to_archive if s.get("_id")]
    # if ids:
    #     db.drinks.delete_many({"_id": {"$in": ids}})

    return len(sessions_to_archive)


if __name__ == "__main__":
    run_archive()
