(() => {
  const C = window.CONFIG;
  const W = 800, H = 300, CHAO = 250;
  const cv = document.getElementById('game'), ctx = cv.getContext('2d');
  const $ = id => document.getElementById(id);
  const semMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let recorde = 0;
  try { recorde = +localStorage.getItem('capivara-recorde') || 0; } catch (e) {}
  $('best').textContent = recorde;

  const P = { x: 90, y: CHAO, vy: 0, w: 44, h: 30, noChao: true };
  let obstaculos, velocidade, pontos, proximo, continuacoes, estado = 'menu', partidas = 0, ultimo = 0, t = 0;
  const nuvens = Array.from({ length: 5 }, (_, i) => ({ x: i * 180 + 40, y: 30 + (i * 37) % 80, s: .3 + (i % 3) * .2 }));

  function zerar() {
    obstaculos = []; velocidade = C.velocidadeInicial; pontos = 0; proximo = 60; continuacoes = 0;
    P.y = CHAO; P.vy = 0; P.noChao = true;
  }
  zerar();

  function pular() {
    if (estado === 'jogando' && P.noChao) { P.vy = -C.pulo; P.noChao = false; }
  }

  function criarObstaculo() {
    const alto = Math.random() < .4;
    obstaculos.push({ x: W + 20, w: alto ? 22 : 34, h: alto ? 48 : 26, tipo: alto ? 'cacto' : 'tronco' });
    proximo = Math.max(38, 70 + Math.random() * 60 - velocidade * 3);
  }

  function atualizar(dt) {
    t += dt;
    velocidade += C.aceleracao * dt;
    pontos += velocidade * 0.02 * dt;
    P.vy += C.gravidade * dt; P.y += P.vy * dt;
    if (P.y >= CHAO) { P.y = CHAO; P.vy = 0; P.noChao = true; }
    if ((proximo -= dt) <= 0) criarObstaculo();
    for (const o of obstaculos) o.x -= velocidade * dt;
    obstaculos = obstaculos.filter(o => o.x + o.w > -10);
    for (const n of nuvens) { n.x -= n.s * dt; if (n.x < -80) n.x = W + 40; }
    // Caixa de colisão um pouco menor que o desenho, para ser justo com o jogador.
    const px = P.x + 6, py = P.y - P.h + 4, pw = P.w - 12, ph = P.h - 6;
    for (const o of obstaculos) {
      if (px < o.x + o.w && px + pw > o.x && py + ph > CHAO - o.h) return bater();
    }
    $('score').textContent = Math.floor(pontos);
  }

  function bater() {
    estado = 'fim';
    Ads.partidaParou();
    const s = Math.floor(pontos);
    if (s > recorde) { recorde = s; try { localStorage.setItem('capivara-recorde', recorde); } catch (e) {} }
    $('best').textContent = recorde;
    $('finalScore').textContent = s;
    $('rewardBtn').hidden = continuacoes >= C.continuarPorPartida || !Ads.podeRecompensado();
    $('over').hidden = false;
    ($('rewardBtn').hidden ? $('againBtn') : $('rewardBtn')).focus();
  }

  function desenhar() {
    const g = ctx.createLinearGradient(0, 0, 0, CHAO);
    g.addColorStop(0, '#1d2440'); g.addColorStop(1, '#6b4a6e');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#ffb347'; ctx.beginPath(); ctx.arc(640, 150, 46, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(244,239,230,.18)';
    for (const n of nuvens) { ctx.beginPath(); ctx.ellipse(n.x, n.y, 38, 11, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#2b3b2e'; ctx.fillRect(0, CHAO - 12, W, 12);
    ctx.fillStyle = '#3a2a22'; ctx.fillRect(0, CHAO, W, H - CHAO);
    ctx.fillStyle = '#4c382d';
    const desloc = (t * velocidade) % 40;
    for (let x = -desloc; x < W; x += 40) ctx.fillRect(x, CHAO + 14, 18, 3);

    for (const o of obstaculos) {
      if (o.tipo === 'cacto') {
        ctx.fillStyle = '#5fc27e';
        ctx.fillRect(o.x + 7, CHAO - o.h, 8, o.h);
        ctx.fillRect(o.x, CHAO - o.h + 16, 6, 14); ctx.fillRect(o.x + 16, CHAO - o.h + 10, 6, 14);
      } else {
        ctx.fillStyle = '#8a5a3c'; ctx.fillRect(o.x, CHAO - o.h, o.w, o.h);
        ctx.fillStyle = '#c08a5c'; ctx.beginPath(); ctx.ellipse(o.x + o.w, CHAO - o.h / 2, 5, o.h / 2, 0, 0, Math.PI * 2); ctx.fill();
      }
    }

    // Capivara
    const balanco = P.noChao && estado === 'jogando' && !semMovimento ? Math.sin(t * .5) * 1.5 : 0;
    const x = P.x, y = P.y + balanco;
    ctx.fillStyle = '#a0683f';
    ctx.beginPath(); ctx.ellipse(x + 20, y - 15, 22, 14, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + 40, y - 21, 11, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#7a4d2e'; ctx.fillRect(x + 46, y - 22, 6, 8); ctx.fillRect(x + 33, y - 32, 5, 5);
    ctx.fillStyle = '#1a1010'; ctx.fillRect(x + 42, y - 25, 3, 3);
    ctx.fillStyle = '#7a4d2e';
    const perna = P.noChao && !semMovimento ? Math.sin(t * .6) * 3 : 0;
    ctx.fillRect(x + 6 + perna, y - 4, 6, 6); ctx.fillRect(x + 28 - perna, y - 4, 6, 6);
  }

  function loop(ts) {
    const dt = Math.min(2.5, (ts - (ultimo || ts)) / 16.67); ultimo = ts;
    if (estado === 'jogando') atualizar(dt);
    desenhar();
    requestAnimationFrame(loop);
  }

  function correr() {
    $('menu').hidden = true; $('over').hidden = true;
    estado = 'jogando'; ultimo = 0;
    Ads.partidaComecou();
  }

  async function novaPartida() {
    $('menu').hidden = true; $('over').hidden = true;
    partidas++;
    if (partidas > 1 && (partidas - 1) % C.intersticialACada === 0) {
      estado = 'anuncio';
      await Ads.intersticial();
    }
    zerar();
    correr();
  }

  async function continuar() {
    $('over').hidden = true;
    estado = 'anuncio';
    const ganhou = await Ads.recompensado();
    if (!ganhou) { bater(); return; }
    continuacoes++;
    obstaculos = obstaculos.filter(o => o.x > P.x + 220);
    P.y = CHAO; P.vy = 0; P.noChao = true;
    correr();
  }

  $('startBtn').onclick = novaPartida;
  $('againBtn').onclick = novaPartida;
  $('rewardBtn').onclick = continuar;
  cv.addEventListener('pointerdown', e => { e.preventDefault(); pular(); });
  addEventListener('keydown', e => {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && estado === 'jogando') { e.preventDefault(); pular(); }
  });

  Textos.aplicar(navigator.language);
  Ads.iniciar().then(() => { if (Ads.idioma()) Textos.aplicar(Ads.idioma()); });
  requestAnimationFrame(loop);
})();
