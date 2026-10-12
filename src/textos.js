// Textos do jogo em cada idioma. O CrazyGames exige inglês; quem tem o
// navegador ou a conta em português vê tudo em português.
// Para adicionar um idioma, copie o bloco "en" e traduza.
window.Textos = (() => {
  const idiomas = {
    pt: {
      recorde: 'recorde',
      instrucoes: 'Toque na tela, aperte espaço ou seta para cima para pular.',
      comecar: 'Começar',
      bateu: 'Bateu!',
      voceFez: 'Você fez',
      pontos: 'pontos.',
      continuarAnuncio: '▶ Ver anúncio e continuar',
      jogarDeNovo: 'Jogar de novo',
      anuncioRecompensado: 'Anúncio recompensado (simulado)',
      anuncioIntersticial: 'Anúncio intersticial (simulado)',
      aguarde: 'Aguarde',
      continuar: 'Continuar',
      fechar: 'Fechar',
    },
    en: {
      recorde: 'best',
      instrucoes: 'Tap the screen, press space or the up arrow to jump.',
      comecar: 'Start',
      bateu: 'Crashed!',
      voceFez: 'You scored',
      pontos: 'points.',
      continuarAnuncio: '▶ Watch an ad to continue',
      jogarDeNovo: 'Play again',
      anuncioRecompensado: 'Rewarded ad (simulated)',
      anuncioIntersticial: 'Interstitial ad (simulated)',
      aguarde: 'Wait',
      continuar: 'Continue',
      fechar: 'Close',
    },
  };
  let atual = idiomas.en;

  // Recebe algo como "pt-BR" ou "en-US"; se não houver tradução, usa inglês.
  function aplicar(codigo) {
    const base = String(codigo || 'en').slice(0, 2).toLowerCase();
    atual = idiomas[base] || idiomas.en;
    document.documentElement.lang = idiomas[base] ? base : 'en';
    document.querySelectorAll('[data-t]').forEach(el => { el.textContent = t(el.dataset.t); });
  }

  function t(chave) { return atual[chave] || idiomas.en[chave] || chave; }

  return { aplicar, t };
})();
