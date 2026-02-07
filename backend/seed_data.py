import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017")
db = client.saferound
users = db.users

user_data = {
    "user_id": "demo-user-1",
    "is_cut_off": False,
    "age": 25,
    "weight_kg": 70,
    "sex": "male"
}

# Update or insert (upsert) to avoid duplicates if run multiple times
result = users.update_one(
    {"user_id": user_data["user_id"]},
    {"$set": user_data},
    upsert=True
)

print(f"Seeded user: {user_data['user_id']}")
print(f"Matched: {result.matched_count}, Modified: {result.modified_count}, Upserted: {result.upserted_id}")
