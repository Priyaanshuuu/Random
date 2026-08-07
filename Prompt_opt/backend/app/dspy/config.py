import dspy
import os

lm = dspy.LM(
    model="groq/llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

dspy.configure(lm=lm)