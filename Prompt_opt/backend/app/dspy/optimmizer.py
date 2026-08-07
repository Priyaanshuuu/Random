from app.dspy.modules import PromptOptimizer

optimizer = PromptOptimizer()


def optimize(current_prompt: str, feedback: str) -> str:
    """
    Optimize a prompt using DSPy.
    """

    result = optimizer(
        prompt=current_prompt,
        feedback=feedback,
    )

    return result.improved_prompt