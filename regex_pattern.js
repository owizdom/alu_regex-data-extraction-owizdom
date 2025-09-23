// ======================= Regex Patterns =======================
const PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  url: /\bhttps?:\/\/(?:[a-z0-9-]+\.)+[a-z]{2,}(?:[^\s<>\"'()\[\]]*)\b/gi,
  phone: /(?<=\s|\D|^)(\+?\(?\d{1,3}\)?[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3,4}/g,
  credit_card: /\b(?:\d{4}[ -]?){3,5}\d{1,4}\b/g,
  repeated_cardNumbers: /\b(\d{4})(?!\1{1,})([ -]?\1){1,}\b/g,
  time24: /\b(?:[01]\d|2[0-3]):[0-5]\d\b/g,
  time12: /\b(?:0?[1-9]|1[0-2]):[0-5]\d\s?(?:AM|PM)\b/gi,
  htmlTag: /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
  hashtag: /(^|\s)#([A-Za-z0-9_]{1,50})\b/g,
  currencyUSD: /\$\d{1,7}(?:,\d{3})*(?:\.\d{2})?\b/g
};

// Deduplicate results
const extractedResult = arr => Array.from(new Set(arr));

// ======================= Extraction Functions =======================
function extractURLs(text) { return extractedResult(text.match(PATTERNS.url) || []); }
function extractEmails(text){ return extractedResult(text.match(PATTERNS.email) || []); }
function extractPhones(text){ return extractedResult(text.match(PATTERNS.phone) || []); }

function extractCreditCards(text) {
  const matches = text.match(PATTERNS.credit_card) || [];
  const validCards = [];
  for (let cardNumber of matches) {
    const digitsOnly = cardNumber.replace(/[\s-]/g, '');
    if (digitsOnly.length >= 16 && !cardNumber.match(PATTERNS.repeated_cardNumbers)) {
      validCards.push(cardNumber);
    }
  }
  return extractedResult(validCards);
}

function extractTimes(text){
  const t24 = text.match(PATTERNS.time24) || [];
  const t12 = text.match(PATTERNS.time12) || [];
  return extractedResult([...t24, ...t12]);
}

function extractHtmlTags(text){ return extractedResult(text.match(PATTERNS.htmlTag) || []); }
function extractHashtags(text){ return extractedResult(text.match(PATTERNS.hashtag) || []); }
function extractCurrencyUSD(text){ return extractedResult(text.match(PATTERNS.currencyUSD) || []); }

function extractAll(text){
  return {
    emails: extractEmails(text),
    urls: extractURLs(text),
    phones: extractPhones(text),
    creditCards: extractCreditCards(text),
    times: extractTimes(text),
    htmlTags: extractHtmlTags(text),
    hashtags: extractHashtags(text),
    currencyUSD: extractCurrencyUSD(text),
  };
}

// ======================= UI Elements =======================
const elements = {
  input: document.querySelector('#input'),
  cards: document.querySelector('#cards'),
  stats: document.querySelector('#stats'),
  btnSample: document.querySelector('#btn-sample'),
  btnClear: document.querySelector('#btn-clear'),
  btnExtract: document.querySelector('#btn-extract'),
  btnCopyJSON: document.querySelector('#btn-copy-json'),
  btnOpenFileMode: document.querySelector('#btn-open'),
  FileMode: document.querySelector('#FileMode'),
  dropZone: document.querySelector('#dropzone'),
  file: document.querySelector('#file'),
  btnBrowse: document.querySelector('#btn-browse'),
  close: document.querySelector('#close')
};

// ======================= Sample Text =======================
const SAMPLE = `Here are some strings to test:
- Emails: okechukwuwisdom016@gmail.com, gokun4621@gmail.com
- URLs: https://www.youtube.com and https://hmm.boring.com/fake/test
- Phones: (123) 456-7890, 123-456-7890, 123.456.7890
- Credit Cards : 4532 0151 1283 0366, 5500-0000-0000-0004
- Time: 14:30, 2:30 AM
- HTML: <p>hello</p> <div class="example">X</div> <img src="image.jpg" alt="description">
- Hashtags: #ALU #ThisIsAHashtag
- Money: $19.99 and $1,234.56
And some noise: mail@:not-valid, http:/broken, 9999 9999 9999 9999`;

// ======================= Button Actions =======================
elements.btnSample.addEventListener('click', () => { elements.input.value = SAMPLE; });
elements.btnClear.addEventListener('click', () => { elements.input.value=''; elements.cards.innerHTML=''; elements.stats.textContent='Cleared'; });

elements.btnExtract.addEventListener('click', () => {
  const text = (elements.input.value || '').trim();
  if (!text) {
    elements.cards.innerHTML = '';
    elements.stats.textContent = 'Please enter text or upload a .txt file.';
    showInfo('Please enter text or upload a .txt file.');
    return;
  }
  const result = extractAll(text);
  showResults(result);
  const total = Object.values(result).reduce((n, arr) => n + (arr?.length || 0), 0);
  elements.stats.textContent = `Found ${total} matches across ${Object.keys(result).length} categories.`;
  if (total === 0) {
    showInfo('No matches found. Please input the right format.');
  }
});

if (elements.btnCopyJSON) {
  elements.btnCopyJSON.addEventListener('click', async () => {
    const result = extractAll(elements.input.value || '');
    const json = JSON.stringify(result, null, 2);
    await navigator.clipboard.writeText(json);
    showInfo('JSON copied to clipboard');
  });
}

// ======================= File Extractor =======================

// Show/hide modal
function showFileMode() { elements.FileMode.classList.remove('hidden'); }
function hideFileMode() { elements.FileMode.classList.add('hidden'); }

if (elements.btnOpenFileMode) {
  elements.btnOpenFileMode.addEventListener('click', showFileMode);
}
if (elements.close) {
  elements.close.addEventListener('click', () => hideFileMode());
}

// Browse button triggers file input
if (elements.btnBrowse) {
  elements.btnBrowse.addEventListener('click', () => elements.file && elements.file.click());
}

// Allow clicking the dropzone to open the file picker
if (elements.dropZone) {
  elements.dropZone.addEventListener('click', () => {
    if (elements.file) elements.file.click();
  });
}

// Drag & drop events
if (elements.dropZone) {
  elements.dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    elements.dropZone.classList.add('drag');
  });
  elements.dropZone.addEventListener('dragleave', () => {
    elements.dropZone.classList.remove('drag');
  });
  elements.dropZone.addEventListener('drop', e => {
    e.preventDefault();
    elements.dropZone.classList.remove('drag');
    handleFiles(e.dataTransfer.files);
  });
}

// Prevent the browser from opening the file when dropped outside the dropzone
['dragover', 'drop'].forEach(evt => {
  window.addEventListener(evt, e => {
    e.preventDefault();
  });
});

// File input change event
if (elements.file) {
  elements.file.addEventListener('change', e => handleFiles(e.target.files));
}

// Read file as text
function readFileAsText(file){
  return new Promise((resolve, reject) => {
    if (!file) return reject('No file selected');
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsText(file);
  });
}

// Handle uploaded files
async function handleFiles(files){
  if (!files || !files.length) return;
  const file = files[0];
  const isTxt = file.type === "text/plain" || /\.txt$/i.test(file.name || '');
  if (!isTxt) {
    showInfo("Only .txt files are supported!");
    return;
  }
  try {
    const text = await readFileAsText(file);
    elements.input.value = text;   // Fill textarea
    hideFileMode();                // Close modal
    showInfo('File loaded. Click Extract to run.');
    // Do not auto-extract; user will press Extract
    // Reset file input so selecting the same file again fires 'change'
    if (elements.file) {
      elements.file.value = '';
    }
  } catch(err) {
    showInfo("Error reading file");
    console.error(err);
  }
}

// File Mode Sample Text button
// Removed Start with Sample button handler (button no longer present)


// ======================= Render Functions =======================
function showInfo(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position:'fixed', right:'16px', bottom:'16px', zIndex:10,
    background:'#0e173b', border:'1px solid #2a3a86', padding:'10px 12px',
    borderRadius:'10px', color:'#fff'
  });
  document.body.appendChild(t);
  setTimeout(()=>{ t.remove(); }, 2000);
}

function renderCard(title, items){
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `<h3>${title} <span class="badge">${items.length}</span></h3>`;
  const list = document.createElement('div');
  list.className = 'list';

  if (!items.length){
    const empty = document.createElement('div');
    empty.className = 'item muted';
    empty.textContent = 'No matches';
    list.appendChild(empty);
  } else {
    for (const it of items){
      const row = document.createElement('div');
      row.className = 'item';
      const c = document.createElement('code'); c.textContent = it; row.appendChild(c);

      const btn = document.createElement('button'); btn.className='copy'; btn.textContent='Copy';
      btn.addEventListener('click', async () => { 
        await navigator.clipboard.writeText(it); 
        showInfo('Copied'); 
      });
      row.appendChild(btn);
      list.appendChild(row);
    }
  }
  div.appendChild(list);
  return div;
}

function showResults(r){
  elements.cards.innerHTML = '';
  elements.cards.append(
    renderCard('Emails', r.emails),
    renderCard('URLs', r.urls),
    renderCard('Phones', r.phones),
    renderCard('Credit Cards', r.creditCards),
    renderCard('Times (12h/24h)', r.times),
    renderCard('HTML Tags', r.htmlTags),
    renderCard('Hashtags', r.hashtags),
    renderCard('Currency $', r.currencyUSD),
  );
}
