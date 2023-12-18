# MultiSnake

MultiSnake é um jogo multiplayer da cobrinha que roda em um site e se comunica com uma API WebSocket construída utilizando Node.js. Este projeto permite que múltiplos jogadores compitam entre si em um jogo clássico da cobrinha, onde controlam suas próprias cobras e tentam crescer enquanto evitam colisões com outras cobras.

## Funcionalidades
- **Jogabilidade Multiplayer:** Jogue com vários jogadores simultaneamente na mesma instância do jogo.
- **Comunicação em Tempo Real:** Utiliza a tecnologia WebSocket para garantir comunicação em tempo real entre os jogadores e o servidor.
- **Escalável e Responsivo:** Projetado para lidar com vários jogadores e se adaptar a diferentes tamanhos de tela para uma experiência de jogo ideal.
- **API WebSocket em Node.js:** API backend construída com Node.js e WebSocket para comunicação contínua entre o cliente do jogo e o servidor.

## Instalação
Para executar o jogo MultiSnake localmente, siga estes passos:

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/JoaoSantos2007/MultiSnake.git
   cd MultiSnake
   ```

2. **Instalar Dependências:**
   ```bash
   npm install
   ```

3. **Iniciar o Servidor:**
   ```bash
   npm start
   ```

4. **Acessar o Jogo:**
   Abra um navegador da web e vá para `http://localhost:3000` para jogar o jogo MultiSnake.

## Uso
- Ao acessar o jogo, os jogadores podem controlar suas cobras usando as teclas de seta ou controles designados.
- Os jogadores visam fazer suas cobras crescerem comendo alimentos enquanto evitam colisões com outras cobras e paredes.
- A interface do jogo exibe pontuações e informações relevantes sobre a jogabilidade em curso.

## Tecnologias Utilizadas
- HTML, CSS, JavaScript para a interface frontend.
- Node.js para lógica no servidor.
- WebSocket para comunicação em tempo real.

## Contribuição
Contribuições para o MultiSnake são bem-vindas! Sinta-se à vontade para abrir problemas (issues) ou enviar solicitações de alteração (pull requests) para contribuir para a melhoria do jogo.

## Autor
João Pedro Tomaz dos Santos - [JoaoSantos2007](https://github.com/JoaoSantos2007)

## Licença
Este projeto está licenciado sob a [Licença MIT](LICENSE).
