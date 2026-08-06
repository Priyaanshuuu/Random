import json

from app.core.config import GROQ_MODEL
from app.core.groq import client

JUDGE_SYSTEM_PROMPT = """You are an AI judge.

Score how well the answer responds to the question.

Return ONLY a JSON object of the form:
{"score": <integer 0-100>, "feedback": "<one or two sentences>"}"""


def judge(question: str, answer: str) -> dict:
    completion = client.chat.completions.create(
        model=GROQ_MODEL,
        # Guarantees parseable JSON instead of prose wrapped in a markdown fence.
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": JUDGE_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"Question:\n{question}\n\nAnswer:\n{answer}",
            },
        ],
    )

    return _parse_verdict(completion.choices[0].message.content)


def _parse_verdict(content: str | None) -> dict:
    """Coerces the model's reply into a score/feedback pair.

    JSON mode makes malformed output unlikely but not impossible, and the model
    can still return a score outside the documented range.
    """
    try:
        data = json.loads(content or "")
    except json.JSONDecodeError as exc:
        raise ValueError("Judge did not return valid JSON") from exc

    if not isinstance(data, dict):
        raise ValueError("Judge did not return a JSON object")

    try:
        score = int(data["score"])
    except (KeyError, TypeError, ValueError) as exc:
        raise ValueError("Judge response is missing a numeric score") from exc

    feedback = data.get("feedback")
    if not isinstance(feedback, str) or not feedback.strip():
        raise ValueError("Judge response is missing feedback")

    return {"score": max(0, min(100, score)), "feedback": feedback.strip()}
