"""
POST /ai/agent
Agentic multi-turn AI with tool calling.
Agent can: run code, explain, fix, read editor content.
Fixes are SUGGESTED only — user manually accepts.
"""
import os, httpx
from fastapi import APIRouter
from pydantic import BaseModel
from core.gemini_client import ask_gemini, HSCRIPT_SYSTEM_PROMPT

router = APIRouter()

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")

# ── Tool definitions for Gemini ────────────────────────────
TOOLS = [
    {
        "name": "run_code",
        "description": "Execute H-Script code and return the output and any errors",
        "parameters": {
            "type": "object",
            "properties": {
                "code": {"type": "string", "description": "The H-Script code to run"}
            },
            "required": ["code"]
        }
    },
    {
        "name": "explain_code",
        "description": "Explain what a piece of H-Script code does",
        "parameters": {
            "type": "object",
            "properties": {
                "code": {"type": "string", "description": "The H-Script code to explain"}
            },
            "required": ["code"]
        }
    },
    {
        "name": "suggest_fix",
        "description": "Suggest a fix for broken H-Script code given an error message",
        "parameters": {
            "type": "object",
            "properties": {
                "code":  {"type": "string", "description": "The broken H-Script code"},
                "error": {"type": "string", "description": "The error message"}
            },
            "required": ["code", "error"]
        }
    },
]

# ── Tool execution ─────────────────────────────────────────
async def execute_tool(name: str, args: dict) -> dict:
    if name == "run_code":
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                r = await client.post(f"{BACKEND_URL}/api/run", json={"code": args["code"]})
                return r.json()
        except Exception as e:
            return {"output": [], "errors": [str(e)]}

    elif name == "explain_code":
        explanation = await ask_gemini(
            f"Explain this H-Script code in simple Hinglish:\n```\n{args['code']}\n```"
        )
        return {"explanation": explanation}

    elif name == "suggest_fix":
        fix = await ask_gemini(
            f"Fix this H-Script code.\nCode:\n```\n{args['code']}\n```\nError: {args['error']}\n"
            "Return ONLY the fixed code in a code block, then EXPLANATION: [what you fixed]"
        )
        return {"suggestion": fix}

    return {"error": f"Unknown tool: {name}"}

# ── Request / Response models ──────────────────────────────
class Message(BaseModel):
    role: str       # 'user' | 'assistant'
    content: str

class AgentRequest(BaseModel):
    message: str
    code: str | None = None        # current editor content
    history: list[Message] = []

class AgentResponse(BaseModel):
    reply: str
    action: str | None = None      # 'fix' | 'explain' | 'run' | None
    result: dict | None = None     # tool result if any
    history: list[Message]         # updated conversation history

# ── Agent endpoint ─────────────────────────────────────────
@router.post("/agent", response_model=AgentResponse)
async def agent_chat(body: AgentRequest):
    # Build conversation context
    history_text = ""
    for msg in body.history[-10:]:   # last 10 messages for context
        role = "User" if msg.role == "user" else "Assistant"
        history_text += f"{role}: {msg.content}\n"

    code_context = ""
    if body.code:
        code_context = f"\nCurrent editor code:\n```\n{body.code}\n```\n"

    # Available tools description
    tools_desc = """
You have access to these tools (call them when needed):
- run_code(code) → execute H-Script and see output
- explain_code(code) → explain code
- suggest_fix(code, error) → suggest a fix (user will manually accept)

To call a tool, write: TOOL_CALL: tool_name(arg1="value1", arg2="value2")
"""

    prompt = f"""{HSCRIPT_SYSTEM_PROMPT}

{tools_desc}
{code_context}

Conversation so far:
{history_text}

User: {body.message}

Think step by step. If you need to run code or use a tool, do it.
Then give your final response to the user.
"""

    raw_reply = ""
    tool_used = None
    tool_result = None
    action = None

    try:
        # First pass — ask Gemini
        raw_reply = await ask_gemini(prompt)

        # Check if Gemini wants to use a tool
        if "TOOL_CALL:" in raw_reply:
            import re
            match = re.search(r'TOOL_CALL:\s*(\w+)\(([^)]*)\)', raw_reply)
            if match:
                tool_name = match.group(1)
                args_str  = match.group(2)

                # Parse simple key="value" args
                args = {}
                for m in re.finditer(r'(\w+)\s*=\s*"([^"]*)"', args_str):
                    args[m.group(1)] = m.group(2)
                # Also handle code blocks in args (multiline)
                if not args and body.code:
                    if tool_name in ("run_code", "explain_code"):
                        args = {"code": body.code}
                    elif tool_name == "suggest_fix":
                        args = {"code": body.code, "error": ""}

                tool_result = await execute_tool(tool_name, args)
                tool_used   = tool_name

                # Map tool name to action
                action = {"run_code": "run", "explain_code": "explain", "suggest_fix": "fix"}.get(tool_name)

                # Second pass — Gemini reflects on tool result
                reflect_prompt = f"""{HSCRIPT_SYSTEM_PROMPT}

User asked: {body.message}
{code_context}

You used tool '{tool_name}' and got this result:
{tool_result}

Now give a helpful, friendly final response to the user based on this result.
If it's a fix suggestion, present it clearly and say "You can accept or reject this fix."
"""
                raw_reply = await ask_gemini(reflect_prompt)

    except Exception as e:
        raw_reply = f"Oops bhai, kuch toh gadbad ho gayi 😅 ({str(e)})"

    # Update history
    updated_history = list(body.history) + [
        Message(role="user",      content=body.message),
        Message(role="assistant", content=raw_reply),
    ]

    return AgentResponse(
        reply=raw_reply,
        action=action,
        result=tool_result,
        history=updated_history,
    )
