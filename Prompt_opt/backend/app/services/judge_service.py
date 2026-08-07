"""Answer grading, backed by the DSPy `AnswerJudge` module."""

import logging

from app.core.errors import InferenceError, InvalidVerdictError
from app.dspy.modules import AnswerJudge

logger = logging.getLogger(__name__)

_judge = AnswerJudge()


def judge(question: str, answer: str) -> dict:
    """Scores `answer` against `question`.

    The signature declares `score` as an int, so DSPy parses and coerces it —
    there is no JSON to unpack here. It cannot enforce the 0-100 range, though,
    so that is still checked below.

    Raises:
        InferenceError: the model was unreachable.
        InvalidVerdictError: the reply had no usable score or feedback.
    """
    try:
        prediction = _judge(question=question, answer=answer)
    except Exception as exc:
        logger.exception("Answer evaluation failed")
        raise InferenceError("Could not evaluate the answer") from exc

    try:
        score = int(prediction.score)
    except (TypeError, ValueError) as exc:
        raise InvalidVerdictError("Judge returned a non-numeric score") from exc

    feedback = (prediction.feedback or "").strip()
    if not feedback:
        raise InvalidVerdictError("Judge returned no feedback")

    return {"score": max(0, min(100, score)), "feedback": feedback}
