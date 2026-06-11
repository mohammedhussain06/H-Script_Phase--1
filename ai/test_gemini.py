"""
Quick diagnostic — run this to see exactly why Gemini isn't working.
Usage: python test_gemini.py
"""
import httpx
import asyncio
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.environ.get("GEMINI_API_KEY", "")
print(f"Key format: {API_KEY[:10]}... (starts with AIza? {'YES ✅' if API_KEY.startswith('AIza') else 'NO ❌ — wrong key type'})")

MODELS = ["gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-pro"]
API_VERSIONS = ["v1beta", "v1"]

PAYLOAD = {
    "contents": [{"role": "user", "parts": [{"text": "Say hello in one word"}]}]
}

async def test():
    async with httpx.AsyncClient(timeout=15) as client:

        print("\n=== TEST 1: API Key as query param ===")
        for v in API_VERSIONS:
            for m in MODELS:
                url = f"https://generativelanguage.googleapis.com/{v}/models/{m}:generateContent?key={API_KEY}"
                r = await client.post(url, json=PAYLOAD)
                status = r.status_code
                msg = r.json().get("error", {}).get("message", r.text[:80]) if status != 200 else "SUCCESS ✅"
                print(f"  [{v}] {m}: {status} — {msg}")
                if status == 200:
                    print(f"  RESPONSE: {r.json()['candidates'][0]['content']['parts'][0]['text']}")
                    return

        print("\n=== TEST 2: OAuth2 Bearer token ===")
        for v in API_VERSIONS:
            for m in MODELS:
                url = f"https://generativelanguage.googleapis.com/{v}/models/{m}:generateContent"
                headers = {"Authorization": f"Bearer {API_KEY}"}
                r = await client.post(url, json=PAYLOAD, headers=headers)
                status = r.status_code
                msg = r.json().get("error", {}).get("message", r.text[:80]) if status != 200 else "SUCCESS ✅"
                print(f"  [{v}] {m}: {status} — {msg}")
                if status == 200:
                    print(f"  RESPONSE: {r.json()['candidates'][0]['content']['parts'][0]['text']}")
                    return

        print("\n❌ All attempts failed. The key may be expired or invalid.")
        print("👉 Go to https://aistudio.google.com/apikey and generate a NEW key.")

asyncio.run(test())
