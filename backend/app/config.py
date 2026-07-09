from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "sqlite:///./realestate.db"
    gemini_api_key: str | None = None
    frontend_url: str = "http://localhost:3000"
    admin_token: str | None = None
    supabase_url: str | None = None
    supabase_key: str | None = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
