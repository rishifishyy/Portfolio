import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const pythonExamples = [
  { label: 'Squares', file: 'squares.py', code: '# A little Python, every day\nnumbers = [1, 2, 3, 4, 5]\nsquares = [n ** 2 for n in numbers]\nprint(squares)', output: '[1, 4, 9, 16, 25]' },
  { label: 'Filter evens', file: 'filter.py', code: '# Keep only the even numbers\nnumbers = [1, 2, 3, 4, 5, 6]\nevens = [n for n in numbers if n % 2 == 0]\nprint(evens)', output: '[2, 4, 6]' },
  { label: 'Functions', file: 'hello.py', code: '# Small functions, clear intent\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("world"))', output: 'Hello, world!' }
];
const aiExamples = [
  { label: 'Summarize', prompt: 'Summarize a long article.', output: 'A shorter version. The main ideas preserved.' },
  { label: 'Explain', prompt: 'Explain recursion simply.', output: 'A function calls itself, until a stopping condition is met.' },
  { label: 'Classify', prompt: 'Classify: “I loved this!”', output: 'Sentiment → positive' }
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

// Every demo owns one timeline. No animation runs offscreen or in a hidden tab.
function runVisibleTimeline(element, buildTimeline) {
  let visible = false;
  let timeline;
  const context = gsap.context(() => {
    timeline = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.4 });
    buildTimeline(timeline);
  }, element);
  const sync = () => {
    const running = visible && !document.hidden;
    timeline.paused(!running);
    element.dataset.animating = String(running);
  };
  const rect = element.getBoundingClientRect();
  visible = rect.top < innerHeight && rect.bottom > 0;
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }, { threshold: 0.05 }) : null;
  observer?.observe(element);
  document.addEventListener('visibilitychange', sync);
  sync();
  return () => {
    observer?.disconnect();
    document.removeEventListener('visibilitychange', sync);
    context.revert();
    element.dataset.animating = 'false';
  };
}

function PythonDemo({ playing }) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const example = pythonExamples[exampleIndex];
  const root = useRef(null);
  const code = useRef(null);
  const output = useRef(null);
  useLayoutEffect(() => {
    code.current.textContent = example.code;
    if (!playing) return;
    const element = root.current;
    const cleanup = runVisibleTimeline(element, timeline => {
      const text = { length: 0 };
      timeline.call(() => { text.length = 0; code.current.textContent = ''; })
        .set(output.current, { autoAlpha: 0, y: 8 })
        .to(text, {
          length: example.code.length, duration: 3.5, ease: 'none',
          onUpdate: () => { code.current.textContent = example.code.slice(0, Math.round(text.length)); }
        })
        .to(output.current, { autoAlpha: 1, y: 0, duration: .4 }, '+=.2')
        .to({}, { duration: 1.5 });
    });
    return () => { cleanup(); code.current.textContent = example.code; };
  }, [example, playing]);

  return <div className="learning-demo python-demo" ref={root} data-animating="false">
    <div className="demo-toolbar"><span className="demo-file"><span aria-hidden="true">&gt;_</span> {example.file}</span><span className="demo-caption">ILLUSTRATED EXAMPLE</span></div>
    <div className="python-editor" aria-hidden="true"><div className="editor-gutter">1<br />2<br />3<br />4<br />5<br />6</div><pre><code ref={code}>{example.code}</code><span className="typing-caret" /></pre></div>
    <span className="learning-sr-only">Python example: {example.code}</span>
    <div className="python-output" ref={output}><span className="output-label">OUTPUT</span><code>{example.output}</code><span className="output-check" aria-hidden="true">✓</span></div>
    <div className="demo-options" aria-label="Python examples">{pythonExamples.map((item, index) => <button key={item.label} type="button" aria-pressed={index === exampleIndex} onClick={() => setExampleIndex(index)}>{item.label}</button>)}</div>
  </div>;
}

function AIDemo({ playing }) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const example = aiExamples[exampleIndex];
  const root = useRef(null);
  useLayoutEffect(() => {
    const responseElement = root.current.querySelector('.ai-response-text');
    responseElement.textContent = example.output;
    if (!playing) return;
    const cleanup = runVisibleTimeline(root.current, timeline => {
      const inputs = [...root.current.querySelectorAll('.ai-packet-in')];
      const outputs = [...root.current.querySelectorAll('.ai-packet-out')];
      const lines = root.current.querySelectorAll('.ai-connection-active');
      const core = root.current.querySelector('.ai-core-ring');
      const response = root.current.querySelector('.ai-response-text');
      timeline.set([...inputs, ...outputs], { opacity: 0 })
        .set(lines, { strokeDashoffset: 220 })
        .call(() => { response.textContent = 'Following the information…'; })
        .set(response, { autoAlpha: 1, y: 0 });
      inputs.forEach((packet, i) => {
        timeline.fromTo(packet, { x: 65, y: 70 + i * 75, opacity: 0 }, { x: 207, y: 145, opacity: 1, duration: 1.25, ease: 'power1.inOut' }, .15 + i * .2);
        timeline.to(packet, { opacity: 0, duration: .15 }, 1.4 + i * .2);
      });
      timeline.to(lines, { strokeDashoffset: 0, duration: 1.6, stagger: .08 }, 0)
        .fromTo(core, { scale: 1, transformOrigin: 'center center' }, { scale: 1.12, duration: .4, repeat: 1, yoyo: true, ease: 'sine.inOut' }, 1.6);
      outputs.forEach((packet, i) => {
        timeline.fromTo(packet, { x: 287, y: 145, opacity: 0 }, { x: 430, y: 70 + i * 75, opacity: 1, duration: 1.15, ease: 'power1.inOut' }, 2.25 + i * .18);
        timeline.to(packet, { opacity: 0, duration: .15 }, 3.4 + i * .18);
      });
      timeline.to(response, { autoAlpha: 0, duration: .15 }, 3.5)
        .call(() => { response.textContent = example.output; }, [], 3.65)
        .fromTo(response, { y: 6 }, { autoAlpha: 1, y: 0, duration: .4 }, 3.65)
        .to({}, { duration: 1.2 });
    });
    return () => { cleanup(); responseElement.textContent = example.output; };
  }, [example, playing]);

  return <div className="learning-demo ai-demo" ref={root} data-animating="false">
    <div className="demo-toolbar"><span className="demo-file">prompt → response</span><span className="demo-caption">CONCEPT VISUALIZATION</span></div>
    <div className="ai-prompt"><span className="output-label">PROMPT</span><p>{example.prompt}</p></div>
    <svg className="ai-network" viewBox="0 0 500 280" role="img" aria-label="An illustration of information flowing from input, through a model, to a response">
      <text x="65" y="25" textAnchor="middle" className="network-label">INPUT</text><text x="247" y="25" textAnchor="middle" className="network-label">MODEL</text><text x="430" y="25" textAnchor="middle" className="network-label">OUTPUT</text>
      {[70, 145, 220].map((y, index) => <g key={y}>
        <path className="ai-connection" d={`M65 ${y} L207 145`} /><path className="ai-connection" d={`M287 145 L430 ${y}`} />
        <path className="ai-connection-active" d={`M65 ${y} L207 145`} /><path className="ai-connection-active" d={`M287 145 L430 ${y}`} />
        <circle className="ai-node" cx="65" cy={y} r="9" /><circle className="ai-node ai-output-node" cx="430" cy={y} r="9" />
        <circle className="ai-packet ai-packet-in" cx="0" cy="0" r="4" /><circle className="ai-packet ai-packet-out" cx="0" cy="0" r="4" />
      </g>)}
      <circle className="ai-core-ring" cx="247" cy="145" r="48" /><circle className="ai-core" cx="247" cy="145" r="38" />
      <text x="247" y="153" textAnchor="middle" className="ai-core-label">AI</text>
      <text x="247" y="262" textAnchor="middle" className="network-footnote">A simplified view of an AI workflow</text>
    </svg>
    <div className="ai-response"><span className="output-label">RESPONSE</span><p className="ai-response-text">{example.output}</p></div>
    <div className="demo-options" aria-label="AI examples">{aiExamples.map((item, index) => <button key={item.label} type="button" aria-pressed={index === exampleIndex} onClick={() => setExampleIndex(index)}>{item.label}</button>)}</div>
  </div>;
}

function LearningExperience({ skills }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [allowMotion, setAllowMotion] = useState(false);
  const reduced = useReducedMotion();
  const playing = !paused && (!reduced || allowMotion);
  const root = useRef(null);
  const indicator = useRef(null);
  const tabs = useRef([]);
  const skill = skills[active];

  useLayoutEffect(() => {
    const move = () => {
      const tab = tabs.current[active];
      gsap.to(indicator.current, { x: tab.offsetLeft, width: tab.offsetWidth, duration: reduced ? 0 : .45, ease: 'power3.out', overwrite: true });
    };
    move();
    const resize = new ResizeObserver(move);
    resize.observe(root.current);
    return () => { resize.disconnect(); gsap.killTweensOf(indicator.current); };
  }, [active, reduced]);

  useLayoutEffect(() => {
    if (reduced && !allowMotion) return;
    const context = gsap.context(() => {
      gsap.from('.learning-copy > *', { x: -24, opacity: 0, duration: .6, stagger: .08, ease: 'power3.out' });
      gsap.from('.learning-demo', { y: 28, opacity: 0, duration: .75, ease: 'power3.out' });
    }, root);
    return () => context.revert();
  }, [active, reduced, allowMotion]);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(root.current.querySelector('.learning-scroll-line'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 95%', end: 'bottom 25%', scrub: .4 } });
    });
    ScrollTrigger.refresh();
    return () => media.revert();
  }, []);

  const changeTabByKey = event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? skills.length - 1 : (active + (event.key === 'ArrowRight' ? 1 : -1) + skills.length) % skills.length;
    setActive(next);
    tabs.current[next].focus();
  };
  const toggleMotion = () => {
    if (!playing) { setAllowMotion(true); setPaused(false); }
    else setPaused(true);
  };

  return <div className={`learning-experience ${active === 1 ? 'learning-ai' : 'learning-python'}`} ref={root}>
    <div className="learning-controls">
      <div className="learning-tabs" role="tablist" aria-label="Skills I am learning" onKeyDown={changeTabByKey}>
        {skills.map((item, index) => <button key={item.id} type="button" role="tab" id={`learning-tab-${index}`} aria-controls="learning-panel" aria-selected={active === index} tabIndex={active === index ? 0 : -1} ref={el => tabs.current[index] = el} onClick={() => setActive(index)}><span className="tab-number">0{index + 1}</span>{item.name}</button>)}
        <span className="learning-tab-indicator" ref={indicator} aria-hidden="true" />
      </div>
      <button className="learning-motion-toggle" type="button" onClick={toggleMotion} aria-label={playing ? 'Pause learning animations' : 'Play learning animations'}><span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>{playing ? 'Pause' : 'Play'}</button>
    </div>
    <div className="learning-workbench" role="tabpanel" id="learning-panel" aria-labelledby={`learning-tab-${active}`}>
      <div className="learning-copy" key={skill.id}>
        <div className="learning-eyebrow"><span className="learning-status-dot" />CURRENTLY LEARNING</div>
        <h3>{skill.name}</h3><p>{skill.description}</p>
        <div className="learning-focus"><span>MY FOCUS</span><ul>{skill.topics.map((topic, index) => <li key={topic}><span className="focus-index">0{index + 1}</span>{topic}</li>)}</ul></div>
        <p className="learning-demo-hint">{active === 0 ? 'Try a different Python example →' : 'Switch prompts to follow the flow →'}</p>
      </div>
      {active === 0 ? <PythonDemo playing={playing} /> : <AIDemo playing={playing} />}
    </div>
    <div className="learning-bottom-line" aria-hidden="true"><span className="learning-scroll-line" /></div>
  </div>;
}

const host = document.getElementById('learning-list');
if (host && window.PORTFOLIO_LEARNING_SKILLS) {
  createRoot(host).render(<LearningExperience skills={window.PORTFOLIO_LEARNING_SKILLS} />);
}
