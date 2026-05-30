"""
H-Script AI Service — FastAPI entry point
Phase 5C: NLP core + Agentic AI
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="H-Script AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "OK", "service": "H-Script AI"}

# TODO Phase 5C: import and include routers
# from api.explain   import router as explain_router
# from api.generate  import router as generate_router
# from api.review    import router as review_router
# from api.agent     import router as agent_router

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
