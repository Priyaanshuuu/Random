from app.core.config import GROQ_MODEL
from app.core.groq import client


def optimize_prompt(prompt: str, feedback: str) -> str:
    completion = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You improve system prompts. "
                    "Return ONLY the improved prompt, with no preamble or commentary."
                ),
            },
            {
                "role": "user",
                "content": f"Current prompt:\n{prompt}\n\nFeedback:\n{feedback}",
            },
        ],
    )

    return completion.choices[0].message.content or prompt
