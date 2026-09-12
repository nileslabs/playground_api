import { siteConfig } from '@/config/site';

/** Actual product launch / first-publish date. Used as datePublished fallback for doc pages. */
const LAUNCH_DATE = '2025-09-01T00:00:00Z';

export function getWebApiSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: 'Playground API',
        alternateName: [
          'Playground Mock API',
          'PlaygroundAPI',
          'JSONPlaceholder Alternative with Persistence',
          'Stateful Mock REST & GraphQL Sandbox',
          'DummyJSON Alternative with JWT Auth',
          'Platzi Fake API Alternative',
          'Persistent Mock API for Frontend',
          'Free API Sandbox for React & Next.js',
          'Mock GraphQL Gateway Sandbox',
          'REST API Testing Sandbox for Playwright',
          'Zero Config Mock Backend for Developers',
        ],
        description: siteConfig.description,
        inLanguage: 'en-US',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteConfig.url}/docs?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${siteConfig.url}/#software`,
        name: 'Playground API',
        url: siteConfig.url,
        applicationCategory: 'DeveloperApplication',
        applicationSubCategory: 'Mock API & API Prototyping Sandbox',
        operatingSystem: 'Any (Web, Node.js, iOS, Android, Desktop)',
        description:
          'Free, zero-configuration, stateful mock REST and GraphQL API sandbox for frontend developers, mobile testing, and AI coding agents. Features persistent per-session mutation overlays, latency simulation, and JWT auth.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        featureList: [
          'Stateful CRUD Mutation Overlays',
          'Zero-Login Per-Session Isolation',
          'Dual Protocol REST & GraphQL Gateway',
          'Network Latency and HTTP Error Simulation',
          'JWT Auth Simulation with Protected Routes',
          'Dynamic Schema-less Custom Collections',
          'Deterministic SVG Avatar Generator',
          'Session Sandbox Snapshot Import and Export',
          'OpenAPI, Postman, Bruno, Insomnia, and TypeScript SDK Specs',
        ],
        author: {
          '@type': 'Person',
          name: siteConfig.author.name,
          url: siteConfig.author.website,
        },
        softwareVersion: '1.0.0',
        license: 'https://opensource.org/licenses/MIT',
      },
      {
        '@type': 'WebAPI',
        '@id': `${siteConfig.url}/#webapi`,
        name: 'Playground API (v1)',
        description: siteConfig.description,
        url: siteConfig.apiUrl,
        documentation: `${siteConfig.url}/docs`,
        termsOfService: `${siteConfig.url}/docs/introduction`,
      },
      {
        '@type': 'Organization',
        '@id': `${siteConfig.url}/#organization`,
        name: 'Playground API by Nilesh Kumar',
        url: siteConfig.url,
        logo: `${siteConfig.url}/favicon.svg`,
        sameAs: [
          'https://github.com/nileslabs/playground_api',
          'https://nileslabs.com',
        ],
      },
    ],
  };
}

export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getDocArticleSchema(params: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: params.title,
    description: params.description,
    url: params.url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': params.url,
    },
    datePublished: params.datePublished || LAUNCH_DATE,
    dateModified: params.dateModified || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.author.website,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/favicon.svg`,
      },
    },
    inLanguage: 'en-US',
  };
}

export function getApiReferenceSchema(params: {
  title: string;
  description: string;
  url: string;
  endpoints?: { method: string; path: string; description: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'APIReference',
    name: params.title,
    description: params.description,
    url: params.url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': params.url,
    },
    targetPlatform: 'Web, Node.js, Mobile',
    programmingLanguage: 'JavaScript, TypeScript, Swift, Kotlin, Python, Dart, cURL',
    hasPart: params.endpoints?.map((ep) => ({
      '@type': 'WebAPI',
      name: `${ep.method} ${ep.path}`,
      description: ep.description,
      url: `${siteConfig.apiUrl}${ep.path}`,
    })),
  };
}

export function getSoftwareDatasetSchema(params: {
  name: string;
  description: string;
  url: string;
  downloadUrl: string;
  fileFormat: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: params.name,
    description: params.description,
    url: params.url,
    codeRepository: siteConfig.githubUrl,
    programmingLanguage: params.fileFormat,
    targetProduct: {
      '@type': 'SoftwareApplication',
      name: 'Playground API',
      url: siteConfig.url,
    },
    downloadUrl: params.downloadUrl,
  };
}
