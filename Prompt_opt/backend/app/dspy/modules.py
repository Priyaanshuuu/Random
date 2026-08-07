import dspy
from app.dspy.signatures import ImprovePrompt

class PromptOptimizer(dspy.Module):

    def __init__(self):
        super().__init__()
        self.predict = dspy.Predict(ImprovePrompt)

    def forward(self, prompt, feedback):

        result = self.predict(
            prompt=prompt,
            feedback=feedback
        )

        return result