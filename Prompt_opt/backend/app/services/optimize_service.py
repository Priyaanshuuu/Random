from app.core.openai import client

def optimize_prompt(prompt: str, feedback: str):

    completion = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role":"system",
                "content":"Improve this prompt."
            },
            {
                "role":"user",
                "content":f"{prompt}\n\n{feedback}"
            }
        ]
    )

    return completion.choices[0].message.content