// Authentication and Firestore user save using Firebase compat SDK.
// Place your firebase config in firebase-config.js

document.addEventListener('DOMContentLoaded', ()=>{

  function ensureFirebaseInitialized(){
    if(typeof firebase === 'undefined' || !firebase.auth){
      console.warn('Firebase not initialized. Add firebase-config.js with your project config to enable auth/firestore.');
      return false;
    }
    return true;
  }

  // SIGNUP
  const signupForm = document.getElementById('signupForm');
  if(signupForm){
    signupForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const name = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const password = document.getElementById('password').value;
      const confirm = document.getElementById('confirmPassword').value;

      if(!name || !email || !phone || !password){ alert('Please fill all fields.'); return; }
      if(password.length < 6){ alert('Password must be at least 6 characters.'); return; }
      if(password !== confirm){ alert('Passwords do not match.'); return; }

      if(!ensureFirebaseInitialized()){
        alert('Firebase is not configured. Please add firebase-config.js with your Firebase project config.');
        return;
      }

      try{
        const userCred = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCred.user;
        const db = firebase.firestore();
        await db.collection('users').doc(user.uid).set({
          fullName: name,
          email,
          phone,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert('Registered successfully!');
        window.location.href = 'login.html';
      } catch(err){
        alert('Registration error: ' + err.message);
      }
    });
  }

  // LOGIN
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      if(!ensureFirebaseInitialized()){
        alert('Firebase is not configured. Please add firebase-config.js with your Firebase project config.');
        return;
      }

      try{
        await firebase.auth().signInWithEmailAndPassword(email, password);
        window.location.href = 'bookings.html';
      } catch(err){
        alert('Invalid credentials: ' + err.message);
      }
    });
  }

  // GOOGLE SIGN-IN (available on both pages)
  const googleBtns = document.querySelectorAll('.google-signin');
  if(googleBtns.length){
    googleBtns.forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        if(!ensureFirebaseInitialized()){ alert('Firebase not configured'); return; }
        const provider = new firebase.auth.GoogleAuthProvider();
        try{
          const res = await firebase.auth().signInWithPopup(provider);
          const user = res.user;
          // ensure user record in Firestore
          const db = firebase.firestore();
          const doc = await db.collection('users').doc(user.uid).get();
          if(!doc.exists){
            await db.collection('users').doc(user.uid).set({
              fullName: user.displayName || '',
              email: user.email,
              phone: user.phoneNumber || '',
              provider: 'google',
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
          }
          window.location.href = 'bookings.html';
        } catch(err){
          alert('Google sign-in failed: ' + err.message);
        }
      });
    });
  }

  // logout
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn){
    logoutBtn.addEventListener('click', async ()=>{
      if(ensureFirebaseInitialized()){
        await firebase.auth().signOut();
      }
      window.location.href = 'index.html';
    });
  }

});
