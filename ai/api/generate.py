"""
POST /ai/generate
Generate H-Script code from a plain English/Hinglish description.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from core.gemini_client import ask_gemini

router = APIRouter()

class GenerateRequest(BaseModel):
    prompt: str          # e.g. "write a function that adds two numbers"
    context: str | None = None  # optional — existing code for context

class GenerateResponse(BaseModel):
    code: str
    explanation: str

@router.post("/generate", response_model=GenerateResponse)
async def generate_code(body: GenerateRequest):
    context_section = ""
    if body.context:
        context_section = f"""
Existing code context (write code that fits with this):
```
{body.context}
```
"""
    prompt = f"""
The user wants you to write H-Script code based on this description:
"{body.prompt}"

{context_section}

Rules:
1. ONLY use valid H-Script syntax (let_him_cook, boliye, pov, agar, warna, etc.)
2. Write clean, readable code with comments
3. After the code block, give a SHORT 2-3 line explanation of what you wrote

Format your response EXACTLY like this:
```hscript
[your code here]
```
EXPLANATION: [short explanation here]
"""
    raw = await ask_gemini(prompt)

    # Guard: empty = rate limit hit
    if not raw or not raw.strip():
        return GenerateResponse(
            code="// AI is busy, try again in a moment bhai 🙏",
            explanation="Rate limit hit — wait a few seconds and try again."
        )

    # Parse code and explanation from response
    code = ""
    explanation = ""
    if "```" in raw:
        parts = raw.split("```")
        for i, part in enumerate(parts):
            if i % 2 == 1:  # inside code block
                lines = part.strip().splitlines()
                if lines and not lines[0].strip().startswith("let_him_cook") \
                        and not lines[0].strip().startswith("//") \
                        and len(lines[0].strip()) < 20:
                    lines = lines[1:]
                code = "\n".join(lines).strip()
                break
    if "EXPLANATION:" in raw:
        explanation = raw.split("EXPLANATION:")[-1].strip()
    if not code:
        # Fallback — return whole response as code
        code = raw.strip()
        explanation = ""

    return GenerateResponse(code=code, explanation=explanation)
