import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "NexaOps AI"
    APP_DESCRIPTION: str = "AI-Powered Business Operations Platform"
    APP_VERSION: str = "2.0.0"
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./nexaops.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "demo-secret-key-for-portfolio-nexaops")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    
    OPEN_ROUTER: str = os.getenv("OPEN_ROUTER", "")
    AI_MODEL: str = os.getenv("AI_MODEL", "google/gemini-2.5-flash")
    AI_ENGINE: str = os.getenv("AI_ENGINE", "agent")
    
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "*")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
