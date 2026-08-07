from fastapi import APIRouter

from app.schemas.evaluate import EvaluateRequest
from app.services.judge_service import judge

router = APIRouter(prefix="/evaluate")


@router.post("")
def evaluate(data: EvaluateRequest):
    # AIEngineError is translated to a 502 by the handler in `main`.
    return judge(data.question, data.answer)
