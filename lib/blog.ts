export interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  author: {
    name: string
    avatar: string
  }
  coverImage: string
  category: string
  tags: string[]
  readingTime: string
}

export interface Category {
  slug: string
  name: string
  description: string
  postCount: number
}

// Mock blog posts data
export const posts: Post[] = [
  {
    slug: "começando-com-nextjs-16-guia-completo",
    title: "Começando com Next.js 16: Um Guia Completo",
    excerpt:
      "Aprenda como construir aplicações web modernas com Next.js 16, incluindo os recursos mais recentes como Turbopack e cache aprimorado.",
    content: `Next.js 16 traz novas funcionalidades emocionantes que tornam a construção de aplicações web mais rápida e eficiente. Neste guia completo, exploraremos as principais melhorias e como aproveitá-las em seus projetos.
## O que há de novo no Next.js 16

O Next.js 16 introduz várias funcionalidades revolucionárias:

- **Turbopack como Padrão**: O novo bundler agora é estável e fornece tempos de build significativamente mais rápidos
- **APIs de Cache Aprimoradas**: Melhor controle sobre o cache de dados com revalidateTag e updateTag
- **Suporte ao React 19**: Suporte completo para os recursos mais recentes do React
- **Performance Aprimorada**: Otimizações em todos os aspectos para carregamentos de página mais rápidos

## Começando

Para criar um novo projeto Next.js 16, simplesmente execute:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

Isso configurará um novo projeto com todos os recursos mais recentes habilitados por padrão.

## Principais Recursos para Explorar

### Componentes do Servidor
Os Componentes do Servidor são a base das aplicações modernas Next.js. Eles permitem renderizar componentes no servidor, reduzindo o JavaScript do lado do cliente e melhorando a performance.

### App Router
O App Router fornece um sistema de roteamento baseado em arquivos poderoso com suporte para layouts, estados de carregamento e limites de erro.

### Busca de Dados
O Next.js 16 torna a busca de dados simples com Componentes do Servidor assíncronos e as novas APIs de cache.

## Conclusão

O Next.js 16 é uma versão significativa que torna a construção de aplicações web mais agradável e eficiente. Comece a explorar esses recursos hoje!`,
    date: "2025-01-10",
    author: {
      name: "Sarah Johnson",
      avatar: "/professional-woman-developer.png",
    },
    coverImage: "/nextjs-coding-dashboard-modern-blue.jpg",
    category: "web-development",
    tags: ["Next.js", "React", "Web Development"],
    readingTime: "8 min read",
  },
  {
    slug: "melhores-praticas-typescript-2025",
    title: "Melhores Práticas de TypeScript para 2025",
    excerpt:
      "Descubra os padrões e práticas mais recentes do TypeScript que tornarão seu código mais mantível e seguro.",
    content: `TypeScript se tornou o padrão de facto para construir aplicações JavaScript de grande escala. Vamos explorar as melhores práticas que ajudarão você a escrever um código TypeScript melhor em 2025.
## Segurança de Tipos em Primeiro Lugar

Sempre priorize a segurança de tipos em seus projetos TypeScript. Use o modo estrito e evite tipos 'any' sempre que possível.

## Tipos Utilitários

O TypeScript fornece tipos utilitários poderosos que podem ajudá-lo a escrever código mais conciso e expressivo:

- **Pick**: Selecione propriedades específicas de um tipo
- **Omit**: Exclua propriedades específicas de um tipo
- **Partial**: Torne todas as propriedades opcionais
- **Required**: Torne todas as propriedades obrigatórias

## Genéricos

Domine os genéricos para escrever código reutilizável e seguro para tipos. Os genéricos permitem criar componentes e funções que funcionam com múltiplos tipos.

## Conclusão

Seguir essas melhores práticas ajudará você a escrever código TypeScript mais mantível e confiável.`,
    date: "2025-01-08",
    author: {
      name: "Michael Chen",
      avatar: "/professional-man-developer-asian.jpg",
    },
    coverImage: "/typescript-code-editor-dark-theme.jpg",
    category: "programming",
    tags: ["TypeScript", "JavaScript", "Best Practices"],
    readingTime: "6 min read",
  },
  {
    slug: "tecnicas-modernas-css-que-voce-deve-conhecer",
    title: "Técnicas Modernas de CSS Que Você Deve Conhecer",
    excerpt:
      "De queries de container até Grid CSS, explore as técnicas modernas de CSS que transformarão a forma como você constrói layouts.",
    content: `CSS evoluiu significativamente nos últimos anos. Vamos explorar as técnicas modernas que ajudarão você a criar melhores interfaces de usuário.
## Queries de Container

As queries de container permitem estilizar elementos com base no tamanho de seu container, não apenas da viewport. Isso é uma mudança revolucionária para o design baseado em componentes.

## CSS Grid

O CSS Grid fornece um sistema de layout bidimensional poderoso. Combinado com Flexbox, você pode criar qualquer layout imaginável.

## Propriedades Personalizadas

As propriedades personalizadas do CSS (variáveis) permitem criar designs mantíveis e tematizáveis.

## Seletores Modernos

Novos seletores CSS como :has(), :is() e :where() fornecem mais poder e flexibilidade em suas folhas de estilo.

## Conclusão

Essas técnicas modernas de CSS ajudarão você a construir interfaces de usuário mais mantíveis e responsivas.`,
    date: "2025-01-05",
    author: {
      name: "Emily Rodriguez",
      avatar: "/professional-woman-designer-latina.jpg",
    },
    coverImage: "/css-grid-layout-colorful-modern.jpg",
    category: "design",
    tags: ["CSS", "Design", "Web Development"],
    readingTime: "7 min read",
  },
  {
    slug: "react-server-components-explicado",
    title: "React Server Components Explicado",
    excerpt: "Entenda como os React Server Components funcionam e por que são revolucionários para construir aplicações web.",
    content: `Os React Server Components representam uma mudança fundamental em como construímos aplicações React. Vamos mergulhar fundo em como eles funcionam.

## O que são Componentes do Servidor?

Os Componentes do Servidor são componentes React que executam exclusivamente no servidor. Eles permitem construir UIs intensivas em dados sem enviar JavaScript para o cliente.

## Benefícios

- **Tamanho de Bundle Zero**: Os Componentes do Servidor não adicionam ao seu bundle do lado do cliente
- **Acesso Direto ao Backend**: Acesse bancos de dados e APIs diretamente sem criar rotas de API
- **Divisão Automática de Código**: Apenas componentes do cliente são enviados para o navegador

## Quando Usar Componentes do Servidor

Use Componentes do Servidor para:
- Busca de dados
- Acesso a recursos do backend
- Manter informações sensíveis no servidor

## Componentes do Cliente

Os Componentes do Cliente são necessários para:
- Interatividade e manipuladores de eventos
- APIs apenas do navegador
- Estado e efeitos

## Conclusão

Os Componentes do Servidor são o futuro do desenvolvimento React, permitindo melhor performance e experiência do desenvolvedor.`,
    date: "2025-01-03",
    author: {
      name: "David Park",
      avatar: "/professional-man-developer-korean.jpg",
    },
    coverImage: "/react-components-server-architecture-diagram.jpg",
    category: "web-development",
    tags: ["React", "Server Components", "Next.js"],
    readingTime: "10 min read",
  },
  {
    slug: "acessibilidade-web-guia-completo",
    title: "Guia Completo de Acessibilidade Web",
    excerpt: "Aprenda como tornar seus websites acessíveis a todos com dicas práticas e técnicas.",
    content: `A acessibilidade web garante que todos, independentemente de suas habilidades, possam usar seu website. Aqui está um guia completo para criar aplicações web acessíveis.

## Por Que A Acessibilidade Importa

A acessibilidade não é apenas sobre conformidade—é sobre criar melhores experiências para todos os usuários.

## HTML Semântico

Use elementos HTML semânticos como <nav>, <main>, <article> e <aside> para fornecer estrutura e significado ao seu conteúdo.

## Atributos ARIA

Os atributos ARIA (Accessible Rich Internet Applications) aprimoram a acessibilidade de conteúdo dinâmico e controles personalizados.

## Navegação por Teclado

Garanta que todos os elementos interativos sejam acessíveis por teclado. Os usuários devem poder navegar em seu site sem um mouse.

## Contraste de Cor

Mantenha contraste de cor suficiente entre texto e fundos para garantir a legibilidade para usuários com deficiências visuais.

## Teste

Use ferramentas como axe DevTools e leitores de tela para testar a acessibilidade do seu website.

## Conclusão

Construir websites acessíveis é essencial para criar experiências digitais inclusivas.`,
    date: "2025-01-01",
    author: {
      name: "Jennifer Williams",
      avatar: "/professional-woman-developer-accessibility.jpg",
    },
    coverImage: "/accessibility-symbols-universal-design.jpg",
    category: "design",
    tags: ["Accessibility", "Web Development", "UX"],
    readingTime: "9 min read",
  },
  {
    slug: "construindo-apis-escalaveis-com-nodejs",
    title: "Construindo APIs Escaláveis com Node.js",
    excerpt: "Melhores práticas para projetar e implementar APIs que conseguem lidar com crescimento e escala de forma eficiente.",
    content: `Construir APIs escaláveis requer planejamento e implementação cuidadosos. Vamos explorar as melhores práticas para criar APIs que podem crescer com sua aplicação.

## Princípios de Design de API

Siga convenções RESTful e use padrões de nomenclatura consistentes. Projete sua API com versionamento em mente desde o início.

## Autenticação e Segurança

Implemente autenticação robusta usando tokens JWT ou OAuth. Sempre use HTTPS e valide todas as entradas.

## Limitação de Taxa

Proteja sua API contra abuso implementando limitação de taxa. Isso garante uso justo e previne sobrecarga.

## Estratégias de Cache

Use cache efetivamente para reduzir a carga do banco de dados e melhorar os tempos de resposta. Considere Redis para cache distribuído.

## Tratamento de Erros

Forneça mensagens de erro claras e consistentes com códigos de status HTTP apropriados. Registre erros para depuração e monitoramento.

## Documentação

Crie documentação abrangente da API usando ferramentas como Swagger ou Postman. Boa documentação é crucial para a adoção da API.

## Monitoramento e Análises

Implemente monitoramento para rastrear performance da API, erros e padrões de uso. Use esses dados para otimizar e escalar.

## Conclusão

Seguir essas práticas ajudará você a construir APIs que são confiáveis, seguras e prontas para escalar.`,
    date: "2024-12-28",
    author: {
      name: "Alex Turner",
      avatar: "/professional-developer-backend.jpg",
    },
    coverImage: "/api-architecture-diagram-cloud-infrastructure.jpg",
    category: "programming",
    tags: ["API", "Node.js", "Backend Development"],
    readingTime: "11 min read",
  },
]

export const categories: Category[] = [
  {
    slug: "web-development",
    name: "Desenvolvimento Web",
    description: "Tutoriais modernos de desenvolvimento web, frameworks e melhores práticas",
    postCount: posts.filter((p) => p.category === "web-development").length,
  },
  {
    slug: "programming",
    name: "Programação",
    description: "Linguagens de programação, algoritmos e engenharia de software",
    postCount: posts.filter((p) => p.category === "programming").length,
  },        
  {
    slug: "design",
    name: "Design",
    description: "Design UI/UX, técnicas CSS e princípios de design visual",
    postCount: posts.filter((p) => p.category === "design").length,
  },
]

export function getAllPosts(): Post[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return posts
    .filter((post) => post.category === categorySlug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllCategories(): Category[] {
  return categories
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug)
}

export function getRelatedPosts(currentSlug: string, limit = 3): Post[] {
  const currentPost = getPostBySlug(currentSlug)
  if (!currentPost) return []

  return posts
    .filter(
      (post) =>
        post.slug !== currentSlug &&
        (post.category === currentPost.category || post.tags.some((tag) => currentPost.tags.includes(tag))),
    )
    .slice(0, limit)
}
