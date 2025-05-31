# GitHub Repository Search

Um aplicativo React avançado para pesquisar e analisar repositórios públicos do GitHub utilizando a API oficial GitHub REST v3.

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![GitHub API](https://img.shields.io/badge/GitHub_API-v3-181717?logo=github)](https://docs.github.com/pt/rest)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Visão Geral

Este aplicativo foi desenvolvido como uma ferramenta de pesquisa acadêmica e profissional para explorar repositórios de código aberto no GitHub. Combinando uma interface moderna com recursos de busca avançados, permite aos usuários localizar, filtrar e analisar projetos de código com eficiência.

![Screenshot da aplicação](https://via.placeholder.com/800x450.png?text=GitHub+Repository+Search+Screenshot)

## 📋 Características

### Interface e Design
- Design moderno e responsivo implementado com Tailwind CSS
- Interface intuitiva e amigável seguindo princípios de UX/UI
- Suporte a temas claro e escuro (detecção automática de preferência do sistema)
- Componentes acessíveis seguindo diretrizes WCAG 2.1

### Funcionalidades de Busca
- **Pesquisa Multi-critério:**
  - Por nome de repositório com busca semântica
  - Por usuário ou organização específica
  - Por linguagem de programação principal
  - Por tópicos associados ao repositório
- **Filtros Avançados:**
  - Combinação de múltiplos critérios simultaneamente
  - Ordenação por relevância, popularidade ou atualização
  - Exclusão de forks ou projetos arquivados (opcional)

### Visualização de Resultados
- Exibição detalhada das informações de cada repositório:
  - Nome e descrição completa
  - Data da última atualização (formatada)
  - Estatísticas: estrelas, forks, issues abertas
  - Linguagem principal com indicadores visuais
  - Tópicos associados e tags
  - Links diretos para o repositório no GitHub
- Indicadores de qualidade e relevância:
  - Tags para projetos acadêmicos/científicos
  - Indicação de projetos populares ou bem mantidos
  - Métricas de atividade da comunidade

### Recursos Técnicos
- Integração completa com a API REST v3 do GitHub
- Paginação eficiente para grandes conjuntos de resultados
- Tratamento de erros robusto com feedback visual
- Estados de carregamento com animações
- Tratamento inteligente de limites de taxa (rate limiting)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18**: Biblioteca JavaScript para construção de interfaces
- **TypeScript**: Superset tipado de JavaScript para maior robustez
- **Tailwind CSS**: Framework CSS utilitário para design responsivo
- **Lucide React**: Biblioteca de ícones SVG modernos
- **React Hooks**: Para gerenciamento de estado e efeitos colaterais

### Integração com API
- **Octokit/rest.js**: SDK oficial do GitHub para JavaScript/TypeScript
- **Fetch API**: Para requisições HTTP quando necessário
- **REST API v3**: Integração com a API REST oficial do GitHub

### Qualidade de Código
- **ESLint**: Análise estática para identificar problemas
- **Prettier**: Formatação consistente de código
- **TypeScript**: Tipagem estática para prevenção de erros

## 📊 Casos de Uso

Este aplicativo é especialmente útil para:

1. **Pesquisadores Acadêmicos**: Localizar implementações de algoritmos, datasets e papers com código
2. **Desenvolvedores**: Encontrar bibliotecas e frameworks para uso em projetos
3. **Estudantes**: Descobrir projetos educativos e exemplos de código em diversas linguagens
4. **Recrutadores**: Identificar projetos relevantes de candidatos
5. **Entusiastas de Open Source**: Explorar projetos para contribuição

## 🔒 Segurança e Ética

Este aplicativo foi desenvolvido com foco em:

- **Privacidade de Dados**: Acessa apenas dados públicos disponíveis na API do GitHub
- **Uso Responsável de API**: Respeita limites de taxa e diretrizes do GitHub
- **Transparência**: Código-fonte aberto para auditoria
- **Conformidade**: Segue os Termos de Serviço do GitHub e diretrizes LGPD

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js (v14.0.0 ou superior)
- npm (v6.0.0 ou superior) ou yarn (v1.22.0 ou superior)

### Passos para instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/github-repository-search.git
cd github-repository-search
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. (Opcional) Configure um token pessoal do GitHub:
   - Crie um arquivo `.env.local` na raiz do projeto
   - Adicione: `REACT_APP_GITHUB_TOKEN=seu_token_pessoal`

4. Execute o aplicativo em modo de desenvolvimento:
```bash
npm start
# ou
yarn start
```

5. Para build de produção:
```bash
npm run build
# ou
yarn build
```

## 🔍 API e Consultas Avançadas

### Qualificadores de Pesquisa Suportados

O aplicativo suporta os seguintes qualificadores na API de pesquisa do GitHub:

| Qualificador | Exemplo | Descrição |
|--------------|---------|-----------|
| `user:` | `user:microsoft` | Repositórios pertencentes a um usuário específico |
| `org:` | `org:facebook` | Repositórios pertencentes a uma organização |
| `language:` | `language:typescript` | Repositórios escritos principalmente em uma linguagem |
| `topic:` | `topic:machine-learning` | Repositórios marcados com um tópico específico |
| `stars:` | `stars:>1000` | Repositórios com determinado número de estrelas |
| `created:` | `created:>2023-01-01` | Repositórios criados após uma data |
| `pushed:` | `pushed:>2023-01-01` | Repositórios atualizados após uma data |

Para consultas mais avançadas, consulte a [documentação oficial de busca do GitHub](https://docs.github.com/pt/search-github/searching-on-github/searching-for-repositories).

## 📝 Limitações da API do GitHub

A API de Pesquisa do GitHub possui as seguintes limitações:

- **Usuários não autenticados**: 10 requisições por minuto
- **Usuários autenticados**: 30 requisições por minuto
- **Resultados por página**: Máximo de 100
- **Resultados totais**: Máximo de 1.000 resultados

O aplicativo implementa:
- Tratamento inteligente de limites de taxa
- Feedback visual quando os limites são atingidos
- Suporte opcional para autenticação com token pessoal

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit de suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

Por favor, siga as boas práticas de código e adicione testes quando aplicável.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato e Suporte

Para dúvidas, sugestões ou problemas, abra uma issue no repositório do GitHub ou entre em contato com o mantenedor do projeto.

---

Desenvolvido com ❤️ por Julio Campos Machado

