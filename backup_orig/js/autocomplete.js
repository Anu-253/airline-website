
/* Enhanced country autocomplete */
let countriesCache = [];

async function loadCountries() {
  try {
    const res = await fetch('data/countries.json');
    const data = await res.json();
    countriesCache = data.map(c => c.name || c);
  } catch (err) {
    console.error('Failed loading countries', err);
  }
}

function attachAutocomplete(input) {
  const list = document.createElement('div');
  list.className = 'autocomplete-list';
  input.parentNode.style.position = 'relative';
  input.parentNode.appendChild(list);

  input.addEventListener('input', () => {
    const val = input.value.trim().toLowerCase();
    list.innerHTML = '';
    if (!val) return;
    const matches = countriesCache.filter(c => c.toLowerCase().startsWith(val)).slice(0, 8);
    matches.forEach(name => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.textContent = name;
      item.addEventListener('click', () => {
        input.value = name;
        list.innerHTML = '';
        validateCountry(input);
      });
      list.appendChild(item);
    });
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !list.contains(e.target)) list.innerHTML = '';
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
  const origin = document.getElementById('origin');
  const dest = document.getElementById('destination');
  if (origin) attachAutocomplete(origin);
  if (dest) attachAutocomplete(dest);
});
