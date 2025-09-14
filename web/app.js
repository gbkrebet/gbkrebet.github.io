const NOTES = ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"]; 

const ROADS = [
  { name: "Ουσάκ", distances: "H-T-T-T-H-T-T", steps: [1,2,2,2,1,2,2] },
  { name: "Φυσικό Μινόρε", distances: "T-H-T-T-H-T-T", steps: [2,1,2,2,1,2,2] },
  { name: "Αρμονικό Μινόρε", distances: "T-H-T-T-H-3H-H", steps: [2,1,2,2,1,3,1] },
  { name: "Νιαβέντ", distances: "T-H-3H-H-H-3H-H", steps: [2,1,3,1,1,3,1] },
  { name: "Νικρίζ", distances: "T-H-3H-H-T-T-H", steps: [2,1,3,1,2,2,1] },
  { name: "Καρσιγάρ", distances: "T-H-T-H-3H-H-T", steps: [2,1,2,1,3,1,2] },
  { name: "Χιτζάζ", distances: "H-3H-H-T-H-T-T", steps: [1,3,1,2,1,2,2] },
  { name: "Χιτζασκιάρ", distances: "H-3H-H-T-H-3H-H", steps: [1,3,1,2,1,3,1] },
  { name: "Πειραιώτικος", distances: "H-3H-T-H-H-3H-H", steps: [1,3,2,1,1,3,1] },
  { name: "Ραστ", distances: "T-T-H-T-T-T-H", steps: [2,2,1,2,2,2,1] },
  { name: "Χουζάμ", distances: "3H-H-H-T-H-3H-H", steps: [3,1,1,2,1,3,1] },
  { name: "Σεγκιά", distances: "3H-H-H-T-T-T-H", steps: [3,1,1,2,2,2,1] },
];

// Units: tetrachords (4-chord) and pentachords (5-chord)
const TETRAS = [
  { kind: '4', name: 'Ουσάκ', steps: [1,2,2], distances: 'H-T-T' },
  { kind: '4', name: 'Μινόρε', steps: [2,1,2], distances: 'T-H-T' },
  { kind: '4', name: 'Σαμπάχ', steps: [2,1,1], distances: 'T-H-H' },
  { kind: '4', name: 'Ραστ',  steps: [2,2,1], distances: 'T-T-H' },
  { kind: '4', name: 'Χιτζάζ', steps: [1,3,1], distances: 'H-3H-H' },
  { kind: '4', name: 'Χουζάμ', steps: [3,1,1], distances: '3H-H-H' },
];

const PENTAS = [
  { kind: '5', name: 'Ουσάκ', steps: [1,2,2,2], distances: 'H-T-T-T' },
  { kind: '5', name: 'Μινόρε', steps: [2,1,2,2], distances: 'T-H-T-T' },
  { kind: '5', name: 'Νικρίζ', steps: [2,1,3,1], distances: 'T-H-3H-H' },
  { kind: '5', name: 'Σαμπάχ', steps: [2,1,1,3], distances: 'T-H-H-3H' },
  { kind: '5', name: 'Ραστ',  steps: [2,2,1,2], distances: 'T-T-H-T' },
  { kind: '5', name: 'Χιτζάζ', steps: [1,3,1,2], distances: 'H-3H-H-T' },
  { kind: '5', name: 'Χουζάμ', steps: [3,1,1,2], distances: '3H-H-H-T' },
];

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function findDecompositions(steps) {
  const out = [];
  for (const p of PENTAS) {
    for (const t of TETRAS) {
      const combo = p.steps.concat(t.steps);
      if (arraysEqual(combo, steps)) out.push({ order: ['5','4'], first: p, second: t });
    }
  }
  for (const t of TETRAS) {
    for (const p of PENTAS) {
      const combo = t.steps.concat(p.steps);
      if (arraysEqual(combo, steps)) out.push({ order: ['4','5'], first: t, second: p });
    }
  }
  return out;
}

function computeNotes(tonic, steps) {
  const start = NOTES.findIndex(n => n.toLowerCase() === tonic.toLowerCase());
  if (start < 0) return [];
  const out = [NOTES[start]];
  let idx = start;
  for (const s of steps) {
    idx = (idx + s) % NOTES.length;
    out.push(NOTES[idx]);
  }
  return out;
}

function render(tonic) {
  const container = document.getElementById('roads');
  container.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'grid';
  for (const r of ROADS) {
    const card = document.createElement('section');
    card.className = 'card';
    const h2 = document.createElement('h2'); h2.textContent = r.name;
    const dist = document.createElement('div'); dist.className = 'dist'; dist.textContent = r.distances;
    const notes = document.createElement('div'); notes.className = 'notes';
    const seq = computeNotes(tonic, r.steps);
    notes.textContent = seq.join(' · ');
    const badge = document.createElement('span'); badge.className = 'badge'; badge.textContent = tonic;
    h2.appendChild(badge);
    card.appendChild(h2); card.appendChild(dist); card.appendChild(notes);

    card.addEventListener('click', () => openModal(r, tonic));
    grid.appendChild(card);
  }
  container.appendChild(grid);
}

function init() {
  const sel = document.getElementById('tonic');
  for (const n of NOTES) {
    const opt = document.createElement('option');
    opt.value = n; opt.textContent = n; sel.appendChild(opt);
  }
  sel.value = 'Mi';
  sel.addEventListener('change', () => render(sel.value));
  const findBtn = document.getElementById('btn-find');
  if (findBtn) findBtn.addEventListener('click', openFindModal);
  const fbBtn = document.getElementById('btn-fretboard');
  if (fbBtn) fbBtn.addEventListener('click', openFretboardModal);
  render(sel.value);
}

document.addEventListener('DOMContentLoaded', init);

function stepLabel(n) {
  if (n === 1) return 'H';
  if (n === 2) return 'T';
  if (n === 3) return '3H';
  return String(n);
}

function classifyMode(steps) {
  const a = steps[0] ?? 0;
  const b = steps[1] ?? 0;
  const sum = a + b;
  const label = (sum === 3) ? 'Μινόρε' : 'Ματζόρε';
  return { sum, label, parts: [stepLabel(a), stepLabel(b)] };
}

// Modal handling
function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
function openModal(road, tonic) {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const content = document.getElementById('modal-content');
  const closeBtn = document.getElementById('modal-close');

  title.textContent = road.name;
  clear(content);

  const tonicBadge = document.createElement('span'); tonicBadge.className = 'badge'; tonicBadge.textContent = tonic;
  title.appendChild(tonicBadge);

  const dist = document.createElement('div'); dist.className = 'dist'; dist.textContent = road.distances;
  content.appendChild(dist);

  const seqDiv = document.createElement('div'); seqDiv.className = 'notes';
  const seq = computeNotes(tonic, road.steps); seqDiv.textContent = seq.join(' · ');
  content.appendChild(seqDiv);

  const mode = classifyMode(road.steps);
  const modeRow = document.createElement('div'); modeRow.className = 'mode';
  const modeBadge = document.createElement('span'); modeBadge.className = 'mode-badge ' + (mode.label === 'Μινόρε' ? 'mode-minor' : 'mode-major'); modeBadge.textContent = mode.label;
  const modeCalc = document.createElement('div'); modeCalc.className = 'label'; modeCalc.textContent = `1η→3η: ${mode.parts[0]} + ${mode.parts[1]} = ${mode.sum}`;
  modeRow.appendChild(modeBadge); modeRow.appendChild(modeCalc);
  content.appendChild(modeRow);

  const decs = findDecompositions(road.steps);
  if (decs.length) {
    decs.forEach((dec) => {
      const block = document.createElement('div'); block.className = 'unit-block';
      const row = document.createElement('div'); row.className = 'unit-row';
      const sidebar = document.createElement('div'); sidebar.className = 'unit-sidebar';
      const tag1 = document.createElement('div'); tag1.className = 'unit-tag u' + dec.first.kind; tag1.textContent = `${dec.first.kind}-χορδ ${dec.first.name}`;
      const tag2 = document.createElement('div'); tag2.className = 'unit-tag u' + dec.second.kind; tag2.textContent = `${dec.second.kind}-χορδ ${dec.second.name}`;
      sidebar.appendChild(tag1); sidebar.appendChild(tag2);

      const body = document.createElement('div');
      const seqWrap = document.createElement('div'); seqWrap.className = 'seq';
      const firstLen = dec.first.steps.length; let idx = 0;
      for (let sIdx = 0; sIdx < road.steps.length; sIdx++) {
        const unitClass = sIdx < firstLen ? 'u' + dec.first.kind : 'u' + dec.second.kind;
        if (sIdx === 0) { const chip = document.createElement('span'); chip.className = `chip ${unitClass}`; chip.textContent = seq[idx]; seqWrap.appendChild(chip); }
        const sep = document.createElement('span'); sep.className = 'sep'; sep.textContent = stepLabel(road.steps[sIdx]); seqWrap.appendChild(sep);
        idx += 1;
        const chip = document.createElement('span'); chip.className = `chip ${unitClass}`; chip.textContent = seq[idx]; seqWrap.appendChild(chip);
      }
      const centers = document.createElement('div'); centers.className = 'centers';
      const c1 = document.createElement('span'); c1.className = 'center-badge u' + dec.first.kind; c1.textContent = `${dec.first.name} τονική: ${seq[0]}`;
      const boundaryIndex = dec.first.steps.length; const c2 = document.createElement('span'); c2.className = 'center-badge u' + dec.second.kind; c2.textContent = `${dec.second.name} τονική: ${seq[boundaryIndex]}`;
      centers.appendChild(c1); centers.appendChild(c2);

      body.appendChild(seqWrap); body.appendChild(centers);
      row.appendChild(sidebar); row.appendChild(body);
      block.appendChild(row);
      content.appendChild(block);
    });
  } else {
    const label = document.createElement('div'); label.className = 'label'; label.textContent = 'Ανάλυση μονάδων: δεν βρέθηκαν εκφράσεις'; content.appendChild(label);
  }

  document.body.classList.add('show');
  overlay.classList.remove('hidden');
  modal.classList.remove('hidden');
  modal.classList.add('show');

  function close() {
    modal.classList.remove('show');
    overlay.classList.add('hidden');
    modal.classList.add('hidden');
    document.body.classList.remove('show');
  }
  overlay.onclick = close;
  closeBtn.onclick = close;
  window.addEventListener('keydown', function esc(e){ if (e.key === 'Escape') { close(); window.removeEventListener('keydown', esc); } });
}

// Find road by selected 7 notes
function openFindModal() {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const content = document.getElementById('modal-content');
  const closeBtn = document.getElementById('modal-close');

  title.textContent = 'Βρες το δρόμο';
  clear(content);

  const info = document.createElement('div'); info.className = 'label'; info.textContent = 'Επιλέξτε 7 νότες:';
  const grid = document.createElement('div'); grid.className = 'note-grid';
  const selected = new Set();

  function updateButtons() {
    const cnt = selected.size;
    counter.textContent = `${cnt}/7`;
    searchBtn.disabled = (cnt !== 7);
    // disable unselected when count == 7
    grid.querySelectorAll('.note').forEach(el => {
      if (!el.classList.contains('sel')) {
        el.classList.toggle('disabled', cnt === 7);
        el.style.opacity = (cnt === 7 ? 0.6 : 1);
        el.style.pointerEvents = (cnt === 7 ? 'none' : 'auto');
      }
    });
  }

  NOTES.forEach(n => {
    const el = document.createElement('div'); el.className = 'note'; el.textContent = n;
    el.onclick = () => {
      if (el.classList.contains('sel')) { selected.delete(n); el.classList.remove('sel'); }
      else if (selected.size < 7) { selected.add(n); el.classList.add('sel'); }
      updateButtons();
    };
    grid.appendChild(el);
  });

  const actions = document.createElement('div'); actions.className = 'actions';
  const counter = document.createElement('div'); counter.className = 'muted'; counter.textContent = '0/7';
  const searchBtn = document.createElement('button'); searchBtn.className = 'btn inline primary'; searchBtn.textContent = 'Αναζήτηση'; searchBtn.disabled = true;
  const clearBtn = document.createElement('button'); clearBtn.className = 'btn inline'; clearBtn.textContent = 'Καθαρισμός';

  const results = document.createElement('div'); results.style.marginTop = '10px';

  searchBtn.onclick = () => {
    const arr = Array.from(selected);
    const matches = findRoadMatches(arr);
    renderMatches(results, matches);
  };
  clearBtn.onclick = () => {
    selected.clear(); grid.querySelectorAll('.note').forEach(el => el.classList.remove('sel')); updateButtons(); results.innerHTML='';
  };
  actions.appendChild(counter); actions.appendChild(searchBtn); actions.appendChild(clearBtn);

  content.appendChild(info);
  content.appendChild(grid);
  content.appendChild(actions);
  content.appendChild(results);

  document.body.classList.add('show');
  overlay.classList.remove('hidden');
  modal.classList.remove('hidden');
  modal.classList.add('show');

  function close() {
    modal.classList.remove('show');
    overlay.classList.add('hidden');
    modal.classList.add('hidden');
    document.body.classList.remove('show');
  }
  overlay.onclick = close;
  closeBtn.onclick = close;
  window.addEventListener('keydown', function esc(e){ if (e.key === 'Escape') { close(); window.removeEventListener('keydown', esc); } });
}

function findRoadMatches(selectedNotes) {
  const set = new Set(selectedNotes);
  const out = [];
  for (const r of ROADS) {
    for (const tonic of NOTES) {
      const seq = computeNotes(tonic, r.steps);
      const unique = seq.slice(0, 7);
      if (sameSet(set, unique)) out.push({ road: r, tonic, seq });
    }
  }
  return out;
}

function sameSet(set, arr) {
  if (set.size !== arr.length) return false;
  for (const x of arr) if (!set.has(x)) return false;
  return true;
}

function renderMatches(container, matches) {
  container.innerHTML = '';
  if (matches.length === 0) {
    const p = document.createElement('div'); p.className = 'label'; p.textContent = 'Δεν βρέθηκε αντίστοιχος δρόμος για αυτήν την επιλογή.'; container.appendChild(p); return;
  }
  const grid = document.createElement('div'); grid.className = 'grid';
  matches.forEach(m => {
    const card = document.createElement('section'); card.className = 'card';
    const h2 = document.createElement('h2'); h2.textContent = `${m.road.name}`;
    const badge = document.createElement('span'); badge.className = 'badge'; badge.textContent = m.tonic; h2.appendChild(badge);
    const dist = document.createElement('div'); dist.className = 'dist'; dist.textContent = m.road.distances;
    const notes = document.createElement('div'); notes.className = 'notes'; notes.textContent = m.seq.slice(0,7).join(' · ');
    card.appendChild(h2); card.appendChild(dist); card.appendChild(notes);
    card.onclick = () => openModal(m.road, m.tonic);
    grid.appendChild(card);
  });
  container.appendChild(grid);
}

// Fretboard modal
function openFretboardModal() {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const content = document.getElementById('modal-content');
  const closeBtn = document.getElementById('modal-close');

  title.textContent = 'Ταστιέρα';
  clear(content);

  const controls = document.createElement('div'); controls.className = 'fb-controls';
  // Road select
  const roadSel = document.createElement('select');
  ROADS.forEach((r, i) => { const o = document.createElement('option'); o.value = String(i); o.textContent = r.name; roadSel.appendChild(o); });
  // Tonic select
  const tonicSel = document.createElement('select');
  NOTES.forEach(n => { const o = document.createElement('option'); o.value = n; o.textContent = n; tonicSel.appendChild(o); });
  tonicSel.value = document.getElementById('tonic')?.value || 'Mi';
  // Tuning select (only standard for now)
  const tuningSel = document.createElement('select');
  const std = document.createElement('option'); std.value = 'EADGBE'; std.textContent = 'EADGBE (Mi-La-Re-Sol-Si-Mi)'; tuningSel.appendChild(std);

  controls.appendChild(labelled('Δρόμος:', roadSel));
  controls.appendChild(labelled('Τονική:', tonicSel));
  controls.appendChild(labelled('Κούρδισμα:', tuningSel));
  content.appendChild(controls);

  const fb = document.createElement('div'); fb.className = 'fretboard';
  const grid = document.createElement('div'); grid.className = 'fb-grid';
  fb.appendChild(grid); content.appendChild(fb);

  function renderBoard() {
    grid.innerHTML = '';
    const road = ROADS[parseInt(roadSel.value || '0', 10)] || ROADS[0];
    const tonic = tonicSel.value || 'Mi';
    const seq = computeNotes(tonic, road.steps);
    const allowed = new Set(seq.slice(0,7));
    // Tuning defined low→high. Display upside down (low string at bottom),
    // so render rows from high→low.
    const strings = tuningSel.value === 'EADGBE' ? ['Mi','La','Re','Sol','Si','Mi'] : ['Mi','La','Re','Sol','Si','Mi'];
    const frets = 12;
    // columns = 1 nut + (frets+1)
    const cols = 1 + (frets + 1);
    grid.style.gridTemplateColumns = `60px repeat(${frets+1}, 44px)`;
    // Header row: nut label + fret numbers 0..12
    const header = document.createElement('div'); header.className = 'fb-header'; header.style.display = 'contents';
    const nutHead = cell(' ', 'cell nut'); header.appendChild(nutHead);
    for (let f = 0; f <= frets; f++) {
      const c = cell(String(f), 'cell fnum fret'); header.appendChild(c);
    }
    grid.appendChild(header);

    function noteAt(open, fret) {
      const idx = NOTES.findIndex(n => n.toLowerCase() === open.toLowerCase());
      if (idx < 0) return '';
      return NOTES[(idx + fret) % NOTES.length];
    }
    for (const s of [...strings].reverse()) {
      const row = document.createElement('div'); row.style.display = 'contents';
      row.appendChild(cell(s, 'cell nut'));
      for (let f = 0; f <= frets; f++) {
        const n = noteAt(s, f);
        const on = allowed.has(n);
        const cls = 'cell fret ' + (on ? 'on' : 'off');
        row.appendChild(cell(n, cls));
      }
      grid.appendChild(row);
    }
  }

  function labelled(text, el) {
    const wrap = document.createElement('div'); wrap.style.display = 'flex'; wrap.style.alignItems = 'center'; wrap.style.gap = '6px';
    const lab = document.createElement('label'); lab.textContent = text; wrap.appendChild(lab); wrap.appendChild(el); return wrap;
  }
  function cell(text, className) { const d = document.createElement('div'); d.className = className; d.textContent = text; return d; }

  roadSel.onchange = renderBoard; tonicSel.onchange = renderBoard; tuningSel.onchange = renderBoard;
  renderBoard();

  document.body.classList.add('show');
  overlay.classList.remove('hidden');
  modal.classList.remove('hidden');
  modal.classList.add('show');

  function close() {
    modal.classList.remove('show');
    overlay.classList.add('hidden');
    modal.classList.add('hidden');
    document.body.classList.remove('show');
  }
  overlay.onclick = close;
  closeBtn.onclick = close;
  window.addEventListener('keydown', function esc(e){ if (e.key === 'Escape') { close(); window.removeEventListener('keydown', esc); } });
}

// metronome removed

// metronome helpers removed
