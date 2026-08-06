import os

from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError(
        "GROQ_API_KEY is not set. Copy backend/.env.example to backend/.env "
        "and fill in a key from https://console.groq.com/keys"
    )

# Shared by the optimize and judge services so the model is changed in one place.
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
