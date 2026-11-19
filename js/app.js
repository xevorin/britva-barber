/* Бритва — учебный проект. Общий скрипт: меню, прайс, мастера, запись. */
(function () {
  "use strict";

  var SERVICES = [
    { id: "cut", group: "cuts", name: "Мужская стрижка", min: 45, price: 1500 },
    { id: "fade", group: "cuts", name: "Фейд / андеркат", min: 60, price: 1800 },
    { id: "machine", group: "cuts", name: "Стрижка машинкой", min: 30, price: 900 },
    { id: "kids", group: "cuts", name: "Детская стрижка (до 12 лет)", min: 30, price: 1000 },
    { id: "beard", group: "beard", name: "Оформление бороды", min: 30, price: 1000 },
    { id: "shave", group: "beard", name: "Королевское бритьё", min: 45, price: 1800 },
    { id: "tone", group: "beard", name: "Камуфляж седины в бороде", min: 30, price: 900 },
    { id: "combo", group: "combo", name: "Стрижка + борода", min: 75, price: 2300 },
    { id: "father", group: "combo", name: "Отец + сын", min: 75, price: 2200 },
    { id: "full", group: "combo", name: "Стрижка + королевское бритьё", min: 90, price: 3000 }
  ];
  var GROUPS = {
    cuts: { title: "Стрижки", note: "Мытьё головы и укладка входят в цену." },
    beard: { title: "Борода", note: "Горячее полотенце, масло и бальзам после бритья." },
    combo: { title: "Комплексы", note: "Выгоднее, чем по отдельности, на 200–600 ₽." }
  };
  var MASTERS = [
    { id: "artem", name: "Артём", exp: "Стаж 6 лет", spec: "Классические стрижки и опасная бритва. Ведёт обучение новых мастеров.", tags: ["классика", "бритьё", "борода"], look: { skin: "#C89B7B", hair: "#2B211B", beard: true, style: "side" } },
    { id: "ilya", name: "Илья", exp: "Стаж 3 года", spec: "Фейды, текстурные стрижки, кроп. Подскажет форму под тип волос.", tags: ["фейд", "кроп", "текстура"], look: { skin: "#E0B897", hair: "#7A4E2A", beard: false, style: "crop" } },
    { id: "mark", name: "Марк", exp: "Стаж 9 лет", spec: "Длинные мужские стрижки и сложные формы бороды. Работает с сединой.", tags: ["длинные", "борода", "камуфляж"], look: { skin: "#A87652", hair: "#141414", beard: true, style: "long" } }
  ];

  var rub = function (n) { return n.toLocaleString("ru-RU").replace(/ |\s/g, " ") + " ₽"; };
  var mins = function (m) { return m + " мин"; };
  var byId = function (list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  /* SVG-аватар мастера */
  function avatar(m) {
    var l = m.look;
    var hair = {
      side: '<path d="M52 70c0-30 22-44 48-44s50 14 50 44v8c-6-14-20-22-34-22-8 8-34 10-64 14z" fill="' + l.hair + '"/>',
      crop: '<path d="M54 74c-2-32 18-46 46-46s48 14 46 46c-10-12-28-16-46-16s-36 4-46 16z" fill="' + l.hair + '"/><path d="M60 62h80" stroke="#00000033" stroke-width="3"/>',
      long: '<path d="M46 120c-6-60 10-94 54-94s60 34 54 94l-12-4c4-30 0-48-10-56-16 8-44 8-64 0-10 8-14 26-10 56z" fill="' + l.hair + '"/>'
    }[l.style];
    var beard = l.beard ? '<path d="M62 112c4 34 18 50 38 50s34-16 38-50c-8 10-20 14-38 14s-30-4-38-14z" fill="' + l.hair + '"/><path d="M86 128c8 4 20 4 28 0" stroke="' + l.skin + '" stroke-width="5" stroke-linecap="round"/>' : '<path d="M88 134c8 4 16 4 24 0" stroke="#5a3a2a" stroke-width="4" stroke-linecap="round" fill="none"/>';
    return '<svg viewBox="0 0 200 220" role="img" aria-label="Иллюстрация: мастер ' + esc(m.name) + '">' +
      '<path d="M30 220c4-38 32-56 70-56s66 18 70 56z" fill="#C9A227"/>' +
      '<path d="M84 150h32v26c-10 6-22 6-32 0z" fill="' + l.skin + '"/>' +
      '<ellipse cx="100" cy="98" rx="46" ry="56" fill="' + l.skin + '"/>' +
      '<ellipse cx="54" cy="104" rx="8" ry="12" fill="' + l.skin + '"/><ellipse cx="146" cy="104" rx="8" ry="12" fill="' + l.skin + '"/>' +
      hair + beard +
      '<circle cx="82" cy="100" r="4" fill="#161616"/><circle cx="118" cy="100" r="4" fill="#161616"/>' +
      '<path d="M72 88q10-6 20 0M108 88q10-6 20 0" stroke="' + l.hair + '" stroke-width="5" stroke-linecap="round" fill="none"/>' +
      '</svg>';
  }

  /* Меню */
  function initNav() {
    var burger = document.querySelector(".burger");
    var nav = document.getElementById("nav");
    if (!burger || !nav) return;
    function set(open) {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
      nav.classList.toggle("is-open", open);
    }
    burger.addEventListener("click", function () { set(burger.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { set(false); burger.focus(); }
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a, button")) set(false); });
    window.addEventListener("resize", function () { if (window.innerWidth >= 768) set(false); });
  }

  /* Прайс */
  function renderPrices() {
    document.querySelectorAll("[data-prices]").forEach(function (box) {
      var group = box.getAttribute("data-prices");
      var limit = parseInt(box.getAttribute("data-limit") || "0", 10);
      var POP = ["cut", "combo", "shave", "beard"];
      var list = group === "popular" ? POP.map(function (id) { return byId(SERVICES, id); })
        : SERVICES.filter(function (s) { return group === "all" || s.group === group; });
      if (limit) list = list.slice(0, limit);
      box.innerHTML = list.map(function (s) {
        return '<li class="price-row"><span class="price-row__name">' + esc(s.name) + '</span>' +
          '<span class="price-row__meta">' + mins(s.min) + '</span>' +
          '<span class="price">' + rub(s.price) + '</span>' +
          '<button type="button" class="price-row__book" data-book data-service="' + s.id + '">Записаться<span class="visually-hidden">: ' + esc(s.name) + '</span></button></li>';
      }).join("");
    });
    document.querySelectorAll("[data-group-title]").forEach(function (el) {
      var g = GROUPS[el.getAttribute("data-group-title")]; if (g) el.textContent = g.title;
    });
    document.querySelectorAll("[data-group-note]").forEach(function (el) {
      var g = GROUPS[el.getAttribute("data-group-note")]; if (g) el.textContent = g.note;
    });
  }

  /* Мастера */
  function renderMasters() {
    document.querySelectorAll("[data-masters]").forEach(function (box) {
      var h = box.getAttribute("data-heading") || "h3";
      var full = box.hasAttribute("data-full");
      box.innerHTML = MASTERS.map(function (m) {
        return '<article class="master"><div class="master__ava">' + avatar(m) + '</div><div class="master__body">' +
          '<' + h + '>' + esc(m.name) + '</' + h + '>' +
          '<p class="master__exp">' + esc(m.exp) + '</p>' +
          '<p class="master__spec">' + esc(m.spec) + '</p>' +
          (full ? '<ul class="master__tags" aria-label="Специализация">' + m.tags.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + '</ul>' : '') +
          '<button type="button" class="btn btn--ghost" data-book data-master="' + m.id + '">Записаться к мастеру<span class="visually-hidden"> ' + esc(m.name) + '</span></button>' +
          '</div></article>';
      }).join("");
    });
  }

  /* ---------- Запись ---------- */
  var DAYS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  var MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  var WEEKDAYS = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];

  function slotTimes() {
    var out = [];
    for (var t = 10 * 60; t <= 20 * 60; t += 45) {
      out.push(String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0"));
    }
    return out; // 10:00 … 19:45
  }
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function dateKey(d) { return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function isBusy(d, masterId, time) { return hash(dateKey(d) + "|" + masterId + "|" + time) % 100 < 28; }
  function isPast(d, time) {
    var now = new Date();
    if (dateKey(d) !== dateKey(now)) return false;
    var p = time.split(":");
    return (+p[0]) * 60 + (+p[1]) <= now.getHours() * 60 + now.getMinutes();
  }
  function nextDays(n) {
    var out = [], base = new Date(); base.setHours(0, 0, 0, 0);
    for (var i = 0; i < n; i++) { var d = new Date(base); d.setDate(base.getDate() + i); out.push(d); }
    return out;
  }
  function fmtDate(d) { return WEEKDAYS[d.getDay()] + ", " + d.getDate() + " " + MONTHS[d.getMonth()]; }

  var state, modal, box, lastFocus;
  var STEP_TITLES = ["Услуга", "Мастер", "Дата и время", "Контакты"];

  function buildModal() {
    modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "booking";
    modal.innerHTML = '<div class="modal__backdrop" data-close></div>' +
      '<div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="booking-title">' +
      '<button type="button" class="modal__close" data-close aria-label="Закрыть запись">&times;</button>' +
      '<h2 class="modal__title" id="booking-title">Запись</h2>' +
      '<ol class="steps" aria-hidden="true"><li></li><li></li><li></li><li></li></ol>' +
      '<div class="modal__body" aria-live="polite"></div></div>';
    document.body.appendChild(modal);
    box = modal.querySelector(".modal__box");
    modal.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) close(); });
    modal.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;
      var f = Array.prototype.filter.call(box.querySelectorAll("button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex='-1'])"), function (el) { return el.offsetParent !== null || el.type === "radio"; });
      f = f.filter(function (el) { return !(el.type === "radio" && !el.checked && box.querySelector('input[name="' + el.name + '"]:checked')); });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  function open(pre) {
    if (!modal) buildModal();
    lastFocus = document.activeElement;
    state = { step: 1, service: pre.service || null, master: pre.master || null, date: pre.day != null ? nextDays(7)[+pre.day] : null, time: pre.time || null, name: "", phone: "" };
    if (state.service && state.master) state.step = 3;
    else if (state.service) state.step = 2;
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
    render();
  }
  function close() {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function stepHeader(n) {
    return '<p class="step-label">Шаг ' + n + ' из 4</p><h3 class="step-title" tabindex="-1">' + STEP_TITLES[n - 1] + '</h3>';
  }
  function navButtons(canNext, nextLabel) {
    return '<div class="modal__nav">' +
      (state.step > 1 ? '<button type="button" class="btn btn--ghost" data-act="back">Назад</button>' : '') +
      '<button type="button" class="btn" data-act="next"' + (canNext ? '' : ' disabled') + '>' + (nextLabel || "Далее") + '</button></div>';
  }
  var DEMO = '<p class="demo-note">Демо-запись: данные никуда не отправляются.</p>';

  function render() {
    var body = modal.querySelector(".modal__body");
    var bars = modal.querySelectorAll(".steps li");
    for (var i = 0; i < bars.length; i++) bars[i].classList.toggle("is-done", i < state.step);
    modal.querySelector(".steps").style.display = state.step > 4 ? "none" : "";
    var html = "";

    if (state.step === 1) {
      html = stepHeader(1) + '<fieldset class="opts"><legend class="visually-hidden">Выберите услугу</legend>';
      Object.keys(GROUPS).forEach(function (g) {
        html += '<p class="opt-group">' + GROUPS[g].title + '</p>';
        SERVICES.filter(function (s) { return s.group === g; }).forEach(function (s) {
          html += '<div class="opt"><input type="radio" name="svc" id="svc-' + s.id + '" value="' + s.id + '"' + (state.service === s.id ? " checked" : "") + '>' +
            '<label for="svc-' + s.id + '"><span class="opt__text"><b>' + esc(s.name) + '</b><small>' + mins(s.min) + '</small></span><span class="price">' + rub(s.price) + '</span></label></div>';
        });
      });
      html += '</fieldset>' + navButtons(!!state.service);
    }

    if (state.step === 2) {
      html = stepHeader(2) + '<fieldset class="opts"><legend class="visually-hidden">Выберите мастера</legend>';
      MASTERS.forEach(function (m) {
        html += '<div class="opt"><input type="radio" name="mst" id="mst-' + m.id + '" value="' + m.id + '"' + (state.master === m.id ? " checked" : "") + '>' +
          '<label for="mst-' + m.id + '"><span class="opt__main"><span class="opt__ava" aria-hidden="true">' + avatar(m) + '</span><span class="opt__text"><b>' + esc(m.name) + '</b><small>' + esc(m.exp) + '</small></span></span></label></div>';
      });
      html += '</fieldset>' + navButtons(!!state.master);
    }

    if (state.step === 3) {
      var days = nextDays(7);
      if (!state.date) state.date = days[0];
      html = stepHeader(3) + '<div class="days" role="group" aria-label="Дата">';
      days.forEach(function (d, i) {
        var on = dateKey(d) === dateKey(state.date);
        html += '<button type="button" class="day" data-day="' + i + '" aria-pressed="' + on + '" aria-label="' + fmtDate(d) + '"><small>' + (i === 0 ? "сегодня" : DAYS[d.getDay()]) + '</small><b>' + d.getDate() + '</b></button>';
      });
      html += '</div><div class="slots" role="group" aria-label="Время, ' + fmtDate(state.date) + '">';
      var free = 0;
      slotTimes().forEach(function (t) {
        var busy = isBusy(state.date, state.master, t), past = isPast(state.date, t);
        var dis = busy || past;
        if (!dis) free++;
        html += '<button type="button" class="slot" data-time="' + t + '" aria-pressed="' + (state.time === t) + '"' + (dis ? ' disabled aria-label="' + t + ', ' + (busy ? "занято" : "прошло") + '"' : '') + '>' + t + '</button>';
      });
      html += '</div>' + (free ? '<p class="legend"><span>Зачёркнуто: занято</span><span>Мастер: ' + esc(byId(MASTERS, state.master).name) + '</span></p>' : '<p class="legend">На этот день свободного времени нет, выберите другой.</p>') + navButtons(!!state.time);
    }

    if (state.step === 4) {
      html = stepHeader(4) + '<form class="book-form" novalidate>' +
        '<div class="field"><label for="b-name">Имя</label><input id="b-name" name="name" autocomplete="given-name" value="' + esc(state.name) + '" aria-describedby="b-name-err" required><span class="field__err" id="b-name-err"></span></div>' +
        '<div class="field"><label for="b-phone">Телефон</label><input id="b-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (900) 000-00-00" value="' + esc(state.phone) + '" aria-describedby="b-phone-err" required><span class="field__err" id="b-phone-err"></span></div>' +
        '</form>' + navButtons(true, "Записаться") + DEMO;
    }

    if (state.step === 5) {
      var s = byId(SERVICES, state.service), m = byId(MASTERS, state.master);
      html = '<div class="done-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" stroke="#161616" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
        '<h3 class="step-title" tabindex="-1">Вы записаны</h3>' +
        '<ul class="summary">' +
        '<li><span>Услуга</span><b>' + esc(s.name) + '</b></li>' +
        '<li><span>Мастер</span><b>' + esc(m.name) + '</b></li>' +
        '<li><span>Когда</span><b>' + fmtDate(state.date) + ', ' + state.time + '</b></li>' +
        '<li><span>Длительность</span><b>' + mins(s.min) + '</b></li>' +
        '<li><span>Стоимость</span><b class="price">' + rub(s.price) + '</b></li>' +
        '<li><span>Имя</span><b>' + esc(state.name) + '</b></li>' +
        '<li><span>Телефон</span><b>' + esc(state.phone) + '</b></li></ul>' +
        DEMO + '<div class="modal__nav"><button type="button" class="btn" data-close>Готово</button></div>';
    }

    body.innerHTML = html;
    bindStep(body);
    var title = body.querySelector(".step-title");
    if (title) title.focus({ preventScroll: true });
    box.scrollTop = 0;
  }

  function formatPhone(v) {
    var d = v.replace(/\D/g, "");
    if (!d) return "";
    if (d[0] === "8") d = "7" + d.slice(1);
    if (d[0] !== "7") d = "7" + d;
    d = d.slice(0, 11);
    var r = "+7";
    if (d.length > 1) r += " (" + d.slice(1, 4);
    if (d.length >= 4) r += ")";
    if (d.length > 4) r += " " + d.slice(4, 7);
    if (d.length > 7) r += "-" + d.slice(7, 9);
    if (d.length > 9) r += "-" + d.slice(9, 11);
    return r;
  }
  function validate(form) {
    var ok = true;
    var name = form.elements.name, phone = form.elements.phone;
    var nv = name.value.trim(), pv = phone.value.replace(/\D/g, "");
    var nErr = !nv ? "Введите имя" : !/^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\s-]{1,39}$/.test(nv) ? "Только буквы, от 2 символов" : "";
    var pErr = !pv ? "Введите телефон" : pv.length !== 11 ? "Нужно 10 цифр после +7" : "";
    [[name, nErr], [phone, pErr]].forEach(function (p) {
      p[0].setAttribute("aria-invalid", p[1] ? "true" : "false");
      document.getElementById(p[0].id + "-err").textContent = p[1];
      if (p[1] && ok) { p[0].focus(); ok = false; }
    });
    return ok;
  }

  function bindStep(body) {
    body.querySelectorAll('input[type="radio"]').forEach(function (r) {
      r.addEventListener("change", function () {
        if (r.name === "svc") state.service = r.value;
        if (r.name === "mst") { state.master = r.value; state.time = null; }
        body.querySelector('[data-act="next"]').disabled = false;
      });
    });
    body.querySelectorAll(".day").forEach(function (b) {
      b.addEventListener("click", function () {
        state.date = nextDays(7)[+b.getAttribute("data-day")];
        state.time = null;
        render();
        var again = modal.querySelector('.day[data-day="' + b.getAttribute("data-day") + '"]');
        if (again) again.focus();
      });
    });
    body.querySelectorAll(".slot").forEach(function (b) {
      b.addEventListener("click", function () {
        state.time = b.getAttribute("data-time");
        body.querySelectorAll(".slot").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        body.querySelector('[data-act="next"]').disabled = false;
      });
    });
    var form = body.querySelector(".book-form");
    if (form) {
      var ph = form.elements.phone;
      ph.addEventListener("input", function () { ph.value = formatPhone(ph.value); });
      form.addEventListener("submit", function (e) { e.preventDefault(); next(); });
    }
    var back = body.querySelector('[data-act="back"]');
    if (back) back.addEventListener("click", function () { state.step--; render(); });
    var nx = body.querySelector('[data-act="next"]');
    if (nx) nx.addEventListener("click", next);
  }

  function next() {
    if (state.step === 4) {
      var form = modal.querySelector(".book-form");
      state.name = form.elements.name.value.trim();
      state.phone = form.elements.phone.value.trim();
      if (!validate(form)) return;
    }
    state.step++;
    render();
  }

  /* Табло ближайших свободных слотов на главной */
  function renderBoard() {
    var box = document.querySelector("[data-free-board]");
    if (!box) return;
    var days = nextDays(7), out = [];
    MASTERS.forEach(function (m) {
      for (var di = 0; di < days.length; di++) {
        var times = slotTimes().filter(function (t) { return !isBusy(days[di], m.id, t) && !isPast(days[di], t); });
        if (times.length) { out.push({ m: m, di: di, times: times.slice(0, 3) }); break; }
      }
    });
    box.innerHTML = out.map(function (r) {
      var when = r.di === 0 ? "сегодня" : r.di === 1 ? "завтра" : fmtDate(days[r.di]);
      return '<li class="board__row"><span class="board__who"><span class="opt__ava" aria-hidden="true">' + avatar(r.m) + '</span><span><b>' + esc(r.m.name) + '</b><small>' + when + '</small></span></span>' +
        '<span class="board__slots">' + r.times.map(function (t) {
          return '<button type="button" class="slot" data-book data-master="' + r.m.id + '" data-day="' + r.di + '" data-time="' + t + '" aria-label="' + esc(r.m.name) + ', ' + when + ', ' + t + '">' + t + '</button>';
        }).join("") + '</span></li>';
    }).join("");
  }

  function initBooking() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-book]");
      if (!t) return;
      e.preventDefault();
      open({ service: t.getAttribute("data-service"), master: t.getAttribute("data-master"), day: t.getAttribute("data-day"), time: t.getAttribute("data-time") });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    renderPrices();
    renderMasters();
    renderBoard();
    initBooking();
    var y = document.querySelector("[data-year]");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
