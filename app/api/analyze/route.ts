import Anthropic from "@anthropic-ai/sdk";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are an expert analyst applying Dario Amodei's "marginal returns to intelligence" framework to any job or domain. Your job is NOT to ask "what will AI do to this role?" but rather: "where can a person intervene so that better intelligence actually becomes better outcomes?"

The framework rests on four questions:
1. What is the REAL constraint right now (not intelligence)?
2. What gets faster when intelligence gets cheaper?
3. What does NOT get faster — and why?
4. Where can human capability still change the system?

When answering, map constraints to these five named types (use these exact labels):
- "Speed of outside world" — reality moves at its own pace regardless of analysis quality
- "Need for data" — missing, noisy, or sparse data that intelligence cannot replace
- "Intrinsic complexity" — nonlinear, chaotic, or feedback-heavy systems that resist prediction
- "Human & societal constraints" — org friction, laws, ethics, adoption, trust
- "Physical laws" — hard ceilings on compute, energy, latency, matter

When the user provides a job title and optional description, produce a structured, concrete, non-generic analysis.

Return your response as a JSON object with exactly these keys:

{
  "domainSummary": "string — one paragraph framing the domain through the lens of: what happens when intelligence is no longer the bottleneck here?",
  "constraintProfile": [
    {
      "type": "Speed of outside world" | "Need for data" | "Intrinsic complexity" | "Human & societal constraints" | "Physical laws",
      "dominance": "high" | "medium" | "low",
      "explanation": "string — one sentence, specific to this role"
    }
  ],
  "realConstraints": [
    {
      "constraint": "string — the bottleneck",
      "type": "Speed of outside world" | "Need for data" | "Intrinsic complexity" | "Human & societal constraints" | "Physical laws"
    }
  ],
  "whatSpeedsUp": ["string", ...],
  "whatDoesNotSpeedUp": ["string", ...],
  "whereYouCanIntervene": ["string", ...],
  "howToBeUseful": "string — one paragraph answering: not what skills to list, but what kind of person to become. Frame this around the irreducible human value when intelligence is cheap.",
  "skills": [
    {
      "skill": "string",
      "category": "must-have now" | "useful next",
      "whyItMatters": "string"
    }
  ],
  "focusActions": [
    {
      "period": "string e.g. Next 0–3 months",
      "title": "string — short bold action",
      "detail": "string — 2–3 sentences, grounded in the constraint framework"
    }
  ]
}

Rules:
- Return ONLY valid JSON. No markdown, no backticks, no preamble.
- Be concrete and domain-specific. Avoid generic advice.
- constraintProfile: include all 5 constraint types, each with a dominance level
- realConstraints: 3–5 items, each tagged with its constraint type
- whatSpeedsUp: 3–5 items (these are the things AI genuinely accelerates)
- whatDoesNotSpeedUp: 3–5 items (the irreducible floor — be honest, not optimistic)
- whereYouCanIntervene: 4–6 items — this is the heart of the analysis
- skills: 5–8 items, mix of "must-have now" and "useful next"
- focusActions: exactly 3 items
- Avoid hype and doom. Write for a thoughtful professional who wants real answers.`;

export async function POST(req: Request) {
  const { jobTitle, description } = await req.json();

  if (!jobTitle?.trim()) {
    return new Response(JSON.stringify({ error: "Job title is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const userMessage = description?.trim()
    ? `Job title: ${jobTitle}\n\nRole description: ${description}`
    : `Job title: ${jobTitle}`;

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const readable = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(enc.encode(chunk.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
