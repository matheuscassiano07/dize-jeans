/* DIZE Jeans: interações do site.
   Sem dependências. Tudo que é conteúdo (produtos, cidades, FAQ) está no HTML;
   este arquivo só dá vida: ilustração das peças, catálogo, sacola → WhatsApp,
   mapa, trena de tamanhos e animações de rolagem. */
(() => {
  'use strict';

  const ZAP = '5512983014355';
  const html = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const mqReduz = matchMedia('(prefers-reduced-motion: reduce)');
  const reduz = () => mqReduz.matches;
  const ponteiroFino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const EASE = 'cubic-bezier(.2,.8,.2,1)';
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const r1 = n => Math.round(n * 10) / 10;
  const linkZap = msg => `https://wa.me/${ZAP}?text=${encodeURIComponent(msg)}`;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ------------------------------------------------------------------ */
  /* 1. Ilustração das peças (SVG gerado)                                */
  /* ------------------------------------------------------------------ */
  const LAVAGENS = {
    claro: { cor: '#9db3d2', nome: 'clara' },
    medio: { cor: '#55739f', nome: 'média' },
    escuro: { cor: '#2c3d63', nome: 'escura' },
    black: { cor: '#2b2b30', nome: 'black' }
  };

  // w cintura · h quadril · ko/ki largura e afastamento no joelho · ho/hi na barra · y barra
  const MODELAGENS = {
    skinny: { w: 52, h: 60, ko: 48, ki: 12, ho: 38, hi: 14 },
    reta: { w: 52, h: 60, ko: 54, ki: 8, ho: 54, hi: 8 },
    wide: { w: 52, h: 62, ko: 70, ki: 4, ho: 84, hi: 2 },
    flare: { w: 52, h: 60, ko: 50, ki: 10, ho: 76, hi: 1 },
    mom: { w: 50, h: 64, ko: 56, ki: 8, ho: 48, hi: 12, y: 290 },
    cargo: { w: 52, h: 60, ko: 54, ki: 8, ho: 54, hi: 8, cargo: true },
    bermuda: { w: 52, h: 62, ho: 64, hi: 6, y: 175, curta: true },
    short: { w: 52, h: 62, ho: 66, hi: 2, y: 140, curta: true }
  };

  function calca(f) {
    const c = 100, yT = 36, yH = 100, yC = 126, yK = 215, yB = f.y || 318;
    const L = x => r1(c - x), R = x => r1(c + x);
    let d = `M${L(f.w)} ${yT} L${R(f.w)} ${yT} C${R(f.w + 3)} ${yT + 30} ${R(f.h)} ${yH - 22} ${R(f.h)} ${yH}`;
    if (f.curta) {
      d += ` L${R(f.hi + f.ho)} ${yB} L${R(f.hi)} ${yB} Q${R(2)} ${yC + 4} ${c} ${yC} Q${L(2)} ${yC + 4} ${L(f.hi)} ${yB} L${L(f.hi + f.ho)} ${yB} L${L(f.h)} ${yH}`;
    } else {
      const kO = f.ki + f.ko;
      d += ` C${R(f.h)} ${yH + 50} ${R(kO)} ${yK - 50} ${R(kO)} ${yK} L${R(f.hi + f.ho)} ${yB} L${R(f.hi)} ${yB} L${R(f.ki)} ${yK}`;
      d += ` C${R(f.ki)} ${yK - 60} ${R(3)} ${yC + 8} ${c} ${yC} C${L(3)} ${yC + 8} ${L(f.ki)} ${yK - 60} ${L(f.ki)} ${yK}`;
      d += ` L${L(f.hi)} ${yB} L${L(f.hi + f.ho)} ${yB} L${L(kO)} ${yK} C${L(kO)} ${yK - 50} ${L(f.h)} ${yH + 50} ${L(f.h)} ${yH}`;
    }
    d += ` C${L(f.h)} ${yH - 22} ${L(f.w + 3)} ${yT + 30} ${L(f.w)} ${yT} Z`;

    const lado = (fn) => fn(L) + fn(R);
    let det = '';
    // cós, passantes e botão
    det += `<path class="roupa__vinco" d="M${L(f.w)} 50 Q${c} 53 ${R(f.w)} 50"/>`;
    det += `<path class="roupa__costura" d="M${L(f.w - 1)} 40 H${R(f.w - 1)} M${L(f.w - 1)} 46.5 Q${c} 49.5 ${R(f.w - 1)} 46.5"/>`;
    det += lado(X => `<path class="roupa__costura" d="M${X(f.w - 8)} 35 v17 M${X(f.w - 13)} 35 v17 M${X(22)} 35 v17 M${X(17)} 35 v17"/>`);
    det += `<circle class="roupa__botao" cx="${c}" cy="43" r="4.2"/>`;
    // braguilha
    det += `<path class="roupa__vinco" d="M${c} 52 V${yC - 4}"/>`;
    det += `<path class="roupa__costura" d="M${c + 7} 52 V98 Q${c + 7} 110 ${c - 2} 113"/>`;
    // bolsos da frente
    det += lado(X => `<path class="roupa__vinco" d="M${X(26)} 52 Q${X(28)} 76 ${X(f.h - 3)} 80"/><path class="roupa__costura" d="M${X(23)} 53 Q${X(25)} 79 ${X(f.h - 3)} 84"/><circle class="roupa__rebite" cx="${X(26)}" cy="54" r="1.9"/><circle class="roupa__rebite" cx="${X(f.h - 4)}" cy="80" r="1.9"/>`);
    det += `<path class="roupa__costura" d="M${R(31)} 55 H${R(43)} L${R(44)} 66 H${R(32)} Z"/>`;
    // bigodes (desgaste)
    det += lado(X => `<path class="roupa__bigode" d="M${X(10)} 110 Q${X(18)} 112 ${X(30)} 108 M${X(9)} 118 Q${X(19)} 121 ${X(34)} 116 M${X(10)} 126 Q${X(18)} 129 ${X(28)} 126"/>`);
    // vincos e barra
    if (!f.curta) {
      det += lado(X => `<path class="roupa__vinco" d="M${X(f.ki + f.ko / 2)} ${yK - 30} L${X(f.hi + f.ho / 2)} ${yB - 14}" opacity=".45"/><path class="roupa__bigode" d="M${X(f.ki + f.ko * .3)} ${yK - 4} q${(X(10) - c) > 0 ? 12 : -12} 4 ${(X(10) - c) > 0 ? 22 : -22} 0"/>`);
    }
    det += lado(X => `<path class="roupa__costura" d="M${X(f.hi + f.ho - 1)} ${yB - 6} L${X(f.hi + 1)} ${yB - 6}"/>`);
    if (f.curta && f.y > 150) {
      det += lado(X => `<path class="roupa__vinco" d="M${X(f.hi + f.ho - 1)} ${yB - 14} L${X(f.hi + 1)} ${yB - 14}"/>`);
    }
    // bolsos cargo
    if (f.cargo) {
      det += lado(X => {
        const a = X(f.ki + f.ko + 4), b = X(f.ki + f.ko - 26);
        const x0 = Math.min(a, b), x1 = Math.max(a, b);
        return `<path class="roupa__tecido" d="M${x0} 168 H${x1} V214 Q${(x0 + x1) / 2} 220 ${x0} 214 Z"/><path class="roupa__vinco" d="M${x0} 168 H${x1} V214 Q${(x0 + x1) / 2} 220 ${x0} 214 Z M${x0} 180 H${x1}"/><path class="roupa__costura" d="M${x0 + 3} 184 H${x1 - 3} V210"/><circle class="roupa__botao" cx="${(x0 + x1) / 2}" cy="176" r="2.6"/>`;
      });
    }
    det += `<rect class="roupa__etiqueta" x="${R(f.w - 22)}" y="38" width="11" height="7" rx="1"/>`;

    const gancho = `M100 30 V14 C100 4 113 3 114 11 M46 30 H154 M58 30 V39 M142 30 V39`;
    return { pecas: [d], detalhes: det, gancho };
  }

  function jaqueta(over) {
    const p = over
      ? { n: 18, o: 40, q: 58, k: 52, b: 266, m: 258, ob: 24, cw: 22 }
      : { n: 16, o: 50, q: 48, k: 60, b: 246, m: 234, ob: 36, cw: 18 };
    const c = 100, M = x => 200 - x;
    const corpo = `M${c - p.n} 36 Q${c} 46 ${c + p.n} 36 L${M(p.o)} ${p.q} L${M(p.k)} 104 L${M(p.k)} ${p.b} L${p.k} ${p.b} L${p.k} 104 L${p.o} ${p.q} Z`;
    const manga = X => `M${X(p.o)} ${p.q} C${X(p.o - 8)} ${p.q + 40} ${X(p.ob)} ${p.m - 80} ${X(p.ob)} ${p.m - 2} L${X(p.ob + p.cw)} ${p.m} L${X(p.k + 4)} 104 Q${X(p.k + 2)} ${p.q + 24} ${X(p.o + 8)} ${p.q - 2} Z`;
    const id = x => x;
    const pecas = [corpo, manga(id), manga(M)];

    let det = '';
    const lado = fn => fn(id) + fn(M);
    // costura das mangas e punhos
    det += lado(X => `<path class="roupa__vinco" d="M${X(p.k + 4)} 104 L${X(p.ob + p.cw)} ${p.m}"/><path class="roupa__vinco" d="M${X(p.ob + 1)} ${p.m - 18} L${X(p.ob + p.cw + 1)} ${p.m - 15}"/><path class="roupa__costura" d="M${X(p.ob + 1)} ${p.m - 13} L${X(p.ob + p.cw)} ${p.m - 10}"/><circle class="roupa__botao" cx="${X(p.ob + p.cw / 2)}" cy="${p.m - 7}" r="2.4"/>`);
    // pala
    det += `<path class="roupa__costura" d="M${p.k} 76 Q${c} 88 ${M(p.k)} 76"/><path class="roupa__costura" d="M${p.k} 80 Q${c} 92 ${M(p.k)} 80"/>`;
    // carcela + botões
    det += `<path class="roupa__vinco" d="M${c} 56 V${p.b}"/><path class="roupa__costura" d="M${c + 5} 60 V${p.b - 2} M${c - 5} 60 V${p.b - 2}"/>`;
    const passo = (p.b - 40 - 84) / 4;
    for (let i = 0; i < 5; i++) det += `<circle class="roupa__botao" cx="${c}" cy="${r1(84 + i * passo)}" r="3.4"/>`;
    // bolsos do peito com lapela
    det += lado(X => {
      const a = X(p.k + 6), b = X(p.k + 32);
      const x0 = Math.min(a, b), x1 = Math.max(a, b), xm = (x0 + x1) / 2;
      return `<path class="roupa__costura" d="M${x0 + 2} 106 V134 H${x1 - 2} V106"/><path class="roupa__tecido" d="M${x0} 94 H${x1} V106 L${xm} 112 L${x0} 106 Z"/><path class="roupa__vinco" d="M${x0} 94 H${x1} V106 L${xm} 112 L${x0} 106 Z"/><path class="roupa__costura" d="M${x0 + 3} 97 H${x1 - 3} V104 L${xm} 109 L${x0 + 3} 104 Z"/><circle class="roupa__botao" cx="${xm}" cy="105" r="2.8"/><path class="roupa__costura" d="M${xm} 136 V${p.b - 22}"/>`;
    });
    // gola
    det += lado(X => `<path class="roupa__tecido" d="M${X(c - p.n)} 36 L${X(c - p.n - 13)} 45 L${X(c - 12)} 78 L${X(c)} 57 Z"/><path class="roupa__vinco" d="M${X(c - p.n)} 36 L${X(c - p.n - 13)} 45 L${X(c - 12)} 78 L${X(c)} 57"/><path class="roupa__costura" d="M${X(c - p.n - 8)} 46 L${X(c - 12)} 72"/>`);
    // cós da barra
    det += `<path class="roupa__vinco" d="M${p.k} ${p.b - 20} H${M(p.k)}"/><path class="roupa__costura" d="M${p.k + 2} ${p.b - 15} H${M(p.k + 2)} M${p.k + 2} ${p.b - 5} H${M(p.k + 2)}"/>`;
    det += lado(X => `<circle class="roupa__botao" cx="${X(p.k + 12)}" cy="${p.b - 10}" r="2.6"/>`);
    det += `<rect class="roupa__etiqueta" x="${M(p.k) - 22}" y="${p.b - 15}" width="11" height="8" rx="1"/>`;
    det += `<path class="roupa__bigode" d="M${p.k + 10} 150 q12 4 20 0 M${M(p.k + 30)} 150 q12 4 20 0"/>`;

    const gancho = `M100 30 V14 C100 4 113 3 114 11 M100 30 L${p.o + 6} ${p.q + 2} M100 30 L${M(p.o + 6)} ${p.q + 2}`;
    return { pecas, detalhes: det, gancho };
  }

  function svgRoupa(fit, lavagem) {
    const forma = fit === 'jaqueta' ? jaqueta(false)
      : fit === 'jaqueta-over' ? jaqueta(true)
      : calca(MODELAGENS[fit] || MODELAGENS.reta);
    const lav = LAVAGENS[lavagem] || LAVAGENS.medio;
    const corpo = forma.pecas.map(d => `<path d="${d}"/>`).join('');
    return `<svg class="roupa${lavagem === 'black' ? ' roupa--black' : ''}" viewBox="0 0 200 330" style="--wash:${lav.cor}" aria-hidden="true" focusable="false">` +
      `<path class="roupa__gancho" d="${forma.gancho}"/>` +
      `<g class="roupa__tecido">${corpo}</g><g class="roupa__trama">${corpo}</g>` +
      `<g class="roupa__desbotado">${corpo}</g><g class="roupa__sombra">${corpo}</g>` +
      forma.detalhes + `</svg>`;
  }

  function desenharRoupa(el, fit, lavagem, foto, nome) {
    if (foto) {
      el.innerHTML = `<img class="produto__foto" src="${esc(foto)}" alt="${esc(nome || '')}" loading="lazy" decoding="async">`;
      return;
    }
    el.innerHTML = svgRoupa(fit, lavagem);
  }

  function trocarLavagem(el, lavagem) {
    const svg = $('svg.roupa', el);
    const lav = LAVAGENS[lavagem];
    if (!svg || !lav) return;
    svg.style.setProperty('--wash', lav.cor);
    svg.classList.toggle('roupa--black', lavagem === 'black');
    el.dataset.wash = lavagem;
  }

  $$('[data-roupa]').forEach(el => {
    const card = el.closest('.produto');
    desenharRoupa(el, el.dataset.fit, el.dataset.wash, card && card.dataset.foto, card && card.dataset.nome);
  });

  /* ------------------------------------------------------------------ */
  /* 2. Diálogos (abrir/fechar com animação)                             */
  /* ------------------------------------------------------------------ */
  function abrirDialogo(d) {
    if (!d || d.open) return;
    d.classList.remove('is-saindo');
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    html.classList.add('trava');
    topo && topo.classList.remove('is-escondido');
  }

  function fecharDialogo(d) {
    return new Promise(resolve => {
      if (!d || !d.open) return resolve();
      const fim = () => {
        if (feito) return;
        feito = true;
        d.removeEventListener('animationend', aoFim);
        d.classList.remove('is-saindo');
        if (typeof d.close === 'function') d.close(); else d.removeAttribute('open');
        if (!$('dialog[open]')) html.classList.remove('trava');
        resolve();
      };
      const aoFim = e => { if (e.target === d) fim(); };
      let feito = false;
      if (reduz()) return fim();
      d.addEventListener('animationend', aoFim);
      d.classList.add('is-saindo');
      setTimeout(fim, 520);
    });
  }

  $$('dialog').forEach(d => {
    d.addEventListener('cancel', e => { e.preventDefault(); fecharDialogo(d); });
    d.addEventListener('close', () => { if (!$('dialog[open]')) html.classList.remove('trava'); });
    $$('form[method="dialog"]', d).forEach(f => f.addEventListener('submit', e => { e.preventDefault(); fecharDialogo(d); }));
    d.addEventListener('click', e => {
      if (e.target !== d) return;
      const r = d.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) fecharDialogo(d);
    });
  });

  /* ------------------------------------------------------------------ */
  /* 3. Toast                                                            */
  /* ------------------------------------------------------------------ */
  const toast = $('[data-toast]');
  let toastTimer;
  function avisar(txt) {
    if (!toast) return;
    toast.textContent = txt;
    toast.classList.add('is-visivel');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visivel'), 2800);
  }

  /* ------------------------------------------------------------------ */
  /* 4. Catálogo: amostras, filtros, ficha da peça                       */
  /* ------------------------------------------------------------------ */
  const TAM_PADRAO = ['36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56'];
  const CATEGORIAS = { calcas: 'Calças', jaquetas: 'Jaquetas', bermudas: 'Bermudas e shorts' };

  const produtos = $$('.produto[data-id]').map(el => ({
    el,
    id: el.dataset.id,
    nome: el.dataset.nome || $('h3', el)?.textContent.trim() || 'Peça',
    desc: $('.produto__info > p:not(.produto__meta)', el)?.textContent.trim() || '',
    cat: (el.dataset.cat || '').split(/\s+/).filter(Boolean),
    fit: el.dataset.fit || 'reta',
    lavagens: (el.dataset.lavagens || 'medio').split(',').map(s => s.trim()).filter(s => LAVAGENS[s]),
    tamanhos: el.dataset.tamanhos ? el.dataset.tamanhos.split(',').map(s => s.trim()) : TAM_PADRAO,
    foto: el.dataset.foto || '',
    roupa: $('.produto__roupa', el)
  }));
  const porId = Object.fromEntries(produtos.map(p => [p.id, p]));

  function botoesAmostra(box, p, ativa, aoEscolher) {
    box.innerHTML = '';
    p.lavagens.forEach(w => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'amostra';
      b.style.setProperty('--c', LAVAGENS[w].cor);
      b.dataset.wash = w;
      b.setAttribute('aria-pressed', String(w === ativa));
      b.setAttribute('aria-label', `Lavagem ${LAVAGENS[w].nome}`);
      b.title = `Lavagem ${LAVAGENS[w].nome}`;
      b.addEventListener('click', e => {
        e.stopPropagation();
        $$('.amostra', box).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        aoEscolher(w);
      });
      box.appendChild(b);
    });
  }

  produtos.forEach(p => {
    const box = $('[data-amostras]', p.el);
    const atual = () => p.roupa?.dataset.wash || p.lavagens[0];
    if (box && !p.foto) botoesAmostra(box, p, atual(), w => trocarLavagem(p.roupa, w));
    p.el.addEventListener('click', e => {
      if (e.target.closest('a, .amostra')) return;
      abrirPeca(p, atual());
    });
  });

  // contadores e filtros
  const chips = $$('[data-filtro]');
  $$('sup[data-qtd]').forEach(s => {
    const f = s.dataset.qtd;
    s.textContent = f === 'todos' ? produtos.length : produtos.filter(p => p.cat.includes(f)).length;
  });

  function filtrar(f) {
    const antes = new Map();
    produtos.forEach(p => { if (!p.el.classList.contains('is-escondido')) antes.set(p.el, p.el.getBoundingClientRect()); });
    produtos.forEach(p => p.el.classList.toggle('is-escondido', !(f === 'todos' || p.cat.includes(f))));
    if (reduz()) return;
    let n = 0;
    produtos.forEach(p => {
      if (p.el.classList.contains('is-escondido')) return;
      const a = antes.get(p.el), b = p.el.getBoundingClientRect();
      if (a) {
        const dx = a.left - b.left, dy = a.top - b.top;
        if (dx || dy) p.el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 600, easing: EASE });
      } else {
        p.el.animate([{ opacity: 0, transform: 'translateY(30px) scale(.95)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: n++ * 45, easing: EASE, fill: 'backwards' });
      }
    });
  }

  chips.forEach(ch => ch.addEventListener('click', () => {
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === ch)));
    filtrar(ch.dataset.filtro);
  }));

  // ficha da peça
  const dPeca = $('[data-peca]');
  const fp = dPeca && {
    roupa: $('[data-peca-roupa]', dPeca),
    cat: $('[data-peca-cat]', dPeca),
    nome: $('[data-peca-nome]', dPeca),
    desc: $('[data-peca-desc]', dPeca),
    washNome: $('[data-peca-wash-nome]', dPeca),
    amostras: $('[data-peca-amostras]', dPeca),
    grade: $('[data-peca-grade]', dPeca),
    qtd: $('[data-qtd]', dPeca),
    aviso: $('[data-peca-aviso]', dPeca),
    add: $('[data-add-sacola]', dPeca),
    agora: $('[data-pedir-agora]', dPeca)
  };
  const estado = { p: null, wash: '', tam: '', qtd: 1 };

  function textoItem(nome, wash, tam, qtd) {
    return `${nome}, lavagem ${LAVAGENS[wash]?.nome || wash}, tam. ${tam}, ${qtd} un.`;
  }

  function atualizarPedirAgora() {
    if (!fp) return;
    const { p, wash, tam, qtd } = estado;
    const msg = `Olá, DIZE! Vim pelo site e quero:\n• ${textoItem(p.nome, wash, tam || '?', qtd)}\nPode me passar valor e disponibilidade?`;
    fp.agora.href = linkZap(msg);
  }

  function erroTamanho() {
    fp.aviso.textContent = 'Escolhe o tamanho antes: é só tocar no número.';
    fp.grade.classList.remove('is-erro');
    void fp.grade.offsetWidth;
    fp.grade.classList.add('is-erro');
    $('button', fp.grade)?.focus();
  }

  function abrirPeca(p, wash) {
    if (!dPeca) return;
    estado.p = p;
    estado.wash = p.lavagens.includes(wash) ? wash : p.lavagens[0];
    estado.tam = '';
    estado.qtd = 1;

    const cat = CATEGORIAS[p.cat[0]] || 'Jeans';
    fp.cat.textContent = p.cat.includes('black') ? `${cat} · Black Jeans` : cat;
    fp.nome.textContent = p.nome;
    fp.desc.textContent = p.desc;
    fp.washNome.textContent = LAVAGENS[estado.wash].nome;
    fp.qtd.textContent = '1';
    fp.aviso.textContent = '';
    desenharRoupa(fp.roupa, p.fit, estado.wash, p.foto, p.nome);

    botoesAmostra(fp.amostras, p, estado.wash, w => {
      estado.wash = w;
      fp.washNome.textContent = LAVAGENS[w].nome;
      trocarLavagem(fp.roupa, w);
      atualizarPedirAgora();
    });
    fp.amostras.closest('fieldset').hidden = p.lavagens.length < 1;

    fp.grade.innerHTML = '';
    p.tamanhos.forEach(t => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = t;
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', `Tamanho ${t}`);
      b.addEventListener('click', () => {
        estado.tam = t;
        $$('button', fp.grade).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        fp.aviso.textContent = '';
        atualizarPedirAgora();
      });
      fp.grade.appendChild(b);
    });

    atualizarPedirAgora();
    abrirDialogo(dPeca);
  }

  if (dPeca) {
    $('[data-qtd-menos]', dPeca).addEventListener('click', () => { estado.qtd = Math.max(1, estado.qtd - 1); fp.qtd.textContent = estado.qtd; atualizarPedirAgora(); });
    $('[data-qtd-mais]', dPeca).addEventListener('click', () => { estado.qtd = Math.min(50, estado.qtd + 1); fp.qtd.textContent = estado.qtd; atualizarPedirAgora(); });
    fp.grade.addEventListener('animationend', () => fp.grade.classList.remove('is-erro'));
    fp.agora.addEventListener('click', e => { if (!estado.tam) { e.preventDefault(); erroTamanho(); } });
    fp.add.addEventListener('click', async () => {
      if (!estado.tam) return erroTamanho();
      const { p, wash, tam, qtd } = estado;
      const origem = fp.roupa.getBoundingClientRect();
      await fecharDialogo(dPeca);
      adicionarNaSacola({ id: p.id, nome: p.nome, fit: p.fit, foto: p.foto, wash, tam, qtd });
      voarAteSacola(origem, p, wash);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 5. Sacola (localStorage) → mensagem no WhatsApp                     */
  /* ------------------------------------------------------------------ */
  const CHAVE = 'dize-sacola';
  const dSacola = $('[data-sacola]');
  const lista = $('[data-sacola-lista]');
  const vazia = $('[data-sacola-vazia]');
  const formSacola = $('[data-sacola-form]');
  const contador = $('[data-contador]');
  const btnSacola = $('.btn-sacola');
  let sacola = [];

  try { sacola = JSON.parse(localStorage.getItem(CHAVE)) || []; } catch (e) { sacola = []; }
  if (!Array.isArray(sacola)) sacola = [];
  sacola = sacola.filter(i => i && i.id && i.tam && LAVAGENS[i.wash]);

  const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(sacola)); } catch (e) { /* modo privado */ } };
  const chaveItem = i => `${i.id}|${i.wash}|${i.tam}`;

  function atualizarContador(pular) {
    if (!contador) return;
    const total = sacola.reduce((s, i) => s + i.qtd, 0);
    contador.textContent = total;
    btnSacola?.setAttribute('aria-label', `Abrir sacola (${total} ${total === 1 ? 'peça' : 'peças'})`);
    if (pular && btnSacola && !reduz()) {
      btnSacola.classList.remove('is-pulo');
      void btnSacola.offsetWidth;
      btnSacola.classList.add('is-pulo');
    }
  }
  btnSacola?.addEventListener('animationend', () => btnSacola.classList.remove('is-pulo'));

  function adicionarNaSacola(item) {
    const k = chaveItem(item);
    const ja = sacola.find(i => chaveItem(i) === k);
    if (ja) ja.qtd = Math.min(50, ja.qtd + item.qtd); else sacola.push(item);
    salvar();
    renderSacola();
    setTimeout(() => atualizarContador(true), reduz() ? 0 : 650);
    avisar(`${item.nome} (${item.tam}) foi pra sacola`);
  }

  function renderSacola() {
    if (!lista) return;
    lista.innerHTML = sacola.map(i => {
      const k = esc(chaveItem(i));
      const mini = i.foto ? `<img src="${esc(i.foto)}" alt="" loading="lazy">` : svgRoupa(i.fit, i.wash);
      return `<li class="sacola__item" data-chave="${k}">
        <div class="sacola__mini">${mini}</div>
        <div><h3>${esc(i.nome)}</h3><p>Lavagem ${esc(LAVAGENS[i.wash].nome)} · tam. ${esc(i.tam)}</p>
          <div class="contador"><button type="button" data-item-menos aria-label="Menos uma">−</button><output>${i.qtd}</output><button type="button" data-item-mais aria-label="Mais uma">+</button></div></div>
        <button type="button" class="sacola__remover" data-item-remover>Tirar</button>
      </li>`;
    }).join('');
    const tem = sacola.length > 0;
    if (vazia) vazia.hidden = tem;
    if (formSacola) formSacola.hidden = !tem;
    lista.hidden = !tem;
    atualizarContador(false);
  }

  lista?.addEventListener('click', e => {
    const li = e.target.closest('.sacola__item');
    if (!li) return;
    const item = sacola.find(i => chaveItem(i) === li.dataset.chave);
    if (!item) return;
    const tirar = () => {
      sacola = sacola.filter(i => i !== item);
      salvar();
      if (reduz()) return renderSacola();
      li.classList.add('is-saindo');
      li.addEventListener('animationend', renderSacola, { once: true });
      setTimeout(() => li.isConnected && renderSacola(), 450);
    };
    if (e.target.closest('[data-item-remover]')) return tirar();
    if (e.target.closest('[data-item-mais]')) item.qtd = Math.min(50, item.qtd + 1);
    else if (e.target.closest('[data-item-menos]')) {
      if (item.qtd <= 1) return tirar();
      item.qtd -= 1;
    } else return;
    $('output', li).textContent = item.qtd;
    salvar();
    atualizarContador(false);
  });

  $$('[data-abrir-sacola]').forEach(b => b.addEventListener('click', () => { renderSacola(); abrirDialogo(dSacola); }));
  $$('[data-fechar-sacola]').forEach(a => a.addEventListener('click', async e => {
    e.preventDefault();
    await fecharDialogo(dSacola);
    const alvo = $(a.getAttribute('href'));
    alvo && alvo.scrollIntoView({ behavior: reduz() ? 'auto' : 'smooth' });
  }));

  formSacola?.addEventListener('submit', e => {
    e.preventDefault();
    if (!sacola.length) return;
    const dados = new FormData(formSacola);
    const nome = (dados.get('nome') || '').toString().trim();
    const cidade = (dados.get('cidade') || '').toString().trim();
    const tipo = (dados.get('tipo') || 'Varejo').toString();
    let msg = 'Olá, DIZE! Vim pelo site e quero fazer um pedido:\n';
    msg += sacola.map(i => `• ${textoItem(i.nome, i.wash, i.tam, i.qtd)}`).join('\n');
    msg += '\n';
    if (nome) msg += `\nNome: ${nome}`;
    if (cidade) msg += `\nCidade: ${cidade}`;
    msg += `\nTipo: ${tipo}`;
    msg += '\n\nPode me passar valores e disponibilidade?';
    window.open(linkZap(msg), '_blank', 'noopener');
    avisar('Abrindo o WhatsApp com o seu pedido…');
  });

  function voarAteSacola(origem, p, wash) {
    if (!btnSacola || reduz() || !origem.width) return;
    topo && topo.classList.remove('is-escondido');
    const alvo = btnSacola.getBoundingClientRect();
    const voa = document.createElement('div');
    voa.className = 'voa';
    voa.innerHTML = p.foto ? `<img src="${esc(p.foto)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:6px">` : svgRoupa(p.fit, wash);
    const x0 = origem.left + origem.width / 2 - 35, y0 = origem.top + origem.height / 2 - 40;
    const x1 = alvo.left + alvo.width / 2 - 35, y1 = alvo.top + alvo.height / 2 - 40;
    voa.style.left = '0px';
    voa.style.top = '0px';
    document.body.appendChild(voa);
    const meioX = (x0 + x1) / 2, meioY = Math.min(y0, y1) - 120;
    const a = voa.animate([
      { transform: `translate(${x0}px, ${y0}px) scale(1.6) rotate(-8deg)`, opacity: 0 },
      { transform: `translate(${x0}px, ${y0}px) scale(1.4) rotate(-4deg)`, opacity: 1, offset: .12 },
      { transform: `translate(${meioX}px, ${meioY}px) scale(.9) rotate(10deg)`, opacity: 1, offset: .55 },
      { transform: `translate(${x1}px, ${y1}px) scale(.2) rotate(0)`, opacity: .2 }
    ], { duration: 850, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'forwards' });
    a.onfinish = () => voa.remove();
  }

  renderSacola();

  /* ------------------------------------------------------------------ */
  /* 6. Topo: sombra, esconde ao descer, link ativo, menu mobile         */
  /* ------------------------------------------------------------------ */
  const topo = $('#topo');
  const hamb = $('.hamburguer');
  const menuMobile = $('#menu-mobile');
  let ultimoY = window.scrollY;

  function abrirMenu(abrir) {
    if (!hamb || !menuMobile) return;
    hamb.setAttribute('aria-expanded', String(abrir));
    hamb.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    menuMobile.hidden = !abrir;
    html.classList.toggle('trava', abrir);
    if (abrir) topo?.classList.remove('is-escondido');
  }
  hamb?.addEventListener('click', () => abrirMenu(hamb.getAttribute('aria-expanded') !== 'true'));
  $$('a', menuMobile || document.createElement('div')).forEach(a => a.addEventListener('click', () => abrirMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && hamb?.getAttribute('aria-expanded') === 'true') { abrirMenu(false); hamb.focus(); } });
  matchMedia('(min-width: 1081px)').addEventListener?.('change', e => { if (e.matches) abrirMenu(false); });

  const linksMenu = $$('.menu a[href^="#"]');
  if ('IntersectionObserver' in window && linksMenu.length) {
    const secoes = linksMenu.map(a => $(a.getAttribute('href'))).filter(Boolean);
    const ioMenu = new IntersectionObserver(ents => {
      ents.forEach(e => {
        if (!e.isIntersecting) return;
        linksMenu.forEach(a => {
          const ativo = a.getAttribute('href') === '#' + e.target.id;
          a.classList.toggle('is-atual', ativo);
          if (ativo) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secoes.forEach(s => ioMenu.observe(s));
  }

  /* ------------------------------------------------------------------ */
  /* 7. Animações de entrada (reveal com escalonamento)                  */
  /* ------------------------------------------------------------------ */
  // marca mais blocos para animar, só os que ainda estão fora da tela
  const extras = '.secao-cabeca, .filtros, .produto, .catalogo__nota, .medidor, .onde__listas > *, .form-revenda, .revenda__texto > *, .destaques li, .post, .carregar-posts, .faq__lista details, .faq__lado, .rodape__col';
  $$(extras).forEach(el => {
    if (el.hasAttribute('data-anim')) return;
    if (el.getBoundingClientRect().top > window.innerHeight * 0.95) el.setAttribute('data-anim', 'sobe');
  });

  if (html.classList.contains('com-intro')) {
    $$('.hero [data-anim]').forEach((el, i) => el.style.setProperty('--d', `${1500 + i * 140}ms`));
  }

  const animaveis = $$('[data-anim]');
  if ('IntersectionObserver' in window && !reduz()) {
    const io = new IntersectionObserver(ents => {
      let i = 0;
      ents.filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach(e => {
          const el = e.target;
          if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', `${Math.min(i++, 8) * 85}ms`);
          el.classList.add('is-in');
          io.unobserve(el);
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    animaveis.forEach(el => io.observe(el));
  } else {
    animaveis.forEach(el => el.classList.add('is-in'));
  }

  /* ------------------------------------------------------------------ */
  /* 8. Manifesto: palavras acendem com a rolagem                        */
  /* ------------------------------------------------------------------ */
  const manifesto = $('[data-manifesto]');
  let palavras = [];
  if (manifesto) {
    const destaque = /^(jeans|36|56|vale|paraíba|litoral|norte|leva|varejo,?|atacado,?|revender\.?)$/i;
    const texto = manifesto.textContent.trim();
    manifesto.setAttribute('aria-label', texto);
    manifesto.textContent = '';
    texto.split(/\s+/).forEach((w, i) => {
      if (i) manifesto.appendChild(document.createTextNode(' '));
      const s = document.createElement('span');
      s.className = 'p' + (destaque.test(w.replace(/[.,]$/, '')) ? ' destaque' : '');
      s.setAttribute('aria-hidden', 'true');
      s.textContent = w;
      manifesto.appendChild(s);
    });
    palavras = $$('.p', manifesto);
    if (reduz()) palavras.forEach(p => p.classList.add('on'));
  }
  function rolarManifesto() {
    if (!palavras.length || reduz()) return;
    const r = manifesto.getBoundingClientRect(), vh = window.innerHeight;
    const prog = clamp((vh * 0.88 - r.top) / (r.height + vh * 0.35), 0, 1);
    const n = Math.round(prog * palavras.length);
    palavras.forEach((p, i) => p.classList.toggle('on', i < n));
  }

  /* ------------------------------------------------------------------ */
  /* 9. Hero: lavagens, parallax, etiqueta de tamanhos                   */
  /* ------------------------------------------------------------------ */
  const hero = $('.hero');
  const heroRoupa = $('[data-hero]');
  $$('[data-hero-wash]').forEach((b, _, todos) => b.addEventListener('click', () => {
    todos.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    trocarLavagem(heroRoupa, b.dataset.heroWash);
  }));

  if (hero && heroRoupa && ponteiroFino && !reduz()) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
      heroRoupa.style.setProperty('--px', `${r1(nx * -26)}px`);
      heroRoupa.style.setProperty('--py', `${r1(ny * -14)}px`);
    });
    hero.addEventListener('pointerleave', () => {
      heroRoupa.style.setProperty('--px', '0px');
      heroRoupa.style.setProperty('--py', '0px');
    });
  }

  const numTag = $('[data-contador-tamanho]');
  let heroVisivel = true;
  if (numTag && !reduz()) {
    let t = 36, pausa = 0;
    const inicio = html.classList.contains('com-intro') ? 2400 : 900;
    setTimeout(() => setInterval(() => {
      if (!heroVisivel || document.hidden) return;
      if (pausa > 0) { pausa--; return; }
      t = t >= 56 ? 36 : t + 2;
      numTag.textContent = t;
      numTag.animate([{ transform: 'translateY(30%)', opacity: .2 }, { transform: 'none', opacity: 1 }], { duration: 260, easing: EASE });
      if (t === 56) pausa = 14;
      else if (t === 36) pausa = 4;
    }, 170), inicio);
  }

  /* ------------------------------------------------------------------ */
  /* 10. Botões magnéticos                                               */
  /* ------------------------------------------------------------------ */
  if (ponteiroFino && !reduz()) {
    $$('[data-magnetico]').forEach(el => {
      const base = getComputedStyle(el).transition;
      el.style.transition = (base && base !== 'all 0s ease 0s' ? base + ', ' : '') + `translate .35s ${EASE}`;
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.28;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.4;
        el.style.translate = `${r1(dx)}px ${r1(dy)}px`;
      });
      el.addEventListener('pointerleave', () => { el.style.translate = '0px 0px'; });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 11. Trena de tamanhos                                               */
  /* ------------------------------------------------------------------ */
  const range = $('[data-tamanho]');
  const saida = $('[data-tamanho-out]');
  const trilho = $('[data-trena]');
  const zapTam = $('[data-zap-tamanho]');
  const txtTam = $$('[data-tamanho-txt]');
  const T_MIN = 30, T_MAX = 62, PASSO_PX = 14;

  if (trilho) {
    let marcas = '';
    for (let v = T_MIN; v <= T_MAX; v++) {
      marcas += v % 2 === 0 ? `<span class="trena__marca cheia"><b>${v}</b></span>` : '<span class="trena__marca meia"></span>';
    }
    trilho.innerHTML = marcas;
    trilho.setAttribute('aria-hidden', 'true');
  }

  function definirTamanho(v, animar) {
    v = clamp(Math.round(v / 2) * 2, +(range?.min || 36), +(range?.max || 56));
    if (range && +range.value !== v) range.value = v;
    if (trilho) trilho.style.transform = `translateX(${-(v - T_MIN) * PASSO_PX}px)`;
    if (saida && saida.textContent !== String(v)) {
      saida.textContent = v;
      if (animar && !reduz()) {
        saida.classList.remove('is-troca');
        void saida.offsetWidth;
        saida.classList.add('is-troca');
      }
    }
    txtTam.forEach(s => { s.textContent = v; });
    if (zapTam) zapTam.href = linkZap(`Oi, DIZE! Uso o tamanho ${v}. Quais modelos vocês têm nesse número?`);
    range?.setAttribute('aria-valuetext', `Tamanho ${v}`);
  }

  if (range) {
    range.addEventListener('input', () => definirTamanho(+range.value, true));
    definirTamanho(+range.value, false);
    const trena = trilho?.closest('.trena');
    if (trena) {
      let x0 = 0, v0 = 44, arrastando = false;
      trena.style.cursor = 'grab';
      trena.style.touchAction = 'pan-y';
      trena.addEventListener('pointerdown', e => {
        arrastando = true; x0 = e.clientX; v0 = +range.value;
        trena.setPointerCapture(e.pointerId);
        trena.style.cursor = 'grabbing';
      });
      trena.addEventListener('pointermove', e => {
        if (!arrastando) return;
        definirTamanho(v0 - Math.round((e.clientX - x0) / (PASSO_PX * 2)) * 2, true);
      });
      const soltar = () => { arrastando = false; trena.style.cursor = 'grab'; };
      trena.addEventListener('pointerup', soltar);
      trena.addEventListener('pointercancel', soltar);
    }
  }

  /* ------------------------------------------------------------------ */
  /* 12. Linha costurada do "como funciona"                              */
  /* ------------------------------------------------------------------ */
  const passos = $('[data-passos]');
  const trilha = $('[data-trilha]');
  let compTrilha = 0;
  if (trilha) {
    compTrilha = trilha.getTotalLength();
    trilha.style.strokeDasharray = `${compTrilha} ${compTrilha}`;
    trilha.style.strokeDashoffset = reduz() ? 0 : compTrilha;
  }
  function rolarPassos() {
    if (!trilha || !passos || reduz()) return;
    const r = passos.getBoundingClientRect(), vh = window.innerHeight;
    const prog = clamp((vh * 0.85 - r.top) / (r.height * 0.8 + vh * 0.25), 0, 1);
    trilha.style.strokeDashoffset = r1(compTrilha * (1 - prog));
  }

  /* ------------------------------------------------------------------ */
  /* 13. Mapa ilustrativo (Vale do Paraíba + Litoral Norte)              */
  /* ------------------------------------------------------------------ */
  // [nome, longitude, latitude, região, posição do rótulo]
  const CIDADES = [
    ['São José dos Campos', -45.886, -23.179, 'vale', 'c'],
    ['Jacareí', -45.966, -23.305, 'vale', 'e'],
    ['Caçapava', -45.707, -23.100, 'vale', 'd'],
    ['Taubaté', -45.556, -23.026, 'vale', 'd'],
    ['Tremembé', -45.549, -22.958, 'vale', 'e'],
    ['Pindamonhangaba', -45.462, -22.924, 'vale', 'd'],
    ['Aparecida', -45.230, -22.847, 'vale', 'eb'],
    ['Guaratinguetá', -45.193, -22.816, 'vale', 'd'],
    ['Lorena', -45.124, -22.731, 'vale', 'd'],
    ['Cruzeiro', -44.963, -22.576, 'vale', 'd'],
    ['Caraguatatuba', -45.413, -23.620, 'litoral', 'e'],
    ['São Sebastião', -45.409, -23.760, 'litoral', 'e'],
    ['Ilhabela', -45.358, -23.778, 'litoral', 'd'],
    ['Ubatuba', -45.071, -23.434, 'litoral', 'd']
  ];
  const projetar = (lon, lat) => [r1((lon + 46.05) * 480 + 30), r1((-lat - 22.5) * 480 + 20)];

  function suave(pts) {
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ` C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`;
    }
    return d;
  }

  const mapaSvg = $('[data-mapa]');
  const legenda = $('[data-mapa-cidade]');
  const legendaPadrao = legenda?.textContent || '';
  const normal = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

  if (mapaSvg) {
    const costa = [[0, 652], [70, 646], [150, 650], [230, 656], [290, 648], [330, 636], [346, 622], [346, 590], [340, 566], [356, 546], [396, 526], [436, 508], [470, 490], [503, 476], [534, 456], [570, 432], [612, 404], [650, 384], [680, 372]];
    const dutra = [[0, 452], [40, 430], [70, 406], [96, 370], [109, 346], [150, 326], [195, 308], [235, 292], [267, 273], [290, 246], [312, 224], [365, 206], [424, 187], [441, 172], [460, 150], [475, 131], [515, 94], [552, 57], [590, 24], [612, 0]];
    const tamoios = [[109, 346], [140, 380], [175, 420], [220, 455], [265, 490], [305, 525], [336, 558]];
    const oswaldo = [[267, 273], [310, 300], [360, 330], [405, 370], [445, 415], [478, 445], [500, 468]];
    const rioSantos = [[332, 624], [334, 592], [331, 566], [350, 538], [392, 516], [434, 498], [468, 480], [500, 466], [532, 446], [570, 422], [612, 394], [650, 372], [680, 360]];

    let s = '';
    s += `<path class="mapa__mar" d="${suave(costa)} L680 700 L0 700 Z"/>`;
    s += `<path class="mapa__ilha" d="M358 616 C374 602 404 610 410 640 C416 672 394 694 372 686 C354 678 350 640 358 616 Z"/>`;
    s += `<path class="mapa__costa" data-desenha d="${suave(costa)}"/>`;
    s += `<path class="mapa__estrada" data-desenha style="--d:.1s" d="${suave(dutra)}"/>`;
    s += `<path class="mapa__estrada mapa__estrada--sec" data-desenha style="--d:.9s" d="${suave(tamoios)}"/>`;
    s += `<path class="mapa__estrada mapa__estrada--sec" data-desenha style="--d:1.1s" d="${suave(oswaldo)}"/>`;
    s += `<path class="mapa__estrada mapa__estrada--sec" data-desenha style="--d:1.4s" d="${suave(rioSantos)}"/>`;
    s += `<text class="mapa__estrada-nome" x="340" y="203" text-anchor="middle" transform="rotate(-18 340 203)">Via Dutra</text>`;
    s += `<text class="mapa__estrada-nome" x="205" y="428" text-anchor="middle" transform="rotate(38 205 428)">Tamoios</text>`;
    s += `<text class="mapa__estrada-nome" x="390" y="341" text-anchor="middle" transform="rotate(41 390 341)">SP-125</text>`;
    s += `<text class="mapa__estrada-nome" x="414" y="493" text-anchor="middle" transform="rotate(-28 414 493)">Rio-Santos</text>`;
    s += `<text class="mapa__regiao" x="24" y="250">Vale do Paraíba</text>`;
    s += `<text class="mapa__regiao" x="440" y="612">Litoral Norte</text>`;
    s += `<text class="mapa__regiao" x="470" y="676" style="font-size:11px">Oceano Atlântico</text>`;

    CIDADES.forEach(([nome, lon, lat, reg, pos], i) => {
      const [x, y] = projetar(lon, lat);
      const rot = { d: [x + 12, y + 4, 'start'], e: [x - 12, y + 4, 'end'], c: [x, y - 14, 'middle'], eb: [x - 10, y + 17, 'end'] }[pos];
      s += `<g class="mapa__cidade" tabindex="0" role="img" aria-label="${esc(nome)}, ${reg === 'vale' ? 'Vale do Paraíba' : 'Litoral Norte'}" data-cidade="${esc(nome)}">` +
        `<circle class="onda" cx="${x}" cy="${y}" r="7" style="--d:${r1(i * 0.2)}s"/>` +
        `<circle class="pino" cx="${x}" cy="${y}" r="5"/>` +
        `<text x="${rot[0]}" y="${rot[1]}" text-anchor="${rot[2]}" aria-hidden="true">${esc(nome)}</text></g>`;
    });
    mapaSvg.insertAdjacentHTML('beforeend', s);
    $$('[data-desenha]', mapaSvg).forEach(p => p.style.setProperty('--len', r1(p.getTotalLength())));

    // sincroniza pinos ↔ lista ↔ legenda
    const pinos = $$('.mapa__cidade', mapaSvg);
    const itensLista = $$('[data-lista-cidades] li');
    const liDe = nome => itensLista.find(li => normal(li.textContent).startsWith(normal(nome)));
    const ativar = nome => {
      pinos.forEach(g => g.classList.toggle('is-ativa', g.dataset.cidade === nome));
      itensLista.forEach(li => li.classList.toggle('is-ativa', li === liDe(nome)));
      if (legenda) {
        const c = CIDADES.find(c => c[0] === nome);
        legenda.textContent = c ? `${nome} · ${c[3] === 'vale' ? 'Vale do Paraíba' : 'Litoral Norte'}` : legendaPadrao;
      }
    };
    const desativar = () => {
      pinos.forEach(g => g.classList.remove('is-ativa'));
      itensLista.forEach(li => li.classList.remove('is-ativa'));
      if (legenda) legenda.textContent = legendaPadrao;
    };
    pinos.forEach(g => {
      ['pointerenter', 'focus'].forEach(ev => g.addEventListener(ev, () => ativar(g.dataset.cidade)));
      ['pointerleave', 'blur'].forEach(ev => g.addEventListener(ev, desativar));
      g.addEventListener('click', () => ativar(g.dataset.cidade));
    });
    CIDADES.forEach(([nome]) => {
      const li = liDe(nome);
      if (!li) return;
      li.addEventListener('pointerenter', () => ativar(nome));
      li.addEventListener('pointerleave', desativar);
    });

    const fig = mapaSvg.closest('.mapa') || mapaSvg;
    if ('IntersectionObserver' in window && !reduz()) {
      const ioMapa = new IntersectionObserver(ents => {
        if (ents.some(e => e.isIntersecting)) { fig.classList.add('is-vivo'); ioMapa.disconnect(); }
      }, { threshold: 0.25 });
      ioMapa.observe(fig);
    } else {
      fig.classList.add('is-vivo');
    }
  }

  // lista de cidades para os campos (datalist)
  const datalist = $('#cidades-lista');
  if (datalist) datalist.innerHTML = CIDADES.map(c => `<option value="${esc(c[0])}"></option>`).join('');

  /* ------------------------------------------------------------------ */
  /* 14. Formulário de revenda → WhatsApp                                */
  /* ------------------------------------------------------------------ */
  const formRev = $('[data-form-revenda]');
  if (formRev) {
    const erro = $('[data-erro]', formRev);
    formRev.addEventListener('input', e => {
      if (e.target.matches('[aria-invalid="true"]') && e.target.value.trim()) e.target.removeAttribute('aria-invalid');
      if (erro && !$('[aria-invalid="true"]', formRev)) erro.textContent = '';
    });
    formRev.addEventListener('submit', e => {
      e.preventDefault();
      const obrigatorios = $$('[required]', formRev);
      const faltando = obrigatorios.filter(i => !i.value.trim());
      obrigatorios.forEach(i => i.toggleAttribute('aria-invalid', faltando.includes(i)));
      faltando.forEach(i => i.setAttribute('aria-invalid', 'true'));
      if (faltando.length) {
        if (erro) erro.textContent = faltando.length > 1 ? 'Falta seu nome e sua cidade.' : `Falta ${faltando[0].name === 'nome' ? 'seu nome' : 'sua cidade'}.`;
        faltando[0].focus();
        return;
      }
      const d = new FormData(formRev);
      const canais = d.getAll('canal');
      let msg = 'Olá, DIZE! Quero revender jeans de vocês.\n';
      msg += `\nNome: ${d.get('nome').toString().trim()}`;
      msg += `\nCidade: ${d.get('cidade').toString().trim()}`;
      if (canais.length) msg += `\nVou vender: ${canais.join(', ')}`;
      if (d.get('experiencia')) msg += `\nExperiência: ${d.get('experiencia')}`;
      msg += '\n\nComo funciona a grade de revenda?';
      window.open(linkZap(msg), '_blank', 'noopener');
      avisar('Abrindo o WhatsApp com a sua ficha…');
    });
  }

  /* ------------------------------------------------------------------ */
  /* 15. Instagram: carrega embeds só quando a pessoa pede               */
  /* ------------------------------------------------------------------ */
  const posts = $('[data-posts]');
  const btnPosts = $('[data-carregar-posts]');
  btnPosts?.addEventListener('click', () => {
    if (!posts) return;
    // o embed oficial precisa do link curto (/p/ID/ ou /reel/ID/), sem o @ no caminho
    const links = $$('[data-post]', posts).map(a => a.href.split('?')[0].replace(/instagram\.com\/[^/]+\/(p|reel|tv)\//, 'instagram.com/$1/'));
    posts.innerHTML = links.map(url => `<blockquote class="instagram-media" data-instgrm-permalink="${esc(url)}?utm_source=ig_embed" data-instgrm-version="14"><a href="${esc(url)}" target="_blank" rel="noopener">Ver no Instagram</a></blockquote>`).join('');
    posts.classList.add('is-embed');
    btnPosts.hidden = true;
    if (window.instgrm) { window.instgrm.Embeds.process(); return; }
    const sc = document.createElement('script');
    sc.async = true;
    sc.src = 'https://www.instagram.com/embed.js';
    document.body.appendChild(sc);
  });

  /* ------------------------------------------------------------------ */
  /* 16. FAQ com abertura animada                                        */
  /* ------------------------------------------------------------------ */
  $$('.faq details').forEach(det => {
    const sum = $('summary', det);
    const corpo = $(':scope > div', det);
    if (!sum || !corpo) return;
    let anim = null;
    sum.addEventListener('click', e => {
      if (reduz() || !corpo.animate) return;
      e.preventDefault();
      anim && anim.cancel();
      if (!det.open) {
        det.open = true;
        const h = corpo.scrollHeight;
        anim = corpo.animate([{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 420, easing: EASE });
        anim.onfinish = () => { anim = null; };
      } else {
        const h = corpo.offsetHeight;
        anim = corpo.animate([{ height: `${h}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 320, easing: EASE });
        anim.onfinish = () => { det.open = false; anim = null; };
      }
    });
  });

  /* ------------------------------------------------------------------ */
  /* 17. Botão flutuante do WhatsApp, rodapé, ano                        */
  /* ------------------------------------------------------------------ */
  const zapFlutua = $('.zap-flutua');
  const rodape = $('.rodape');
  const marcaRodape = $('[data-rodape-marca]');
  let rodapeVisivel = false;
  const atualizarFlutua = () => zapFlutua && zapFlutua.classList.toggle('is-visivel', !heroVisivel && !rodapeVisivel);

  if ('IntersectionObserver' in window) {
    if (hero) new IntersectionObserver(ents => { heroVisivel = ents[0].isIntersecting; atualizarFlutua(); }, { threshold: 0.15 }).observe(hero);
    if (rodape) new IntersectionObserver(ents => { rodapeVisivel = ents[0].isIntersecting; atualizarFlutua(); }).observe(rodape);
    if (marcaRodape) {
      const ioM = new IntersectionObserver(ents => { if (ents[0].isIntersecting) { marcaRodape.classList.add('is-in'); ioM.disconnect(); } }, { threshold: 0.3 });
      ioM.observe(marcaRodape);
    }
  } else {
    zapFlutua?.classList.add('is-visivel');
    marcaRodape?.classList.add('is-in');
  }

  $$('[data-ano]').forEach(s => { s.textContent = new Date().getFullYear(); });

  // registro opcional de cliques no WhatsApp (funciona se houver GTM/GA com dataLayer)
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href*="wa.me"]');
    if (!a || !Array.isArray(window.dataLayer)) return;
    window.dataLayer.push({ event: 'clique_whatsapp', origem: a.dataset.zapOrigem || 'outro' });
  });

  /* ------------------------------------------------------------------ */
  /* 18. Laço de rolagem (um rAF só)                                     */
  /* ------------------------------------------------------------------ */
  let pedido = false;
  function aoRolar() {
    pedido = false;
    const y = window.scrollY;
    if (topo) {
      topo.classList.toggle('is-rolado', y > 24);
      const dy = y - ultimoY;
      const menuAberto = hamb?.getAttribute('aria-expanded') === 'true';
      if (dy > 6 && y > 480 && !menuAberto && !$('dialog[open]')) topo.classList.add('is-escondido');
      else if (dy < -6 || y < 480) topo.classList.remove('is-escondido');
      if (Math.abs(dy) > 6) ultimoY = y;
    }
    rolarManifesto();
    rolarPassos();
  }
  const pedirQuadro = () => { if (!pedido) { pedido = true; requestAnimationFrame(aoRolar); } };
  window.addEventListener('scroll', pedirQuadro, { passive: true });
  window.addEventListener('resize', pedirQuadro, { passive: true });
  aoRolar();
})();
