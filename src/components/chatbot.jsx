
import { useState, useEffect, useRef } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import "./chatbot.css";

const KNOWLEDGE = {
  about: "I'm Sohum AI. Ask me about Sohum's projects, AWS skills, DevOps experience, resume or contact information.",
  projects: "NeuroVision, Dockerized Full Stack CI/CD, Python AI Automation Pipeline.",
  aws: "EC2, IAM, VPC, Route53, Lambda, ECS, CloudWatch, Docker, Terraform, GitHub Actions, EKS (learning).",
  resume: "Use the Resume button on the portfolio to download the latest resume."
};

export default function ChatBot() {
  const [open,setOpen]=useState(false);
  const [typing,setTyping]=useState(false);
  const [input,setInput]=useState("");
  const [messages,setMessages]=useState([
    {role:"assistant",content:KNOWLEDGE.about}
  ]);

  const wrapRef=useRef(null);
  const bottomRef=useRef(null);

  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:"smooth"});
  },[messages,typing]);

  useEffect(()=>{
    function outside(e){
      if(open && wrapRef.current && !wrapRef.current.contains(e.target)){
        setOpen(false);
      }
    }
    document.addEventListener("mousedown",outside);
    return ()=>document.removeEventListener("mousedown",outside);
  },[open]);

  function lookup(q){
    q=q.toLowerCase();
    if(q.includes("project")) return KNOWLEDGE.projects;
    if(q.includes("aws")) return KNOWLEDGE.aws;
    if(q.includes("resume")) return KNOWLEDGE.resume;
    return "That's a great question. Connect me to an OpenAI or Gemini API and I'll answer naturally using Sohum's portfolio.";
  }

  function streamReply(text){
    let i=0;
    setMessages(m=>[...m,{role:"assistant",content:""}]);

    const timer=setInterval(()=>{
      i++;
      setMessages(prev=>{
        const copy=[...prev];
        copy[copy.length-1]={
          ...copy[copy.length-1],
          content:text.slice(0,i)
        };
        return copy;
      });
      if(i>=text.length){
        clearInterval(timer);
        setTyping(false);
      }
    },18);
  }

  function send(custom){
    const q=(custom||input).trim();
    if(!q) return;

    setMessages(m=>[...m,{role:"user",content:q}]);
    setInput("");
    setTyping(true);
  }

  useEffect(()=>{
    if(!typing) return;
    const last=messages[messages.length-1];
    if(last?.role!=="user") return;
    const id=setTimeout(()=>{
      streamReply(lookup(last.content));
    },800);
    return ()=>clearTimeout(id);
  },[typing]);

  const prompts=["Projects","AWS","Resume"];

  return (
    <div ref={wrapRef}>
      <button className="chat-toggle" onClick={()=>setOpen(v=>!v)}>
        <Sparkles size={28}/>
      </button>

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="ai-avatar"><Bot size={22}/></div>
            <div className="ai-info">
              <div className="ai-title">Sohum AI</div>
              <div className="ai-status"><span className="status-dot"/>Online</div>
            </div>
            <button className="close-btn" onClick={()=>setOpen(false)}><X size={18}/></button>
          </div>

          <div className="chat-body">
            <div className="suggestions">
              {prompts.map(p=><button key={p} onClick={()=>send(p)}>{p}</button>)}
            </div>

            {messages.map((m,i)=>(
              <div key={i} className={`msg ${m.role==="user"?"user":"bot"}`}>
                {m.content}
              </div>
            ))}

            {typing && <div className="msg bot"><div className="typing"><span/><span/><span/></div></div>}
            <div ref={bottomRef}/>
          </div>

          <div className="chat-footer">
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter" && send()}
              placeholder="Ask anything..."
            />
            <button onClick={()=>send()}><Send size={18}/></button>
          </div>
        </div>
      )}
    </div>
  );
}
