export interface AIConfig {
  provider: "openai" | "anthropic";
  apiKey: string;
  model?: string;
}

export function getAIConfig(): AIConfig | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("resumeave_ai_config");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setAIConfig(config: AIConfig): void {
  localStorage.setItem("resumeave_ai_config", JSON.stringify(config));
}

export function clearAIConfig(): void {
  localStorage.removeItem("resumeave_ai_config");
}

export async function improveBullet(bullet: string, jobTitle: string, config: AIConfig): Promise<string> {
  const prompt = `You are a professional resume writer. Improve this resume bullet point for a ${jobTitle} role. Make it more impactful: start with a strong action verb, quantify results where possible, and be concise. Return only the improved bullet, no explanation.\n\nOriginal: ${bullet}`;

  if (config.provider === "anthropic") {
    const model = config.model ?? "claude-haiku-4-5-20251001";
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": config.apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "anthropic-dangerous-direct-browser-calls": "true",
      },
      body: JSON.stringify({ model, max_tokens: 200, messages: [{ role: "user", content: prompt }] }),
    });
    if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`);
    const data = await res.json();
    return data.content[0].text.trim();
  } else {
    const model = config.model ?? "gpt-4o-mini";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, max_tokens: 200, messages: [{ role: "user", content: prompt }] }),
    });
    if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
    const data = await res.json();
    return data.choices[0].message.content.trim();
  }
}

export async function improveSummary(summary: string, targetRole: string, config: AIConfig): Promise<string> {
  const prompt = `You are a professional resume writer. Rewrite this professional summary for a ${targetRole} role. Make it compelling, specific, and 2-3 sentences. Return only the improved summary.\n\nOriginal: ${summary || "(empty — write a strong generic summary for this role)"}`;

  if (config.provider === "anthropic") {
    const model = config.model ?? "claude-haiku-4-5-20251001";
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": config.apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "anthropic-dangerous-direct-browser-calls": "true",
      },
      body: JSON.stringify({ model, max_tokens: 300, messages: [{ role: "user", content: prompt }] }),
    });
    if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`);
    const data = await res.json();
    return data.content[0].text.trim();
  } else {
    const model = config.model ?? "gpt-4o-mini";
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, max_tokens: 300, messages: [{ role: "user", content: prompt }] }),
    });
    if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
    const data = await res.json();
    return data.choices[0].message.content.trim();
  }
}
