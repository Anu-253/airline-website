// Main JS for navigation, FAQs, and booking interactions

document.addEventListener('DOMContentLoaded', ()=>{

  // navigation buttons for data-link and data-scroll
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-link]');
    if(btn) {
      window.location.href = btn.dataset.link;
    }
    const sbtn = e.target.closest('[data-scroll]');
    if(sbtn){
      const id = sbtn.dataset.scroll;
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({behavior:'smooth'});
    }
  });

  // FAQ tab behaviour
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panels .panel');

  function openPanel(name){
    panels.forEach(p => {
      if(p.id === name){ p.classList.add('open'); }
      else p.classList.remove('open');
    });
    tabButtons.forEach(b=> {
      b.classList.toggle('active', b.dataset.tab === name);
    });
  }

  tabButtons.forEach(btn=>{
    btn.addEventListener('click', ()=> {
      const name = btn.dataset.tab;
      // toggle: if already open, close it
      const panel = document.getElementById(name);
      const isOpen = panel.classList.contains('open');
      if(isOpen){
        panel.classList.remove('open');
        btn.classList.remove('active');
      } else {
        openPanel(name);
      }
    });
    btn.addEventListener('mouseenter', ()=> {
      btn.style.boxShadow = '0 18px 40px rgba(96,165,250,0.15)';
    });
    btn.addEventListener('mouseleave', ()=> {
      btn.style.boxShadow = '';
    });
  });

  // allow opening panel by hash
  if(location.hash){
    const h = location.hash.replace('#','');
    if(document.getElementById(h)) openPanel(h);
  }

  // Booking form handling (if present) - keep layout stable
  const bookingForm = document.getElementById('bookingForm');
  if(bookingForm){
    bookingForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const origin = document.getElementById('origin').value.trim();
      const destination = document.getElementById('destination').value.trim();
      const depart = document.getElementById('depart').value;
      const ret = document.getElementById('return').value;

      const result = document.getElementById('bookingResult');
      if(!origin || !destination){ result.innerText = 'Please fill origin and destination.'; return; }

      result.innerHTML = '';
      const resultsEl = document.getElementById('flightResults');
      resultsEl.innerHTML = '<p>Searching flights…</p>';

      // use mock API loaded from flight-api.js
      setTimeout(()=>{
        const flights = mockSearchFlights(origin, destination, depart, ret);
        resultsEl.innerHTML = '';
        flights.forEach(f=>{
            // create structured card ensuring content order consistent
            const card = document.createElement('div');
            card.className = 'flight';
            const meta = document.createElement('div'); meta.className = 'meta';
            const left = document.createElement('div'); left.textContent = f.carrier + ' • ' + f.stops;
            const right = document.createElement('div'); right.className = 'price'; right.textContent = '$' + (Number(f.price).toFixed(2));
            meta.appendChild(left); meta.appendChild(right);

            const departEl = document.createElement('div'); departEl.textContent = 'Departs: ' + f.depart;
            const durationEl = document.createElement('div'); durationEl.textContent = 'Duration: ' + f.duration;
            const actions = document.createElement('div'); actions.style.marginTop = '8px'; actions.style.display='flex'; actions.style.gap='8px';
            const bookBtn = document.createElement('button'); bookBtn.className='btn primary glow'; bookBtn.setAttribute('data-book-id', f.id);
            bookBtn.setAttribute('data-flight-json', JSON.stringify(f)); bookBtn.textContent='Book';
            const detailsBtn = document.createElement('button'); detailsBtn.className='btn outline'; detailsBtn.type='button';
            detailsBtn.textContent='Details';
            detailsBtn.onclick = ()=> alert('Flight details:\n' + f.id + ' — ' + f.carrier + '\nPrice: ₹' + f.price);

            actions.appendChild(bookBtn); actions.appendChild(detailsBtn);

            card.appendChild(meta);
            card.appendChild(departEl);
            card.appendChild(durationEl);
            card.appendChild(actions);

            resultsEl.appendChild(card);
        });
      }, 500 + Math.random()*500);

    });
  }

});


// Booking Modal (Option 2) handlers
(function(){
  const openButtons = document.querySelectorAll('[data-open-booking], [data-open-booking="true"]');
  const bookingBackdrop = document.getElementById('bookingModalBackdrop');
  const bookingModal = document.getElementById('bookingModal');
  const qbForm = document && document.getElementById && document.getElementById('quickBookingForm');

  function openBookingModal(){
    const bd = document.getElementById('bookingModalBackdrop');
    if(!bd) return;
    bd.style.display = 'flex';
    bd.setAttribute('aria-hidden','false');
    const nameInput = document.getElementById('qbOrigin');
    if(nameInput) nameInput.focus();
  }

  function closeBookingModal(){
    const bd = document.getElementById('bookingModalBackdrop');
    if(!bd) return;
    bd.style.display = 'none';
    bd.setAttribute('aria-hidden','true');
    const res = document.getElementById('qbResult');
    if(res) res.innerHTML = '';
    if(qbForm) qbForm.reset();
  }

  // delegate clicks for open buttons
  document.addEventListener('click', (e)=>{
    if(e.target.closest && e.target.closest('[data-open-booking], [data-open-booking="true"]')){
      e.preventDefault();
      openBookingModal();
    }
  });

  // cancel button
  document.addEventListener('click', (e)=>{
    if(e.target && e.target.id === 'qbCancel'){ closeBookingModal(); }
  });

  // submit quick booking -> open payment modal with simulated flight selection
  document.addEventListener('submit', (e)=>{
    if(e.target && e.target.id === 'quickBookingForm'){
      e.preventDefault();
      const origin = document.getElementById('qbOrigin').value.trim();
      const destination = document.getElementById('qbDestination').value.trim();
      // Strict country validation: ensure input matches a known country
      if (typeof countriesCache !== 'undefined'){
        const okOrigin = countriesCache.some(c=>c.toLowerCase()===origin.toLowerCase());
        const okDest = countriesCache.some(c=>c.toLowerCase()===destination.toLowerCase());
        if(!okOrigin || !okDest){ qbRes.innerText = 'Please choose valid countries from suggestions for From / To.'; return; }
      }
      const depart = document.getElementById('qbDepart').value;
      const ret = document.getElementById('qbReturn').value;
      const qbRes = document.getElementById('qbResult');
      if(!origin || !destination){ qbRes.innerText = 'Please fill origin and destination.'; return; }
      qbRes.innerHTML = 'Looking for best fares…';
      // simulate selecting top mock flight and open payment modal
      setTimeout(()=>{
        const flights = typeof mockSearchFlights === 'function' ? mockSearchFlights(origin, destination, depart, ret) : [];
        const top = flights && flights.length ? flights[0] : { id:'FL000', carrier: 'Airgo Express', price: 1999, depart:'09:00', duration:'4h', stops:'Non-stop' };
        // close booking modal then open payment modal with flight info
        closeBookingModal();
        // ensure payment modal exists
        const payBackdrop = document.getElementById('paymentBackdrop');
        if(payBackdrop){
          // populate payment modal title and info
          document.getElementById('payTitle').innerText = 'Pay ₹' + top.price + ' to confirm';
          document.getElementById('payInfo').innerText = top.carrier + ' — ' + origin + ' → ' + destination + ' | ' + depart + (ret ? ' | Return: '+ret : '');
          // open payment modal
          payBackdrop.style.display = 'flex';
          payBackdrop.setAttribute('aria-hidden','false');
          document.getElementById('cardName').focus();
        } else {
          alert('Payment modal not found.');
        }
      }, 600 + Math.random()*400);
    }
  });

  // close on Escape
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){ closeBookingModal(); }
  });

})();


// Utility: determine international by comparing origin and destination (case-insensitive)
function isInternationalRoute(a,b){
  if(!a || !b) return false;
  return a.trim().toLowerCase() !== b.trim().toLowerCase();
}

// Utility: show visa UI in payment modal when needed
function preparePaymentModalForInternational(isInternational, origin, destination){
  const visa = document.getElementById('visaNotice');
  const passport = document.getElementById('passportNumber');
  if(visa && passport){
    if(isInternational){
      visa.style.display = 'block';
      passport.required = true;
    } else {
      visa.style.display = 'none';
      passport.required = false;
    }
  }
}


// Listen for a custom event to open payment with context {flight, origin, destination, depart, ret}
document.addEventListener('openPaymentWithContext', function(e){
  try{
    const detail = e.detail || {};
    const flight = detail.flight || {};
    const origin = detail.origin || '';
    const destination = detail.destination || '';
    const isIntl = isInternationalRoute(origin, destination);
    preparePaymentModalForInternational(isIntl, origin, destination);
    // populate title and info if elements exist
    const payTitle = document.getElementById('payTitle');
    const payInfo = document.getElementById('payInfo');
    if(payTitle) payTitle.innerText = 'Pay ₹' + (flight.price || '0') + ' to confirm';
    if(payInfo) payInfo.innerText = (flight.carrier || '') + ' — ' + origin + ' → ' + destination + ' | ' + (detail.depart || '') + (detail.ret ? ' | Return: '+detail.ret : '');
    const payBackdrop = document.getElementById('paymentBackdrop');
    if(payBackdrop){
      payBackdrop.style.display = 'flex'; payBackdrop.setAttribute('aria-hidden','false');
      const nameInput = document.getElementById('cardName'); if(nameInput) nameInput.focus();
    }
  }catch(err){ console.warn('openPaymentWithContext failed', err); }
});


// Format as USD currency
function formatUSD(value) {
  return '$' + Number(value).toFixed(2);
}

// Apply formatting on elements with data-price
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-price]').forEach(el => {
    const val = parseFloat(el.dataset.price);
    if (!isNaN(val)) {
      el.textContent = formatUSD(val);
    }
  });
});
