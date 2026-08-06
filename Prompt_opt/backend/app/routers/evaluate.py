from fastapi import APIRouter, HTTPException

from app.schemas.evaluate import EvaluateRequest
from app.services.judge_service import judge

router = APIRouter(prefix="/evaluate")


@router.post("")
def evaluate(data: EvaluateRequest):
    try:
        return judge(data.question, data.answer)
    except ValueError as exc:
        # The judge returned something unusable — surface it rather than a bare 500.
        raise HTTPException(status_code=502, detail=str(exc)) from exc
