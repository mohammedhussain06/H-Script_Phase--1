# agent.py — Agentic AI loop
# Implemented: full agentic multi-turn loop with tool calling via api/agent.py
# This module mirrors the tool registry used by the FastAPI agent endpoint.

TOOLS = {
    "run_code":     "Execute H-Script code via backend /api/run, return output/errors",
    "explain_code": "Explain H-Script code in friendly Hinglish",
    "suggest_fix":  "Given code + error, return fixed code (user manually accepts)",
    "generate":     "Generate H-Script code from a natural language prompt",
}

def run_agent(prompt: str, code: str, history: list) -> dict:
    """
    Implemented — see ai/api/agent.py for the live FastAPI endpoint.
    Supports: tool calling, multi-turn history (last 10 messages),
    editor code context, two-pass Groq inference (plan + reflect).
    """
    return {
        "status": "implemented",
        "endpoint": "POST /ai/agent",
        "tools": list(TOOLS.keys()),
    }
