import React, { useEffect, useRef, useState, useCallback } from "react";
import emailjs from "@emailjs/browser";
import ChatBot from "./components/ChatBot";
import {
  Terminal,
  Cloud,
  GitBranch,
  Activity,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Link2,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  Dot,
  Send,
  Loader2,
  RefreshCw,
} from "lucide-react";

// ---- EmailJS config ----
// 1. Create a free account at https://www.emailjs.com/
// 2. Add an Email Service (e.g. Gmail) -> copy the Service ID
// 3. Create an Email Template with variables: {{from_name}}, {{from_email}}, {{message}}
//    -> copy the Template ID
// 4. Account -> General -> copy your Public Key
// 5. Paste the three values below.
const EMAILJS_SERVICE_ID = "service_34rcdle";
const EMAILJS_TEMPLATE_ID = "template_wpwb8aa";
const EMAILJS_PUBLIC_KEY = "MdLtvTlbQJ_rMz3lN";

const SECTIONS = [
  { id: "home", label: "PROFILE", icon: Terminal },
  { id: "stack", label: "STACK", icon: Cloud },
  { id: "projects", label: "PROJECTS", icon: GitBranch },
  { id: "highlights", label: "HIGHLIGHTS", icon: Activity },
  { id: "education", label: "EDUCATION", icon: GraduationCap },
  { id: "contact", label: "CONTACT", icon: Mail },
];

const STACK = [
  {
    title: "AWS Services",
    items: [
      { name: "EC2", level: "core" },
      { name: "VPC", level: "core" },
      { name: "IAM", level: "core" },
      { name: "Route53", level: "core" },
      { name: "Auto Scaling", level: "core" },
      { name: "Lambda", level: "core" },
      { name: "CloudWatch", level: "core" },
      { name: "ECS", level: "core" },
      { name: "EKS", level: "learning" },
    ],
  },
  {
    title: "IaC & Automation",
    items: [
      { name: "Terraform", level: "core" },
      { name: "CloudFormation", level: "awareness" },
      { name: "Bash Scripting", level: "core" },
      { name: "Python Scripting", level: "core" },
      { name: "Linux Administration", level: "core" },
    ],
  },
  {
    title: "CI/CD Pipelines",
    items: [
      { name: "GitHub Actions", level: "core" },
      { name: "AWS CodePipeline", level: "learning" },
      { name: "Jenkins", level: "concepts" },
      { name: "Automated Build & Deploy", level: "core" },
    ],
  },
  {
    title: "Containers & Orchestration",
    items: [
      { name: "Docker", level: "core" },
      { name: "Kubernetes Concepts", level: "learning" },
      { name: "EKS", level: "learning" },
      { name: "Container Security", level: "core" },
      { name: "Image Optimisation", level: "core" },
    ],
  },
  {
    title: "Monitoring & Observability",
    items: [
      { name: "Prometheus", level: "core" },
      { name: "Grafana", level: "core" },
      { name: "CloudWatch Metrics", level: "core" },
      { name: "Splunk", level: "awareness" },
      { name: "Kibana", level: "awareness" },
    ],
  },
  {
    title: "Security & Networking",
    items: [
      { name: "IAM Policies", level: "core" },
      { name: "Secrets Management", level: "core" },
      { name: "Encryption at Rest/Transit", level: "core" },
      { name: "VPC Security Groups", level: "core" },
      { name: "Least Privilege", level: "core" },
    ],
  },
  {
    title: "Dev & Web Skills",
    items: [
      { name: "Python", level: "core" },
      { name: "React.js", level: "core" },
      { name: "Node.js", level: "core" },
      { name: "JavaScript", level: "core" },
      { name: "SQL", level: "core" },
      { name: "REST APIs", level: "core" },
    ],
  },
];

const PROJECTS = [
  {
    title: "NeuroVision – AI Facial Analysis Platform",
    tags: [
      "Python",
      "Flask",
      "TensorFlow",
      "OpenCV",
      "MTCNN",
      "SQLite",
      "Render"
    ],
    live: "https://neurovision-o9sh.onrender.com",
    bullets: [
      "Designed and deployed an AI-powered facial analysis platform capable of detecting faces and predicting age and gender using Deep Learning.",
      "Built with Flask, TensorFlow, OpenCV, MTCNN, NumPy and SQLite, providing an end-to-end machine learning workflow.",
      "Implemented image preprocessing, face detection, feature extraction and real-time inference through a responsive web interface.",
      "Developed a secure backend with REST-based request handling, structured data management and modular architecture.",
      "Deployed the application on Render, making the project publicly accessible for demonstration and testing."
    ]
  },

  {
    title: "Containerised Full-Stack Application with CI/CD Pipeline",
    tags: ["Docker", "GitHub Actions", "Node.js", "React.js", "SQL"],
    bullets: [
      "Containerised a full-stack React.js + Node.js app with optimised multi-stage Dockerfiles to minimise image size and attack surface.",
      "Built a GitHub Actions pipeline to automate build, test, and deploy stages.",
      "Configured automated health checks, restart policies, and resource limits.",
      "Added structured timestamped logging for monitoring.",
      "Applied least-privilege security practices."
    ]
  },

  {
    title: "Python Automated AI Pipeline",
    tags: ["Python", "TensorFlow", "Linux", "Flask"],
    bullets: [
      "Automated multi-stage AI workflows using Python.",
      "Implemented scheduling, retries and monitoring.",
      "Collected structured JSON logs for performance analysis.",
      "Optimised compute usage through batching and resource control."
    ]
  }
];

const HIGHLIGHTS = [
  {
    title: "AWS Core Services",
    body: "Solid conceptual and hands-on grounding in EC2, VPC, IAM, Route53, Auto Scaling, Lambda, and CloudWatch.",
  },
  {
    title: "Infrastructure as Code",
    body: "Learning Terraform to define, version, and deploy infrastructure reproducibly — state, modules, plan/apply.",
  },
  {
    title: "Kubernetes & EKS",
    body: "Studying pods, deployments, services, and ingress, plus EKS cluster management as active self-driven upskilling.",
  },
  {
    title: "Monitoring Stack",
    body: "Hands-on with Prometheus metrics and Grafana dashboards; building familiarity with Splunk and Kibana.",
  },
  {
    title: "AWS Security",
    body: "Strong grasp of IAM policy design, least privilege, role chaining, KMS/TLS encryption, and Secrets Manager patterns.",
  },
  {
    title: "Cost Optimisation",
    body: "Aware of Reserved and Spot Instance strategy, Auto Scaling policy design, and Lambda right-sizing.",
  },
];

const STRENGTHS = [
  "Cloud-First Mindset",
  "Automation-Oriented",
  "Security-Aware",
  "Rapid Self-Learner",
  "Analytical Problem Solver",
  "Detail-Oriented",
  "Collaborative",
];

const LANGUAGES = ["English", "French", "Kannada", "Hindi", "Telugu"];

const LEVEL_META = {
  core: { label: "Hands-on", color: "var(--mint)" },
  learning: { label: "Learning", color: "var(--amber)" },
  concepts: { label: "Concepts", color: "var(--amber)" },
  awareness: { label: "Awareness", color: "var(--muted)" },
};

const TERMINAL_LINES = [
  { prompt: "$ whoami", out: "Sohum M P" },

  { prompt: "$ status --availability", out: "Open to immediate joining · Bengaluru, on-site" },
];

function useTypewriter(lines, active) {
  const [rendered, setRendered] = useState(
    lines.map(() => ({
      prompt: "",
      out: "",
    }))
  );

  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState("prompt");
  const [charIndex, setCharIndex] = useState(0);

  // Reset animation whenever active becomes true
  useEffect(() => {
    if (!active) return;

    setRendered(
      lines.map(() => ({
        prompt: "",
        out: "",
      }))
    );

    setLineIndex(0);
    setPhase("prompt");
    setCharIndex(0);
  }, [active, lines]);

  useEffect(() => {
    if (!active) return;
    if (lineIndex >= lines.length) return;

    const current = lines[lineIndex];
    const target =
      phase === "prompt"
        ? current.prompt
        : current.out;

    if (charIndex <= target.length) {
      const timeout = setTimeout(() => {
        setRendered((prev) => {
          const next = [...prev];

          next[lineIndex] = {
            ...next[lineIndex],
            [phase === "prompt" ? "prompt" : "out"]:
              target.slice(0, charIndex),
          };

          return next;
        });

        setCharIndex((c) => c + 1);
      }, phase === "prompt" ? 28 : 16);

      return () => clearTimeout(timeout);
    }

    if (phase === "prompt") {
      const timeout = setTimeout(() => {
        setPhase("out");
        setCharIndex(0);
      }, 220);

      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setLineIndex((i) => i + 1);
      setPhase("prompt");
      setCharIndex(0);
    }, 380);

    return () => clearTimeout(timeout);

  }, [active, charIndex, phase, lineIndex, lines]);

  return {
    rendered,
    done: lineIndex >= lines.length,
  };
}
function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, answer: a + b };
}

export default function Portfolio() {
  const [active, setActive] = useState("home");
  const refs = useRef({});
  const navRef = useRef(null);
  const [heroInView, setHeroInView] = useState(true);
  const { rendered: typedLines, done: typingDone } = useTypewriter(TERMINAL_LINES, heroInView);

  // ---- Contact form state ----
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [sendState, setSendState] = useState("idle"); // idle | sending | success | error
  const [formError, setFormError] = useState("");

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setFormError("Please fill in every field before sending.");
      return;
    }

    if (parseInt(captchaInput, 10) !== captcha.answer) {
      setFormError("Captcha answer is incorrect — please try again.");
      refreshCaptcha();
      return;
    }

    setSendState("sending");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );

      setSendState("success");
      setForm({ name: "", email: "", message: "" });
      refreshCaptcha();
    } catch (err) {
      console.error("EmailJS send failed:", err);
      setSendState("error");
      refreshCaptcha();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
  if (!entry.isIntersecting) return;

  setActive(entry.target.id);

  if (entry.target.id === "home") {
    setHeroInView(false);

    setTimeout(() => {
      setHeroInView(true);
    }, 10);
  } else {
    setHeroInView(false);
  }
});},
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = refs.current[s.id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id) => {
    const el = refs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

 const activeIndex = SECTIONS.findIndex((s) => s.id === active);

const fillPct =
  ((activeIndex + 1) / SECTIONS.length) * 100;

  return (
    <div className="sm-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');

        .sm-root {
          --bg: #0a0f1c;
          --bg-panel: #111a2e;
          --bg-panel-alt: #16213a;
          --border: #223154;
          --border-soft: #1a2540;
          --text: #e7ecf6;
          --muted: #8291b3;
          --mint: #5eead4;
          --mint-dim: #2f6a63;
          --amber: #f5a524;
          --mono: 'JetBrains Mono', monospace;
          --sans: 'Inter', sans-serif;

          background: var(--bg);
          color: var(--text);
          font-family: var(--sans);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          line-height: 1.5;
        }

        .sm-root * { box-sizing: border-box; }

        .sm-bg-grid {
  position: fixed;
  top: 65px;          /* Same height as your navbar */
  left: 0;
  right: 0;
  bottom: 0;

  background-image:
    linear-gradient(rgba(10,15,28,0.55), rgba(10,15,28,0.75)),
    url("/background.png");

  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;

  z-index: 0;
  pointer-events: none;
}

        .sm-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 65px;
  z-index: 50;

  background: rgba(10,15,28,0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
  .sm-project-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:20px;
    flex-wrap:wrap;
    margin-bottom:18px;
}

.sm-project-live{
    padding:10px 18px;
    border-radius:8px;
    border:1px solid var(--mint);
    color:var(--mint);
    text-decoration:none;
    font-family:var(--mono);
    font-size:12px;
    transition:.25s;
}

.sm-project-live:hover{
    background:var(--mint);
    color:#07131d;
}

        .sm-nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .sm-logo {
          font-family: var(--mono);
          font-weight: 600;
          font-size: 15px;
          color: var(--text);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sm-logo .dot { color: var(--mint); }

        .sm-pipeline {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0;
          overflow-x: auto;
          scrollbar-width: none;
          flex: 1;
          justify-content: flex-end;
        }
          
    transition:width .45s ease;
}
        .sm-pipeline::-webkit-scrollbar { display: none; }

        

        .sm-node-btn {
  position: relative;
  z-index: 1;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--muted);
  transition: color 0.2s ease;
  white-space: nowrap;
}
        .sm-node-btn:hover { color: var(--text); }
        .sm-node-btn.is-active { color: var(--mint); }
        .sm-node-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--bg-panel);
          border: 2px solid var(--border);
          transition: all 0.25s ease;
        }
        .sm-node-btn.is-active .sm-node-dot {
          background: var(--mint);
          border-color: var(--mint);
          box-shadow: 0 0 0 4px rgba(94,234,212,0.15);
        }
        .sm-node-icon { display: none; }

        .sm-section {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 120px 24px 80px;
          scroll-margin-top: 70px;
        }

        .sm-eyebrow {
          font-family: var(--mono);
          font-size: 12px;
          color: var(--mint);
          letter-spacing: 0.08em;
          margin-bottom: 12px;
        }

        .sm-h2 {
          font-family: var(--sans);
          font-weight: 800;
          font-size: clamp(26px, 4vw, 36px);
          margin: 0 0 40px;
          color: var(--text);
          letter-spacing: -0.01em;
        }

        /* HERO */
        .sm-hero {
          padding-top: 150px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 48px;
          align-items: center;
          min-height: 86vh;
        }
        @media (max-width: 860px) {
          .sm-hero { grid-template-columns: 1fr; min-height: unset; padding-top: 120px; }
        }

        .sm-hero-title {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800;
          line-height: 1.08;
          margin: 0 0 16px;
          letter-spacing: -0.02em;
        }
        .sm-hero-title span { color: var(--mint); }

        .sm-hero-sub {
          font-family: var(--mono);
          color: var(--muted);
          font-size: 14px;
          margin-bottom: 20px;
          letter-spacing: 0.02em;
        }

        .sm-hero-desc {
          color: var(--muted);
          font-size: 16px;
          max-width: 46ch;
          margin-bottom: 32px;
        }

        .sm-cta-row { display: flex; gap: 14px; flex-wrap: wrap; }
        .sm-btn {
          font-family: var(--mono);
          font-size: 13px;
          padding: 12px 20px;
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .sm-btn.primary {
          background: var(--mint);
          border-color: var(--mint);
          color: #06231f;
          font-weight: 600;
        }
        .sm-btn.primary:hover { background: #7ff2df; }
        .sm-btn:not(.primary):hover { border-color: var(--mint); color: var(--mint); }

        .sm-terminal {
          background: var(--bg-panel);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .sm-terminal-bar {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 14px;
          background: var(--bg-panel-alt);
          border-bottom: 1px solid var(--border);
        }
        .sm-terminal-dot { width: 10px; height: 10px; border-radius: 50%; }
        .sm-terminal-body {
          padding: 22px 20px;
          font-family: var(--mono);
          font-size: 13.5px;
          min-height: 180px;
        }
        .sm-terminal-line { margin-bottom: 14px; }
        .sm-terminal-prompt { color: var(--mint); }
        .sm-terminal-out { color: var(--text); margin-left: 0; display: block; margin-top: 4px; }
        .sm-cursor {
          display: inline-block;
          width: 7px;
          height: 14px;
          background: var(--mint);
          margin-left: 2px;
          animation: blink 1s step-end infinite;
          vertical-align: middle;
        }
        @keyframes blink { 50% { opacity: 0; } }

        /* STACK */
        .sm-stack-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 18px;
        }
        .sm-card {
          background: var(--bg-panel);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 22px;
        }
        .sm-card-title {
          font-family: var(--mono);
          font-size: 13px;
          color: var(--text);
          font-weight: 600;
          margin-bottom: 14px;
          letter-spacing: 0.02em;
        }
        .sm-tag-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .sm-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-family: var(--mono);
          padding: 5px 10px;
          border-radius: 20px;
          background: var(--bg-panel-alt);
          border: 1px solid var(--border-soft);
          color: var(--muted);
        }
        .sm-tag-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        .sm-legend {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 28px;
          font-family: var(--mono);
          font-size: 11.5px;
          color: var(--muted);
        }
        .sm-legend span { display: inline-flex; align-items: center; gap: 6px; }
        .sm-legend .sm-tag-dot { width: 7px; height: 7px; }

        /* PROJECTS */
        .sm-project {
          background: var(--bg-panel);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 28px;
          margin-bottom: 22px;
        }
        .sm-project-title {
          font-size: 19px;
          font-weight: 700;
          margin: 0 0 12px;
        }
        .sm-project-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
        .sm-project-tag {
          font-family: var(--mono);
          font-size: 11.5px;
          color: var(--amber);
          border: 1px solid rgba(245,165,36,0.35);
          padding: 4px 10px;
          border-radius: 5px;
        }
        .sm-project ul { margin: 0; padding: 0; list-style: none; }
        .sm-project li {
          position: relative;
          padding-left: 20px;
          margin-bottom: 10px;
          color: var(--muted);
          font-size: 14.5px;
        }
        .sm-project li::before {
          content: '›';
          position: absolute;
          left: 0;
          color: var(--mint);
          font-family: var(--mono);
        }

        /* HIGHLIGHTS */
        .sm-highlight-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 18px;
        }
        .sm-highlight-card {
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 20px;
          background: var(--bg-panel);
        }
        .sm-highlight-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 14.5px;
          margin-bottom: 10px;
        }
        .sm-highlight-title svg { color: var(--mint); flex-shrink: 0; }
        .sm-highlight-body { color: var(--muted); font-size: 13.5px; }

        /* EDUCATION */
        .sm-edu-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 20px;
        }
        @media (max-width: 760px) { .sm-edu-grid { grid-template-columns: 1fr; } }
        .sm-edu-degree { font-size: 17px; font-weight: 700; margin-bottom: 6px; }
        .sm-edu-focus { color: var(--muted); font-size: 14px; margin-bottom: 0; }
        .sm-strength-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .sm-strength-tag {
          font-family: var(--mono);
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid var(--border-soft);
          color: var(--text);
          background: var(--bg-panel-alt);
        }
        .sm-lang-row { display: flex; gap: 10px; flex-wrap: wrap; font-size: 13px; color: var(--muted); }

        /* CONTACT */
        .sm-contact-console{
    max-width:850px;
    margin:40px auto 0;
    background:#111a2e;
    border:1px solid var(--border);
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 20px 50px rgba(0,0,0,.35);
}

.sm-console-header{
    padding:16px 24px;
    background:#16213a;
    border-bottom:1px solid var(--border);
    font-family:var(--mono);
    letter-spacing:2px;
    color:var(--mint);
    font-size:13px;
}

.sm-console-row{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:18px 24px;
    border-bottom:1px solid rgba(255,255,255,.05);
}

.sm-console-row:last-of-type{
    border-bottom:none;
}

.sm-console-row .label{
    color:var(--muted);
    font-family:var(--mono);
    width:120px;
}

.sm-console-row a,
.sm-console-row span:last-child{
    color:var(--text);
    text-decoration:none;
    transition:.3s;
}

.sm-console-row a:hover{
    color:var(--mint);
}

.sm-console-status{
    padding:18px 24px;
    display:flex;
    align-items:center;
    gap:10px;
    background:#0f1728;
    color:var(--mint);
    font-family:var(--mono);
}

/* CONTACT FORM */
.sm-contact-form{
    max-width:850px;
    margin:24px auto 0;
    background:#111a2e;
    border:1px solid var(--border);
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 20px 50px rgba(0,0,0,.35);
}

.sm-form-body{
    padding:24px;
    display:flex;
    flex-direction:column;
    gap:16px;
}

.sm-form-row{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:16px;
}
@media (max-width:600px){ .sm-form-row{ grid-template-columns:1fr; } }

.sm-form-field{ display:flex; flex-direction:column; gap:6px; }

.sm-form-field label{
    font-family:var(--mono);
    font-size:11.5px;
    letter-spacing:1px;
    color:var(--muted);
}

.sm-form-field input,
.sm-form-field textarea{
    background:var(--bg-panel-alt);
    border:1px solid var(--border-soft);
    border-radius:8px;
    padding:11px 13px;
    color:var(--text);
    font-family:var(--sans);
    font-size:14px;
    resize:vertical;
    transition:border-color .2s ease;
}

.sm-form-field input:focus,
.sm-form-field textarea:focus{
    outline:none;
    border-color:var(--mint);
}

.sm-captcha-row{
    display:flex;
    align-items:flex-end;
    gap:12px;
    flex-wrap:wrap;
}

.sm-captcha-challenge{
    font-family:var(--mono);
    font-size:13px;
    color:var(--mint);
    background:var(--bg-panel-alt);
    border:1px solid var(--border-soft);
    border-radius:8px;
    padding:11px 14px;
    white-space:nowrap;
}

.sm-captcha-refresh{
    background:transparent;
    border:1px solid var(--border-soft);
    border-radius:8px;
    color:var(--muted);
    padding:11px;
    cursor:pointer;
    display:flex;
    align-items:center;
    transition:.2s;
}
.sm-captcha-refresh:hover{ color:var(--mint); border-color:var(--mint); }

.sm-form-error{
    font-family:var(--mono);
    font-size:12.5px;
    color:#ff8080;
    background:rgba(255,95,87,0.08);
    border:1px solid rgba(255,95,87,0.25);
    border-radius:8px;
    padding:10px 14px;
}

.sm-form-success{
    font-family:var(--mono);
    font-size:12.5px;
    color:var(--mint);
    background:rgba(94,234,212,0.08);
    border:1px solid rgba(94,234,212,0.25);
    border-radius:8px;
    padding:10px 14px;
}

.sm-form-submit{
    align-self:flex-start;
    display:inline-flex;
    align-items:center;
    gap:8px;
}

.sm-spin{ animation: sm-spin 1s linear infinite; }
@keyframes sm-spin { to { transform: rotate(360deg); } }

.status-dot{
    width:10px;
    height:10px;
    border-radius:50%;
    background:#5eead4;
    box-shadow:0 0 10px #5eead4;
}
        .sm-contact-card {
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 18px;
          background: var(--bg-panel);
          text-decoration: none;
          color: var(--text);
          transition: border-color 0.2s ease;
        }
        .sm-contact-card:hover { border-color: var(--mint); }
        .sm-contact-icon {
          width: 38px; height: 38px;
          border-radius: 8px;
          background: var(--bg-panel-alt);
          display: flex; align-items: center; justify-content: center;
          color: var(--mint);
          flex-shrink: 0;
        }
        .sm-contact-label { font-size: 11px; color: var(--muted); font-family: var(--mono); }
        .sm-contact-value { font-size: 14px; font-weight: 600; word-break: break-word; }

        .sm-footer {
          text-align: center;
          padding: 30px 24px 50px;
          font-family: var(--mono);
          font-size: 12px;
          color: var(--muted);
          position: relative;
          z-index: 1;
        }

        :focus-visible { outline: 2px solid var(--mint); outline-offset: 2px; }

        @media (prefers-reduced-motion: reduce) {
          .sm-cursor { animation: none; }
        }
      `}</style>

      <div className="sm-bg-grid" />

      <nav className="sm-nav">
        <div className="sm-nav-inner">
          <div className="sm-logo"><span className="dot">$</span> sohum.mp</div>
          <div className="sm-pipeline">
            <div className="sm-track">
              <div className="sm-track-fill" style={{ width: `${fillPct}%` }} />
            </div>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                className={`sm-node-btn ${active === s.id ? "is-active" : ""}`}
                onClick={() => scrollTo(s.id)}
              >
                <span className="sm-node-dot" />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <section id="home" ref={(el) => (refs.current.home = el)} className="sm-section sm-hero">
        <div>
          <div className="sm-hero-sub">// aws cloud & devops engineer</div>
          <h1 className="sm-hero-title">
            Sohum M P builds<br />infrastructure that <span>deploys itself</span>
          </h1>
          <p className="sm-hero-desc">
            BCA graduate building scalable, cost-aware AWS environments and automating the path
            from commit to production. Hands-on with Python, Linux, and Docker — currently
            deepening Terraform and Kubernetes to ship infrastructure that's reproducible by design.
          </p>
          <div className="sm-cta-row">
            <button className="sm-btn primary" onClick={() => scrollTo("projects")}>
              See the projects <ArrowUpRight size={15} />
            </button>
            <button className="sm-btn" onClick={() => scrollTo("contact")}>
              Get in touch
            </button>
          </div>
        </div>

        <div className="sm-terminal">
          <div className="sm-terminal-bar">
            <span className="sm-terminal-dot" style={{ background: "#ff5f57" }} />
            <span className="sm-terminal-dot" style={{ background: "#febc2e" }} />
            <span className="sm-terminal-dot" style={{ background: "#28c840" }} />
          </div>
          <div className="sm-terminal-body">
            {typedLines.map((line, i) => (
              <div className="sm-terminal-line" key={i}>
                {line.prompt && (
                  <span className="sm-terminal-prompt">
                    {line.prompt}
                    {i === typedLines.findIndex((l) => l.prompt && !l.out) && !typingDone && (
                      <span className="sm-cursor" />
                    )}
                  </span>
                )}
                {line.out && <span className="sm-terminal-out">{line.out}</span>}
              </div>
            ))}
            {typingDone && <span className="sm-cursor" />}
          </div>
        </div>
      </section>

      <section id="stack" ref={(el) => (refs.current.stack = el)} className="sm-section">
        <div className="sm-eyebrow">// core competencies</div>
        <h2 className="sm-h2">What I build with</h2>
        <div className="sm-legend">
          <span><span className="sm-tag-dot" style={{ background: "var(--mint)" }} /> Hands-on</span>
          <span><span className="sm-tag-dot" style={{ background: "var(--amber)" }} /> Learning / concepts</span>
          <span><span className="sm-tag-dot" style={{ background: "var(--muted)" }} /> Awareness</span>
        </div>
        <div className="sm-stack-grid">
          {STACK.map((group) => (
            <div className="sm-card" key={group.title}>
              <div className="sm-card-title">{group.title}</div>
              <div className="sm-tag-list">
                {group.items.map((item) => (
                  <span className="sm-tag" key={item.name}>
                    <span className="sm-tag-dot" style={{ background: LEVEL_META[item.level].color }} />
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" ref={(el) => (refs.current.projects = el)} className="sm-section">
        <div className="sm-eyebrow">// key projects</div>
        <h2 className="sm-h2">Projects that mirror production</h2>
        {PROJECTS.map((p) => (
          <div className="sm-project" key={p.title}>
            <div className="sm-project-title">{p.title}</div>
            <div className="sm-project-header">
  <div className="sm-project-tags">
    {p.tags.map((t) => (
      <span className="sm-project-tag" key={t}>
        {t}
      </span>
    ))}
  </div>

  {p.live && (
    <a
      className="sm-project-live"
      href={p.live}
      target="_blank"
      rel="noopener noreferrer"
    >
      Live Demo ↗
    </a>
  )}
</div>
            <ul>
              {p.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section id="highlights" ref={(el) => (refs.current.highlights = el)} className="sm-section">
        <div className="sm-eyebrow">// aws & devops knowledge</div>
        <h2 className="sm-h2">Where hands-on meets the roadmap</h2>
        <div className="sm-highlight-grid">
          {HIGHLIGHTS.map((h) => (
            <div className="sm-highlight-card" key={h.title}>
              <div className="sm-highlight-title">
                <CheckCircle2 size={17} />
                {h.title}
              </div>
              <div className="sm-highlight-body">{h.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="education" ref={(el) => (refs.current.education = el)} className="sm-section">
        <div className="sm-eyebrow">// education & strengths</div>
        <h2 className="sm-h2">Foundation & working style</h2>
        <div className="sm-edu-grid">
          <div className="sm-card">
            <div className="sm-card-title">EDUCATION</div>
            <div className="sm-edu-degree">Bachelor of Computer Applications (BCA)</div>
            <p className="sm-edu-focus">
              Focus: Software Development, AI, Deep Learning, Web Technologies, Linux & Networking
            </p>
          </div>
          <div className="sm-card">
            <div className="sm-card-title">LANGUAGES</div>
            <div className="sm-lang-row">
              {LANGUAGES.map((l) => <span key={l}>{l}</span>)}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div className="sm-card-title" style={{ fontFamily: "var(--mono)", color: "var(--muted)", marginBottom: 14 }}>
            PROFESSIONAL STRENGTHS
          </div>
          <div className="sm-strength-tags">
            {STRENGTHS.map((s) => (
              <span className="sm-strength-tag" key={s}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" ref={(el) => (refs.current.contact = el)} className="sm-section">
        <div className="sm-eyebrow">// contact</div>
        <h2 className="sm-h2">Let's build something reliable</h2>
        <p style={{ color: "var(--muted)", maxWidth: "50ch" }}>
          Available for technical assessments & interviews. Open to immediate joining, on-site in Bengaluru, Mumbai, Hyderabad.
        </p>
        <div className="sm-contact-console">
  <div className="sm-console-header">
    CONNECTION STATUS
  </div>

  <div className="sm-console-row">
    <span className="label">EMAIL</span>
    <a href="mailto:sohummp@gmail.com">sohummp@gmail.com</a>
  </div>

  <div className="sm-console-row">
    <span className="label">PHONE</span>
    <a href="tel:+919480966591">+91 94809 66591</a>
  </div>

  <div className="sm-console-row">
    <span className="label">LINKEDIN</span>
    <a
      href="https://www.linkedin.com/in/sohum-m-p-275b67284"
      target="_blank"
      rel="noopener noreferrer"
    >
      SOHUM M P
    </a>
  </div>

  <div className="sm-console-row">
    <span className="label">LOCATION</span>
    <span>Bengaluru, India</span>
  </div>

  <div className="sm-console-status">
    <span className="status-dot"></span>
    Available for Immediate Joining
  </div>
</div>

        <form className="sm-contact-form" onSubmit={handleContactSubmit}>
          <div className="sm-console-header">SEND A MESSAGE</div>
          <div className="sm-form-body">
            <div className="sm-form-row">
              <div className="sm-form-field">
                <label htmlFor="sm-name">NAME</label>
                <input
                  id="sm-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="sm-form-field">
                <label htmlFor="sm-email">EMAIL</label>
                <input
                  id="sm-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="sm-form-field">
              <label htmlFor="sm-message">MESSAGE</label>
              <textarea
                id="sm-message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleFormChange}
                placeholder="Tell me a bit about the role or project..."
                required
              />
            </div>

            <div className="sm-form-field">
              <label htmlFor="sm-captcha">
                CAPTCHA — what is {captcha.a} + {captcha.b}?
              </label>
              <div className="sm-captcha-row">
                <input
                  id="sm-captcha"
                  type="number"
                  inputMode="numeric"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Your answer"
                  style={{ maxWidth: 160 }}
                  required
                />
                <span className="sm-captcha-challenge">
                  {captcha.a} + {captcha.b} = ?
                </span>
                <button
                  type="button"
                  className="sm-captcha-refresh"
                  onClick={refreshCaptcha}
                  aria-label="Refresh captcha"
                  title="Get a new question"
                >
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>

            {formError && <div className="sm-form-error">{formError}</div>}
            {sendState === "success" && (
              <div className="sm-form-success">
                Message sent — thanks for reaching out! I'll reply as soon as I can.
              </div>
            )}
            {sendState === "error" && (
              <div className="sm-form-error">
                Something went wrong sending the message. Please try again or email me directly.
              </div>
            )}

            <button
              type="submit"
              className="sm-btn primary sm-form-submit"
              disabled={sendState === "sending"}
            >
              {sendState === "sending" ? (
                <>
                  <Loader2 size={15} className="sm-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send size={15} /> Send Message
                </>
              )}
            </button>
          </div>
        </form>
      </section>

     <div className="sm-footer">
  $ echo "thanks for scrolling" — Sohum M P, built with React
</div>

<ChatBot />

</div>
  );
}