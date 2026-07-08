import { useState, useEffect, useRef } from "react";
import {
    Bot,
    Send,
    Sparkles,
    X
} from "lucide-react";

import "./chatbot.css";

const AI_DATA = {
    projects:
        "I've built NeuroVision, an AI Facial Analysis Platform using Flask, TensorFlow, OpenCV, SQLite and MTCNN. I've also built a Dockerized Full Stack application with CI/CD and a Python Automation Pipeline.",

    aws:
        "I have hands-on experience with EC2, IAM, VPC, Route53, Lambda, CloudWatch, ECS, Docker, Terraform, GitHub Actions and I'm currently learning Kubernetes & EKS.",

    devops:
        "My DevOps stack includes Docker, GitHub Actions, Linux, Python, Terraform, Prometheus, Grafana and AWS.",

    neurovision:
        "NeuroVision is an AI-powered facial analysis platform capable of predicting age and gender using Deep Learning. It is built using Flask, TensorFlow, OpenCV, SQLite and MTCNN.",

    education:
        "Bachelor of Computer Applications (BCA) focused on Software Development, AI, Deep Learning and Cloud Technologies.",

    contact:
        "📧 sohummp@gmail.com\n📱 +91 94809 66591\n📍 Bengaluru, India",

    resume:
        "You can download Sohum's resume directly from the Resume button on this portfolio.",

    about:
        "I'm Sohum M P, an AWS Cloud & DevOps Engineer passionate about automation, scalable cloud infrastructure and AI applications.",

    default:
        "I couldn't find an exact answer. Try asking about Projects, AWS, DevOps, NeuroVision, Resume, Education or Contact."
};

export default function ChatBot() {

    const [open, setOpen] = useState(false);

    const [input, setInput] = useState("");

    const [typing, setTyping] = useState(false);

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text:
`Hello 👋

I'm Sohum AI.

I've been trained on Sohum's portfolio.

Ask me anything about

• Projects
• AWS
• DevOps
• Resume
• Education
• Contact`
        }
    ]);

    const chatRef = useRef(null);

    const bottomRef = useRef(null);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages, typing]);

    useEffect(() => {

        function close(e){

            if(
                open &&
                chatRef.current &&
                !chatRef.current.contains(e.target)
            ){
                setOpen(false);
            }

        }

        document.addEventListener("mousedown", close);

        return ()=>document.removeEventListener("mousedown", close);

    },[open]);

    function getReply(question){

        const q=question.toLowerCase();

        if(q.includes("project")) return AI_DATA.projects;

        if(q.includes("aws")) return AI_DATA.aws;

        if(q.includes("devops")) return AI_DATA.devops;

        if(q.includes("docker")) return AI_DATA.devops;

        if(q.includes("terraform")) return AI_DATA.devops;

        if(q.includes("neuro")) return AI_DATA.neurovision;

        if(q.includes("education")) return AI_DATA.education;

        if(q.includes("resume")) return AI_DATA.resume;

        if(q.includes("contact")) return AI_DATA.contact;

        if(q.includes("about")) return AI_DATA.about;

        return AI_DATA.default;

    }

    function sendMessage(custom){

        const question = custom || input;

        if(!question.trim()) return;

        const userMessage={
            sender:"user",
            text:question
        };

        setMessages(prev=>[
            ...prev,
            userMessage
        ]);

        setInput("");

        setTyping(true);

        setTimeout(()=>{

            setTyping(false);

            setMessages(prev=>[
                ...prev,
                {
                    sender:"bot",
                    text:getReply(question)
                }
            ]);

        },1200);

    }

    const suggestions=[
        "Projects",
        "AWS Skills",
        "DevOps",
        "NeuroVision",
        "Resume"
    ];

    return(

<div ref={chatRef}>

<button
className="chat-toggle"
onClick={()=>setOpen(!open)}
>

<Sparkles size={28}/>

</button>

{open && (

<div className="chat-window">

<div className="chat-header">

<div className="ai-avatar">

<Bot size={24}/>

</div>

<div className="ai-info">

<div className="ai-title">

Sohum AI

</div>

<div className="ai-status">

<span className="status-dot"></span>

Online • AI Assistant

</div>

</div>

<button
className="close-btn"
onClick={()=>setOpen(false)}
>

<X size={18}/>

</button>

</div>

<div className="chat-body">

<div className="suggestions">

{suggestions.map(s=>(

<button
key={s}
onClick={()=>sendMessage(s)}
>

{s}

</button>

))}

</div>

{messages.map((msg,index)=>(

<div
key={index}
className={`msg ${msg.sender}`}
>

{msg.text}

<div className="time">

{new Date().toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
})}

</div>

</div>

))}

{typing && (

<div className="msg bot">

<div className="typing">

<span></span>

<span></span>

<span></span>

</div>

</div>

)}

<div ref={bottomRef}></div>

</div>

<div className="chat-footer">

<input

value={input}

placeholder="Ask anything..."

onChange={(e)=>setInput(e.target.value)}

onKeyDown={(e)=>{

if(e.key==="Enter"){

sendMessage();

}

}}

/>

<button
onClick={()=>sendMessage()}
>

<Send size={18}/>

</button>

</div>

</div>

)}

</div>

);

}
