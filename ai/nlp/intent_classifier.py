# intent_classifier.py — NLP Intent Detection
# Implemented: intent classification via LLM (Groq/Llama) in api/agent.py
# The agent endpoint classifies intent from conversation context automatically.

def classify_intent(prompt: str) -> str:
    """
    Returns one of: generate | debug | explain | review | refactor | chat
    Note: In production this is handled by the Groq agent via TOOL_CALL parsing.
    This helper uses keyword matching as a fast local fallback.
    """
    p = prompt.lower()
    if any(k in p for k in ["generate", "write", "create", "make"]):
        return "generate"
    if any(k in p for k in ["fix", "debug", "broken", "error", "wrong"]):
        return "debug"
    if any(k in p for k in ["explain", "what does", "how does", "samjhao"]):
        return "explain"
    if any(k in p for k in ["review", "check", "feedback", "improve"]):
        return "review"
    if any(k in p for k in ["refactor", "clean", "optimise", "optimize"]):
        return "refactor"
    return "chat"
