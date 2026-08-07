"""Prompt optimization, backed by the DSPy `PromptOptimizer` module."""

import logging

from app.core.errors import InferenceError
from app.dspy.modules import PromptOptimizer

logger = logging.getLogger(__name__)

# Modules are stateless once constructed, so one instance is shared rather than
# rebuilt per request.
_optimizer = PromptOptimizer()


def optimize_prompt(prompt: str, feedback: str) -> str:
    """Rewrites `prompt` so it addresses `feedback`.

    Raises:
        InferenceError: the model was unreachable or returned an empty prompt.
    """
    try:
        prediction = _optimizer(prompt=prompt, feedback=feedback)
    except Exception as exc:
        logger.exception("Prompt optimization failed")
        raise InferenceError("Could not optimize the prompt") from exc

    improved = (prediction.improved_prompt or "").strip()

    # An empty rewrite would silently wipe the caller's prompt.
    if not improved:
        raise InferenceError("Optimizer returned an empty prompt")

    return improved
