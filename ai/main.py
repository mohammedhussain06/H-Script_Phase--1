"""
H-Script AI Service — FastAPI entry point
Phase 5C: Gemini 1.5 Flash — Explain / Generate / Fix / Autocomplete / Agent
"""
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

from api.explain       import router as explain_router
from api.generate      import router as generate_router
from api.fix           import router as fix_router
from api.autocomplete  import router as autocomplete_router
from api.explain_error import router as explain_error_router
from api.agent         import router as agent_router

app = FastAPI(
    title="H-Script AI Service",
    version="2.0.0",
    description="Gemini-powered AI: explain, generate, fix, autocomplete, and agentic chat."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
        os.getenv("BACKEND_URL",  "http://localhost:5000"),
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_error_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"error": str(exc)})

# ── All AI routes ─────────────────────────────────────────
app.include_router(explain_router,       prefix="/ai", tags=["AI"])
app.include_router(generate_router,      prefix="/ai", tags=["AI"])
app.include_router(fix_router,           prefix="/ai", tags=["AI"])
app.include_router(autocomplete_router,  prefix="/ai", tags=["AI"])
app.include_router(explain_error_router, prefix="/ai", tags=["AI"])
app.include_router(agent_router,         prefix="/ai", tags=["AI"])

@app.get("/health")
def health():
    return {
        "status": "OK",
        "service": "H-Script AI",
        "version": "2.0.0",
        "model": "gemini-1.5-flash",
        "endpoints": [
            "/ai/explain",
            "/ai/generate",
            "/ai/fix",
            "/ai/autocomplete",
            "/ai/explain-error",
            "/ai/agent",
        ]
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AI_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
