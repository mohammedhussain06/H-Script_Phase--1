"""
POST /ai/fix
Given code + an error message, suggest a fix.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from core.gemini_client import ask_gemini

router = APIRouter()

class FixRequest(BaseModel):
    code: str
    error: str

class FixResponse(BaseModel):
    fixed_code: str
    explanation: str

@router.post("/fix", response_model=FixResponse)
async def fix_code(body: FixRequest):
    prompt = f"""
The user's H-Script code has an error. Help them fix it.

Original code:
```
{body.code}
```

Error message:
"{body.error}"

Instructions:
1. Identify what caused the error
2. Provide the COMPLETE fixed code (not just the changed line)
3. Explain the fix in 2-3 friendly Hinglish sentences

Format your response EXACTLY like this:
```hscript
[complete fixed code here]
```
EXPLANATION: [what was wrong and how you fixed it]
"""
    raw = await ask_gemini(prompt)

    # Parse fixed code and explanation
    fixed_code = ""
    explanation = ""
    if "```" in raw:
        parts = raw.split("```")
        for i, part in enumerate(parts):
            if i % 2 == 1:
                lines = part.strip().splitlines()
                if lines and len(lines[0].strip()) < 20 and not lines[0].strip().startswith("let_him_cook"):
                    lines = lines[1:]
                fixed_code = "\n".join(lines).strip()
                break
    if "EXPLANATION:" in raw:
        explanation = raw.split("EXPLANATION:")[-1].strip()

    if not fixed_code:
        fixed_code = body.code
        explanation = raw

    return FixResponse(fixed_code=fixed_code, explanation=explanation)
