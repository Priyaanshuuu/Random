from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.health import router as health_router
from app.routers.optimize import router as optimize_router
from app.routers.evaluate import router as evaluate_router

app = FastAPI(title="AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(optimize_router)
app.include_router(evaluate_router)