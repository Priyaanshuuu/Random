"""DSPy modules wrapping each signature in a `Predict` step."""

import dspy

from app.dspy.config import get_lm
from app.dspy.signatures import ImprovePrompt, JudgeAnswer


class PromptOptimizer(dspy.Module):
    """Rewrites a system prompt in light of evaluation feedback."""

    def __init__(self) -> None:
        super().__init__()
        self.predict = dspy.Predict(ImprovePrompt)
        # Bound explicitly so the module works on FastAPI's worker threads,
        # which do not inherit `dspy.configure` from the startup thread.
        self.set_lm(get_lm())

    def forward(self, prompt: str, feedback: str) -> dspy.Prediction:
        return self.predict(prompt=prompt, feedback=feedback)


class AnswerJudge(dspy.Module):
    """Scores an answer against the question it was given."""

    def __init__(self) -> None:
        super().__init__()
        self.predict = dspy.Predict(JudgeAnswer)
        self.set_lm(get_lm())

    def forward(self, question: str, answer: str) -> dspy.Prediction:
        return self.predict(question=question, answer=answer)
