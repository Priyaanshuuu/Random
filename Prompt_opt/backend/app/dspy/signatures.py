import dspy

class ImprovePrompt(dspy.Signature):
    """
    Improve a system prompt using evaluation feedback.
    """

    prompt = dspy.InputField()

    feedback = dspy.InputField()

    improved_prompt = dspy.OutputField()