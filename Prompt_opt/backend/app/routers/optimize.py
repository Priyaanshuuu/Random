from fastapi import APIRouter

from app.schemas.optimize import OptimizeRequest
from app.services.optimize_service import optimize_prompt

router = APIRouter(prefix="/optimize")

@router.post("")
def optimize(data: OptimizeRequest):

    result = optimize_prompt(
        data.prompt,
        data.feedback
    )

    return {
        "optimizedPrompt": result
    }