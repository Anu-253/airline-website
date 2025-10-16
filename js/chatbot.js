class SimpleBot {
  constructor(container){
    container.innerHTML = '';
    this.container = container;

    // Chat history
    this.history = document.createElement('div');
    this.history.className = 'bot-history';
    Object.assign(this.history.style, {
      flex: '1', padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', background: '#f9f9f9'
    });
    this.container.appendChild(this.history);

    // Controls
    this.controls = document.createElement('div');
    this.controls.className = 'bot-controls';
    Object.assign(this.controls.style, {display: 'flex', padding: '10px', gap: '6px', borderTop: '1px solid #ddd'});

    this.input = document.createElement('input');
    this.input.placeholder = 'Type a message...';
    Object.assign(this.input.style, {flex: '1', padding: '6px', borderRadius: '6px', border: '1px solid #ccc'});

    this.send = document.createElement('button');
    this.send.textContent = 'Send';
    Object.assign(this.send.style, {padding: '6px 12px', borderRadius: '6px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer'});

    this.controls.appendChild(this.input);
    this.controls.appendChild(this.send);
    this.container.appendChild(this.controls);

    this.send.onclick = () => this.sendMessage();
    this.input.addEventListener('keydown', e => { if(e.key==='Enter') this.sendMessage(); });

    this.countries = ["india","japan","france","germany","usa","canada","italy","spain","australia","uae","china","brazil","uk","russia","singapore","malaysia","thailand","indonesia","south korea","nepal","sri lanka","switzerland","sweden","norway","mexico","argentina","turkey","netherlands","egypt","south africa"];
  }

  addBubble(text, who='bot'){
    const b = document.createElement('div');
    b.textContent = text;
    Object.assign(b.style, {
      alignSelf: who==='user'?'flex-end':'flex-start',
      background: who==='user'?'#007bff':'#e0e0e0',
      color: who==='user'?'#fff':'#000',
      padding: '6px 10px', borderRadius: '12px', maxWidth: '80%', wordBreak: 'break-word'
    });
    this.history.appendChild(b);
    this.history.scrollTop = this.history.scrollHeight;
  }

  async sendMessage(){
    const text = this.input.value.trim();
    if(!text) return;
    this.addBubble(text,'user');
    this.input.value = '';

    const typing = document.createElement('div');
    typing.textContent = '...';
    Object.assign(typing.style, {alignSelf:'flex-start', background:'#e0e0e0', padding:'6px 10px', borderRadius:'12px'});
    this.history.appendChild(typing);
    this.history.scrollTop = this.history.scrollHeight;

    const reply = await this.getReply(text);
    await new Promise(r=>setTimeout(r, 400 + Math.min(reply.length*20, 1000)));
    typing.remove();
    this.addBubble(reply,'bot');
  }

  async getReply(text){
    const t = text.toLowerCase();
    const m = t.match(/from\s+([a-z\s]+)\s+to\s+([a-z\s]+)/i);
    if(m){
      let from = m[1].trim().toLowerCase();
      let to = m[2].trim().toLowerCase();
      if(!this.countries.includes(from) || !this.countries.includes(to)) return "Please enter valid countries only.";
      if(from===to) return "Both are same country, try different ones.";
      return `✈ Searching flights from ${this.capitalize(from)} to ${this.capitalize(to)} (demo)...`;
    }
    if(/\b(hi|hello|hey)\b/.test(t)) return "Hello! Ask me: 'From India to Japan'";
    return "I only handle country-to-country flight searches.";
  }

  capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
}

// === Floating button & panel ===
document.addEventListener('DOMContentLoaded', ()=>{
  // Remove old chatbot if exists
  const old = document.getElementById('chatbot');
  if(old) old.style.display = 'none';

  // Button
  const btn = document.createElement('button');
  btn.innerHTML = '💬';
  Object.assign(btn.style,{
    position:'fixed', bottom:'20px', right:'20px', width:'60px', height:'60px',
    borderRadius:'50%', background:'#007bff', color:'#fff', border:'none',
    fontSize:'26px', boxShadow:'0 4px 10px rgba(0,0,0,0.3)', cursor:'pointer', zIndex:'9999'
  });
  document.body.appendChild(btn);

  // Panel
  const panel = document.createElement('div');
  Object.assign(panel.style,{
    position:'fixed', bottom:'100px', right:'20px', width:'320px', height:'420px',
    background:'#fff', borderRadius:'16px', boxShadow:'0 4px 20px rgba(0,0,0,0.3)',
    display:'flex', flexDirection:'column',
    transform:'translateY(40px)', opacity:'0', pointerEvents:'none', transition:'all 0.3s ease', zIndex:'9998'
  });
  document.body.appendChild(panel);

  // Chat root
  const chatRoot = document.createElement('div');
  chatRoot.id = 'chatbot';
  chatRoot.style.flex = '1'; chatRoot.style.display='flex'; chatRoot.style.flexDirection='column';
  panel.appendChild(chatRoot);

  let isOpen = false;
  let bot = null;

  const togglePanel = ()=>{
    if(isOpen){
      panel.style.opacity='0'; panel.style.transform='translateY(40px)'; panel.style.pointerEvents='none';
      btn.innerHTML='💬';
    } else {
      panel.style.opacity='1'; panel.style.transform='translateY(0)'; panel.style.pointerEvents='auto';
      btn.innerHTML='✖';
      if(!bot) bot = new SimpleBot(chatRoot);
      chatRoot.querySelector('input')?.focus();
    }
    isOpen = !isOpen;
  };

  btn.addEventListener('click', togglePanel);

  // Click outside closes
  document.addEventListener('click', e=>{
    if(isOpen && !panel.contains(e.target) && e.target!==btn){
      togglePanel();
    }
  });
});
