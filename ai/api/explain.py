"""
POST /ai/explain
Explain selected H-Script code in simple Hinglish.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from core.gemini_client import ask_gemini

router = APIRouter()

class ExplainRequest(BaseModel):
    code: str
    selection: str | None = None   # optional — explain just selected text

class ExplainResponse(BaseModel):
    explanation: str

@router.post("/explain", response_model=ExplainResponse)
async def explain_code(body: ExplainRequest):
    target = body.selection or body.code
    prompt = f"""
The user wants a simple explanation of this H-Script code.
Explain it line by line in simple Hinglish — like you're a friendly tutor
talking to a beginner. Use emojis and keep it fun.

Code to explain:
```
{target}
```

Give a clear, friendly explanation. Mention what each part does.
If there's a bug or potential issue, point it out gently.
"""
    explanation = await ask_gemini(prompt)
    return ExplainResponse(explanation=explanation)
