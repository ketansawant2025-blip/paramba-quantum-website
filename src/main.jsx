import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Vapi from '@vapi-ai/web';
import { ArrowUpRight, Bot, BrainCircuit, CheckCircle2, ChevronDown, Clock3, Code2, Globe2, Headphones, Mail, Menu, Mic, Phone, Play, Send, ShieldCheck, Sparkles, Workflow, X, Zap } from 'lucide-react';
import './styles.css';

const services = [
  { icon: Bot, title: 'AI Voice Agents', text: 'Always-on AI receptionists and sales assistants that answer questions, qualify enquiries and help customers take the next step.' },
  { icon: Workflow, title: 'AI Automation', text: 'Connect repetitive business processes, forms and follow-ups into smoother workflows that save time.' },
  { icon: Code2, title: 'Website Development', text: 'Modern, responsive business websites designed to build trust and turn visitors into enquiries.' },
  { icon: Globe2, title: 'Landing Pages', text: 'Focused campaign pages with clear messaging and conversion-led enquiry experiences.' },
  { icon: Sparkles, title: 'Marketing Creatives', text: 'AI-assisted campaign visuals, social media creatives and promotional content for your brand.' },
  { icon: BrainCircuit, title: 'AI Business Solutions', text: 'Practical AI integrations shaped around your customer journey, operations and growth goals.' },
];

function VoiceDemo() {
  const vapiRef = useRef(null);
  const timerRef = useRef(null);
  const [status, setStatus] = useState('ready');
  const [seconds, setSeconds] = useState(180);
  const [error, setError] = useState('');
  const [transcript, setTranscript] = useState('');
  const key = import.meta.env.VITE_VAPI_PUBLIC_KEY;
  const assistant = import.meta.env.VITE_VAPI_ASSISTANT_ID;
  const active = ['connecting', 'listening', 'speaking'].includes(status);

  useEffect(() => {
    if (!key || !assistant) return;
    const vapi = new Vapi(key);
    vapiRef.current = vapi;
    vapi.on('call-start', () => { setStatus('listening'); setError(''); });
    vapi.on('call-end', () => { clearInterval(timerRef.current); setStatus('ended'); });
    vapi.on('error', (e) => { console.error('Vapi error:', e); setError(e?.message || 'The voice session could not connect.'); setStatus('error'); clearInterval(timerRef.current); });
    vapi.on('message', (m) => {
      if (m?.type === 'transcript' && m.transcript) {
        setTranscript(`${m.role === 'assistant' ? 'AI' : 'You'}: ${m.transcript}`);
      }
      if (m?.type === 'speech-update') setStatus(m.status === 'started' ? 'speaking' : 'listening');
    });
    return () => { clearInterval(timerRef.current); try { vapi.stop(); } catch {} vapi.removeAllListeners?.(); };
  }, [key, assistant]);

  const stop = () => { clearInterval(timerRef.current); try { vapiRef.current?.stop(); } catch {} setStatus('ended'); };
  const start = async () => {
    if (!key || !assistant) { setError('Vapi setup is incomplete. Add the public key and assistant ID to your deployment environment variables.'); setStatus('error'); return; }
    if (!navigator.mediaDevices?.getUserMedia) { setError('This browser cannot access the microphone. Open this page in an up-to-date browser over HTTPS.'); setStatus('error'); return; }
    setError(''); setTranscript(''); setSeconds(180); setStatus('connecting');
    try {
      // Request permission from the explicit button gesture, then release the test stream.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      await vapiRef.current.start(assistant);
      const startedAt = Date.now();
      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, 180 - Math.floor((Date.now() - startedAt) / 1000));
        setSeconds(remaining);
        if (remaining <= 0) stop();
      }, 500);
    } catch (e) {
      console.error('Voice demo start failed:', e);
      const msg = e?.message || String(e);
      setError(msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('denied') ? 'Microphone permission was denied. Allow microphone access for this site in your browser settings, then try again.' : `Could not start the voice session: ${msg}`);
      setStatus('error');
      clearInterval(timerRef.current);
    }
  };
  const fmt = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  const label = ({ready:'Ready to start', connecting:'Connecting to your AI assistant…', listening:'Listening — speak naturally', speaking:'Your AI assistant is speaking', ended:'Session ended', error:'Connection needs attention'})[status];
  return <div className="voice-card" id="live-demo">
    <div className="voice-card-top"><span className="online-dot" /> <span>PARAMBA QUANTUM · AI VOICE</span><span className="live-pill">LIVE DEMO</span></div>
    <h3>Talk to our AI assistant</h3>
    <p className="voice-intro">Experience a real conversation with an AI voice agent — right here in your browser.</p>
<div className="nisha-avatar">
  <div
    className={`nisha-sprite ${
      status === 'speaking' ? 'nisha-speaking' :
      status === 'listening' ? 'nisha-listening' :
      'nisha-idle'
    }`}
    role="img"
    aria-label="Nisha AI Assistant"
  />

  <div className={`nisha-status ${
    status === 'speaking' ? 'speaking' :
    status === 'listening' ? 'listening' : ''
  }`}>
    {status === 'speaking' ? '• Nisha is speaking' :
     status === 'listening' ? '• Nisha is listening' :
     '• Nisha is ready'}
  </div>
</div>

<div className={`mic-stage ${active ? 'is-active' : ''} ${status === 'speaking' ? 'is-speaking' : ''}`}>
      <div className="soundbars left-bars"><i/><i/><i/><i/><i/></div>
      <div className="mic-orbit"><div className="mic-button"><Mic size={34} strokeWidth={2.2}/></div></div>
      <div className="soundbars right-bars"><i/><i/><i/><i/><i/></div>
    </div>
    <div className={`status-label ${status === 'error' ? 'error-text' : ''}`}>{label}</div>
    {active && <div className="timer"><Clock3 size={15}/> Demo time remaining <strong>{fmt}</strong></div>}
    {error && <div className="error-box" role="alert">{error}</div>}
    {transcript && <div className="transcript" aria-live="polite">{transcript}</div>}
    {!active ? <button className="button button-primary demo-button" onClick={start}><Play size={17} fill="currentColor"/> {status === 'error' || status === 'ended' ? 'Try Live Demo Again' : 'Start Live AI Demo'}</button> : <button className="button button-stop demo-button" onClick={stop}><X size={17}/> End Conversation</button>}
    <div className="voice-foot"><span><Clock3 size={16}/> Up to 3 minutes</span><span><ShieldCheck size={16}/> No phone call required</span></div>
    <p className="privacy-note">You are interacting with an AI voice assistant. Your browser microphone is used for this live conversation.</p>
  </div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({name:'', phone:'', email:'', service:'AI Voice Agents', message:''});
  const submit = (e) => {
    e.preventDefault();
    const text = `Hello Paramba Quantum, I'm ${form.name}.\nPhone: ${form.phone}\nEmail: ${form.email}\nInterested in: ${form.service}\nMessage: ${form.message}`;
    window.open(`https://wa.me/919833010399?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setSent(true);
  };
  return <>
    <header className="header"><div className="container nav-wrap">
      <a className="brand" href="#home"><img src="/assets/paramba-quantum-logo.png" alt="Paramba Quantum — Technology, AI, Innovation"/></a>
      <button className="mobile-menu" aria-label="Toggle navigation" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button>
      <nav className={menuOpen?'nav open':'nav'}>
        <a href="#home" onClick={()=>setMenuOpen(false)}>Home</a><a href="#about" onClick={()=>setMenuOpen(false)}>About</a>
        <a href="#services" onClick={()=>setMenuOpen(false)}>Services <ChevronDown size={13}/></a><a href="#live-demo" onClick={()=>setMenuOpen(false)}>Live Demo</a><a href="#work" onClick={()=>setMenuOpen(false)}>Our Work</a><a href="#contact" onClick={()=>setMenuOpen(false)}>Contact</a>
      </nav>
      <a className="button button-yellow nav-cta" href="#contact">Book a Consultation <ArrowUpRight size={16}/></a>
    </div></header>

    <main>
      <section className="hero" id="home"><div className="hero-grid"/><div className="container hero-content">
        <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot"/> TECHNOLOGY · AI · INNOVATION</div>
          <h1>Powering businesses<br/>with <span>AI innovation.</span></h1>
          <p className="hero-lede">We help businesses work smarter, serve customers better and grow faster with practical AI solutions and modern digital experiences.</p>
          <div className="hero-actions"><a href="#services" className="button button-primary">Explore Our Services <ArrowUpRight size={17}/></a><a href="#live-demo" className="button button-outline"><Mic size={17}/> Try Live AI Demo</a></div>
          <div className="hero-proof"><span><CheckCircle2/> Built around your business</span><span><CheckCircle2/> Practical, scalable solutions</span></div>
        </div>
        <div className="hero-visual"><div className="visual-glow"/><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-visual-card"><div className="visual-card-head"><span className="pulse-dot"/> Intelligent business systems</div><div className="visual-brain"><BrainCircuit size={92} strokeWidth={1.15}/><span className="brain-spark">✦</span></div><div className="visual-caption">Human conversations.<br/><b>Intelligent automation.</b></div><div className="visual-tags"><span>AI Voice</span><span>Automation</span><span>Web</span></div></div><div className="float-chip chip-one"><Bot/> AI assistants</div><div className="float-chip chip-two"><Zap/> Smarter workflows</div></div>
      </div><div className="hero-bottom-wave"/></section>

      <section className="trust-strip"><div className="container trust-inner"><span>DESIGNED FOR BUSINESS GROWTH</span><div><i/> Customer experience</div><div><i/> Operational efficiency</div><div><i/> Digital presence</div></div></section>

      <section className="section about-section" id="about"><div className="container about-grid"><div><div className="section-kicker">WHO WE ARE</div><h2>Technology should make business <span>simpler.</span></h2></div><div className="about-text"><p>Paramba Quantum helps businesses put modern technology to work. We combine AI, automation and digital development to create useful solutions that improve everyday business operations and customer experiences.</p><p>Our approach is practical: understand the business challenge, design the right solution and build an experience that is easy to use.</p><a href="#contact" className="text-link">Let's discuss your business <ArrowUpRight size={17}/></a></div></div></section>

      <section className="section services-section" id="services"><div className="container"><div className="section-heading"><div><div className="section-kicker">WHAT WE DO</div><h2>Solutions built for the <span>next move.</span></h2></div><p>From your first website to intelligent customer conversations, get the digital tools that move your business forward.</p></div>
        <div className="service-grid">{services.map(({icon:Icon,title,text},i)=><article className="service-card" key={title}><div className="service-icon"><Icon size={23}/></div><span className="service-number">0{i+1}</span><h3>{title}</h3><p>{text}</p><a href="#contact" aria-label={`Enquire about ${title}`}><ArrowUpRight size={18}/></a></article>)}</div>
      </div></section>

      <section className="demo-section"><div className="container demo-layout"><div className="demo-copy"><div className="section-kicker">TRY IT YOURSELF</div><h2>Don't just hear about AI.<br/><span>Have a conversation.</span></h2><p>Meet our AI voice assistant and experience how a business can welcome visitors, answer common questions and guide potential customers — without a phone call.</p><div className="demo-benefits"><div><Headphones/><span><b>Natural conversations</b><small>Speak in your own words</small></span></div><div><Workflow/><span><b>Business-ready use cases</b><small>Reception, enquiries and lead qualification</small></span></div><div><ShieldCheck/><span><b>Browser-based demo</b><small>No phone number or dialling required</small></span></div></div></div><VoiceDemo/></div></section>

      <section className="section work-section" id="work"><div className="container"><div className="section-heading"><div><div className="section-kicker">SELECTED WORK</div><h2>Built with a <span>business-first</span> mindset.</h2></div><p>We focus on clear communication, useful functionality and digital experiences that help brands serve their customers.</p></div><article className="work-card"><div className="work-art"><div className="work-browser"><div className="browser-dots"><i/><i/><i/></div><div className="browser-content"><div className="browser-logo">NANDAI <b>TRAVELS</b></div><div className="browser-line wide"/><div className="browser-line"/><div className="browser-button"/></div></div><div className="work-orb">N</div></div><div className="work-info"><span className="work-label">WEBSITE DEVELOPMENT</span><h3>Nandai Travels</h3><p>A digital presence concept for a tours and travels business, bringing its transport and travel services into a clear customer enquiry experience.</p><div className="work-tags"><span>Business website</span><span>Travel services</span><span>Enquiry journey</span></div></div></article></div></section>

      <section className="why-section"><div className="container why-grid"><div><div className="section-kicker">WHY PARAMBA QUANTUM</div><h2>Good technology.<br/><span>Clear business value.</span></h2><p className="why-lede">We believe the best solution is not the most complicated one. It is the one that solves the right problem and makes a measurable difference.</p></div><div className="why-points"><div><span>01</span><section><h3>Understand before building</h3><p>We start with your goals, customers and current process.</p></section></div><div><span>02</span><section><h3>Practical by design</h3><p>Solutions are designed to be clear, useful and easy to adopt.</p></section></div><div><span>03</span><section><h3>Ready to evolve</h3><p>Build a digital foundation that can grow as your business grows.</p></section></div></div></div></section>

      <section className="cta-band"><div className="container cta-inner"><div><div className="section-kicker">YOUR NEXT STEP STARTS HERE</div><h2>Let's make technology<br/>work for your business.</h2></div><a href="#contact" className="button button-yellow">Start a Conversation <ArrowUpRight size={17}/></a></div></section>

      <section className="section contact-section" id="contact"><div className="container contact-grid"><div><div className="section-kicker">GET IN TOUCH</div><h2>Tell us what you want to <span>build.</span></h2><p>Share a little about your business and what you need. We'll connect with you to discuss the next step.</p><div className="contact-method"><div><Phone/></div><span><small>CALL / WHATSAPP</small><b>+91 98330 10399</b></span></div><div className="contact-method"><div><Mail/></div><span><small>ENQUIRIES</small><b>Use the enquiry form</b></span></div></div>
        <form className="contact-form" onSubmit={submit}><div className="form-title">Start your project enquiry</div><div className="form-row"><label>Your name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name"/></label><label>Phone number<input required type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Mobile number"/></label></div><label>Email address<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@company.com"/></label><label>What are you interested in?<select value={form.service} onChange={e=>setForm({...form,service:e.target.value})}>{services.map(s=><option key={s.title}>{s.title}</option>)}</select></label><label>Tell us about your requirement<textarea rows="3" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="A few details about your project..."/></label><button className="button button-primary form-submit" type="submit"><Send size={16}/> Send Enquiry on WhatsApp</button>{sent&&<p className="form-success">Your enquiry is ready in WhatsApp. Please send the pre-filled message to complete submission.</p>}<small className="form-note">By submitting, you agree to be contacted about your enquiry.</small></form>
      </div></section>
    </main>
    <footer className="footer"><div className="container footer-main"><div className="footer-brand"><img src="/assets/paramba-quantum-logo.png" alt="Paramba Quantum logo"/><p>Powering Businesses with AI Innovation.</p></div><div><b>Explore</b><a href="#about">About</a><a href="#services">Services</a><a href="#live-demo">Live Demo</a><a href="#work">Our Work</a></div><div><b>Connect</b><a href="https://wa.me/919833010399" target="_blank" rel="noreferrer">WhatsApp</a><a href="#contact">Contact</a></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Paramba Quantum. All rights reserved.</span><span>Technology · AI · Innovation</span></div></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
