from pydantic import BaseModel

class EvaluateRequest(BaseModel):
    question: str
    answer: str