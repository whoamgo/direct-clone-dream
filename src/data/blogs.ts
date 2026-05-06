export type Blog = {
  id: string;
  slug: string;
  title: string;
  date: string;
  month: string;
  day: string;
  author: string;
  excerpt: string;
  cover: string;
  content: string[];
};

const covers = [
  "linear-gradient(135deg,#dbeafe,#ede9fe)",
  "linear-gradient(135deg,#dcfce7,#fef9c3)",
  "linear-gradient(135deg,#fee2e2,#fce7f3)",
  "linear-gradient(135deg,#cffafe,#dbeafe)",
  "linear-gradient(135deg,#fef3c7,#fed7aa)",
  "linear-gradient(135deg,#e0e7ff,#fae8ff)",
  "linear-gradient(135deg,#d1fae5,#a7f3d0)",
  "linear-gradient(135deg,#fce7f3,#fbcfe8)",
];

const titles = [
  "Best Online Pharmacies in India",
  "Omeprazole Capsule: Uses, Benefits, Dosage, Side Effects & Warnings",
  "Cetirizine Tablet: Uses, Benefits, Dosage, Side Effects & Warnings",
  "Skin Infection Treatments: Creams, Ointments & Tablets Explained",
  "How to Boost Immunity Naturally with Ayurveda",
  "Top 10 Vitamins Every Adult Should Take Daily",
  "Azithromycin: A Complete Guide to Usage and Safety",
  "Metformin: Uses, Side Effects, and Precautions",
  "Managing Diabetes: Diet, Exercise & Medication Tips",
  "Hair Fall Solutions That Actually Work",
  "Understanding Blood Pressure: Causes & Treatments",
  "Children's Nutrition: Essential Vitamins & Minerals",
];

const monthDays = [
  ["May", "04"], ["May", "01"], ["Apr", "30"], ["Apr", "29"],
  ["Apr", "27"], ["Apr", "23"], ["Apr", "21"], ["Apr", "15"],
  ["Apr", "10"], ["Apr", "05"], ["Mar", "28"], ["Mar", "20"],
];

export const blogs: Blog[] = titles.map((t, i) => ({
  id: `b-${i + 1}`,
  slug: t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  title: t,
  date: `${monthDays[i][0]} ${monthDays[i][1]}, 2026`,
  month: monthDays[i][0],
  day: monthDays[i][1],
  author: "Direct Dawai Author",
  excerpt: `Learn everything about ${t.toLowerCase()} — a clear and practical guide so you can take this medicine safely and with confidence.`,
  cover: covers[i % covers.length],
  content: [
    `In this guide, we will explain everything in a clear and practical way so you can take this medicine safely and with confidence. Let's start by understanding what exactly ${t.split(":")[0]} is.`,
    `## What is ${t.split(":")[0]}?`,
    `${t.split(":")[0]} is a medicine used to reduce the amount of acid your stomach produces. It belongs to a group of medicines called proton pump inhibitors (PPIs). They are commonly used to treat acid-related problems.`,
    `These capsules are available as 20 mg or 40 mg. They are often prescribed for short-term and long-term stomach issues, though depending on the condition.`,
    `## How Does It Work in the Body?`,
    `To understand how it works, think of your stomach like a factory that produces acid to digest food. Sometimes, this factory produces more acid than needed, which leads to problems like acidity, heartburn, and ulcers.`,
    `## Common Uses`,
    `- Acidity and Heartburn\n- GERD (Acid Reflux)\n- Stomach and Duodenal Ulcers\n- H. pylori Infection (with antibiotics)\n- Zollinger-Ellison Syndrome\n- Prevention of NSAID-Induced Ulcers`,
    `## Side Effects & Warnings`,
    `Like all medicines, this one may cause side effects in some people. Most are mild and go away on their own. Always consult your doctor before starting or stopping any medication.`,
    `## Conclusion`,
    `Always follow your doctor's advice and complete the prescribed course. If you experience any unusual symptoms, contact your healthcare provider immediately.`,
  ],
}));

export const bySlug = (slug: string) => blogs.find((b) => b.slug === slug);