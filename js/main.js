/* Эмонг Ас — квест в Улан-Удэ. © 2026 Полунин Лев */
(function () {
  'use strict';
  var d = document, w = window;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  /* header */
  var hdr = $('#hdr');
  var fab = $('.fab');
  function onScroll() { var y = w.pageYOffset || d.documentElement.scrollTop; hdr.classList.toggle('is-solid', y > 30); if (fab) fab.classList.toggle('is-show', y > w.innerHeight * 0.8); }
  w.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* burger */
  var burger = $('#burger'), nav = $('#nav');
  function setMenu(open) {
    burger.classList.toggle('is-open', open); nav.classList.toggle('is-open', open);
    d.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    if (open) hdr.classList.add('is-solid'); else onScroll();
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); alarmOff(); } });
  w.addEventListener('resize', function () { if (w.innerWidth > 960) setMenu(false); });

  /* reveal */
  if ('IntersectionObserver' in w) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else { d.documentElement.classList.add('no-io'); }

  /* video */
  var vid = $('#promo'), play = $('#play');
  if (vid && play) {
    play.addEventListener('click', function () {
      vid.controls = true; vid.muted = false;
      var p = vid.play(); if (p && p.catch) p.catch(function () { vid.muted = true; vid.play(); });
      vid.parentNode.classList.add('is-playing');
    });
    vid.addEventListener('ended', function () { vid.parentNode.classList.remove('is-playing'); vid.controls = false; });
  }

  /* role cards */
  $$('.rcard').forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.classList.toggle('is-flipped');
      c.setAttribute('aria-pressed', f ? 'true' : 'false');
    });
  });

  /* ship map */
  var Z = [
    ['Моторный отсек', 'Гул двигателей и мигающие лампы. Экипаж следит, чтобы корабль не сбился с курса, — а в шуме легко не заметить шаги за спиной.'],
    ['Инженерный отсек', 'Провода, щиты и панели. Здесь чинят то, что сломал саботаж. Осторожно: знаки «электричество» — зона, куда заходить нельзя.'],
    ['Склад', 'Ящики, полки и тёмные углы. Идеальное место, чтобы спрятаться… или стать следующей жертвой.'],
    ['Медпункт', 'Место, где проверяют экипаж. Здесь удобно доказать свою невиновность — если успеешь.'],
    ['Столовая', 'Сердце корабля. Здесь стоит кнопка экстренного собрания: нашёл тело или заметил подозрительное — жми, и весь экипаж собирается на голосование.'],
    ['Тренажёрный зал', 'Зона для заданий, где нужно двигаться. Чем активнее экипаж, тем быстрее починен корабль.'],
    ['Комната отдыха', 'Мягкие диваны и обманчивое спокойствие. Расслабляться не стоит — предатель тоже любит отдохнуть.'],
    ['Командный пункт', 'Мостик корабля. Отсюда видно многое — но не всё. Кто стоял здесь перед саботажем?'],
    ['Шлюз', 'Здесь начинается миссия: экипировка, шлемы, костюмы и инструктаж ведущего.'],
    ['Вентиляция', 'Секретный ход, по которому перемещается только предатель. Видел, как кто-то вылез из вентиляции? Это уже повод для собрания.']
  ];
  var zinfo = $('#zinfo'), zh = $('#zh'), zp = $('#zp'), zones = $$('.zone');
  function pick(i) {
    zones.forEach(function (z) { z.classList.toggle('is-active', +z.getAttribute('data-z') === i); });
    zh.textContent = Z[i][0]; zp.textContent = Z[i][1];
    zinfo.classList.remove('is-swap'); void zinfo.offsetWidth; zinfo.classList.add('is-swap');
  }
  zones.forEach(function (z) {
    var i = +z.getAttribute('data-z');
    z.addEventListener('click', function () {
      pick(i);
      if (w.innerWidth <= 960) { var r = zinfo.getBoundingClientRect(); if (r.top > w.innerHeight || r.bottom < 0) zinfo.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
    z.addEventListener('mouseenter', function () { if (w.matchMedia('(hover:hover)').matches) pick(i); });
  });
  if (zones.length) pick(4);

  /* calculator */
  var cp = $('#cp'), ch = $('#ch'), cs = $('#cs'), cr = $('#cr');
  function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'; }
  function fill(r) { var p = (r.value - r.min) / (r.max - r.min) * 100; r.style.setProperty('--p', p + '%'); }
  function calc() {
    var n = +cp.value, h = +ch.value;
    var imp = Math.max(1, Math.floor(n / 5));
    var sum = n * h * 1000 * (cs.checked ? 0.7 : 1) + (cr.checked ? 5000 : 0);
    $('#cpo').textContent = n; $('#cho').textContent = h;
    $('#cimp').textContent = imp; $('#ccrew').textContent = n - imp;
    $('#csum').textContent = fmt(sum);
    fill(cp); fill(ch);
  }
  if (cp) { [cp, ch].forEach(function (el) { el.addEventListener('input', calc); }); [cs, cr].forEach(function (el) { el.addEventListener('change', calc); }); calc(); }

  /* reviews slider */
  var slider = $('#slider'), track = $('#track');
  if (slider && track) {
    var slides = $$('.rv', track), dotsBox = $('#dots'), idx = 0, per = 3, pages = 1, timer;
    function perView() { return w.innerWidth <= 680 ? 1 : (w.innerWidth <= 1100 ? 2 : 3); }
    function build() {
      per = perView(); pages = Math.max(1, slides.length - per + 1);
      dotsBox.innerHTML = '';
      for (var i = 0; i < pages; i++) {
        var b = d.createElement('button'); b.type = 'button';
        b.setAttribute('aria-label', 'Отзыв ' + (i + 1)); b.setAttribute('role', 'tab');
        (function (k) { b.addEventListener('click', function () { go(k); restart(); }); })(i);
        dotsBox.appendChild(b);
      }
      go(Math.min(idx, pages - 1), true);
    }
    function go(i, instant) {
      idx = (i + pages) % pages;
      var shift = slides[idx].offsetLeft - slides[0].offsetLeft;
      if (instant) { track.style.transition = 'none'; }
      track.style.transform = 'translate3d(' + (-shift) + 'px,0,0)';
      if (instant) { void track.offsetWidth; track.style.transition = ''; }
      $$('button', dotsBox).forEach(function (b, k) { b.classList.toggle('is-on', k === idx); b.setAttribute('aria-selected', k === idx ? 'true' : 'false'); });
      slides.forEach(function (s, k) { s.setAttribute('aria-hidden', (k >= idx && k < idx + per) ? 'false' : 'true'); });
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 6000); }
    $('#prev').addEventListener('click', function () { go(idx - 1); restart(); });
    $('#next').addEventListener('click', function () { go(idx + 1); restart(); });
    slider.addEventListener('mouseenter', function () { clearInterval(timer); });
    slider.addEventListener('mouseleave', restart);

    /* swipe */
    var x0 = null, y0 = null, dx = 0, base = 0, drag = false;
    function start(x, y) { x0 = x; y0 = y; dx = 0; drag = false; base = -(slides[idx].offsetLeft - slides[0].offsetLeft); clearInterval(timer); }
    function move(x, y, e) {
      if (x0 === null) return;
      dx = x - x0; var dy = y - y0;
      if (!drag && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { drag = true; slider.classList.add('is-drag'); track.style.transition = 'none'; }
      if (drag) { if (e && e.cancelable) e.preventDefault(); track.style.transform = 'translate3d(' + (base + dx) + 'px,0,0)'; }
    }
    function end() {
      if (x0 === null) return;
      track.style.transition = ''; slider.classList.remove('is-drag');
      if (drag && Math.abs(dx) > 50) go(dx < 0 ? Math.min(idx + 1, pages - 1) : Math.max(idx - 1, 0)); else go(idx);
      x0 = null; restart();
    }
    slider.addEventListener('touchstart', function (e) { var t = e.touches[0]; start(t.clientX, t.clientY); }, { passive: true });
    slider.addEventListener('touchmove', function (e) { var t = e.touches[0]; move(t.clientX, t.clientY, e); }, { passive: false });
    slider.addEventListener('touchend', end);
    slider.addEventListener('touchcancel', end);
    slider.addEventListener('mousedown', function (e) { e.preventDefault(); start(e.clientX, e.clientY); });
    w.addEventListener('mousemove', function (e) { if (x0 !== null) move(e.clientX, e.clientY); });
    w.addEventListener('mouseup', end);

    var rt; w.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 150); });
    build(); restart();
  }

  /* lazy yandex map */
  var mapbox = $('#mapbox');
  function loadMap() {
    if (!mapbox || mapbox.getAttribute('data-loaded')) return;
    var f = d.createElement('iframe');
    f.src = mapbox.getAttribute('data-src'); f.title = 'Квест Эмонг Ас на карте: Улан-Удэ, ул. Каландаришвили, 27а';
    f.setAttribute('loading', 'lazy'); f.setAttribute('allowfullscreen', '');
    mapbox.appendChild(f); mapbox.setAttribute('data-loaded', '1');
  }
  if (mapbox) {
    if ('IntersectionObserver' in w) {
      var mo = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { loadMap(); mo.disconnect(); } }, { rootMargin: '400px' });
      mo.observe(mapbox);
    } else loadMap();
  }

  /* sabotage easter egg */
  var alarm = $('#alarm'), sab = $('#sabotage'), at;
  function alarmOff() { if (alarm) { alarm.classList.remove('is-on'); alarm.setAttribute('aria-hidden', 'true'); } }
  if (sab && alarm) {
    sab.addEventListener('click', function () {
      alarm.classList.add('is-on'); alarm.setAttribute('aria-hidden', 'false');
      clearTimeout(at); at = setTimeout(alarmOff, 6000);
    });
    alarm.addEventListener('click', function (e) { if (e.target === alarm) alarmOff(); });
  }

  var y = $('#y'); if (y) y.textContent = new Date().getFullYear();
})();
