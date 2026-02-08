"""Create MongoDB indexes for SafeRound collections."""

from motor.core import AgnosticDatabase


async def create_indexes(db: AgnosticDatabase) -> None:
    """Create indexes for users and drinks. Idempotent."""
    await db.users.create_index("user_id", unique=True)
    await db.drinks.create_index([("user_id", 1), ("timestamp", -1)])
    await db.groups.create_index("code", unique=True)
