# GitHub Repository Search

Um aplicativo React para pesquisar repositórios públicos do GitHub usando a API oficial do GitHub.

## Características

- Interface de pesquisa limpa e intuitiva
- Filtros por nome de repositório, usuário/organização, linguagem e tópico
- Exibição detalhada dos resultados incluindo:
  - Nome e descrição do repositório
  - Data da última atualização
  - Contagem de estrelas e forks
  - Linguagem principal
  - Links diretos para o GitHub
- Estilização com Tailwind CSS
- Integração com a API pública de pesquisa do GitHub
- Estados de carregamento e tratamento de erros
- Paginação para resultados

## Tecnologias Utilizadas

- React
- TypeScript
- Tailwind CSS
- Octokit (SDK oficial do GitHub)
- Lucide React (ícones)

## Uso Ético e Privacidade

Este aplicativo utiliza apenas a API pública do GitHub e acessa somente dados que já são publicamente disponíveis. Nenhuma informação privada é coletada ou armazenada.

## Instalação e Execução

1. Clone o repositório
2. Instale as dependências com `npm install`
3. Execute o aplicativo com `npm start`

## Limitações da API do GitHub

A API de Pesquisa do GitHub tem limites de taxa. Para usuários não autenticados, o limite é de 10 requisições por minuto. Para obter limites maiores, você pode se autenticar usando um token pessoal do GitHub.

## Licença

MIT

