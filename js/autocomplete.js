
/* Enhanced country autocomplete and strict validation
   - Loads data/countries.json (array of strings)
   - Attaches suggestion dropdown to inputs with IDs qbOrigin and qbDestination
   - Shows full filtered list when typing (e.g., "A" shows all A... countries)
   - Adds class 'invalid-country' when value does not match any country exactly
*/
let countriesCache = [];

async function loadCountries() {
  try {
    const res = await fetch('data/countries.json');
    const data = await res.json();
    // support both array of strings or array of objects with name property
    countriesCache = data.map(c => typeof c === 'string' ? c : (c.name || c));
    countriesCache.sort();
  } catch (err) {
    console.error('Failed loading countries', err);
    countriesCache = [];
  }
}

function createDropdown() {
  const d = document.createElement('div');
  d.className = 'autocomplete-dropdown';
  d.style.position = 'absolute';
  d.style.zIndex = 10000;
  d.style.maxHeight = '220px';
  d.style.overflow = 'auto';
  d.style.background = 'white';
  d.style.boxShadow = '0 6px 18px rgba(16,24,40,0.08)';
  d.style.border = '1px solid rgba(0,0,0,0.06)';
  d.style.borderRadius = '8px';
  d.style.padding = '6px';
  d.hidden = true;
  return d;
}

function attachAutocomplete(input) {
  input.setAttribute('autocomplete','off');
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  input.parentNode.insertBefore(wrapper, input);
  wrapper.appendChild(input);
  const dropdown = createDropdown();
  wrapper.appendChild(dropdown);

  function showSuggestions(q) {
    dropdown.innerHTML = '';
    const qlow = q.trim().toLowerCase();
    // If nothing typed, show top 20 countries
    if (!qlow) {
      countriesCache.slice(0, 20).forEach(addItem);
      dropdown.hidden = false;
      return;
    }

    // Don't show suggestions for single non-letter characters
    if (qlow.length === 1 && !/^[a-z]$/.test(qlow)) {
      dropdown.hidden = true;
      return;
    }

    // Prefer startsWith matching to keep suggestions relevant
    let filtered = countriesCache.filter(c => c.toLowerCase().startsWith(qlow));

    // Fallback: if no startsWith matches, try contains (but only for q length >= 2)
    if (filtered.length === 0 && qlow.length >= 2) {
      filtered = countriesCache.filter(c => c.toLowerCase().includes(qlow));
    }

    // Limit results and ensure they come exactly from the data list
    filtered = filtered.slice(0, 50);
    if (filtered.length === 0) {
      dropdown.hidden = true;
      return;
    }

    filtered.forEach(addItem);
    dropdown.hidden = false;

    function addItem(name) {
      const it = document.createElement('div');
      it.className = 'autocomplete-item';
      it.style.padding = '8px';
      it.style.cursor = 'pointer';
      it.textContent = name;
      it.onclick = () => {
        input.value = name;
        validateCountry(input);
        dropdown.hidden = true;
        input.focus();
      };
      dropdown.appendChild(it);
    }
  }

  input.addEventListener('input', (e) => {
    showSuggestions(e.target.value);
    validateCountry(input);
  });

  input.addEventListener('focus', (e) => {
    showSuggestions(e.target.value || '');
  });

  input.addEventListener('blur', (e) => {
    setTimeout(()=> dropdown.hidden = true, 150);
    validateCountry(input);
  });

  // keyboard navigation
  input.addEventListener('keydown', (e) => {
    const items = dropdown.querySelectorAll('.autocomplete-item');
    if (!items.length) return;
    const active = dropdown.querySelector('.active');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!active) {
        items[0].classList.add('active');
      } else {
        active.classList.remove('active');
        const next = active.nextElementSibling || items[0];
        next.classList.add('active');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!active) {
        items[items.length-1].classList.add('active');
      } else {
        active.classList.remove('active');
        const prev = active.previousElementSibling || items[items.length-1];
        prev.classList.add('active');
      }
    } else if (e.key === 'Enter') {
      if (active) {
        e.preventDefault();
        input.value = active.textContent;
        validateCountry(input);
        dropdown.hidden = true;
      }
    }
  });
}

function validateCountry(input) {
  const val = input.value.trim().toLowerCase();
  const valid = countriesCache.some(c => c.toLowerCase() === val);
  input.classList.toggle('invalid-country', !valid);
  return valid;
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadCountries();
  ['qbOrigin','qbDestination','origin','destination'].forEach(id => {
    const el = document.getElementById(id);
    if (el) attachAutocomplete(el);
  });
});
