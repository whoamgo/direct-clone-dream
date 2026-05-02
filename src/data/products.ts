export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  emoji: string;
  bg: string;
  desc: string;
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
};

export const categories = [
  { slug: "ayurveda", name: "Ayurveda", icon: "🌿" },
  { slug: "homeopathy", name: "Homeopathy", icon: "💊" },
  { slug: "vitamins-and-nutrition", name: "Vitamins & Nutrition", icon: "🍊" },
  { slug: "nutritional-drinks", name: "Nutritional Drinks", icon: "🥛" },
  { slug: "fitness-supplements", name: "Fitness Supplements", icon: "💪" },
  { slug: "sexual-wellness", name: "Sexual Wellness", icon: "💗" },
  { slug: "stomach-pain-care", name: "Stomach & Pain Care", icon: "🩺" },
  { slug: "skin-care", name: "Skin Care", icon: "🧴" },
  { slug: "hair-care", name: "Hair Care", icon: "💆" },
  { slug: "oral-care", name: "Oral Care", icon: "🪥" },
  { slug: "sanitizers-handwash", name: "Sanitizers & Hand Wash", icon: "🧼" },
  { slug: "baby-care", name: "Baby Care", icon: "👶" },
];

const palette = ["#FFE5E5", "#E5F4FF", "#E8F8E8", "#FFF4E0", "#F0E8FF", "#FFF0F5", "#E0F7FA", "#FFFAE0"];
const pick = (i: number) => palette[i % palette.length];

const make = (id: number, name: string, brand: string, category: string, price: number, mrp: number, emoji: string, opts: Partial<Product> = {}): Product => ({
  id: `p-${id}`,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  name, brand, category, price, mrp,
  rating: 4 + Math.random(),
  reviews: 20 + Math.floor(Math.random() * 400),
  emoji, bg: pick(id),
  desc: `${name} from ${brand}. A trusted ${category.replace(/-/g, " ")} product to support your daily wellness routine. Authentic, lab-tested and shipped fresh.`,
  inStock: true,
  isSale: mrp > price,
  ...opts,
});

export const products: Product[] = [
  make(1, "HealthOK Multivitamin For Men", "Mankind", "vitamins-and-nutrition", 240, 280, "💊"),
  make(2, "PentaSure Complete Balanced Nutrition", "Hetero", "nutritional-drinks", 1634, 1850, "🥤"),
  make(3, "Oziva Protein & Herbs for Women", "Oziva", "fitness-supplements", 1529, 1799, "🥛"),
  make(4, "Wellbeing Nutrition Slow Burn", "Wellbeing", "fitness-supplements", 1430, 1650, "🌶️"),
  make(5, "SBL Arnica Gel", "SBL", "homeopathy", 75, 90, "🧴"),
  make(6, "Baidyanath Aloe Vera Juice with Pulp", "Baidyanath", "ayurveda", 160, 200, "🌿"),
  make(7, "Jeena Sikho Mifree Capsule", "Jeena Sikho", "ayurveda", 1270, 1450, "💊"),
  make(8, "Krishna Herbal Ayurveda She Care Juice", "Krishna", "ayurveda", 543, 650, "🍵"),
  make(9, "Maharishi Ayurveda Amlant Tablet", "Maharishi", "ayurveda", 562, 690, "🟫"),
  make(10, "Softovac Bowel Regulator", "Softovac", "ayurveda", 404, 460, "🟡"),
  make(11, "Bakson Homeopathy Hair Reviver", "Bakson", "homeopathy", 439, 520, "💆"),
  make(12, "SBL Alfalfa Tonic with Ginseng", "SBL", "homeopathy", 159, 180, "🧴"),
  make(13, "SBL Thuja Ointment", "SBL", "homeopathy", 76, 90, "🧴"),
  make(14, "SBL Tonicard Gold Drop", "SBL", "homeopathy", 420, 480, "💧"),
  make(15, "Combo Pack Neuralain Forte Tablet", "Mankind", "vitamins-and-nutrition", 253, 290, "💊"),
  make(16, "Combo Pack Ravitol H Tablet", "Mankind", "vitamins-and-nutrition", 396, 460, "💊"),
  make(17, "Dr Morepen Iron & Zinc Vitamin C", "Morepen", "vitamins-and-nutrition", 365, 420, "🧡"),
  make(18, "Vaamveda Vitamin B Complex", "Vaamveda", "vitamins-and-nutrition", 749, 850, "🟢"),
  make(19, "Vitamin D3 1Gm Granules", "Cipla", "vitamins-and-nutrition", 24.7, 30, "🟧"),
  make(20, "Beeceekan Syrup", "Beeceekan", "nutritional-drinks", 40.5, 50, "🍯"),
  make(21, "ProteoMe SF Powder Vanilla Sugar Free", "ProteoMe", "nutritional-drinks", 403.41, 480, "🥄"),
  make(22, "Wada's Himalayan Apple Cider Vinegar", "Wada", "nutritional-drinks", 358, 420, "🍎"),
  make(23, "MuscleBlaze Fuel One Whey Protein", "MuscleBlaze", "fitness-supplements", 4099, 4500, "🏋️"),
  make(24, "MuscleBlaze Watermelon BCAA Pro", "MuscleBlaze", "fitness-supplements", 1430, 1700, "🍉"),
  make(25, "NutraLab Slim Powder Vanilla", "NutraLab", "fitness-supplements", 1064, 1250, "🥛"),
  make(26, "Durex Close Fit Invisible Condom", "Durex", "sexual-wellness", 437, 500, "💙"),
  make(27, "Manforce 1500 Dots Xotic Condom", "Manforce", "sexual-wellness", 99.1, 120, "💗"),
  make(28, "Manforce Dots 1750 Condom", "Manforce", "sexual-wellness", 132, 160, "💗"),
  make(29, "Skore Flavored Dotted Condom", "Skore", "sexual-wellness", 120, 150, "💛"),
  make(30, "Skore Timeless Climax Delay Condom", "Skore", "sexual-wellness", 130, 160, "🖤"),
  make(31, "Dabur Gastrina Tablet", "Dabur", "stomach-pain-care", 90.2, 110, "🟠"),
  make(32, "Himalaya Gasex Tablet for Gas, Bloating", "Himalaya", "stomach-pain-care", 165, 190, "🟢"),
  make(33, "Mkuty Betain HCL Pepsin Acidity", "Mkuty", "stomach-pain-care", 686, 780, "💛"),
  make(34, "Unihelo Unigasto Syrup Sugar Free", "Unihelo", "stomach-pain-care", 120, 145, "🍊"),
  make(35, "Zandu Nityam Tablet for Stomach Care", "Zandu", "stomach-pain-care", 38.2, 45, "🟦"),
  make(36, "Benac AC 2.5% Gel", "Glenmark", "skin-care", 102, 125, "🩹"),
  make(37, "Chemist At Play Odour Control Roll On", "Chemist@Play", "skin-care", 327, 380, "🟧"),
  make(38, "Seven Seas Original Cod-Liver Oil", "Seven Seas", "skin-care", 370, 420, "🐟"),
  make(39, "Tetmosol Medicated Soap with 5% Mono", "Tetmosol", "skin-care", 30, 38, "🧼"),
  make(40, "The Derma Co 10% Vitamin C Face Serum", "Derma Co", "skin-care", 449, 520, "💜"),
  make(41, "Bodywash Wild Grove Aloe Juice", "Bodywash", "hair-care", 259, 310, "🟢"),
  make(42, "Head & Shoulders Smooth & Silky 2in1", "H&S", "hair-care", 460, 520, "💙"),
  make(43, "Livon Anti-Friz for All Hair Types", "Livon", "hair-care", 175, 210, "💖"),
  make(44, "Pantene Pro-V Advanced Hairfall Solution", "Pantene", "hair-care", 175, 210, "🟪"),
  make(45, "Ustraa Hair Growth Vitalizer for Men", "Ustraa", "hair-care", 537, 620, "🖤"),
  make(46, "Colgate Peppermint Maxfresh Floss Antibacterial", "Colgate", "oral-care", 165, 195, "🪥"),
  make(47, "Dabur Clove Oil Relieves Toothache", "Dabur", "oral-care", 48.5, 60, "💛"),
  make(48, "Dabur Red Toothpaste for Complete Care", "Dabur", "oral-care", 268.5, 310, "🔴"),
  make(49, "Dente 91 Cool Mint Toothpaste 70g Twin", "Dente91", "oral-care", 284, 330, "💙"),
  make(50, "Orasore Mouth Ulcer Relief Gel", "Orasore", "oral-care", 57.4, 70, "💎"),
  make(51, "Dettol Original Hand Wash 200ml", "Dettol", "sanitizers-handwash", 89, 110, "🧼"),
  make(52, "Lifebuoy Total 10 Hand Wash", "Lifebuoy", "sanitizers-handwash", 99, 120, "🧴"),
  make(53, "Himalaya Pure Hands Sanitizer", "Himalaya", "sanitizers-handwash", 60, 75, "💧"),
  make(54, "Savlon Hand Sanitizer Gel", "Savlon", "sanitizers-handwash", 110, 140, "💙"),
  make(55, "Mamaearth Baby Lotion 200ml", "Mamaearth", "baby-care", 249, 299, "👶"),
  make(56, "Johnson's Baby Soap 100g", "Johnson's", "baby-care", 65, 80, "🌸"),
];

export const bySlug = (slug: string) => products.find((p) => p.slug === slug);
export const byCategory = (cat: string) => products.filter((p) => p.category === cat);
export const bestSellers = () => products.slice(0, 10);
export const newAdditions = () => [...products].sort(() => 0.5 - Math.random()).slice(0, 8);
