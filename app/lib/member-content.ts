export type CategoryCard = {
  title: string;
  description: string;
  icon: string;
  driveUrl: string;
  isBonus?: boolean;
};

const BASE_URL = "https://drive.google.com/drive/folders/";

// Root folders – included in both plans
const rootCards: CategoryCard[] = [
  {
    title: "Personagens",
    description: "Personagens variados para montar em papel 3D",
    icon: "🧑",
    driveUrl: BASE_URL + "1H-yBJt_ylyrwDdEeXYsX3qSa8_nZJxJS",
  },
  {
    title: "Decorações",
    description: "Enfeites e decorações em papercraft para qualquer ocasião",
    icon: "🎀",
    driveUrl: BASE_URL + "1W1WzPrmZl8VFoHVqFGa0U0sBY8MkeMKP",
  },
  {
    title: "Desenhos",
    description: "Moldes de desenhos clássicos e modernos em papel 3D",
    icon: "✏️",
    driveUrl: BASE_URL + "1ArK_JMZxIAXMQ8Vld6gtEphZ7QRrpTBF",
  },
  {
    title: "Frutas",
    description: "Frutas coloridas e realistas em papercraft",
    icon: "🍎",
    driveUrl: BASE_URL + "1w8APAZdIlL6HHTqhOdUUl4NtK_DHsiEk",
  },
  {
    title: "Games",
    description: "Personagens e itens dos seus jogos favoritos",
    icon: "🎮",
    driveUrl: BASE_URL + "1q0FhrNcmbWtOa72g85oztanGv60rWXEY",
  },
  {
    title: "Jogos",
    description: "Moldes temáticos de jogos de tabuleiro e diversão",
    icon: "🎲",
    driveUrl: BASE_URL + "1FXB1DL8h4YHDOX3IV52sYc5M66SHYVyh",
  },
  {
    title: "Natal",
    description: "Papai Noel, renas, enfeites natalinos e muito mais",
    icon: "🎄",
    driveUrl: BASE_URL + "17yhWokKSrVxpg2A4lGi8IhaNyl1Gtdhf",
  },
  {
    title: "Séries",
    description: "Personagens das séries mais populares em papel 3D",
    icon: "📺",
    driveUrl: BASE_URL + "17TOunICNNWM3Voq894YpQIDS_Y1gr8id",
  },
  {
    title: "Tutoriais",
    description: "Passo a passo para montar seus moldes com perfeição",
    icon: "📚",
    driveUrl: BASE_URL + "1erTe5fKzhip3Us1tbpqMlhthCCPFuT_D",
  },
  {
    title: "Pasta Completa",
    description: "Acesso à pasta completa com todos os arquivos organizados",
    icon: "📁",
    driveUrl: BASE_URL + "1nrR4pqSqU0mIO_eVBaSYJlgwXu61RnQc",
  },
];

// Premium folder – mestre only
const premiumCard: CategoryCard = {
  title: "Moldes Premium",
  description:
    "Castelos, Coisas Fofas, Alfabeto, Balões, Caixas, Dinossauros e muito mais conteúdo exclusivo",
  icon: "⭐",
  driveUrl: BASE_URL + "1PrGsDSeV4X5Hf2HBXf8utXKBsBoiVcuL",
  isBonus: true,
};

export const memberContent: Record<"iniciante" | "mestre", CategoryCard[]> = {
  iniciante: rootCards,
  mestre: [...rootCards, premiumCard],
};
