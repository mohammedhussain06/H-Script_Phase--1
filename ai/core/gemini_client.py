"""
AI client — powered by Groq (llama-3.3-70b-versatile)
Fast, free tier, reliable API keys (gsk_...)
"""
import os
import asyncio
import concurrent.futures
import warnings
warnings.filterwarnings("ignore")

from groq import Groq
from dotenv import load_dotenv

load_dotenv()

_client = Groq(api_key=os.environ["GROQ_API_KEY"])
_executor = concurrent.futures.ThreadPoolExecutor(max_workers=4)

HSCRIPT_SYSTEM_PROMPT = """
You are an expert H-Script tutor and code assistant. H-Script is a fun, Hinglish-flavored
programming language. Here are its key keywords and syntax rules:

KEYWORDS:
- let_him_cook   → variable declaration (like let/var/const)
- boliye()       → print to output
- agar           → if
- warna          → else
- baaki_sab agar → else if
- jab_tak_doomscroll → while loop
- baar_baar      → for loop
- nikal_lo       → break
- skip_karo      → continue
- pov            → function definition (like function/def)
- wapas_karo     → return
- squad          → class definition
- new            → create instance
- this           → current object reference
- buzurg         → super (parent class)
- nepo_baby_of   → extends (inheritance)
- agar_risk      → try
- pakad_lo       → catch
- jo_bhi_hai_bhaad_me_jaaye → finally
- jhel_isko      → throw
- no_cap         → true
- fraud          → false
- null           → null/none

BUILT-IN FUNCTIONS:
- typeOf(), toNumber(), toString(), lambai(), upperCase(), lowerCase()
- randomNum(min, max), powerOf(x, y), squareRoot(x), absValue(x)
- max(), min(), split_karo(), includes_kya(), trim_karo()

LIST METHODS:
- .daalo() → push  |  .nikalo() → pop
- .lambai → length  |  .pehla → first  |  .aakhri → last
- .map_karo() → map  |  .filter_karo() → filter
- .reduce_karo() → reduce  |  .milao() → join

Tone: Always respond in friendly Hinglish. Keep it fun — think senior dost, not professor.
Use Bollywood/cricket/desi references where it fits naturally.
When generating code, ONLY use valid H-Script syntax listed above.
"""


async def ask_gemini(prompt: str) -> str:
    """Call Groq API in background thread (non-blocking for FastAPI)."""
    loop = asyncio.get_event_loop()

    def _sync_call():
        response = _client.chat.completions.create(
            model="llama-3.1-8b-instant",   # fast model — sub-second on Groq
            messages=[
                {"role": "system", "content": HSCRIPT_SYSTEM_PROMPT},
                {"role": "user",   "content": prompt},
            ],
            temperature=0.7,
            max_tokens=2048,
        )
        return response.choices[0].message.content

    try:
        return await loop.run_in_executor(_executor, _sync_call)
    except Exception as e:
        err = str(e)
        if "429" in err or "rate_limit" in err.lower():
            return ""   # quota — silent fail
        raise RuntimeError(f"Groq API error: {err}")
