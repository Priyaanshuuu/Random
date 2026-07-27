from app.core.openai import client

def judge(question, answer):

    completion = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role":"system",
                "content":"Evaluate this answer and give a score."
            },
            {
                "role":"user",
                "content":f"Question:\n{question}\n\nAnswer:\n{answer}"
            }
        ]
    )

    return completion.choices[0].message.content