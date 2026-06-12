"use client";
import { useState } from "react";
import { Sparkles, Key, Eye, EyeOff, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { getAIConfig, setAIConfig, clearAIConfig, improveSummary, type AIConfig } from "@/lib/ai";
import type { ResumeData } from "@/lib/types";

interface Props {
  resume: ResumeData;
  onUpdate: (data: ResumeData) => void;
}

export function AIPanel({ resume, onUpdate }: Props) {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<AIConfig | null>(() => getAIConfig());
  const [showKey, setShowKey] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [provider, setProvider] = useState<"anthropic" | "openai">("anthropic");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const saveKey = () => {
    if (!keyInput.trim()) return;
    const cfg: AIConfig = { provider, apiKey: keyInput.trim() };
    setAIConfig(cfg);
    setConfig(cfg);
    setKeyInput("");
  };

  const handleImproveSummary = async () => {
    if (!config) return;
    setLoading(true);
    setError("");
    try {
      const improved = await improveSummary(resume.personal.summary, targetRole || "the target role", config);
      onUpdate({ ...resume, personal: { ...resume.personal, summary: improved } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-indigo-100 rounded-xl bg-indigo-50/50">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
          <Sparkles size={16} />
          AI Writing Assistant
          <span className="text-xs font-normal text-indigo-400">(your API key, your data)</span>
        </div>
        {open ? <ChevronUp size={16} className="text-indigo-400" /> : <ChevronDown size={16} className="text-indigo-400" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-xs text-gray-500">
            Your API key is stored only in your browser. Requests go directly from your device to the AI provider — we never see your data.
          </p>

          {!config ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setProvider("anthropic")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition ${provider === "anthropic" ? "border-indigo-500 bg-indigo-600 text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  Anthropic (Claude)
                </button>
                <button
                  onClick={() => setProvider("openai")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition ${provider === "openai" ? "border-indigo-500 bg-indigo-600 text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  OpenAI (GPT)
                </button>
              </div>
              <div className="relative">
                <Input
                  label="API Key"
                  type={showKey ? "text" : "password"}
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder={provider === "anthropic" ? "sk-ant-..." : "sk-..."}
                />
                <button
                  onClick={() => setShowKey((s) => !s)}
                  className="absolute right-3 top-7 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <Button onClick={saveKey} disabled={!keyInput.trim()} className="w-full">
                <Key size={14} /> Save Key Locally
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <span className="text-xs text-green-700 font-medium">
                {config.provider === "anthropic" ? "Claude" : "OpenAI"} connected
              </span>
              <button onClick={() => { clearAIConfig(); setConfig(null); }} className="text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            </div>
          )}

          {config && (
            <div className="space-y-3 pt-1">
              <Input
                label="Target Role (optional)"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
              />
              <Button
                onClick={handleImproveSummary}
                disabled={loading}
                variant="secondary"
                className="w-full"
              >
                <Sparkles size={14} />
                {loading ? "Improving..." : "Improve Summary"}
              </Button>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <p className="text-xs text-gray-400">
                More AI tools (per-bullet improvement) are available in the Experience section when you hover each bullet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
