"use client";

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type ConstraintType =
  | "Speed of outside world"
  | "Need for data"
  | "Intrinsic complexity"
  | "Human & societal constraints"
  | "Physical laws";

interface ConstraintProfileItem {
  type: ConstraintType;
  dominance: "high" | "medium" | "low";
  explanation: string;
}

interface RealConstraint {
  constraint: string;
  type: ConstraintType;
}

interface Skill {
  skill: string;
  category: "must-have now" | "useful next";
  whyItMatters: string;
}

interface FocusAction {
  period: string;
  title: string;
  detail: string;
}

interface Analysis {
  domainSummary: string;
  constraintProfile: ConstraintProfileItem[];
  realConstraints: RealConstraint[];
  whatSpeedsUp: string[];
  whatDoesNotSpeedUp: string[];
  whereYouCanIntervene: string[];
  howToBeUseful: string;
  skills: Skill[];
  focusActions: FocusAction[];
}

// ── Constraint helpers ────────────────────────────────────────────────────────

const CONSTRAINT_COLORS: Record<ConstraintType, { bg: string; text: string; bar: string }> = {
  "Speed of outside world":       { bg: "bg-blue-50",   text: "text-blue-700",   bar: "bg-blue-400" },
  "Need for data":                { bg: "bg-amber-50",  text: "text-amber-700",  bar: "bg-amber-400" },
  "Intrinsic complexity":         { bg: "bg-rose-50",   text: "text-rose-700",   bar: "bg-rose-400" },
  "Human & societal constraints": { bg: "bg-violet-50", text: "text-violet-700", bar: "bg-violet-400" },
  "Physical laws":                { bg: "bg-gray-100",  text: "text-gray-700",   bar: "bg-gray-500" },
};

const DOMINANCE_WIDTH = { high: "w-full", medium: "w-2/3", low: "w-1/3" };
const DOMINANCE_LABEL = { high: "Dominant", medium: "Moderate", low: "Minor" };

function ConstraintTag({ type }: { type: ConstraintType }) {
  const c = CONSTRAINT_COLORS[type];
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}>
      {type}
    </span>
  );
}

// ── Small UI atoms ────────────────────────────────────────────────────────────

function Pill({ category }: { category: Skill["category"] }) {
  const base = "inline-block px-2 py-0.5 rounded text-xs font-medium";
  return category === "must-have now" ? (
    <span className={`${base} bg-green-100 text-green-800`}>must-have now</span>
  ) : (
    <span className={`${base} bg-purple-100 text-purple-800`}>useful next</span>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-gray-700">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 p-5">
      <div className="mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="flex items-end gap-1 h-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="loading-bar w-1.5 h-full bg-gray-900 rounded-sm origin-bottom" />
        ))}
      </div>
      <p className="text-sm text-gray-500">Mapping your constraints…</p>
    </div>
  );
}

// ── Constraint Profile card ───────────────────────────────────────────────────

function ConstraintProfileCard({ profile }: { profile: ConstraintProfileItem[] }) {
  const sorted = [...profile].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.dominance] - order[b.dominance];
  });
  return (
    <Card
      title="Constraint profile"
      subtitle="Which limits dominate this role when intelligence is no longer scarce"
    >
      <div className="space-y-3">
        {sorted.map((item) => {
          const c = CONSTRAINT_COLORS[item.type];
          return (
            <div key={item.type}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${c.text}`}>{item.type}</span>
                <span className="text-xs text-gray-400">{DOMINANCE_LABEL[item.dominance]}</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full mb-1">
                <div className={`h-1.5 rounded-full ${c.bar} ${DOMINANCE_WIDTH[item.dominance]}`} />
              </div>
              <p className="text-xs text-gray-500">{item.explanation}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Results renderer ──────────────────────────────────────────────────────────

function ResultsView({ data, jobTitle, onReset }: { data: Analysis; jobTitle: string; onReset: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Bottleneck</p>
          <h1 className="text-2xl font-bold">{jobTitle}</h1>
          <p className="text-xs text-gray-400 mt-1">
            When intelligence is cheap — what still limits you, and where can you intervene?
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 transition-colors"
          >
            {copied ? "Copied!" : "Copy JSON"}
          </button>
          <button
            onClick={onReset}
            className="border border-gray-900 bg-gray-900 text-white px-3 py-1.5 text-xs font-medium hover:bg-gray-700 transition-colors"
          >
            New analysis
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <Card title="Domain summary">
          <p className="text-sm text-gray-700 leading-relaxed">{data.domainSummary}</p>
        </Card>

        <ConstraintProfileCard profile={data.constraintProfile} />

        <Card title="Real constraints" subtitle="What actually limits progress — not intelligence">
          <ul className="space-y-2.5">
            {data.realConstraints.map((rc, i) => (
              <li key={i} className="flex flex-col gap-1">
                <div className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                  <span className="text-sm text-gray-700 flex-1">{rc.constraint}</span>
                </div>
                <div className="pl-3.5">
                  <ConstraintTag type={rc.type} />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="The acceleration gap" subtitle="Honest split: what AI changes vs. what it doesn't">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">What speeds up</p>
              <BulletList items={data.whatSpeedsUp} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">What does not speed up</p>
              <BulletList items={data.whatDoesNotSpeedUp} />
            </div>
          </div>
        </Card>

        <Card title="Where you can still change the outcome" subtitle="The places where human judgment shifts the result">
          <BulletList items={data.whereYouCanIntervene} />
        </Card>

        <Card title="What kind of person to become">
          <p className="text-sm text-gray-700 leading-relaxed">{data.howToBeUseful}</p>
        </Card>

        <Card title="Skills">
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-1 text-xs font-semibold text-gray-500 w-1/3">Skill</th>
                  <th className="text-left py-2 px-1 text-xs font-semibold text-gray-500 w-1/5">Category</th>
                  <th className="text-left py-2 px-1 text-xs font-semibold text-gray-500">Why it matters</th>
                </tr>
              </thead>
              <tbody>
                {data.skills.map((s, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0">
                    <td className="py-2.5 px-1 font-medium text-gray-900 align-top">{s.skill}</td>
                    <td className="py-2.5 px-1 align-top"><Pill category={s.category} /></td>
                    <td className="py-2.5 px-1 text-gray-600 align-top">{s.whyItMatters}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Focus actions">
          <div className="space-y-4">
            {data.focusActions.map((a, i) => (
              <div key={i} className="border-l-2 border-gray-900 pl-4">
                <p className="text-xs font-semibold text-gray-400 mb-0.5">
                  {String(i + 1).padStart(2, "0")} · {a.period}
                </p>
                <p className="font-semibold text-gray-900 mb-1">{a.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{a.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <MethodologySection />
    </div>
  );
}

// ── Methodology footer ────────────────────────────────────────────────────────

function MethodologySection() {
  return (
    <div className="mt-16 border-t border-gray-100 pt-10 pb-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Methodology</p>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        This tool applies Dario Amodei's <em>marginal returns to intelligence</em> framework from{" "}
        <a
          href="https://darioamodei.com/essay/machines-of-loving-grace"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700"
        >
          Machines of Loving Grace
        </a>
        . The central question isn't "what will AI replace?" — it's "when intelligence is cheap, what
        becomes the real bottleneck?"
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Four framework questions</p>
          <ol className="space-y-1.5 list-none">
            {[
              "What is the real constraint right now (not intelligence)?",
              "What gets faster when intelligence gets cheaper?",
              "What does NOT get faster — and why?",
              "Where can human capability still change the system?",
            ].map((q, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="shrink-0 text-xs text-gray-400 font-mono mt-0.5">{i + 1}.</span>
                {q}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Five constraint types</p>
          <ul className="space-y-1.5">
            {[
              { type: "Speed of outside world" as ConstraintType, desc: "Reality moves at its own pace regardless of analysis quality" },
              { type: "Need for data" as ConstraintType, desc: "Missing, noisy, or sparse data that intelligence cannot replace" },
              { type: "Intrinsic complexity" as ConstraintType, desc: "Nonlinear, chaotic, or feedback-heavy systems that resist prediction" },
              { type: "Human & societal constraints" as ConstraintType, desc: "Org friction, laws, ethics, adoption, trust" },
              { type: "Physical laws" as ConstraintType, desc: "Hard ceilings on compute, energy, latency, matter" },
            ].map(({ type, desc }) => (
              <li key={type} className="flex flex-col gap-0.5">
                <ConstraintTag type={type} />
                <p className="text-xs text-gray-500 pl-0.5">{desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Input screen ──────────────────────────────────────────────────────────────

function InputScreen({ onResult }: { onResult: (data: Analysis, jobTitle: string) => void }) {
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!jobTitle.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, description }),
      });
      if (!res.ok || !res.body) throw new Error("Request failed");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let raw = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        raw += dec.decode(value, { stream: true });
      }
      const parsed: Analysis = JSON.parse(raw.trim());
      onResult(parsed, jobTitle.trim());
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-20 pb-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="7" stroke="#0f0f0f" strokeWidth="2" />
            <circle cx="10" cy="10" r="3" stroke="#0f0f0f" strokeWidth="1.5" opacity="0.4" />
            <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-sm font-semibold tracking-tight">Bottleneck</span>
        </div>

        <h1 className="text-3xl font-bold mb-2 leading-tight">
          What's left for you<br />when AI gets clever?
        </h1>
        <p className="text-sm text-gray-500 mb-2 leading-relaxed">
          When intelligence stops being scarce, something else becomes the real bottleneck.
          This tool maps those constraints for your role — and shows where <em>you</em> can still change the outcome.
        </p>
        <p className="text-xs text-gray-400 mb-8 leading-relaxed">
          Based on Dario Amodei's "marginal returns to intelligence" framework from{" "}
          <a
            href="https://darioamodei.com/essay/machines-of-loving-grace"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            Machines of Loving Grace
          </a>
          .
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-400 block mb-1.5">
              Job title *
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="e.g. Radiologist, Civil Engineer, Data Scientist"
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-400 block mb-1.5">
              Role description{" "}
              <span className="normal-case text-gray-300">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add context about your specific work, industry, or the constraints you already feel…"
              rows={4}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 transition-colors resize-none"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={!jobTitle.trim()}
            className="w-full bg-gray-900 text-white py-3 text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Analyse my role →
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-400 leading-relaxed">
          This is for thinking, not career advice. The framework forces a different question: not "what will AI replace?" but "what still needs a human to move?"
        </p>
      </div>
      <div className="w-full max-w-2xl">
        <MethodologySection />
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [result, setResult] = useState<Analysis | null>(null);
  const [jobTitle, setJobTitle] = useState("");

  const handleResult = (data: Analysis, title: string) => {
    setResult(data);
    setJobTitle(title);
  };

  if (result) {
    return (
      <ResultsView
        data={result}
        jobTitle={jobTitle}
        onReset={() => { setResult(null); setJobTitle(""); }}
      />
    );
  }

  return <InputScreen onResult={handleResult} />;
}
