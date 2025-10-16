
// --- suppression helper: filter noisy Firebase warnings while preserving others
(function(){
  const originalWarn = console.warn.bind(console);
  console.warn = function(...args){
    try{
      const msg = args.map(a => String(a)).join(' ');
      // ignore common firebase noise messages
      if(/firebase/i.test(msg) || /deprecated/i.test(msg) || /analytics/i.test(msg)) return;
    }catch(e){}
    originalWarn(...args);
  };
})();


// Firebase compat loader with your provided project config.
// This file initializes Firebase using the compat libraries so the existing codebase works.
// Replace nothing — your config is embedded below.

const firebaseConfig = {
  apiKey: "AIzaSyCFyQED4jgaCFzQ5MKYenBPydoN6e05y7s",
  authDomain: "airline-2da0d.firebaseapp.com",
  projectId: "airline-2da0d",
  storageBucket: "airline-2da0d.firebasestorage.app",
  messagingSenderId: "739386715655",
  appId: "1:739386715655:web:aefad83d62c5b0f0c204a2",
  measurementId: "G-W2B8YWEEZS"
};

// Load compat SDKs and initialize
(function(){
  if(typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length){
    console.log('Firebase already initialized (compat).');
    return;
  }
  const scripts = [
    "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js",
    "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js",
    "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js",
    "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics-compat.js",
    "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage-compat.js"
  ];
  let loaded = 0;
  scripts.forEach(src=>{
    const s = document.createElement('script');
    s.src = src;
    s.onload = ()=>{
      loaded++;
      if(loaded === scripts.length){
        try{
          firebase.initializeApp(firebaseConfig);
          if(firebase.analytics) try{ firebase.analytics(); } catch(e){}
          console.log('Firebase (compat) initialized.');
        }catch(err){
          console.warn('Firebase init error:', err);
        }
      }
    };
    s.onerror = ()=> console.warn('Failed loading firebase script', src);
    document.head.appendChild(s);
  });
})();
