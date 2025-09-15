// script.js — same API + fallback logic, now with smooth fade animations

const quoteEl = document.getElementById('quote');
const authorEl = document.getElementById('author');
const newBtn = document.getElementById('newBtn');
const copyBtn = document.getElementById('copyBtn');

const API = 'https://api.api-ninjas.com/v1/quotes';
const API_KEY = '---'; // replace with your API key or leave as '---' to always use local

const localQuotes = [
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Happiness depends upon ourselves.", author: "Aristotle" },
  { text: "You cannot swim for new horizons until you have courage to lose sight of the shore.", author: "William Faulkner" }
];

const shown = new Set();
let pool = shuffleArray(localQuotes.slice());

// UI hint appended to .card
const cardEl = document.querySelector('.card');
const hint = document.createElement('div');
hint.className = 'hint';
hint.setAttribute('aria-live', 'polite');
cardEl.appendChild(hint);
updateHint();

// ---------- animation-aware setter ----------
const ANIM_OUT_MS = 240; // must match CSS .fade-out duration
function animateSetQuote(q) {
  if (!q) return;
  // add fade-out to both elements
  quoteEl.classList.remove('fade-in');
  authorEl.classList.remove('fade-in');
  quoteEl.classList.add('fade-out');
  authorEl.classList.add('fade-out');

  // after out animation, set text and play fade-in
  setTimeout(() => {
    quoteEl.textContent = `“${q.text}”`;
    authorEl.textContent = q.author ? `— ${q.author}` : '';
    shown.add(`${q.text} — ${q.author || ''}`);
    updateHint();

    quoteEl.classList.remove('fade-out');
    authorEl.classList.remove('fade-out');
    // force reflow so animation can replay reliably
    // eslint-disable-next-line no-unused-expressions
    quoteEl.offsetWidth;
    quoteEl.classList.add('fade-in');
    authorEl.classList.add('fade-in');
  }, ANIM_OUT_MS);
}

// ---------- helpers ----------
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function refillPool() { pool = shuffleArray(localQuotes.slice()); }
function updateHint() { hint.textContent = `Quotes left in cycle: ${pool.length}`; }

function getLocalQuote() {
  if (pool.length === 0) refillPool();
  let candidate = pool.pop();
  let tries = 0;
  while (shown.has(`${candidate.text} — ${candidate.author || ''}`) && pool.length > 0 && tries < 10) {
    candidate = pool.pop();
    tries++;
  }
  if (shown.has(`${candidate.text} — ${candidate.author || ''}`)) {
    refillPool();
    candidate = pool.pop();
  }
  return candidate;
}

async function fetchApiQuote(attempts = 4) {
  if (!API_KEY || API_KEY === '---') return null;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(API, { headers: { 'X-Api-Key': API_KEY } });
      if (!res.ok) { console.warn('API status', res.status); return null; }
      const data = await res.json();
      const raw = Array.isArray(data) ? data[0] : data;
      if (!raw || !raw.quote) return null;
      const candidate = { text: raw.quote.trim(), author: (raw.author || '').trim() };
      const key = `${candidate.text} — ${candidate.author}`;
      if (!shown.has(key)) return candidate;
    } catch (err) {
      console.error('API error', err);
      return null;
    }
  }
  return null;
}

// ---------- main ----------
async function getQuote() {
  quoteEl.textContent = 'Loading...';
  authorEl.textContent = '';

  // try API (preferred)
  const apiCandidate = await fetchApiQuote();
  if (apiCandidate) {
    animateSetQuote(apiCandidate);
    return;
  }

  // otherwise local fallback
  const local = getLocalQuote();
  animateSetQuote(local);
}

// ---------- copy UI ----------
async function copyQuote() {
  const text = [quoteEl.textContent, authorEl.textContent].filter(Boolean).join('\n');
  try {
    await navigator.clipboard.writeText(text);
    flash(copyBtn, 'Copied!');
  } catch {
    flash(copyBtn, 'Failed');
  }
}
function flash(btn, label) {
  const orig = btn.textContent;
  btn.textContent = label;
  btn.disabled = true;
  setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 900);
}

// ---------- events ----------
newBtn.addEventListener('click', getQuote);
copyBtn.addEventListener('click', copyQuote);
document.addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 'n') getQuote(); });

// init: show one quote on load
window.addEventListener('load', () => {
  const initial = getLocalQuote();
  // show without out-animation on first load for a smoother start:
  quoteEl.textContent = `“${initial.text}”`;
  authorEl.textContent = initial.author ? `— ${initial.author}` : '';
  shown.add(`${initial.text} — ${initial.author || ''}`);
  updateHint();
});
