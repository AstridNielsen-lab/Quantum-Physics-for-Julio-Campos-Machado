import React from 'react';
import { BookOpen, ArrowLeft, Atom, Rocket, Brain, TestTube } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const BlogPage = () => {
  const posts = [
    {
      id: 1,
      title: 'Fundamentos dos Cristais Quânticos Iso-Carregados',
      date: '15 Mar 2024',
      author: 'Dr. Julio Campos Machado',
      excerpt: 'Uma análise profunda da estrutura atômica e propriedades fundamentais dos cristais quânticos iso-carregados.',
      icon: Atom,
      content: `
        Os Cristais Quânticos Iso-Carregados representam uma inovação revolucionária na física de materiais. 
        Sua estrutura única permite a manipulação precisa de campos eletromagnéticos em escala subatômica.

        Características Principais:
        • Estrutura cristalina com cargas elétricas perfeitamente balanceadas
        • Capacidade de modulação de campos quânticos
        • Alta estabilidade em condições extremas
        • Propriedades supercondutoras em temperatura ambiente

        A organização molecular destes cristais segue um padrão específico que maximiza 
        a eficiência na manipulação de campos eletromagnéticos, permitindo um controle 
        sem precedentes sobre as forças fundamentais da natureza.
      `
    },
    {
      id: 2,
      title: 'Propulsão Quântica: O Futuro da Exploração Espacial',
      date: '12 Mar 2024',
      author: 'Dr. Julio Campos Machado',
      excerpt: 'Como os cristais iso-carregados revolucionarão a propulsão espacial.',
      icon: Rocket,
      content: `
        O sistema de propulsão quântica baseado em cristais iso-carregados representa 
        uma ruptura completa com os métodos convencionais de propulsão espacial.

        Princípios de Funcionamento:
        • Manipulação de campos eletromagnéticos em nível quântico
        • Redução do arrasto quântico através de campos modulados
        • Geração de impulso através de interações subatômicas
        • Eficiência energética superior aos métodos convencionais

        Este sistema permite uma aceleração controlada e sustentável, 
        tornando viável a exploração do espaço profundo com eficiência 
        energética incomparável.
      `
    },
    {
      id: 3,
      title: 'Avanços na Pesquisa de Materiais Quânticos',
      date: '10 Mar 2024',
      author: 'Dr. Julio Campos Machado',
      excerpt: 'Últimas descobertas no desenvolvimento de materiais para propulsão quântica.',
      icon: TestTube,
      content: `
        Nossa pesquisa contínua em materiais quânticos tem revelado propriedades 
        surpreendentes que ampliam as possibilidades de aplicação em propulsão espacial.

        Descobertas Recentes:
        • Novos métodos de síntese de cristais iso-carregados
        • Aprimoramento da estabilidade em altas energias
        • Desenvolvimento de interfaces de controle quântico
        • Otimização da eficiência energética

        Estes avanços nos aproximam cada vez mais de uma revolução 
        na exploração espacial, tornando possível o que antes era 
        apenas ficção científica.
      `
    },
    {
      id: 4,
      title: 'Implicações Teóricas da Manipulação Quântica',
      date: '8 Mar 2024',
      author: 'Dr. Julio Campos Machado',
      excerpt: 'Análise das implicações teóricas da manipulação de campos quânticos.',
      icon: Brain,
      content: `
        A manipulação de campos quânticos através de cristais iso-carregados 
        nos leva a reconsiderar alguns princípios fundamentais da física.

        Considerações Teóricas:
        • Interação entre campos quânticos e gravidade
        • Efeitos da manipulação quântica no espaço-tempo
        • Conservação de energia em sistemas quânticos
        • Implicações para a teoria da relatividade

        Estas descobertas não apenas expandem nossa compreensão do universo, 
        mas também abrem novas possibilidades para tecnologias revolucionárias.
      `
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navigation />
      
      <main className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mb-12 flex items-center gap-3">
            <BookOpen className="text-violet-400" />
            Blog Técnico
          </h1>

          <div className="space-y-8">
            {posts.map(post => (
              <article
                key={post.id}
                className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 p-8 rounded-xl border border-violet-500/20"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-violet-500/10 rounded-lg">
                    <post.icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-violet-400 mb-2">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.author}</span>
                    </div>
                    <p className="text-gray-300 mb-6">
                      {post.excerpt}
                    </p>
                    <div className="prose prose-invert max-w-none">
                      {post.content.split('\n\n').map((paragraph, index) => (
                        <div key={index} className="mb-4">
                          {paragraph.includes('•') ? (
                            <ul className="space-y-2 text-gray-300">
                              {paragraph.split('\n').map((line, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  {line.startsWith('•') && (
                                    <>
                                      <span className="text-violet-400">•</span>
                                      <span>{line.slice(2)}</span>
                                    </>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-300">{paragraph}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-violet-950/30 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>© 2024 Julio Campos Machado - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;