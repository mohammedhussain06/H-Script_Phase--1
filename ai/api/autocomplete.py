"""
POST /ai/autocomplete
Returns ghost-text completions based on code prefix.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from core.gemini_client import ask_gemini

router = APIRouter()

class AutocompleteRequest(BaseModel):
    prefix: str          # last few lines of code up to cursor

class AutocompleteResponse(BaseModel):
    completions: list[str]

@router.post("/autocomplete", response_model=AutocompleteResponse)
async def autocomplete(body: AutocompleteRequest):
    # Only send last 10 lines to keep prompt small and fast
    lines = body.prefix.strip().splitlines()
    context = "\n".join(lines[-10:])

    prompt = f"""
You are an H-Script autocomplete engine. Given the code prefix below, suggest
1 to 3 short completions for what comes IMMEDIATELY NEXT after the cursor.

Rules:
- Each completion must be a SHORT snippet (not a full function)
- Use only valid H-Script syntax
- Return ONLY completions, one per line, no explanations, no numbering
- If nothing sensible follows, return a single empty line

Code prefix (cursor is at the very end):
```
{context}
```

Return completions only, one per line:
"""
    raw = await ask_gemini(prompt)
    # Parse: split by newlines, strip, remove empty/code-block lines
    lines_out = [
        l.strip() for l in raw.strip().splitlines()
        if l.strip() and not l.strip().startswith("```")
    ]
    completions = lines_out[:3] if lines_out else []
    return AutocompleteResponse(completions=completions)
