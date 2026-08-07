"""DSPy layer: language-model configuration, signatures, and modules.

Note on the package name: this package is called ``dspy`` and so shares a name
with the installed DSPy library. Absolute imports mean ``import dspy`` inside
these modules still resolves to the real library, because only ``backend/`` is on
``sys.path`` — not ``backend/app/dspy/``. That stops being true if a script is
run with this directory as the working directory, so ``config`` asserts it got
the real library rather than failing later with a confusing AttributeError.

Never write ``from app import dspy``; import the submodules directly.
"""

from app.dspy.config import configure_dspy, get_lm
from app.dspy.modules import AnswerJudge, PromptOptimizer
from app.dspy.signatures import ImprovePrompt, JudgeAnswer

__all__ = [
    "AnswerJudge",
    "ImprovePrompt",
    "JudgeAnswer",
    "PromptOptimizer",
    "configure_dspy",
    "get_lm",
]
