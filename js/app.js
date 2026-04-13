/* =====================================================
   EVENTSPARK — app.js
   Shared application logic for all pages
   ===================================================== */

/* ── Navigation between pages ──
   Each page is a standalone .html file.
   goTo() does a real browser navigation. */
function goTo(page) {
  const map = {
    login:     'login.html',
    signup:    'signup.html',
    dashboard: 'dashboard.html',
    discover:  'discover.html',
    profile:   'profile.html',
    settings:  'settings.html',
    admin:     'admin.html',
  };
  if (map[page]) window.location.href = map[page];
}

/* ── Active nav item highlighting ──
   Call setActiveNav('dashboard') on each page's own <script> */
function setActiveNav(pageId) {
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.remove('active');
    if (n.dataset.page === pageId) n.classList.add('active');
  });
}

/* ── Modal helpers ── */
function openModal(id)  { const m = document.getElementById(id); if (m) m.classList.add('open'); }
function closeModal(id) { const m = document.getElementById(id); if (m) m.classList.remove('open'); }

// Close modal on backdrop click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('open');
});

/* ── Toast notification ── */
function showToast(msg, duration = 3000) {
  const t = document.createElement('div');
  t.className = 'toast-popup';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), duration);
}

/* ── Filter chips ── */
function filterClick(el, gridSelector, filterFn) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  if (filterFn) filterFn(el.dataset.filter);
}

/* ── Approve event row (admin table) ── */
function approveEvent(btn) {
  const row = btn.closest('tr');
  row.querySelector('.status-cell').innerHTML = '<span class="badge badge-green">Approved</span>';
  row.querySelector('.action-cell').innerHTML = `
    <div style="display:flex;gap:6px;">
      <button class="btn-ghost" style="font-size:11.5px;padding:4px 10px;">View</button>
      <button class="btn-ghost" style="font-size:11.5px;padding:4px 10px;color:var(--red);border-color:rgba(239,68,68,0.3);">Remove</button>
    </div>`;
}

/* ── Event detail modal population ── */
const evData = {
  design: { title: 'Design Leadership Summit 2026', cat: 'Design', bg: 'linear-gradient(135deg,#111,#1c0e04)' },
  music:  { title: 'Neon Nights Miami',              cat: 'Music',  bg: 'linear-gradient(135deg,#0a110a,#0d200d)' },
  coffee: { title: 'Founders & Coffee Morning',      cat: 'Social', bg: 'linear-gradient(135deg,#110a00,#201400)' },
  ai:     { title: 'AI & Future of Work Conference', cat: 'Tech',   bg: 'linear-gradient(135deg,#090e18,#0d1628)' },
  marathon:{ title: 'City Marathon 2026',            cat: 'Sports', bg: 'linear-gradient(135deg,#060f06,#0d200a)' },
  food:   { title: 'Street Food Fiesta',             cat: 'Food',   bg: 'linear-gradient(135deg,#120800,#201000)' },
};

function openEventDetail(key) {
  const d = evData[key]; if (!d) return;
  const titleEl = document.getElementById('modal-event-title');
  const catEl   = document.getElementById('modal-event-cat');
  const imgEl   = document.getElementById('modal-event-img');
  if (titleEl) titleEl.textContent = d.title;
  if (catEl)   catEl.textContent   = d.cat;
  if (imgEl)   imgEl.style.background = d.bg;
  openModal('modal-event');
}

/* ── Promote / submit event ── */
function submitEvent() {
  closeModal('modal-promote');
  showToast('Event submitted for review ✓');
  setTimeout(() => goTo('dashboard'), 800);
}

/* ── Auth toggle (login ↔ signup used on login page) ── */
let _isSignup = false;
function toggleAuthMode() {
  _isSignup = !_isSignup;
  const heading  = document.getElementById('auth-heading');
  const sub      = document.getElementById('auth-subheading');
  const btn      = document.getElementById('auth-btn');
  const sigFlds  = document.getElementById('signup-fields');
  const confPw   = document.getElementById('confirm-pw-wrap');
  const forgot   = document.getElementById('forgot-link');
  const toggle   = document.getElementById('auth-toggle-text');

  if (heading) heading.textContent = _isSignup ? 'Create your account' : 'Sign in to your account';
  if (sub)     sub.textContent     = _isSignup ? 'Join EventSpark and start promoting events.' : 'Welcome back. Enter your credentials to continue.';
  if (btn)     btn.textContent     = _isSignup ? 'Create Account' : 'Sign In';
  if (sigFlds) sigFlds.style.display  = _isSignup ? 'block' : 'none';
  if (confPw)  confPw.style.display   = _isSignup ? 'block' : 'none';
  if (forgot)  forgot.style.display   = _isSignup ? 'none'  : 'block';
  if (toggle)  toggle.innerHTML = _isSignup
    ? 'Already have an account? <span class="link-orange" onclick="toggleAuthMode()">Sign in</span>'
    : 'Don\'t have an account? <span class="link-orange" onclick="toggleAuthMode()">Create one</span>';
}

/* ── Admin unlock ── */
function unlockAdmin() {
  const gate  = document.getElementById('admin-gate');
  const dash  = document.getElementById('admin-dashboard');
  if (gate) gate.style.display = 'none';
  if (dash) dash.style.display = 'block';
}

/* ── Open edit profile modal ── */
function openEditProfile() { openModal('modal-editprofile'); }

/* ── Open promote modal ── */
function openPromote() {
  openModal('modal-promote');
  setActiveNav('promote');
}

/* ── Theme switcher ── */
const Theme = {
  storageKey: 'eventspark-theme',
  LIGHT: 'light',
  DARK: 'dark',
};

function applyTheme(theme) {
  const body = document.body;
  if (theme === Theme.LIGHT) body.classList.add('light-theme');
  else body.classList.remove('light-theme');

  document.querySelectorAll('[data-theme-toggle-text]').forEach(button => {
    button.textContent = theme === Theme.LIGHT ? 'Switch to Dark Mode' : 'Switch to Light Mode';
  });
  document.querySelectorAll('[data-theme-chip]').forEach(chip => {
    chip.textContent = theme === Theme.LIGHT ? 'Light' : 'Dark';
  });
  document.querySelectorAll('.theme-switch-checkbox').forEach(cb => {
    cb.checked = theme === Theme.LIGHT;
  });
  localStorage.setItem(Theme.storageKey, theme);
}

function toggleTheme(force) {
  const current = document.body.classList.contains('light-theme') ? Theme.LIGHT : Theme.DARK;
  const next = typeof force === 'boolean' ? (force ? Theme.LIGHT : Theme.DARK) : (current === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  applyTheme(next);
}

function initTheme() {
  const stored = localStorage.getItem(Theme.storageKey);
  const theme = stored === Theme.LIGHT ? Theme.LIGHT : Theme.DARK;
  applyTheme(theme);
}

document.addEventListener('DOMContentLoaded', initTheme);

/* =====================================================
   CALENDAR ENGINE
   (used on discover.html — renders into #cal-grid)
   ===================================================== */
const CAL = (() => {
  const EVENTS = {};
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const CAT_BADGE = { Design:'badge-blue', Music:'badge-green', Tech:'badge-orange', Social:'badge-blue', Food:'badge-green', Sports:'badge-red' };

  let calY, calM, selKey = null;

  // Seed relative events from today
  (function seed() {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth(), d = now.getDate();
    function add(offset, evs) {
      const dt = new Date(y, m, d + offset);
      EVENTS[`${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`] = evs;
    }
    add(0,  [{ title: 'EventSpark Launch',              time: '12:00 PM', cat: 'Tech'   }]);
    add(2,  [{ title: 'Design Leadership Summit',       time: '1:00 PM',  cat: 'Design' }]);
    add(5,  [{ title: 'Neon Nights Miami',              time: '9:00 PM',  cat: 'Music'  },
             { title: 'AI Conference Pre-party',        time: '6:00 PM',  cat: 'Tech'   }]);
    add(9,  [{ title: 'Founders & Coffee Morning',      time: '7:00 AM',  cat: 'Social' }]);
    add(12, [{ title: 'AI & Future of Work Conference', time: '10:00 AM', cat: 'Tech'   }]);
    add(15, [{ title: 'Street Food Fiesta',             time: '12:00 PM', cat: 'Food'   },
             { title: 'City Marathon',                  time: '6:00 AM',  cat: 'Sports' }]);
    add(18, [{ title: 'UX Design Meetup',               time: '7:00 PM',  cat: 'Design' }]);
    add(22, [{ title: 'Startup Pitch Night',            time: '6:30 PM',  cat: 'Tech'   }]);
    add(-3, [{ title: 'Web Summit Recap',               time: '3:00 PM',  cat: 'Tech'   }]);
    add(-8, [{ title: 'Brand Strategy Workshop',        time: '9:00 AM',  cat: 'Design' }]);
  })();

  function init() { const n = new Date(); calY = n.getFullYear(); calM = n.getMonth(); }

  function nav(dir) {
    if (!calY) init();
    if (dir === 0) init();
    else { calM += dir; if (calM > 11) { calM = 0; calY++; } else if (calM < 0) { calM = 11; calY--; } }
    selKey = null;
    render();
  }

  function selectDay(k) { selKey = (selKey === k) ? null : k; render(); }

  function render() {
    const grid = document.getElementById('cal-grid');
    if (!grid) return;
    if (!calY) init();

    const now = new Date();
    const isCurrent = calY === now.getFullYear() && calM === now.getMonth();
    document.getElementById('cal-title').textContent    = `${MONTHS[calM]} ${calY}`;
    document.getElementById('cal-subtitle').textContent = isCurrent ? 'Current month' : '';

    const firstDay    = new Date(calY, calM, 1).getDay();
    const daysInMonth = new Date(calY, calM + 1, 0).getDate();
    const daysInPrev  = new Date(calY, calM, 0).getDate();

    let html = DAYS.map(d => `<div class="cal-day-label">${d}</div>`).join('');

    // Prev month tail
    for (let i = firstDay - 1; i >= 0; i--) {
      const pd = daysInPrev - i;
      const pm = calM === 0 ? 12 : calM, py = calM === 0 ? calY - 1 : calY;
      const k  = `${py}-${pm}-${pd}`;
      const hasEv = !!EVENTS[k];
      html += `<div class="cal-day other-month${hasEv?' has-event':''}" onclick="CAL.selectDay('${k}')"><span class="cal-day-num">${pd}</span>${hasEv?'<div class="event-pip"></div>':''}</div>`;
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = isCurrent && d === now.getDate();
      const k = `${calY}-${calM+1}-${d}`;
      const hasEv = !!EVENTS[k];
      const isSel = selKey === k;
      let cls = 'cal-day';
      if (isToday)    cls += ' today';
      else if (isSel) cls += ' selected';
      if (hasEv)      cls += ' has-event';
      html += `<div class="${cls}" onclick="CAL.selectDay('${k}')"><span class="cal-day-num">${d}</span>${hasEv?'<div class="event-pip"></div>':''}</div>`;
    }

    // Next month head
    const total = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const nm = calM === 11 ? 1 : calM + 2, ny = calM === 11 ? calY + 1 : calY;
    for (let d = 1; d <= total - firstDay - daysInMonth; d++) {
      const k = `${ny}-${nm}-${d}`;
      const hasEv = !!EVENTS[k];
      html += `<div class="cal-day other-month${hasEv?' has-event':''}" onclick="CAL.selectDay('${k}')"><span class="cal-day-num">${d}</span>${hasEv?'<div class="event-pip"></div>':''}</div>`;
    }

    grid.innerHTML = html;
    renderPanel();
  }

  const EVENT_DETAIL_KEY = {
    'Design Leadership Summit': 'design',
    'Neon Nights Miami': 'music',
    'Founders & Coffee Morning': 'coffee',
    'AI & Future of Work Conference': 'ai',
    'Street Food Fiesta': 'food',
    'City Marathon': 'marathon',
    'EventSpark Launch': 'ai',
    'Brand Strategy Workshop': 'design',
    'UX Design Meetup': 'design',
    'Startup Pitch Night': 'ai',
  };

  function renderPanel() {
    const container = document.getElementById('events-panel-container');
    if (!container) return;
    if (!selKey || !EVENTS[selKey]) { container.innerHTML = ''; return; }

    const evs   = EVENTS[selKey];
    const parts = selKey.split('-');
    const label = `${MONTHS[parseInt(parts[1])-1]} ${parts[2]}, ${parts[0]}`;

    const rows = evs.map(ev => {
      const detailKey = EVENT_DETAIL_KEY[ev.title] || ev.cat.toLowerCase();
      return `
      <div class="panel-event-row" onclick="openEventDetail('${detailKey}')">
        <div class="panel-event-dot"></div>
        <div class="panel-event-info"><div class="title">${ev.title}</div><div class="time">${ev.time}</div></div>
        <div class="panel-event-badge"><span class="badge ${CAT_BADGE[ev.cat]||'badge-orange'}">${ev.cat}</span></div>
      </div>`;
    }).join('');

    container.innerHTML = `
      <div class="events-panel">
        <div class="events-panel-header">
          <h4>${label}</h4>
          <span>${evs.length} event${evs.length>1?'s':''}</span>
        </div>
        ${rows}
      </div>`;
  }

  return { nav, selectDay, render };
})();
