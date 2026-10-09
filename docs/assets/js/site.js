/* lumaemusic.app: theme, header, reveal and the small explainers on each page.
   No dependencies, no network requests. Every demo is an illustration with
   made-up songs; the page reads fine without this script. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var THEME_KEY = 'lumae-site-theme';
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function storeSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      /* private mode or blocked storage: the choice lasts for this page only */
    }
  }
  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $all(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }
  function svgEl(name, attrs) {
    var el = document.createElementNS(SVG_NS, name);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }
  // Small deterministic random generator so a demo looks the same on every visit.
  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // Calls start when el scrolls into view and stop when it leaves.
  function whileVisible(el, start, stop, threshold) {
    if (!('IntersectionObserver' in window)) {
      start();
      return;
    }
    var running = false;
    new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !running) {
            running = true;
            start();
          } else if (!entry.isIntersecting && running) {
            running = false;
            stop();
          }
        });
      },
      { threshold: threshold === undefined ? 0.25 : threshold },
    ).observe(el);
  }
  // Pauses an autoplaying demo while the mouse or keyboard focus is in it.
  function holdWhileUsed(el, pause, resume) {
    var pointer = false;
    var focus = false;
    function update() {
      if (pointer || focus) pause();
      else resume();
    }
    el.addEventListener('pointerenter', function (ev) {
      if (ev.pointerType !== 'mouse') return;
      pointer = true;
      update();
    });
    el.addEventListener('pointerleave', function (ev) {
      if (ev.pointerType !== 'mouse') return;
      pointer = false;
      update();
    });
    el.addEventListener('focusin', function () {
      focus = true;
      update();
    });
    el.addEventListener('focusout', function (ev) {
      if (el.contains(ev.relatedTarget)) return;
      focus = false;
      update();
    });
  }

  /* ---------- Theme ---------- */

  var THEME_COLORS = { dark: '#0d0d0f', light: '#f7f7f4' };

  function effectiveTheme() {
    var set = root.getAttribute('data-theme');
    if (set === 'light' || set === 'dark') return set;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function syncThemeUi() {
    var theme = effectiveTheme();
    $all('meta[name="theme-color"]').forEach(function (m) {
      if (root.getAttribute('data-theme')) m.setAttribute('content', THEME_COLORS[theme]);
    });
    $all('.theme-toggle').forEach(function (btn) {
      var next = theme === 'dark' ? 'light' : 'dark';
      btn.setAttribute('aria-label', 'Switch to the ' + next + ' theme');
      btn.setAttribute('title', 'Switch to the ' + next + ' theme');
    });
  }

  $all('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      storeSet(THEME_KEY, next);
      syncThemeUi();
    });
  });
  var systemTheme = window.matchMedia('(prefers-color-scheme: light)');
  if (systemTheme.addEventListener) systemTheme.addEventListener('change', syncThemeUi);
  syncThemeUi();

  /* ---------- Header ---------- */

  var header = $('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Hero rings rest while off screen ---------- */

  var hero = $('.hero');
  if (hero && $('.hero-rings', hero)) {
    whileVisible(
      hero,
      function () {
        hero.classList.remove('is-offscreen');
      },
      function () {
        hero.classList.add('is-offscreen');
      },
      0,
    );
  }

  /* ---------- Reveal on scroll ---------- */

  // Content is only hidden once this runs (see .reveal-armed in site.css),
  // so nothing disappears if the script is blocked.
  var reveals = $all('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion.matches && reveals.length) {
    var revealer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    );
    reveals.forEach(function (el) {
      var box = el.getBoundingClientRect();
      // Whatever is already on screen stays put; the rest rises in.
      if (box.top < window.innerHeight && box.bottom > 0) el.classList.add('is-visible');
      else revealer.observe(el);
    });
    root.classList.add('reveal-armed');
  }

  /* ---------- Anti-shuffle map ---------- */

  function initShuffleDemo(panel) {
    var svg = $('svg', panel);
    var pathLayer = $('.paths', svg);
    var dotLayer = $('.dots', svg);
    var avgOut = $('[data-out="avg"]', panel);
    var maxOut = $('[data-out="max"]', panel);
    var avgBar = $('[data-bar="avg"]', panel);
    var maxBar = $('[data-bar="max"]', panel);
    var caption = $('[data-out="caption"]', panel);
    var modeButtons = $all('[data-mode]', panel);
    var W = 600;
    var H = 380;
    var PAD = 30;
    var DIAG = Math.sqrt(W * W + H * H);
    var seed = 11;
    var mode = 'shuffle';
    var points = [];
    var shuffleRand = mulberry32(97);
    var touched = false;

    function gauss(rand) {
      var u = 1 - rand();
      var v = rand();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }

    function makePoints() {
      var rand = mulberry32(seed);
      // Five loose groups of similar-sounding songs, spread over the map.
      var spots = [
        [0.14, 0.28],
        [0.36, 0.74],
        [0.55, 0.3],
        [0.78, 0.7],
        [0.88, 0.22],
      ];
      var clusters = spots.map(function (s) {
        return {
          x: PAD + (s[0] + (rand() - 0.5) * 0.12) * (W - 2 * PAD),
          y: PAD + (s[1] + (rand() - 0.5) * 0.16) * (H - 2 * PAD),
        };
      });
      points = [];
      for (var i = 0; i < 20; i++) {
        var cl = clusters[i % clusters.length];
        var x = Math.min(W - PAD, Math.max(PAD, cl.x + gauss(rand) * 30));
        var y = Math.min(H - PAD, Math.max(PAD, cl.y + gauss(rand) * 30));
        // Energy follows the horizontal axis loosely, so color shows the jumps.
        var energy = Math.min(1, Math.max(0, (x - PAD) / (W - 2 * PAD) + gauss(rand) * 0.08));
        points.push({ x: x, y: y, energy: energy });
      }
    }

    function dist(a, b) {
      return Math.hypot(points[a].x - points[b].x, points[a].y - points[b].y);
    }

    function lumaeOrder() {
      // Nearest neighbor from the opener, then 2-opt to iron out crossings:
      // the same idea as the app's anti-shuffle, without its extra signals.
      var n = points.length;
      var order = [0];
      var used = { 0: true };
      while (order.length < n) {
        var last = order[order.length - 1];
        var best = -1;
        var bestD = Infinity;
        for (var j = 0; j < n; j++) {
          if (used[j]) continue;
          var d = dist(last, j);
          if (d < bestD) {
            bestD = d;
            best = j;
          }
        }
        used[best] = true;
        order.push(best);
      }
      var improved = true;
      var guard = 0;
      while (improved && guard++ < 50) {
        improved = false;
        for (var i = 1; i < n - 1; i++) {
          for (var k = i + 1; k < n; k++) {
            var a = order[i - 1];
            var b = order[i];
            var c = order[k];
            var before = dist(a, b);
            var after = dist(a, c);
            if (k + 1 < n) {
              var e = order[k + 1];
              before += dist(c, e);
              after += dist(b, e);
            }
            if (after + 0.01 < before) {
              var mid = order.slice(i, k + 1).reverse();
              order.splice.apply(order, [i, mid.length].concat(mid));
              improved = true;
            }
          }
        }
      }
      return order;
    }

    function shuffledOrder() {
      var rest = [];
      for (var i = 1; i < points.length; i++) rest.push(i);
      for (var j = rest.length - 1; j > 0; j--) {
        var r = Math.floor(shuffleRand() * (j + 1));
        var t = rest[j];
        rest[j] = rest[r];
        rest[r] = t;
      }
      return [0].concat(rest);
    }

    function energyColor(e) {
      if (e < 0.25) return 'var(--sky)';
      if (e < 0.5) return 'var(--teal)';
      if (e < 0.75) return 'var(--gold)';
      return 'var(--accent)';
    }

    function drawDots() {
      dotLayer.textContent = '';
      points.forEach(function (p, i) {
        dotLayer.appendChild(
          svgEl('circle', {
            class: 'node',
            cx: p.x.toFixed(1),
            cy: p.y.toFixed(1),
            r: i === 0 ? 7 : 5.5,
            fill: energyColor(p.energy),
          }),
        );
      });
      var s = points[0];
      dotLayer.appendChild(svgEl('circle', { class: 'start', cx: s.x.toFixed(1), cy: s.y.toFixed(1), r: 13 }));
      var label = svgEl('text', {
        x: s.x.toFixed(1),
        y: (s.y < 60 ? s.y + 36 : s.y - 22).toFixed(1),
        'text-anchor': 'middle',
      });
      label.textContent = 'first song';
      dotLayer.appendChild(label);
    }

    function draw() {
      var order = mode === 'lumae' ? lumaeOrder() : shuffledOrder();
      var d = '';
      var total = 0;
      var max = 0;
      order.forEach(function (idx, i) {
        var p = points[idx];
        d += (i ? ' L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1);
        if (i) {
          var step = dist(order[i - 1], idx);
          total += step;
          if (step > max) max = step;
        }
      });
      pathLayer.textContent = '';
      var path = svgEl('path', { class: 'path path--' + mode, d: d });
      pathLayer.appendChild(path);
      if (!reduceMotion.matches && path.getTotalLength) {
        var len = path.getTotalLength();
        path.style.strokeDasharray = len + ' ' + len;
        path.style.strokeDashoffset = String(len);
        path.getBoundingClientRect();
        path.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)';
        path.style.strokeDashoffset = '0';
      }
      var avg = total / (order.length - 1);
      var avgPct = Math.round((avg / DIAG) * 100);
      var maxPct = Math.round((max / DIAG) * 100);
      avgOut.textContent = avgPct + '%';
      maxOut.textContent = maxPct + '%';
      avgBar.style.setProperty('--v', Math.min(100, avgPct * 1.6) + '%');
      maxBar.style.setProperty('--v', Math.min(100, maxPct * 1.6) + '%');
      caption.textContent =
        mode === 'lumae'
          ? 'Lumae: each song steps to a close neighbor, so the sound changes gradually.'
          : 'Random shuffle: the next song can come from anywhere, so the sound lurches.';
    }

    function setMode(next) {
      mode = next;
      modeButtons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-mode') === mode));
      });
      draw();
    }

    modeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        touched = true;
        setMode(btn.getAttribute('data-mode'));
      });
    });
    var again = $('[data-action="new-songs"]', panel);
    if (again) {
      again.addEventListener('click', function () {
        touched = true;
        seed += 1;
        makePoints();
        drawDots();
        draw();
      });
    }
    makePoints();
    drawDots();
    if (reduceMotion.matches) {
      setMode('lumae');
      return;
    }
    // Show the random order first, then let Lumae sort it once, in view.
    setMode('shuffle');
    var sorted = false;
    whileVisible(
      panel,
      function () {
        if (sorted || touched) return;
        sorted = true;
        setTimeout(function () {
          if (!touched) setMode('lumae');
        }, 1800);
      },
      function () {},
      0.5,
    );
  }

  /* ---------- Mood Compass typing ---------- */

  // Taken from the app's own word list (src/constants/smartLayers.ts).
  var COMPASS = {
    'rock workout': [
      ['genre', 'rock'],
      ['energy', 'about 85%'],
      ['leans', 'aggressive'],
      ['leans', 'danceable'],
    ],
    'melancholy jazz': [
      ['genre', 'jazz'],
      ['energy', 'about 35%'],
      ['leans', 'sad'],
      ['nudges', 'blues, folk'],
    ],
    'deep focus': [
      ['energy', 'about 40%'],
      ['leans', 'relaxed'],
      ['nudges', 'instrumental'],
    ],
    'long drive': [
      ['energy', 'about 60%'],
      ['leans', 'happy'],
      ['nudges', 'classic rock, indie'],
    ],
  };

  function initCompass(panel) {
    var typed = $('.typed', panel);
    var count = $('.count', panel);
    var chipsBox = $('.compass-chips', panel);
    var status = $('.compass-status', panel);
    var tryButtons = $all('[data-phrase]', panel);
    var phrases = Object.keys(COMPASS);
    var index = 0;
    var timer = null;
    var manual = false;
    var visible = false;
    var held = false;

    function setText(text) {
      typed.textContent = text;
      count.textContent = text.length + ' / 240';
    }
    function markCurrent(phrase) {
      tryButtons.forEach(function (b) {
        b.classList.toggle('is-current', b.getAttribute('data-phrase') === phrase);
      });
    }
    function showChips(phrase, instant) {
      chipsBox.textContent = '';
      (COMPASS[phrase] || []).forEach(function (pair, i) {
        var chip = document.createElement('span');
        chip.className = 'chip';
        var kind = document.createElement('i');
        kind.textContent = pair[0];
        chip.appendChild(kind);
        chip.appendChild(document.createTextNode(' ' + pair[1]));
        chipsBox.appendChild(chip);
        if (instant) chip.classList.add('is-in');
        else
          setTimeout(function () {
            chip.classList.add('is-in');
          }, 140 * i);
      });
    }
    function clearChips() {
      chipsBox.textContent = '';
    }
    function stop() {
      clearTimeout(timer);
      timer = null;
    }
    function play() {
      stop();
      var phrase = phrases[index % phrases.length];
      var i = 0;
      clearChips();
      markCurrent(phrase);
      (function typeNext() {
        if (i <= phrase.length) {
          setText(phrase.slice(0, i++));
          timer = setTimeout(typeNext, 75 + Math.random() * 60);
          return;
        }
        showChips(phrase, false);
        timer = setTimeout(eraseThenNext, 2600);
      })();
    }
    function eraseThenNext() {
      clearChips();
      (function erase() {
        var t = typed.textContent;
        if (t.length) {
          setText(t.slice(0, -1));
          timer = setTimeout(erase, 28);
          return;
        }
        index++;
        timer = setTimeout(play, 380);
      })();
    }
    function resume() {
      if (manual || held || !visible || reduceMotion.matches || timer) return;
      // Pick up from a finished phrase: wait, then move on.
      timer = setTimeout(eraseThenNext, 1600);
    }
    function pick(phrase) {
      manual = true;
      stop();
      index = phrases.indexOf(phrase);
      setText(phrase);
      showChips(phrase, reduceMotion.matches);
      markCurrent(null);
      tryButtons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-phrase') === phrase));
      });
      // Only a choice the visitor made is announced.
      if (status) {
        status.textContent =
          '“' +
          phrase +
          '”: ' +
          COMPASS[phrase]
            .map(function (pair) {
              return pair[0] + ' ' + pair[1];
            })
            .join(', ') +
          '.';
      }
    }
    tryButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        pick(btn.getAttribute('data-phrase'));
      });
    });

    // Start with a phrase already typed, so the panel is never empty.
    setText(phrases[0]);
    showChips(phrases[0], true);
    markCurrent(phrases[0]);
    if (reduceMotion.matches) return;
    holdWhileUsed(
      panel,
      function () {
        held = true;
        stop();
      },
      function () {
        held = false;
        resume();
      },
    );
    whileVisible(
      panel,
      function () {
        visible = true;
        resume();
      },
      function () {
        visible = false;
        stop();
      },
    );
  }

  /* ---------- Sonic DNA radar ---------- */

  var DNA_AXES = [
    'Energy',
    'Mood',
    'Danceability',
    'Aggression',
    'Acoustic',
    'Vocals',
    'Complexity',
    'Tempo',
    'Rhythm',
    'Atmosphere',
  ];
  var DNA_TRACKS = {
    saltwater: [34, 62, 28, 8, 82, 70, 44, 38, 30, 78],
    strobe: [88, 56, 82, 58, 8, 26, 64, 82, 88, 46],
    amber: [52, 78, 58, 18, 46, 84, 48, 56, 52, 38],
  };

  function initRadar(panel) {
    var svg = $('svg.radar', panel);
    var buttons = $all('[data-track]', panel);
    var CX = 260;
    var CY = 222;
    var R = 140;
    var n = DNA_AXES.length;
    var current = DNA_TRACKS.saltwater.slice();
    var raf = 0;
    var cycleTimer = null;
    var order = Object.keys(DNA_TRACKS);
    var cycleIndex = 0;
    var userPicked = false;
    var visible = false;
    var held = false;

    function pointAt(i, value) {
      var angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      var r = (value / 100) * R;
      return [CX + Math.cos(angle) * r, CY + Math.sin(angle) * r];
    }

    // Static web, axes and labels.
    [25, 50, 75, 100].forEach(function (level) {
      var pts = [];
      for (var i = 0; i < n; i++) {
        var p = pointAt(i, level);
        pts.push(p[0].toFixed(1) + ',' + p[1].toFixed(1));
      }
      svg.appendChild(svgEl('polygon', { class: 'web', points: pts.join(' ') }));
    });
    for (var i = 0; i < n; i++) {
      var end = pointAt(i, 100);
      svg.appendChild(svgEl('line', { class: 'axis', x1: CX, y1: CY, x2: end[0].toFixed(1), y2: end[1].toFixed(1) }));
      var lp = pointAt(i, 122);
      var label = svgEl('text', {
        x: lp[0].toFixed(1),
        y: (lp[1] + 5).toFixed(1),
        'text-anchor': Math.abs(lp[0] - CX) < 8 ? 'middle' : lp[0] > CX ? 'start' : 'end',
      });
      label.textContent = DNA_AXES[i];
      svg.appendChild(label);
    }
    var shape = svgEl('polygon', { class: 'shape' });
    svg.appendChild(shape);
    var dots = [];
    for (var j = 0; j < n; j++) {
      var dot = svgEl('circle', { class: 'pt', r: 4 });
      dots.push(dot);
      svg.appendChild(dot);
    }

    function render(values) {
      var pts = [];
      values.forEach(function (v, k) {
        var p = pointAt(k, v);
        pts.push(p[0].toFixed(1) + ',' + p[1].toFixed(1));
        dots[k].setAttribute('cx', p[0].toFixed(1));
        dots[k].setAttribute('cy', p[1].toFixed(1));
      });
      shape.setAttribute('points', pts.join(' '));
    }

    function animateTo(target) {
      cancelAnimationFrame(raf);
      if (reduceMotion.matches) {
        current = target.slice();
        render(current);
        return;
      }
      var from = current.slice();
      var t0 = performance.now();
      var dur = 900;
      (function frame(now) {
        var t = Math.min(1, (now - t0) / dur);
        var e = 1 - Math.pow(1 - t, 3);
        current = from.map(function (v, k) {
          return v + (target[k] - v) * e;
        });
        render(current);
        if (t < 1) raf = requestAnimationFrame(frame);
      })(t0);
    }

    function select(key) {
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-track') === key));
      });
      animateTo(DNA_TRACKS[key]);
    }

    function stopCycle() {
      clearInterval(cycleTimer);
      cycleTimer = null;
    }
    function startCycle() {
      if (userPicked || held || !visible || reduceMotion.matches || cycleTimer) return;
      cycleTimer = setInterval(function () {
        cycleIndex = (cycleIndex + 1) % order.length;
        select(order[cycleIndex]);
      }, 3400);
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        userPicked = true;
        stopCycle();
        cycleIndex = order.indexOf(btn.getAttribute('data-track'));
        select(btn.getAttribute('data-track'));
      });
    });
    render(current);
    holdWhileUsed(
      panel,
      function () {
        held = true;
        stopCycle();
      },
      function () {
        held = false;
        startCycle();
      },
    );
    whileVisible(
      panel,
      function () {
        visible = true;
        startCycle();
      },
      function () {
        visible = false;
        stopCycle();
      },
    );
  }

  /* ---------- Radio energy curve ---------- */

  var CURVES = {
    // The radio's default curve (headless/service/station-definition.mjs).
    weekdays: [
      [0, 22],
      [7, 20],
      [10, 40],
      [14, 70],
      [18, 55],
      [22, 25],
      [24, 22],
    ],
    // An example of a weekend curve; a station has none until you add one.
    weekend: [
      [0, 24],
      [9, 18],
      [12, 44],
      [16, 66],
      [20, 58],
      [23, 32],
      [24, 24],
    ],
    steady: [
      [0, 50],
      [24, 50],
    ],
  };

  // Monotone cubic interpolation (Fritsch–Carlson), so the curve never
  // overshoots the points you set.
  function monotone(points) {
    var n = points.length;
    var xs = points.map(function (p) {
      return p[0];
    });
    var ys = points.map(function (p) {
      return p[1];
    });
    var d = [];
    var m = [];
    for (var i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
    m[0] = d[0];
    m[n - 1] = d[n - 2];
    for (var k = 1; k < n - 1; k++) m[k] = d[k - 1] * d[k] <= 0 ? 0 : (d[k - 1] + d[k]) / 2;
    for (var j = 0; j < n - 1; j++) {
      if (d[j] === 0) {
        m[j] = 0;
        m[j + 1] = 0;
        continue;
      }
      var a = m[j] / d[j];
      var b = m[j + 1] / d[j];
      var s = a * a + b * b;
      if (s > 9) {
        var t = 3 / Math.sqrt(s);
        m[j] = t * a * d[j];
        m[j + 1] = t * b * d[j];
      }
    }
    return function (x) {
      if (x <= xs[0]) return ys[0];
      if (x >= xs[n - 1]) return ys[n - 1];
      var i2 = 0;
      while (x > xs[i2 + 1]) i2++;
      var h = xs[i2 + 1] - xs[i2];
      var t2 = (x - xs[i2]) / h;
      var t3 = t2 * t2 * t2;
      var tt = t2 * t2;
      return (
        (2 * t3 - 3 * tt + 1) * ys[i2] +
        (t3 - 2 * tt + t2) * h * m[i2] +
        (-2 * t3 + 3 * tt) * ys[i2 + 1] +
        (t3 - tt) * h * m[i2 + 1]
      );
    };
  }

  function initEnergy(panel) {
    var svg = $('svg.energy-svg', panel);
    var readout = $('.energy-readout', panel);
    var X0 = 44;
    var X1 = 620;
    var Y0 = 24;
    var Y1 = 206;
    var curveKey = 'weekdays';
    var fn = monotone(CURVES[curveKey]);
    var area = $('.area', svg);
    var line = $('.curve', svg);
    var ctrlLayer = $('.ctrls', svg);
    var nowLine = $('.now-line', svg);
    var nowDot = $('.now-dot', svg);
    var scrubLine = $('.scrub-line', svg);
    var scrubDot = $('.scrub-dot', svg);
    var scrubHour = null;

    function xOf(h) {
      return X0 + (h / 24) * (X1 - X0);
    }
    function yOf(v) {
      return Y1 - (v / 100) * (Y1 - Y0);
    }
    function hourLabel(h) {
      var total = Math.round(h * 60) % (24 * 60);
      var hh = Math.floor(total / 60);
      var mm = total % 60;
      return (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm;
    }
    function nowHour() {
      var d = new Date();
      return d.getHours() + d.getMinutes() / 60;
    }
    function draw() {
      var d = '';
      for (var i = 0; i <= 96; i++) {
        var h = (i / 96) * 24;
        d += (i ? ' L' : 'M') + xOf(h).toFixed(1) + ' ' + yOf(fn(h)).toFixed(1);
      }
      line.setAttribute('d', d);
      area.setAttribute('d', d + ' L' + X1 + ' ' + Y1 + ' L' + X0 + ' ' + Y1 + ' Z');
      ctrlLayer.textContent = '';
      if (curveKey !== 'steady') {
        CURVES[curveKey].forEach(function (p) {
          if (p[0] === 24 || p[0] === 0) return;
          ctrlLayer.appendChild(svgEl('circle', { class: 'ctrl', cx: xOf(p[0]).toFixed(1), cy: yOf(p[1]).toFixed(1), r: 5 }));
        });
      }
      var nh = nowHour();
      nowLine.setAttribute('x1', xOf(nh).toFixed(1));
      nowLine.setAttribute('x2', xOf(nh).toFixed(1));
      nowDot.setAttribute('cx', xOf(nh).toFixed(1));
      nowDot.setAttribute('cy', yOf(fn(nh)).toFixed(1));
      say();
    }
    // The readout is visual. The chart itself is a slider for assistive
    // technology, so nothing is announced unless the visitor moves it.
    function say() {
      var h = scrubHour === null ? nowHour() : scrubHour;
      var v = Math.round(fn(h));
      var when = scrubHour === null ? 'Right now (' + hourLabel(h) + ')' : 'At ' + hourLabel(h);
      readout.textContent = '';
      readout.appendChild(document.createTextNode(when + ', the station looks for music around '));
      var strong = document.createElement('strong');
      strong.textContent = v + '% energy';
      readout.appendChild(strong);
      readout.appendChild(
        document.createTextNode(curveKey === 'steady' ? ', all day long.' : v >= 60 ? '. Lively.' : v <= 30 ? '. Calm.' : '.'),
      );
      svg.setAttribute('aria-valuenow', String(Math.round(h * 2) / 2));
      svg.setAttribute('aria-valuetext', hourLabel(h) + ', ' + v + '% energy');
    }
    function scrubTo(h) {
      scrubHour = Math.max(0, Math.min(23.99, h));
      var x = xOf(scrubHour).toFixed(1);
      scrubLine.setAttribute('x1', x);
      scrubLine.setAttribute('x2', x);
      scrubDot.setAttribute('cx', x);
      scrubDot.setAttribute('cy', yOf(fn(scrubHour)).toFixed(1));
      svg.classList.add('is-scrubbing');
      say();
    }
    function endScrub() {
      scrubHour = null;
      svg.classList.remove('is-scrubbing');
      say();
    }
    function hourFromEvent(ev) {
      var rect = svg.getBoundingClientRect();
      var vbX = ((ev.clientX - rect.left) / rect.width) * 640;
      return ((vbX - X0) / (X1 - X0)) * 24;
    }
    svg.addEventListener('pointermove', function (ev) {
      if (ev.pointerType === 'mouse' || ev.buttons) scrubTo(hourFromEvent(ev));
    });
    svg.addEventListener('pointerdown', function (ev) {
      scrubTo(hourFromEvent(ev));
    });
    // A finger lifting keeps its reading; only a mouse leaving resets it.
    svg.addEventListener('pointerleave', function (ev) {
      if (ev.pointerType === 'mouse') endScrub();
    });
    svg.addEventListener('keydown', function (ev) {
      var base = scrubHour === null ? Math.floor(nowHour()) : scrubHour;
      var handled = true;
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowUp') scrubTo(base + 0.5);
      else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowDown') scrubTo(base - 0.5);
      else if (ev.key === 'PageUp') scrubTo(base + 3);
      else if (ev.key === 'PageDown') scrubTo(base - 3);
      else if (ev.key === 'Home') scrubTo(0);
      else if (ev.key === 'End') scrubTo(23.5);
      else if (ev.key === 'Escape') endScrub();
      else handled = false;
      if (handled) ev.preventDefault();
    });
    svg.addEventListener('blur', endScrub);

    $all('[data-curve]', panel).forEach(function (btn, _i, all) {
      btn.addEventListener('click', function () {
        curveKey = btn.getAttribute('data-curve');
        fn = monotone(CURVES[curveKey]);
        all.forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === btn));
        });
        draw();
        if (scrubHour !== null) scrubTo(scrubHour);
      });
    });
    draw();
    setInterval(function () {
      if (scrubHour === null) draw();
    }, 60000);
  }

  /* ---------- Tabs ---------- */

  function initTabs(box) {
    var tabs = $all('[role="tab"]', box);
    function activate(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        activate(tab, false);
      });
      tab.addEventListener('keydown', function (ev) {
        var next = null;
        if (ev.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        else if (ev.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (ev.key === 'Home') next = tabs[0];
        else if (ev.key === 'End') next = tabs[tabs.length - 1];
        if (next) {
          ev.preventDefault();
          activate(next, true);
        }
      });
    });
    // Every panel shows without the script; the tabs take over from here.
    var selected = tabs.filter(function (t) {
      return t.getAttribute('aria-selected') === 'true';
    })[0];
    activate(selected || tabs[0], false);
  }

  /* ---------- Privacy page contents ---------- */

  function initToc(toc) {
    var details = $('details', toc);
    var small = window.matchMedia('(max-width: 900px)');
    // On a phone the list folds away under the title; beside the text it stays open.
    if (details) {
      if (small.matches) details.open = false;
      $all('a', toc).forEach(function (a) {
        a.addEventListener('click', function () {
          if (small.matches) details.open = false;
        });
      });
    }
    var links = $all('a[href^="#"]', toc);
    var map = {};
    links.forEach(function (a) {
      map[a.getAttribute('href').slice(1)] = a;
    });
    var headings = $all('.prose h2[id]');
    if (!headings.length) return;
    var queued = false;
    function update() {
      queued = false;
      var active = headings[0].id;
      for (var i = 0; i < headings.length; i++) {
        if (headings[i].getBoundingClientRect().top < 140) active = headings[i].id;
      }
      links.forEach(function (a) {
        a.classList.toggle('is-active', a === map[active]);
      });
    }
    window.addEventListener(
      'scroll',
      function () {
        if (!queued) {
          queued = true;
          window.requestAnimationFrame(update);
        }
      },
      { passive: true },
    );
    update();
  }

  $all('[data-demo="shuffle"]').forEach(initShuffleDemo);
  $all('[data-demo="compass"]').forEach(initCompass);
  $all('[data-demo="radar"]').forEach(initRadar);
  $all('[data-demo="energy"]').forEach(initEnergy);
  $all('[data-tabs]').forEach(initTabs);
  $all('[data-toc]').forEach(initToc);

  // A Copy button on each command block, where the browser allows the clipboard.
  if (navigator.clipboard && window.isSecureContext) {
    $all('pre.cmd').forEach(function (pre) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cmd-copy';
      btn.textContent = 'Copy';
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(pre.querySelector('code').textContent).then(
          function () {
            btn.textContent = 'Copied';
            setTimeout(function () {
              btn.textContent = 'Copy';
            }, 1600);
          },
          function () {
            btn.textContent = 'Select and copy';
          },
        );
      });
      var wrap = document.createElement('div');
      wrap.className = 'cmd-wrap';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      wrap.appendChild(btn);
    });
  }
})();
