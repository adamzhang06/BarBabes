from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongodb_uri: str = "mongodb://localhost:27017"
    google_gemini_api_key: str = ""
    snowflake_account: str = ""
    snowflake_user: str = ""
    snowflake_password: str = ""
    snowflake_warehouse: str = "COMPUTE_WH"
    snowflake_database: str = "SAFEROUND_ARCHIVE"
    snowflake_schema: str = "PUBLIC"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
