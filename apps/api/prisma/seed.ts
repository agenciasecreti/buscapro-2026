import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Seed de demonstração do BuscaPRO.
 *
 * Determinístico e idempotente: todos os registros usam IDs estáveis e
 * `createMany({ skipDuplicates: true })`, então rodar várias vezes não
 * duplica nada e não exige limpar o banco.
 *
 * Volume: 12 categorias · 20 prestadores · 15 clientes · 40 serviços · 80
 * avaliações · localizações reais (PB / PE / RN).
 */

// Data de referência fixa — mantém createdAt determinístico e "recente".
const BASE = new Date('2026-05-10T12:00:00.000Z');
const daysAgo = (n: number): Date =>
  new Date(BASE.getTime() - n * 24 * 60 * 60 * 1000);

const pad = (n: number, size = 2): string => String(n).padStart(size, '0');

const slugify = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/(^\.|\.$)/g, '');

const avatar = (n: number): string =>
  `https://i.pravatar.cc/300?img=${(n % 70) + 1}`;

const serviceImage = (id: string): string =>
  `https://picsum.photos/seed/buscapro-${id}/800/450`;

// ---------------------------------------------------------------------------
// Categorias
// ---------------------------------------------------------------------------

const categories = [
  { slug: 'eletricista', name: 'Eletricista' },
  { slug: 'encanador', name: 'Encanador' },
  { slug: 'diarista', name: 'Diarista' },
  { slug: 'pintor', name: 'Pintor' },
  { slug: 'tecnico-informatica', name: 'Técnico em Informática' },
  { slug: 'marceneiro', name: 'Marceneiro' },
  { slug: 'pedreiro', name: 'Pedreiro' },
  { slug: 'jardineiro', name: 'Jardineiro' },
  { slug: 'montador-moveis', name: 'Montador de Móveis' },
  { slug: 'tecnico-ar-condicionado', name: 'Técnico de Ar Condicionado' },
  { slug: 'designer-grafico', name: 'Designer Gráfico' },
  { slug: 'desenvolvedor-web', name: 'Desenvolvedor Web' },
] as const;

type CategorySlug = (typeof categories)[number]['slug'];

const categoryId = (slug: CategorySlug): string => `cat_${slug}`;

// ---------------------------------------------------------------------------
// Cidades (PB / PE / RN)
// ---------------------------------------------------------------------------

const CITIES = {
  cg: { city: 'Campina Grande', state: 'PB', ddd: '83', lat: -7.2306, lng: -35.8811 },
  jp: { city: 'João Pessoa', state: 'PB', ddd: '83', lat: -7.1195, lng: -34.845 },
  re: { city: 'Recife', state: 'PE', ddd: '81', lat: -8.0476, lng: -34.877 },
  na: { city: 'Natal', state: 'RN', ddd: '84', lat: -5.7945, lng: -35.211 },
} as const;

type CityKey = keyof typeof CITIES;

const phone = (ddd: string, seed: number): string => {
  const a = pad(1000 + ((seed * 7919) % 9000), 4);
  const b = pad((seed * 5081) % 10000, 4);
  return `(${ddd}) 9${a}-${b}`;
};

// ---------------------------------------------------------------------------
// Prestadores (20)
// ---------------------------------------------------------------------------

const providersSeed: {
  name: string;
  category: CategorySlug;
  city: CityKey;
  years: number;
}[] = [
  { name: 'Carlos Henrique Souza', category: 'eletricista', city: 'cg', years: 14 },
  { name: 'Marcos Vinícius Lima', category: 'encanador', city: 'jp', years: 9 },
  { name: 'Fernanda Albuquerque', category: 'diarista', city: 're', years: 7 },
  { name: 'Rafael Nóbrega', category: 'pintor', city: 'cg', years: 11 },
  { name: 'Bruno Carvalho', category: 'tecnico-informatica', city: 'na', years: 6 },
  { name: 'João Pedro Ramos', category: 'marceneiro', city: 'jp', years: 18 },
  { name: 'Antônio José da Silva', category: 'pedreiro', city: 'cg', years: 22 },
  { name: 'Luciana Ferreira', category: 'jardineiro', city: 're', years: 8 },
  { name: 'Diego Martins', category: 'montador-moveis', city: 'jp', years: 5 },
  { name: 'Paulo Roberto Gomes', category: 'tecnico-ar-condicionado', city: 'cg', years: 13 },
  { name: 'Camila Andrade', category: 'designer-grafico', city: 're', years: 7 },
  { name: 'Thiago Barbosa', category: 'desenvolvedor-web', city: 'na', years: 9 },
  { name: 'Roberto Cavalcanti', category: 'eletricista', city: 'jp', years: 16 },
  { name: 'Sandro Oliveira', category: 'encanador', city: 'cg', years: 12 },
  { name: 'Patrícia Mendes', category: 'diarista', city: 'cg', years: 10 },
  { name: 'Eduardo Tavares', category: 'pintor', city: 'na', years: 8 },
  { name: 'Felipe Aragão', category: 'tecnico-informatica', city: 're', years: 11 },
  { name: 'Gustavo Pereira', category: 'marceneiro', city: 'cg', years: 15 },
  { name: 'José Maria Bezerra', category: 'pedreiro', city: 'jp', years: 20 },
  { name: 'André Luiz Santos', category: 'desenvolvedor-web', city: 're', years: 6 },
];

// ---------------------------------------------------------------------------
// Clientes (15)
// ---------------------------------------------------------------------------

const clientsSeed: { name: string; city: CityKey }[] = [
  { name: 'Mariana Costa', city: 'cg' },
  { name: 'Pedro Henrique Alves', city: 'jp' },
  { name: 'Juliana Rocha', city: 're' },
  { name: 'Lucas Almeida', city: 'na' },
  { name: 'Beatriz Nunes', city: 'cg' },
  { name: 'Rodrigo Farias', city: 'jp' },
  { name: 'Amanda Vasconcelos', city: 're' },
  { name: 'Vinícius Moura', city: 'na' },
  { name: 'Larissa Dias', city: 'cg' },
  { name: 'Gabriel Macedo', city: 'jp' },
  { name: 'Letícia Brito', city: 're' },
  { name: 'Daniel Correia', city: 'na' },
  { name: 'Renata Lopes', city: 'cg' },
  { name: 'Fábio Queiroz', city: 'jp' },
  { name: 'Carolina Pinto', city: 're' },
];

// ---------------------------------------------------------------------------
// Bios profissionais por categoria
// ---------------------------------------------------------------------------

const bioFor = (
  category: CategorySlug,
  name: string,
  years: number,
  city: string,
): string => {
  const first = name.split(' ')[0];
  const map: Record<CategorySlug, string> = {
    eletricista: `Eletricista profissional com ${years} anos de experiência em instalações residenciais e prediais em ${city}. Trabalho com laudo, segurança e acabamento impecável — atendimento rápido inclusive em emergências.`,
    encanador: `Especialista em hidráulica e detecção de vazamentos. Atendo ${city} e região há ${years} anos, com diagnóstico preciso e garantia em todos os serviços.`,
    diarista: `${first} oferece limpeza residencial e pós-obra com ${years} anos de experiência. Capricho nos detalhes, pontualidade e produtos de qualidade inclusos.`,
    pintor: `Pintor com ${years} anos de estrada em ${city}. Pintura interna, externa e textura com preparação completa de parede e acabamento profissional.`,
    'tecnico-informatica': `Técnico em informática há ${years} anos. Formatação, remoção de vírus, upgrade de hardware e suporte remoto — atendimento honesto e sem enrolação.`,
    marceneiro: `Marceneiro com ${years} anos de oficina própria. Móveis sob medida, restauração e projetos planejados com madeira de qualidade.`,
    pedreiro: `Pedreiro experiente (${years} anos) em ${city}. Reformas, alvenaria, contrapiso e pequenos reparos com organização e limpeza da obra.`,
    jardineiro: `Cuido de jardins e áreas verdes há ${years} anos. Poda, paisagismo, manutenção e revitalização com responsabilidade ambiental.`,
    'montador-moveis': `Montador profissional de móveis há ${years} anos. Monto guarda-roupas, cozinhas planejadas e estações de trabalho com agilidade e sem danificar as peças.`,
    'tecnico-ar-condicionado': `Técnico de refrigeração com ${years} anos de experiência. Instalação, limpeza e manutenção de splits com PMOC e atendimento ágil em ${city}.`,
    'designer-grafico': `Designer gráfico com ${years} anos de mercado. Identidade visual, social media e materiais impressos com entrega rápida e revisões inclusas.`,
    'desenvolvedor-web': `Desenvolvedor web full-stack há ${years} anos. Sites institucionais, landing pages e sistemas sob medida com foco em performance e conversão.`,
  };
  return map[category];
};

// ---------------------------------------------------------------------------
// Templates de serviço por categoria
// ---------------------------------------------------------------------------

type Template = { title: string; description: string; min: number; max: number };

const SERVICE_TEMPLATES: Record<CategorySlug, Template[]> = {
  eletricista: [
    {
      title: 'Instalação elétrica residencial completa',
      description:
        'Projeto e instalação de toda a parte elétrica da residência: quadro de distribuição, tomadas, iluminação e aterramento. Inclui teste de carga, organização da fiação e laudo de segurança ao final.',
      min: 450,
      max: 2200,
    },
    {
      title: 'Troca de disjuntores e quadro de energia',
      description:
        'Substituição de disjuntores antigos, balanceamento de fases e modernização do quadro de distribuição para evitar sobrecargas e curtos. Garantia de 90 dias no serviço.',
      min: 180,
      max: 650,
    },
    {
      title: 'Instalação de chuveiro e ponto 220V',
      description:
        'Instalação ou troca de chuveiro com dimensionamento correto do fio e do disjuntor, eliminando aquecimento e disjuntor desarmando. Atendimento no mesmo dia.',
      min: 90,
      max: 260,
    },
  ],
  encanador: [
    {
      title: 'Detecção e reparo de vazamentos',
      description:
        'Localização de vazamentos sem quebra-quebra desnecessário, com reparo definitivo da tubulação e teste de estanqueidade. Atendimento de emergência disponível.',
      min: 150,
      max: 700,
    },
    {
      title: 'Desentupimento de pia, ralo e esgoto',
      description:
        'Desentupimento com equipamento profissional, limpeza da tubulação e orientação para evitar reincidência. Serviço limpo e sem odor.',
      min: 120,
      max: 480,
    },
    {
      title: 'Instalação de louças e metais sanitários',
      description:
        'Instalação de vaso sanitário, pia, torneiras e registros com vedação correta e acabamento profissional, sem vazamentos.',
      min: 130,
      max: 520,
    },
  ],
  diarista: [
    {
      title: 'Limpeza residencial completa',
      description:
        'Limpeza detalhada de todos os cômodos: cozinha, banheiros, quartos e áreas comuns. Inclui produtos, organização e atenção especial a cantos e rejuntes.',
      min: 130,
      max: 320,
    },
    {
      title: 'Faxina pós-obra e pós-mudança',
      description:
        'Remoção de resíduos de obra, limpeza pesada de pisos, vidros e esquadrias, deixando o imóvel pronto para morar.',
      min: 220,
      max: 600,
    },
    {
      title: 'Limpeza de apartamento (diária)',
      description:
        'Diária de limpeza para apartamentos de até 3 quartos, com lavagem de banheiro, cozinha e organização geral. Pontualidade garantida.',
      min: 120,
      max: 240,
    },
  ],
  pintor: [
    {
      title: 'Pintura de apartamento completo',
      description:
        'Pintura interna com massa corrida, lixamento, proteção de móveis e duas demãos de tinta premium. Acabamento liso e uniforme.',
      min: 900,
      max: 4500,
    },
    {
      title: 'Pintura externa e fachada',
      description:
        'Preparação de superfície, tratamento de infiltração e pintura externa com tinta acrílica de alta durabilidade. Inclui andaime quando necessário.',
      min: 1200,
      max: 6000,
    },
    {
      title: 'Aplicação de textura e efeito decorativo',
      description:
        'Aplicação de grafiato, textura ou efeito decorativo em parede de destaque, com preparo completo e acabamento profissional.',
      min: 350,
      max: 1400,
    },
  ],
  'tecnico-informatica': [
    {
      title: 'Formatação e otimização de computador',
      description:
        'Backup dos dados, formatação, instalação do sistema e programas essenciais, atualização de drivers e otimização de inicialização. PC como novo.',
      min: 90,
      max: 220,
    },
    {
      title: 'Remoção de vírus e limpeza do sistema',
      description:
        'Remoção completa de vírus, malwares e adwares, limpeza de arquivos temporários e configuração de proteção. Sem perda de dados.',
      min: 80,
      max: 180,
    },
    {
      title: 'Upgrade de hardware (SSD e memória)',
      description:
        'Instalação de SSD e memória RAM com clonagem do sistema, deixando o equipamento muito mais rápido. Diagnóstico incluso.',
      min: 120,
      max: 400,
    },
  ],
  marceneiro: [
    {
      title: 'Móveis planejados sob medida',
      description:
        'Projeto, fabricação e instalação de móveis planejados em MDF de qualidade, com ferragens reforçadas e acabamento impecável.',
      min: 800,
      max: 7000,
    },
    {
      title: 'Restauração de móveis de madeira',
      description:
        'Recuperação de móveis antigos: lixamento, troca de ferragens, recolagem e novo acabamento, preservando a estrutura original.',
      min: 220,
      max: 1200,
    },
    {
      title: 'Confecção de estante e painel de TV',
      description:
        'Estante ou painel sob medida para sua sala, com nicho, iluminação embutida e acabamento personalizado.',
      min: 600,
      max: 3200,
    },
  ],
  pedreiro: [
    {
      title: 'Reforma de banheiro completa',
      description:
        'Demolição, hidráulica, assentamento de revestimento, rejunte e acabamento. Obra organizada, com limpeza diária e prazo definido.',
      min: 1500,
      max: 8000,
    },
    {
      title: 'Construção de muro e alvenaria',
      description:
        'Levantamento de muro ou parede com alicerce adequado, prumo perfeito e acabamento para pintura.',
      min: 900,
      max: 5000,
    },
    {
      title: 'Pequenos reparos e contrapiso',
      description:
        'Correção de contrapiso, reparos em alvenaria, chumbamento e pequenos serviços de pedreiro com qualidade.',
      min: 200,
      max: 900,
    },
  ],
  jardineiro: [
    {
      title: 'Manutenção de jardim e poda',
      description:
        'Poda de arbustos e árvores, corte de grama, capina e adubação, deixando o jardim saudável e bem cuidado.',
      min: 120,
      max: 450,
    },
    {
      title: 'Projeto de paisagismo residencial',
      description:
        'Planejamento e execução de paisagismo com escolha de espécies adequadas ao clima local e sistema de irrigação.',
      min: 600,
      max: 3500,
    },
    {
      title: 'Revitalização de gramado',
      description:
        'Recuperação de gramado com escarificação, replantio, adubação e plano de manutenção para resultado duradouro.',
      min: 250,
      max: 1100,
    },
  ],
  'montador-moveis': [
    {
      title: 'Montagem de guarda-roupa e cama box',
      description:
        'Montagem profissional de guarda-roupa, cômoda e cama box com alinhamento perfeito e sem danificar as peças.',
      min: 90,
      max: 350,
    },
    {
      title: 'Montagem de cozinha planejada',
      description:
        'Montagem completa de cozinha modulada com nivelamento de armários, fixação segura e ajuste de portas e gavetas.',
      min: 300,
      max: 1500,
    },
    {
      title: 'Montagem de home office',
      description:
        'Montagem de mesa, estante e estação de trabalho, com organização de cabos e ajuste ergonômico.',
      min: 100,
      max: 400,
    },
  ],
  'tecnico-ar-condicionado': [
    {
      title: 'Instalação de ar-condicionado split',
      description:
        'Instalação completa de split com furação, vácuo na tubulação, teste de estanqueidade e start-up. Garantia no serviço.',
      min: 350,
      max: 1200,
    },
    {
      title: 'Limpeza e higienização de split',
      description:
        'Higienização completa da evaporadora e condensadora, troca de filtros e eliminação de mau cheiro. Ar mais saudável.',
      min: 120,
      max: 350,
    },
    {
      title: 'Manutenção preventiva (PMOC)',
      description:
        'Plano de manutenção preventiva com checagem de gás, componentes elétricos e desempenho, prolongando a vida do equipamento.',
      min: 180,
      max: 700,
    },
  ],
  'designer-grafico': [
    {
      title: 'Criação de identidade visual e logo',
      description:
        'Desenvolvimento de logotipo, paleta de cores, tipografia e manual de marca para posicionar o seu negócio com profissionalismo.',
      min: 450,
      max: 2500,
    },
    {
      title: 'Pacote de social media mensal',
      description:
        'Criação de artes para redes sociais (feed e stories) com calendário de postagens e identidade consistente.',
      min: 400,
      max: 1800,
    },
    {
      title: 'Design de cardápio e material impresso',
      description:
        'Layout de cardápio, panfleto e cartão de visita prontos para impressão, com revisões inclusas.',
      min: 180,
      max: 900,
    },
  ],
  'desenvolvedor-web': [
    {
      title: 'Desenvolvimento de landing page',
      description:
        'Landing page responsiva e otimizada para conversão, com integração de formulário, SEO básico e publicação. Entrega em até 7 dias.',
      min: 800,
      max: 3500,
    },
    {
      title: 'Site institucional completo',
      description:
        'Site institucional sob medida com painel de conteúdo, design responsivo, performance e otimização para Google.',
      min: 1500,
      max: 7000,
    },
    {
      title: 'Sistema web sob medida',
      description:
        'Desenvolvimento de sistema web personalizado (cadastros, dashboard e relatórios) com código limpo e escalável.',
      min: 3000,
      max: 18000,
    },
  ],
};

// ---------------------------------------------------------------------------
// Avaliações — comentários realistas e variados
// ---------------------------------------------------------------------------

const REVIEW_COMMENTS = [
  'Excelente atendimento, chegou no horário combinado e explicou tudo com clareza antes de começar.',
  'Resolveu rapidamente o problema e ainda deu dicas de manutenção para não acontecer de novo. Recomendo!',
  'Profissional muito organizado, deixou tudo limpo no final. Trabalho impecável.',
  'Serviço ficou ótimo, dentro do orçamento e sem surpresas. Voltarei a contratar com certeza.',
  'Pontual, educado e caprichoso. Notou um detalhe que eu nem tinha percebido e corrigiu sem cobrar a mais.',
  'Atendeu rápido na emergência e cobrou um valor justo. Salvou meu fim de semana.',
  'Acabamento muito bem feito, dá pra ver que tem experiência. Indiquei para meus vizinhos.',
  'Comunicação excelente do início ao fim, sempre respondendo as dúvidas pelo WhatsApp.',
  'Cumpriu o prazo prometido e o resultado superou minha expectativa. Muito satisfeito.',
  'Serviço de qualidade, mas demorou um pouco mais que o combinado para finalizar. Ainda assim valeu a pena.',
  'Trabalho caprichado e preço honesto. Raro encontrar profissional tão comprometido hoje em dia.',
  'Foi atencioso com a minha família e cuidadoso com os móveis. Recomendo de olhos fechados.',
  'Identificou a causa real do problema que outro profissional não tinha conseguido. Conhecimento de sobra.',
  'Ficou tudo perfeito, exatamente como combinamos no orçamento. Profissionalismo nota dez.',
  'Bom serviço no geral, só achei que poderia ter limpado um pouco melhor depois. Mas o resultado ficou bom.',
  'Rápido, eficiente e transparente. Mostrou cada etapa do que estava fazendo.',
  'Muito prestativo, remarcou sem problema quando precisei e ainda assim entregou no prazo.',
  'O resultado ficou lindo, recebi vários elogios das visitas. Valeu cada centavo.',
  'Educado e honesto: disse que uma peça não precisava ser trocada e economizei um bom dinheiro.',
  'Atendeu certinho, trabalho dentro do esperado para o valor cobrado. Sem reclamações.',
  'Excelente custo-benefício. Já é a segunda vez que contrato e sempre entrega com qualidade.',
  'Chegou com todas as ferramentas, não precisou improvisar nada. Serviço profissional de verdade.',
  'Resolveu um problema antigo que vinha me incomodando há meses. Finalmente resolvido!',
  'Atencioso e paciente para explicar as opções. Me ajudou a escolher a melhor solução pelo melhor preço.',
  'O serviço ficou muito bom, só houve um pequeno atraso no início, mas avisou com antecedência.',
  'Trabalho limpo, rápido e bem acabado. Já agendei outro serviço com ele.',
  'Profissional de confiança, deixei a casa com ele e estava tudo certo quando voltei.',
  'Caprichou no acabamento e ainda fez um ajuste extra sem cobrar. Atendimento humano e honesto.',
  'Bom profissional, cumpriu o que prometeu. Recomendo para quem busca seriedade.',
  'Superou as expectativas, ficou melhor do que eu imaginava. Indico sem pensar duas vezes.',
];

// Notas: maioria 4 e 5, alguns 3 para parecer natural (≈ 12% de notas 3).
const RATING_PATTERN = [
  5, 5, 4, 5, 4, 5, 5, 4, 5, 3, 5, 4, 5, 5, 4, 5, 3, 5, 4, 5, 5, 4, 5, 5, 4,
];

// ---------------------------------------------------------------------------
// Construção dos registros
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.info('🌱 Semeando dados de demonstração do BuscaPRO...');

  const password = await hash('demo1234', 10);

  // -- Categorias --
  await prisma.category.createMany({
    data: categories.map((c, i) => ({
      id: categoryId(c.slug),
      name: c.name,
      slug: c.slug,
      createdAt: daysAgo(400 - i),
    })),
    skipDuplicates: true,
  });

  // -- Usuários (prestadores + clientes) --
  const providerUsers = providersSeed.map((p, i) => {
    const c = CITIES[p.city];
    const id = `usr_p_${pad(i + 1)}`;
    return {
      id,
      name: p.name,
      email: `${slugify(p.name)}.${pad(i + 1)}@demo.buscapro.com`,
      password,
      phone: phone(c.ddd, i + 1),
      role: 'PROVIDER' as const,
      avatarUrl: avatar(i * 3 + 4),
      createdAt: daysAgo(360 - i * 11),
    };
  });

  const clientUsers = clientsSeed.map((cl, i) => {
    const c = CITIES[cl.city];
    const id = `usr_c_${pad(i + 1)}`;
    return {
      id,
      name: cl.name,
      email: `${slugify(cl.name)}.${pad(i + 1)}@demo.buscapro.com`,
      password,
      phone: phone(c.ddd, 100 + i),
      role: 'CLIENT' as const,
      avatarUrl: avatar(i * 5 + 31),
      createdAt: daysAgo(300 - i * 9),
    };
  });

  await prisma.user.createMany({
    data: [...providerUsers, ...clientUsers],
    skipDuplicates: true,
  });

  // -- Localizações (1:1 por usuário) --
  const locations = [
    ...providersSeed.map((p, i) => {
      const c = CITIES[p.city];
      return {
        id: `loc_${providerUsers[i].id}`,
        city: c.city,
        state: c.state,
        latitude: c.lat,
        longitude: c.lng,
        userId: providerUsers[i].id,
      };
    }),
    ...clientsSeed.map((cl, i) => {
      const c = CITIES[cl.city];
      return {
        id: `loc_${clientUsers[i].id}`,
        city: c.city,
        state: c.state,
        latitude: c.lat,
        longitude: c.lng,
        userId: clientUsers[i].id,
      };
    }),
  ];

  await prisma.location.createMany({
    data: locations,
    skipDuplicates: true,
  });

  // -- Serviços (1 a 3 por prestador, total = 40) --
  const serviceCounts = [2, 3, 1, 2]; // soma 8 por ciclo de 4 → 20 × = 40
  const services: {
    id: string;
    title: string;
    description: string;
    price: number;
    active: boolean;
    imageUrl: string;
    userId: string;
    categoryId: string;
    createdAt: Date;
  }[] = [];

  providersSeed.forEach((p, i) => {
    const count = serviceCounts[i % serviceCounts.length];
    const templates = SERVICE_TEMPLATES[p.category];
    for (let k = 0; k < count; k++) {
      const t = templates[k % templates.length];
      const seq = services.length + 1;
      const id = `svc_${pad(seq, 3)}`;
      const span = t.max - t.min;
      const price = t.min + ((seq * 137) % (span + 1));
      // Arredonda para múltiplos de 10 — preços mais "comerciais".
      const rounded = Math.max(t.min, Math.round(price / 10) * 10);
      services.push({
        id,
        title: t.title,
        description: t.description,
        price: rounded,
        active: true,
        imageUrl: serviceImage(id),
        userId: providerUsers[i].id,
        categoryId: categoryId(p.category),
        createdAt: daysAgo(150 - (seq % 140)),
      });
    }
  });

  await prisma.service.createMany({
    data: services,
    skipDuplicates: true,
  });

  // -- Avaliações (2 por serviço, total = 80) --
  const reviews: {
    id: string;
    rating: number;
    comment: string;
    reviewerId: string;
    serviceId: string;
    createdAt: Date;
  }[] = [];

  services.forEach((svc, sIdx) => {
    for (let k = 0; k < 2; k++) {
      const seq = reviews.length;
      // Clientes consecutivos distintos; nunca o dono (clientes são CLIENT).
      const reviewer = clientUsers[(sIdx * 2 + k) % clientUsers.length];
      reviews.push({
        id: `rev_${pad(seq + 1, 3)}`,
        rating: RATING_PATTERN[seq % RATING_PATTERN.length],
        comment: REVIEW_COMMENTS[(seq * 13) % REVIEW_COMMENTS.length],
        reviewerId: reviewer.id,
        serviceId: svc.id,
        createdAt: daysAgo(1 + ((seq * 7) % 110)),
      });
    }
  });

  await prisma.review.createMany({
    data: reviews,
    skipDuplicates: true,
  });

  // -- Resumo --
  const [cCat, cUser, cProv, cSvc, cRev] = await Promise.all([
    prisma.category.count(),
    prisma.user.count(),
    prisma.user.count({ where: { role: 'PROVIDER' } }),
    prisma.service.count(),
    prisma.review.count(),
  ]);

  console.info('✅ Seed concluído:');
  console.info(`   • ${cCat} categorias`);
  console.info(`   • ${cUser} usuários (${cProv} prestadores)`);
  console.info(`   • ${cSvc} serviços`);
  console.info(`   • ${cRev} avaliações`);
  console.info('   Login de teste: <email do usuário> / senha: demo1234');
}

main()
  .catch((err) => {
    console.error('❌ Falha no seed:', err);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
