"""Declarative input/output contracts. DSPy builds the prompt from these."""

import dspy


class ImprovePrompt(dspy.Signature):
    """Rewrite a system prompt so it addresses the evaluation feedback.

    Preserve the original intent and voice. Return only the rewritten prompt,
    with no preamble, commentary, or surrounding quotes.
    """

    prompt: str = dspy.InputField(
        desc="The system prompt currently in use.",
    )
    feedback: str = dspy.InputField(
        desc="Recent judge feedback describing where the prompt falls short.",
    )
    improved_prompt: str = dspy.OutputField(
        desc="The rewritten system prompt, ready to use as-is.",
    )


class JudgeAnswer(dspy.Signature):
    """Score how well an answer responds to the question it was given."""

    question: str = dspy.InputField(
        desc="The question that was asked.",
    )
    answer: str = dspy.InputField(
        desc="The answer to grade.",
    )
    score: int = dspy.OutputField(
        desc="Quality of the answer from 0 (useless) to 100 (excellent).",
    )
    feedback: str = dspy.OutputField(
        desc="One or two sentences justifying the score.",
    )
