from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.errors import AIEngineError
from app.dspy.config import configure_dspy
from app.routers.health import router as health_router
from app.routers.optimize import router as optimize_router
from app.routers.evaluate import router as evaluate_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Builds the LM up front so a bad key or model name fails at boot rather than
    # on the first request. Modules bind the same instance via `get_lm`.
    configure_dspy()
    yield


app = FastAPI(title="AI Engine", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(AIEngineError)
async def ai_engine_error_handler(request: Request, exc: AIEngineError) -> JSONResponse:
    """Reports upstream model failures as 502 — the fault is not the caller's."""
    return JSONResponse(status_code=502, content={"detail": str(exc)})


app.include_router(health_router)
app.include_router(optimize_router)
app.include_router(evaluate_router)
