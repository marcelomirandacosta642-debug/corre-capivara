// Camada de anúncios. O jogo só chama Ads.intersticial() e Ads.recompensado();
// aqui decidimos qual rede usar. Hoje: CrazyGames quando o jogo roda no site deles,
// e anúncios simulados em qualquer outro lugar. Depois entra o AdMob (Android).
window.Ads = (() => {
  let rede = 'simulado';
  let sdk = null;

  async function iniciar() {
    try {
      sdk = window.CrazyGames && window.CrazyGames.SDK;
      if (sdk) {
        await sdk.init();
        if (sdk.environment === 'crazygames' || sdk.environment === 'local') rede = 'crazygames';
      }
    } catch (e) {
      rede = 'simulado';
    }
    return rede;
  }

  // Avisa a rede quando a partida começa e para (o CrazyGames pede isso).
  function partidaComecou() { if (rede === 'crazygames') sdk.game.gameplayStart(); }
  function partidaParou() { if (rede === 'crazygames') sdk.game.gameplayStop(); }

  function pedirCrazyGames(tipo) {
    return new Promise(resolve => {
      sdk.ad.requestAd(tipo, {
        adStarted: () => {},
        adFinished: () => resolve(true),
        adError: () => resolve(false),
      });
    });
  }

  // Anúncio de mentira, para testar o fluxo sem rede real.
  function simulado(tipo) {
    return new Promise(resolve => {
      const tela = document.getElementById('fakeAd');
      const botao = document.getElementById('fakeAdClose');
      document.getElementById('fakeAdKind').textContent =
        tipo === 'rewarded' ? 'Anúncio recompensado (simulado)' : 'Anúncio intersticial (simulado)';
      let n = tipo === 'rewarded' ? 5 : 3;
      tela.hidden = false;
      botao.disabled = true;
      botao.textContent = 'Aguarde ' + n + 's';
      const timer = setInterval(() => {
        n--;
        if (n > 0) { botao.textContent = 'Aguarde ' + n + 's'; return; }
        clearInterval(timer);
        botao.disabled = false;
        botao.textContent = tipo === 'rewarded' ? 'Continuar' : 'Fechar';
        botao.focus();
      }, 1000);
      botao.onclick = () => { tela.hidden = true; resolve(true); };
    });
  }

  function mostrar(tipo) {
    return rede === 'crazygames' ? pedirCrazyGames(tipo) : simulado(tipo);
  }

  return {
    iniciar,
    partidaComecou,
    partidaParou,
    rede: () => rede,
    // Tela cheia entre partidas. Sempre termina, mesmo se o anúncio falhar.
    intersticial: () => mostrar('midgame'),
    // Retorna true só se o jogador assistiu até o fim e ganhou a recompensa.
    recompensado: () => mostrar('rewarded'),
  };
})();
