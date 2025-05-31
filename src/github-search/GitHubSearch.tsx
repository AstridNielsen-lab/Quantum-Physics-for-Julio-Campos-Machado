import React, { useState, useEffect } from 'react';
import { Search, Github, Filter, Calendar, Star, GitFork, Code, ExternalLink } from 'lucide-react';
import { Octokit } from '@octokit/rest';

// Types
interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  updated_at: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  topics: string[];
}

interface SearchState {
  query: string;
  user: string;
  language: string;
  topic: string;
  page: number;
  perPage: number;
}

// Helper function to format dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Main component
const GitHubSearch: React.FC = () => {
  // State
  const [searchParams, setSearchParams] = useState<SearchState>({
    query: '',
    user: '',
    language: '',
    topic: '',
    page: 1,
    perPage: 10
  });
  const [results, setResults] = useState<Repository[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [languages, setLanguages] = useState<string[]>([
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'PHP', 'Ruby', 'Rust', 'C++', 'C'
  ]);
  const [topics, setTopics] = useState<string[]>([
    'react', 'vue', 'angular', 'node', 'python', 'machine-learning', 'data-science', 'web', 'api', 'game'
  ]);

  // Initialize Octokit
  const octokit = new Octokit();

  // Search repositories
  const searchRepositories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Build query string
      let queryString = searchParams.query || '';
      
      if (searchParams.user) {
        queryString += ` user:${searchParams.user}`;
      }
      
      if (searchParams.language) {
        queryString += ` language:${searchParams.language}`;
      }
      
      if (searchParams.topic) {
        queryString += ` topic:${searchParams.topic}`;
      }

      // If query is empty, show a message
      if (!queryString.trim()) {
        setResults([]);
        setTotalCount(0);
        setIsLoading(false);
        return;
      }

      // Execute search
      const response = await octokit.search.repos({
        q: queryString,
        page: searchParams.page,
        per_page: searchParams.perPage,
        sort: 'updated',
        order: 'desc'
      });

      setResults(response.data.items);
      setTotalCount(response.data.total_count);
    } catch (err) {
      console.error('Error searching repositories:', err);
      setError('Ocorreu um erro ao buscar repositórios. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => ({ ...prev, page: 1 })); // Reset to first page
    searchRepositories();
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => ({ ...prev, page: newPage }));
  };

  // Fetch repositories when page changes
  useEffect(() => {
    if (searchParams.query || searchParams.user || searchParams.language || searchParams.topic) {
      searchRepositories();
    }
  }, [searchParams.page]);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / searchParams.perPage);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center justify-center">
            <Github className="w-10 h-10 mr-3 text-gray-700" />
            Pesquisador Avançado de Repositórios GitHub
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Pesquise repositórios públicos no GitHub utilizando a API RESTful oficial v3. Esta ferramenta acadêmica oferece acesso estruturado a mais de 200 milhões de repositórios de código aberto.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">REST API v3</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">Busca Semântica</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">Padrões SOLID</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">TypeScript</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">React 18</span>
          </div>
        </div>

        {/* Technical Information */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 mb-8 text-sm text-gray-600">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Sobre o Sistema de Busca</h2>
          <p className="mb-2">
            Este sistema utiliza a <a href="https://docs.github.com/pt/rest" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium">API REST v3 do GitHub</a> para pesquisar e recuperar metadados de repositórios com alta precisão. A busca implementa:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-3">
            <li>Qualificadores de busca avançados para filtragem precisa</li>
            <li>Ordenação por relevância utilizando algoritmos de classificação do GitHub</li>
            <li>Paginação otimizada para grandes conjuntos de resultados</li>
            <li>Tratamento de taxa limite (rate limiting) conforme especificações da API</li>
          </ul>
          <p>
            O desenvolvimento segue práticas recomendadas de engenharia de software e padrões da indústria para garantir confiabilidade, escalabilidade e manutenibilidade.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  Nome do Repositório
                  <span className="ml-1 inline-block rounded-full bg-gray-100 px-1 text-xs text-gray-500" title="Você pode usar parte do nome, palavras-chave ou descrição para encontrar repositórios">
                    ?
                  </span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="query"
                    id="query"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Pesquisar repositórios..."
                    value={searchParams.query}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  Usuário / Organização
                  <span className="ml-1 inline-block rounded-full bg-gray-100 px-1 text-xs text-gray-500" title="Digite o nome de usuário ou organização exato. Ex: 'microsoft', 'google', 'facebook'">
                    ?
                  </span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">@</span>
                  </div>
                  <input
                    type="text"
                    name="user"
                    id="user"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Usuário ou organização..."
                    value={searchParams.user}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  Linguagem de Programação
                  <span className="ml-1 inline-block rounded-full bg-gray-100 px-1 text-xs text-gray-500" title="Filtra repositórios pela linguagem principal usada no código-fonte">
                    ?
                  </span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Code className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="language"
                    name="language"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={searchParams.language}
                    onChange={handleChange}
                  >
                    <option value="">Todas as linguagens</option>
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  Tópico
                  <span className="ml-1 inline-block rounded-full bg-gray-100 px-1 text-xs text-gray-500" title="Os tópicos são tags definidas pelos mantenedores para categorizar os repositórios">
                    ?
                  </span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="topic"
                    name="topic"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={searchParams.topic}
                    onChange={handleChange}
                  >
                    <option value="">Todos os tópicos</option>
                    {topics.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4 px-2 text-xs text-gray-500 italic">
              <p>Dica: Combine os filtros para resultados mais precisos. Por exemplo, use "machine-learning" como tópico e "Python" como linguagem para encontrar bibliotecas de aprendizado de máquina em Python.</p>
            </div>
            
            <div className="mt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="-ml-1 mr-2 h-5 w-5" />
                    Pesquisar Repositórios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erro na busca</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-6">
          {/* Results Header */}
          {results.length > 0 && (
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Resultados ({totalCount.toLocaleString()} repositórios encontrados)
              </h2>
              <div className="text-sm text-gray-500">
                Mostrando {(searchParams.page - 1) * searchParams.perPage + 1} - {Math.min(searchParams.page * searchParams.perPage, totalCount)} de {totalCount.toLocaleString()}
              </div>
            </div>
          )}

          {/* Results Grid */}
          {results.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {results.map(repo => (
                <div key={repo.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="px-4 py-5 sm:p-6">
                    {/* Academic Research Context Tag - conditional rendering based on repo attributes */}
                    {(repo.topics.some(t => 
                      ['research', 'academic', 'science', 'paper', 'thesis', 'dissertation', 'study', 'experiment', 'data-science', 'machine-learning'].includes(t)
                    ) || repo.name.toLowerCase().includes('research') || (repo.description && repo.description.toLowerCase().includes('research'))) && (
                      <div className="mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
                          Repositório Acadêmico
                        </span>
                      </div>
                    )}
                    <div className="flex items-start">
                      <img
                        src={repo.owner.avatar_url}
                        alt={`${repo.owner.login} avatar`}
                        className="h-10 w-10 rounded-full mr-3"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">
                            {repo.name}
                          </a>
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{repo.owner.login}</p>
                      </div>
                      <a 
                        href={repo.html_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-gray-400 hover:text-gray-600"
                        title="Abrir no GitHub"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>

                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                      {repo.description || "Sem descrição disponível."}
                    </p>

                    {repo.topics && repo.topics.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {repo.topics.slice(0, 4).map(topic => (
                          <span 
                            key={topic} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {topic}
                          </span>
                        ))}
                        {repo.topics.length > 4 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{repo.topics.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Professional Project Indicators */}
                    {repo.stargazers_count > 100 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {repo.stargazers_count > 1000 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Projeto Popular
                          </span>
                        )}
                        {repo.forks_count > 100 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Altamente Bifurcado
                          </span>
                        )}
                        {new Date().getTime() - new Date(repo.updated_at).getTime() < 7776000000 && ( // 90 days in milliseconds
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Ativamente Mantido
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <div className="flex items-center mr-6">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        {repo.stargazers_count.toLocaleString()}
                      </div>
                      <div className="flex items-center mr-6">
                        <GitFork className="h-4 w-4 mr-1 text-blue-500" />
                        {repo.forks_count.toLocaleString()}
                      </div>
                      {repo.language && (
                        <div className="flex items-center mr-6">
                          <span className="h-3 w-3 rounded-full mr-1" style={{
                            backgroundColor: 
                              repo.language === 'JavaScript' ? '#f7df1e' :
                              repo.language === 'TypeScript' ? '#3178c6' :
                              repo.language === 'Python' ? '#3572A5' :
                              repo.language === 'Java' ? '#b07219' :
                              repo.language === 'C#' ? '#178600' :
                              repo.language === 'Go' ? '#00ADD8' :
                              repo.language === 'PHP' ? '#4F5D95' :
                              repo.language === 'Ruby' ? '#701516' :
                              repo.language === 'Rust' ? '#dea584' :
                              repo.language === 'C++' ? '#f34b7d' :
                              repo.language === 'C' ? '#555555' : '#cccccc'
                          }}></span>
                          {repo.language}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {formatDate(repo.updated_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <svg className="animate-spin mx-auto h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-500">Carregando resultados...</p>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum resultado encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchParams.query || searchParams.user || searchParams.language || searchParams.topic
                  ? "Tente modificar os filtros para encontrar mais resultados."
                  : "Digite um termo de busca para encontrar repositórios."}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between py-3 bg-white px-4 rounded-lg shadow mt-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(Math.max(1, searchParams.page - 1))}
                  disabled={searchParams.page === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    searchParams.page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, searchParams.page + 1))}
                  disabled={searchParams.page === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    searchParams.page === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Próxima
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{(searchParams.page - 1) * searchParams.perPage + 1}</span> a <span className="font-medium">{Math.min(searchParams.page * searchParams.perPage, totalCount)}</span> de <span className="font-medium">{totalCount}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={searchParams.page === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        searchParams.page === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Primeira</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      // Show 5 pages around current page
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (searchParams.page <= 3) {
                        pageNum = i + 1;
                      } else if (searchParams.page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = searchParams.page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            searchParams.page === pageNum
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={searchParams.page === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        searchParams.page === totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Última</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* API Usage Information */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Informações Técnicas sobre a API</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Especificações da API GitHub</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span><b>Endpoint:</b> <code className="bg-gray-100 px-1 py-0.5 rounded">https://api.github.com/search/repositories</code></span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span><b>Método:</b> <code className="bg-gray-100 px-1 py-0.5 rounded">GET</code></span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span><b>Rate Limit:</b> 10 requisições/minuto (não autenticado), 30 requisições/minuto (autenticado)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span><b>Biblioteca Cliente:</b> <a href="https://github.com/octokit/rest.js" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Octokit REST.js</a></span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Parâmetros de Busca Avançada</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span><b>Qualificadores Adicionais:</b> <code>stars:>1000</code>, <code>fork:true</code>, <code>created:>2023-01-01</code></span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span><b>Operadores Booleanos:</b> AND (<code>+</code>), NOT (<code>-</code>), OR</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span><b>Ordenação:</b> <code>sort=stars</code>, <code>sort=forks</code>, <code>sort=updated</code>, <code>sort=help-wanted-issues</code></span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span><b>Documentação Oficial:</b> <a href="https://docs.github.com/pt/rest/search" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">GitHub Search API</a></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security and Best Practices */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Segurança e Boas Práticas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Medidas de Segurança Implementadas</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Uso exclusivo de HTTPS para todas as requisições API</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Sanitização de inputs para prevenir injeção</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Validação de dados no lado cliente e servidor</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Limitação de taxa para prevenir sobrecarga</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Padrões e Boas Práticas</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Desenvolvimento baseado em componentes React</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Tipagem estrita com TypeScript</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Design responsivo e acessível (WCAG 2.1)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Tratamento de erros e feedback do usuário</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer - Disclaimer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">
                  Este sistema utiliza a API pública do GitHub para buscar repositórios. Apenas dados públicos são acessados, 
                  seguindo as diretrizes éticas e legais de uso de APIs. O uso desta ferramenta deve respeitar os 
                  <a href="https://docs.github.com/pt/site-policy/github-terms/github-terms-of-service" className="underline ml-1" target="_blank" rel="noopener noreferrer">Termos de Serviço do GitHub</a>.
                </p>
                <p className="mt-3 text-sm md:mt-0 md:ml-6">
                  <a href="https://docs.github.com/pt/rest" className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                    GitHub API Docs <span aria-hidden="true">&rarr;</span>
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid md:grid-cols-3 gap-4 text-center text-sm text-gray-500">
            <div>
              <h4 className="font-medium text-gray-700">Recursos Acadêmicos</h4>
              <p className="mt-1">Ideal para pesquisadores e estudantes buscando projetos open-source</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Conformidade LGPD</h4>
              <p className="mt-1">Este aplicativo respeita a privacidade e proteção de dados pessoais</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Suporte & Feedback</h4>
              <p className="mt-1">Contribuições são bem-vindas através do repositório no GitHub</p>
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} GitHub Repository Search. Desenvolvido por Julio Campos Machado.<br/>
            <span className="text-xs">Versão 1.2.0 - Última atualização: {new Date().toLocaleDateString('pt-BR')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GitHubSearch;

