export type CategoryCard = {
  title: string;
  description: string;
  icon: string;
  driveUrl: string;
  isBonus?: boolean;
};

export const memberContent: Record<"iniciante" | "mestre", CategoryCard[]> = {
  iniciante: [
    {
      title: "Personagens",
      description: "Moldes de personagens variados para montar em papel 3D",
      icon: "🧑",
      driveUrl: "https://drive.google.com/PLACEHOLDER-PERSONAGENS",
    },
    {
      title: "Plantas",
      description: "Flores, árvores e plantas decorativas em papercraft",
      icon: "🌱",
      driveUrl: "https://drive.google.com/PLACEHOLDER-PLANTAS",
    },
    {
      title: "Objetos",
      description: "Objetos do dia a dia em versão papercraft 3D",
      icon: "📦",
      driveUrl: "https://drive.google.com/PLACEHOLDER-OBJETOS",
    },
    {
      title: "Diversos",
      description: "Moldes variados de diferentes categorias",
      icon: "🎨",
      driveUrl: "https://drive.google.com/PLACEHOLDER-DIVERSOS",
    },
  ],
  mestre: [
    {
      title: "Personagens",
      description: "Moldes de personagens variados para montar em papel 3D",
      icon: "🧑",
      driveUrl: "https://drive.google.com/PLACEHOLDER-PERSONAGENS",
    },
    {
      title: "Plantas",
      description: "Flores, árvores e plantas decorativas em papercraft",
      icon: "🌱",
      driveUrl: "https://drive.google.com/PLACEHOLDER-PLANTAS",
    },
    {
      title: "Objetos",
      description: "Objetos do dia a dia em versão papercraft 3D",
      icon: "📦",
      driveUrl: "https://drive.google.com/PLACEHOLDER-OBJETOS",
    },
    {
      title: "Diversos",
      description: "Moldes variados de diferentes categorias",
      icon: "🎨",
      driveUrl: "https://drive.google.com/PLACEHOLDER-DIVERSOS",
    },
    {
      title: "Moldes Gigantes 3D",
      description: "Moldes em tamanho grande para decoração impactante",
      icon: "🏗️",
      driveUrl: "https://drive.google.com/PLACEHOLDER-GIGANTES",
    },
    {
      title: "Alfabeto Lowpoly",
      description: "Letras e números em estilo low poly para personalizar",
      icon: "🔤",
      driveUrl: "https://drive.google.com/PLACEHOLDER-ALFABETO",
    },
    {
      title: "Castelos",
      description: "Castelos medievais e fantásticos em papercraft",
      icon: "🏰",
      driveUrl: "https://drive.google.com/PLACEHOLDER-CASTELOS",
    },
    {
      title: "Coisas Fofas",
      description: "Moldes fofos e kawaii para todas as idades",
      icon: "🧸",
      driveUrl: "https://drive.google.com/PLACEHOLDER-FOFAS",
    },
    {
      title: "Dinossauros",
      description: "Dinossauros realistas e estilizados em papel 3D",
      icon: "🦕",
      driveUrl: "https://drive.google.com/PLACEHOLDER-DINOSSAUROS",
    },
    {
      title: "Dragões",
      description: "Dragões épicos e detalhados para montar",
      icon: "🐉",
      driveUrl: "https://drive.google.com/PLACEHOLDER-DRAGOES",
    },
    {
      title: "Espaço – Universo",
      description: "Naves, planetas e astronautas em papercraft",
      icon: "🚀",
      driveUrl: "https://drive.google.com/PLACEHOLDER-ESPACO",
    },
    {
      title: "Esportes",
      description: "Troféus, bolas e itens esportivos em papel 3D",
      icon: "⚽",
      driveUrl: "https://drive.google.com/PLACEHOLDER-ESPORTES",
    },
    {
      title: "Geek",
      description: "Personagens e itens da cultura geek e gamer",
      icon: "🎮",
      driveUrl: "https://drive.google.com/PLACEHOLDER-GEEK",
    },
    {
      title: "Mitologia",
      description: "Criaturas e deuses mitológicos em papercraft",
      icon: "⚡",
      driveUrl: "https://drive.google.com/PLACEHOLDER-MITOLOGIA",
    },
    {
      title: "Músicos",
      description: "Instrumentos musicais e ícones da música",
      icon: "🎸",
      driveUrl: "https://drive.google.com/PLACEHOLDER-MUSICOS",
    },
    {
      title: "Zoológico de Papercraft",
      description: "Animais selvagens e domésticos em papel 3D",
      icon: "🦁",
      driveUrl: "https://drive.google.com/PLACEHOLDER-ZOOLOGICO",
    },
    {
      title: "Heróis",
      description: "Super-heróis e vilões icônicos em papercraft",
      icon: "🦸",
      driveUrl: "https://drive.google.com/PLACEHOLDER-HEROIS",
      isBonus: true,
    },
    {
      title: "Animes",
      description: "Personagens de animes populares em papel 3D",
      icon: "⛩️",
      driveUrl: "https://drive.google.com/PLACEHOLDER-ANIMES",
      isBonus: true,
    },
    {
      title: "Garagem de Carros",
      description: "Carros, motos e veículos detalhados em papercraft",
      icon: "🏎️",
      driveUrl: "https://drive.google.com/PLACEHOLDER-CARROS",
      isBonus: true,
    },
  ],
};
