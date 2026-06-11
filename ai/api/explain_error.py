"""
POST /ai/explain-error
Classifies error type and gives a beginner-friendly Hinglish explanation.
Auto-triggered when Run returns errors.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from core.gemini_client import ask_gemini

router = APIRouter()

class ExplainErrorRequest(BaseModel):
    code: str
    error: str

class ExplainErrorResponse(BaseModel):
    error_type: str      # SyntaxError | ReferenceError | TypeError | RuntimeError | LogicError
    explanation: str     # friendly Hinglish explanation
    hint: str            # one-line fix hint

@router.post("/explain-error", response_model=ExplainErrorResponse)
async def explain_error(body: ExplainErrorRequest):
    prompt = f"""
A user is learning H-Script and got this error while running their code.

Code:
```
{body.code}
```

Error message:
"{body.error}"

Your job:
1. Classify the error into ONE of these types:
   SyntaxError | ReferenceError | TypeError | RuntimeError | LogicError

2. Write a SHORT friendly explanation (2-3 sentences) in Hinglish — like a helpful tutor.
   Use emojis. Don't be too technical.

3. Give ONE short fix hint (a single sentence).

Format your response EXACTLY like this (no extra text):
ERROR_TYPE: [one of the 5 types above]
EXPLANATION: [your 2-3 sentence Hinglish explanation]
HINT: [one-line fix suggestion]
"""
    raw = await ask_gemini(prompt)

    # Parse structured response
    error_type   = "RuntimeError"
    explanation  = raw
    hint         = ""

    for line in raw.splitlines():
        if line.startswith("ERROR_TYPE:"):
            error_type = line.split(":", 1)[1].strip()
        elif line.startswith("EXPLANATION:"):
            explanation = line.split(":", 1)[1].strip()
        elif line.startswith("HINT:"):
            hint = line.split(":", 1)[1].strip()

    return ExplainErrorResponse(
        error_type=error_type,
        explanation=explanation,
        hint=hint,
    )
