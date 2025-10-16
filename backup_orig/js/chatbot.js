
/* Simple voice-enabled chatbot (client-side) */
class SimpleBot {
  constructor(container) {
    this.container = container;
    this.history = document.createElement('div');
    this.history.className = 'bot-history';
    this.container.appendChild(this.history);
    const controls = document.createElement('div');
    controls.className='bot-controls';
    const mic = document.createElement('button');
    mic.textContent='🎤';
    mic.title='Speak';
    const input = document.createElement('input');
    input.placeholder='Type a message...';
    const send = document.createElement('button');
    send.textContent='Send';
    controls.appendChild(mic);
    controls.appendChild(input);
    controls.appendChild(send);
    this.container.appendChild(controls);
    send.onclick = ()=> this.send(input.value);
    input.addEventListener('keydown', e=> { if(e.key==='Enter') this.send(input.value); });
    mic.onclick = ()=> this.startRecognition(input);

    // SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.rec = new SpeechRecognition();
      this.rec.lang = 'en-US';
      this.rec.onresult = (ev)=> {
        const text = ev.results[0][0].transcript;
        input.value = text;
        this.send(text);
      };
      this.rec.onerror = (e)=> console.warn('Speech error', e);
    } else {
      mic.disabled = true;
      mic.title = 'Speech not supported in this browser';
    }
  }
  send(text) {
    if (!text || !text.trim()) return;
    this.addMessage('You: ' + text);
    const reply = this.getReply(text);
    setTimeout(()=> this.addMessage('Bot: ' + reply), 400);
  }
  addMessage(txt) {
    const p = document.createElement('div');
    p.className='bot-msg';
    p.textContent = txt;
    this.history.appendChild(p);
    this.history.scrollTop = this.history.scrollHeight;
  }
  getReply(text) {
    text = text.toLowerCase();
    if (text.includes('hello') || text.includes('hi')) return 'Hey! Need help booking or finding flights?';
    if (text.includes('book')) return 'Sure — pick a flight and click Book, then fill passenger details.';
    if (text.includes('countries') || text.includes('from')) return 'Type the country name in the From / To fields — suggestions will appear.';
    return "Sorry, I'm a lightweight bot. For advanced help, integrate a backend NLP model (instructions in README).";
  }
  startRecognition(input) {
    if (this.rec) this.rec.start();
  }
}

document.addEventListener('DOMContentLoaded', ()=> {
  const el = document.getElementById('chatbot');
  if (el) new SimpleBot(el);
});
