Airgo - Netlify Ready Package

How to test locally:
1. It's recommended to serve the files from a local server (Live Server extension for VS Code or `python -m http.server 8000`) 
   because Firebase Auth requires an http(s) origin (file:// won't work correctly for authentication).
2. Open http://localhost:8000/ or the Live Server URL.

Firebase:
- Your Firebase config is embedded in js/firebase-config.js (compat loader).
- Ensure your Firebase Console has Authentication enabled for Email/Password and Google.
- Add authorized domains in Firebase Auth settings: 'localhost' and your Netlify domain once deployed.

Netlify Deployment:
1. Create a new site in Netlify and drag-and-drop the contents of this folder or connect a Git repo.
2. No build step needed — it's a static site.
3. After deployment, add your Netlify site domain to Firebase Auth's authorized domains.

Booking Flow (Option 2):
- Click "Book Flights" in the header or page to open the booking modal.
- Fill origin/destination and continue to payment. Payment modal will simulate a transaction.
- If logged in, bookings with paymentStatus 'Paid' will be saved to Firestore.

Files:
- index.html, signup.html, login.html, bookings.html
- css/, js/, images/airp.jpg



Updates:
- Added My Bookings (history.html) to view saved bookings from Firestore for the logged-in user.
- Payment flow uses a simulated Stripe Test Mode; transactions are saved with paymentMethod: 'stripe_test_sim' and a mock transactionId.


International travel behavior:
- If your itinerary is international (origin != destination), the payment modal will require a passport number and a visa confirmation checkbox before allowing payment.
- Support contact includes Indian phone number +91-81234-56789.


## Improvements added by assistant
- countries list at /data/countries.json
- client-side autocomplete for From/To fields (js/autocomplete.js)
- simple voice-enabled chatbot (js/chatbot.js)
- modal CSS fixes to avoid keyboard overlap on mobile
- mock backend scaffold in /server with /countries, /book, /pay endpoints

## How to run backend locally (optional)
1. cd server
2. npm install
3. node server.js

Notes: The chatbot is client-side and uses the Web Speech API. To connect to a real NLP backend (e.g., OpenAI), add server-side integration.
