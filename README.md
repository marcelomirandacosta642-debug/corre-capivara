# Corre Capivara

Jogo de corrida infinita para navegador, feito para ganhar dinheiro com anúncios.

## Como jogar

Toque na tela, aperte espaço ou a seta para cima para pular os obstáculos. Quanto mais longe, mais rápido.

## Como testar no seu computador

Baixe o projeto e abra o arquivo `index.html` no navegador. Fora do CrazyGames os anúncios aparecem como "simulados", só para mostrar onde entram.

## Anúncios

- **Recompensado:** depois de bater, o jogador pode ver um anúncio para continuar. Vale uma vez por partida.
- **Intersticial:** tela cheia a cada 3 partidas, antes da próxima começar.

A escolha da rede fica em `src/ads.js`:
- No site do CrazyGames, usa os anúncios do próprio CrazyGames.
- Em qualquer outro lugar, mostra anúncios simulados.
- O AdMob (versão Android) entra numa próxima etapa.

## Idiomas

O jogo aparece em português para quem usa o navegador ou o CrazyGames em português, e em inglês para todo o resto (o CrazyGames exige inglês). Os textos ficam em `src/textos.js`.

## Enviar para o CrazyGames

O arquivo enviado é um .zip com `index.html`, `style.css` e a pasta `src`. As três capas exigidas ficam na pasta `capas`.

## Ajustes fáceis

Os números do jogo (velocidade, pulo, frequência dos anúncios) ficam em `src/config.js`.

## Arquivos

- `index.html`: a página do jogo
- `style.css`: aparência das telas
- `src/config.js`: ajustes do jogo
- `src/textos.js`: textos em português e inglês
- `src/ads.js`: anúncios
- `capas/`: imagens de capa para o CrazyGames
- `src/game.js`: lógica do jogo
