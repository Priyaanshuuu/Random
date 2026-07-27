from fastapi import APIRouter

from app.schemas.evaluate import EvaluateRequest
from app.services.judge_service import judge

router = APIRouter(prefix="/evaluate")

@router.post("")
def evaluate(data: EvaluateRequest):

    result = judge(
        data.question,
        data.answer
    )

    return {
        "result": result
    }