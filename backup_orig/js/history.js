
function waitForFirebase(maxMs = 5000){
  return new Promise((resolve, reject) => {
    const start = Date.now();
    (function check(){
      if(typeof firebase !== 'undefined' && firebase.auth){
        resolve(true); return;
      }
      if(Date.now() - start > maxMs){ reject(new Error('Firebase not available')); return; }
      setTimeout(check, 100);
    })();
  });
}

// Fetch and display bookings for the logged-in user
document.addEventListener('DOMContentLoaded', ()=>{

  function ensureFirebase(){
    if(typeof firebase === 'undefined' || !firebase.auth) return false;
    return true;
  }

  const listEl = document.getElementById('historyList');
  if(!listEl) return;

  waitForFirebase().catch(()=>{ listEl.innerHTML = '<p style="color:orange;">Firebase not initialized. Bookings cannot be fetched in this environment.</p>'; return; });
  if(!ensureFirebase()){
    listEl.innerHTML = '<p style="color:orange;">Firebase not initialized. Bookings cannot be fetched in this environment.</p>';
    return;
  }

  firebase.auth().onAuthStateChanged(async user=>{
    if(!user){
      listEl.innerHTML = '<p>Please <a href="login.html">login</a> to see your bookings.</p>';
      return;
    }
    listEl.innerHTML = '<p>Fetching your bookings…</p>';
    try{
      const db = firebase.firestore();
      const q = await db.collection('bookings').where('userId','==', user.uid).orderBy('createdAt','desc').get();
      if(q.empty){
        listEl.innerHTML = '<p>No bookings yet — go <a href="bookings.html">book a flight</a>!</p>';
        return;
      }
      const frag = document.createDocumentFragment();
      q.forEach(doc=>{
        const d = doc.data();
        const card = document.createElement('div');
        card.className = 'card';
        card.style.marginBottom = '12px';
        const created = d.createdAt && d.createdAt.toDate ? d.createdAt.toDate().toLocaleString() : (d.createdAt || '');
        card.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;">
            <div><strong>${d.origin || '—'} → ${d.destination || '—'}</strong><div style="font-size:0.95rem;color:#345;">${d.carrier || ''} • ${d.flightId || ''}</div></div>
            <div style="text-align:right;">
              <div style="font-weight:800;color:${d.paymentStatus === 'Paid' ? 'green':'#333'};">${d.paymentStatus || 'Pending'}</div>
              <div style="font-size:0.9rem;color:#666;">${created}</div>
            </div>
          </div>
          <div style="margin-top:8px;font-size:0.95rem;">Price: ${d.price ? ('₹'+d.price) : '—'}</div>`;
        frag.appendChild(card);
      });
      listEl.innerHTML = '';
      listEl.appendChild(frag);
    } catch(err){
      listEl.innerHTML = '<p style="color:red;">Failed loading bookings: '+err.message+'</p>';
    }
  });

});
