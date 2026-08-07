"""Environment-derived settings, validated at import time."""

import os

from dotenv import load_dotenv

load_dotenv()


def _required(name: str, hint: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"{name} is not set. {hint}")
    return value


def _positive_int(name: str, default: int) -> int:
    raw = os.getenv(name)
    if raw is None:
        return default

    try:
        value = int(raw)
    except ValueError as exc:
        raise RuntimeError(f"{name} must be an integer, got {raw!r}") from exc

    if value <= 0:
        raise RuntimeError(f"{name} must be greater than zero, got {value}")
    return value


def _temperature(name: str, default: float) -> float:
    raw = os.getenv(name)
    if raw is None:
        return default

    try:
        value = float(raw)
    except ValueError as exc:
        raise RuntimeError(f"{name} must be a number, got {raw!r}") from exc

    if not 0.0 <= value <= 2.0:
        raise RuntimeError(f"{name} must be between 0 and 2, got {value}")
    return value


GROQ_API_KEY = _required(
    "GROQ_API_KEY",
    "Copy backend/.env.example to backend/.env and fill in a key from "
    "https://console.groq.com/keys",
)

# Shared by every DSPy module so the model is changed in one place.
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

# DSPy routes through LiteLLM, which selects the provider from this prefix.
DSPY_MODEL = f"groq/{GROQ_MODEL}"

# Judging and prompt rewriting both want repeatable output, not creative output.
LM_TEMPERATURE = _temperature("LM_TEMPERATURE", 0.0)
LM_MAX_TOKENS = _positive_int("LM_MAX_TOKENS", 2048)

# Retries inside DSPy's LM client, for transient Groq 5xx / rate limits.
LM_NUM_RETRIES = _positive_int("LM_NUM_RETRIES", 3)

# DSPy caches identical calls in-process. Useful in dev, surprising in prod when
# the same prompt should be re-judged, so it is opt-in.
LM_CACHE = os.getenv("LM_CACHE", "false").lower() in {"1", "true", "yes"}
