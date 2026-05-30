# agent.py — Agentic AI loop
# TODO Phase 5E: multi-step reasoning with tools

TOOLS = {
    "run_code":    "Execute H-Script code, return output/errors",
    "fix_error":   "Given code + error, return fixed code",
    "explain":     "Explain an error in plain English",
    "read_file":   "Read user's current file content",
    "generate":    "Generate H-Script code from prompt",
}

def run_agent(prompt: str, code: str, history: list) -> dict:
    """
    Agentic loop: classify intent → plan steps → execute tools → respond
    """
    return {
        "response": "Agentic AI coming in Phase 5E",
        "code": code,
        "steps": []
    }
