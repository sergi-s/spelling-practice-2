import { NextResponse } from 'next/server';
import topicRepo from './repositories/topicRepository';


export const GET = async () => {
    const topics = await topicRepo.getAllTopics()
    return NextResponse.json(topics)
}

// SEEDER HELPER functions has nothing to do with the application logic

const seederTopics = [
    "food", "farming", "sports", "football", "basketball", "tennis", "swimming", "athletics", "baseball", "cricket", "hockey",
    "volleyball", "rugby", "cycling", "boxing", "golf", "gymnastics", "karate", "wrestling", "badminton", "surfing",
    "snowboarding", "skiing", "ice skating", "figure skating", "marathon", "triathlon", "rowing", "sailing", "diving",
    "archery", "fencing", "equestrian", "skateboarding", "climbing", "mountaineering", "hiking", "camping", "fishing",
    "hunting", "bird watching", "photography", "cinematography", "writing", "poetry", "novels", "short stories",
    "journalism", "blogging", "podcasting", "radio", "television", "movies", "theater", "opera", "ballet", "dance",
    "painting", "sculpture", "drawing", "comics", "animation", "video games", "board games", "card games", "puzzles",
    "chess", "checkers", "dominoes", "backgammon", "scrabble", "monopoly", "risk", "dungeons and dragons", "strategy games",
    "role-playing games", "sports games", "simulation games", "arcade games", "mobile games", "PC games", "console games",
    "virtual reality", "augmented reality", "technology", "computers", "smartphones", "tablets", "smartwatches", "gadgets",
    "robotics", "artificial intelligence", "machine learning", "data science", "big data", "cloud computing", "cybersecurity",
    "internet of things", "blockchain", "cryptocurrency", "web development", "app development", "software engineering",
    "programming languages", "JavaScript", "Python", "Java", "C++", "Ruby", "PHP", "Swift", "Kotlin", "TypeScript",
    "HTML", "CSS", "React", "Angular", "Vue", "Node.js", "Django", "Flask", "Spring", "Laravel", "Ruby on Rails",
    "machine learning", "deep learning", "neural networks", "natural language processing", "computer vision",
    "robotics", "automation", "quantum computing", "bioinformatics", "genomics", "biotechnology", "nanotechnology",
    "renewable energy", "solar power", "wind power", "hydropower", "geothermal energy", "bioenergy", "nuclear energy",
    "electric vehicles", "autonomous vehicles", "space exploration", "astronomy", "astrophysics", "cosmology",
    "satellites", "rockets", "spacecraft", "Mars", "Moon", "planets", "stars", "galaxies", "black holes",
    "dark matter", "dark energy", "quantum mechanics", "relativity", "particle physics", "string theory",
    "mathematics", "algebra", "geometry", "trigonometry", "calculus", "statistics", "probability", "number theory",
    "graph theory", "topology", "logic", "set theory", "combinatorics", "optimization", "economics", "microeconomics",
    "macroeconomics", "finance", "investment", "stock market", "cryptocurrency", "banking", "insurance",
    "real estate", "business", "management", "marketing", "sales", "advertising", "public relations",
    "human resources", "entrepreneurship", "startups", "innovation", "leadership", "strategy",
    "project management", "operations", "supply chain", "logistics", "quality management", "lean",
    "six sigma", "customer service", "e-commerce", "retail", "wholesale", "trade", "import",
    "export", "manufacturing", "production", "agriculture", "horticulture", "forestry", "fishing",
    "mining", "construction", "architecture", "engineering", "mechanical engineering", "electrical engineering",
    "civil engineering", "chemical engineering", "biomedical engineering", "aerospace engineering",
    "environmental engineering", "industrial engineering", "materials science", "physics", "chemistry",
    "biology", "zoology", "botany", "ecology", "geology", "meteorology", "oceanography", "paleontology",
    "anthropology", "archaeology", "history", "politics", "government", "law", "international relations",
    "sociology", "psychology", "philosophy", "ethics", "religion", "theology", "linguistics",
    "literature", "languages", "education", "teaching", "learning", "pedagogy", "curriculum",
    "assessment", "special education", "online learning", "distance education", "higher education",
    "primary education", "secondary education", "vocational education", "professional development",
    "training", "certification", "skills development", "personal development", "health", "medicine",
    "nursing", "dentistry", "pharmacy", "public health", "nutrition", "fitness", "mental health",
    "wellness", "alternative medicine", "sports medicine", "physiotherapy", "occupational therapy",
    "speech therapy", "healthcare management", "healthcare technology", "medical research", "clinical trials",
    "epidemiology", "genetics", "immunology", "neurology", "cardiology", "oncology", "pediatrics",
    "geriatrics", "dermatology", "endocrinology", "gastroenterology", "nephrology", "urology",
    "pulmonology", "rheumatology", "psychiatry", "surgery", "anesthesiology", "radiology",
    "pathology", "emergency medicine", "critical care", "infectious diseases", "vaccinology",
    "virology", "bacteriology", "mycology", "parasitology", "entomology", "herpetology",
    "ornithology", "mammalogy", "ichthyology", "paleobiology", "astrobiology", "marine biology",
    "wildlife biology", "conservation", "environmental science", "climate change", "sustainability",
    "pollution", "recycling", "waste management", "water management", "energy management",
    "environmental policy", "environmental law", "environmental ethics", "conservation biology",
    "landscape ecology", "urban ecology", "restoration ecology", "ecotoxicology", "environmental health",
    "natural resources", "biodiversity", "ecosystems", "habitats", "wildlife conservation",
    "forest conservation", "marine conservation", "soil conservation", "water conservation",
    "sustainable agriculture", "sustainable development", "green technology", "clean technology",
    "renewable resources", "alternative energy", "energy efficiency", "carbon footprint",
    "carbon offsetting", "environmental impact", "environmental monitoring", "environmental education",
    "environmental advocacy", "ecotourism", "sustainable tourism", "green building", "sustainable cities",
    "urban planning", "urban design", "public transportation", "smart cities", "resilient cities",
    "community development", "social development", "economic development", "cultural development",
    "human rights", "social justice", "gender equality", "racial equality", "LGBTQ+ rights",
    "disability rights", "indigenous rights", "animal rights", "peace studies", "conflict resolution",
    "humanitarian aid", "disaster relief", "international development", "global health",
    "poverty alleviation", "food security", "clean water", "sanitation", "hygiene",
    "education access", "healthcare access", "economic opportunity", "empowerment", "capacity building",
    "community resilience", "social innovation", "philanthropy", "nonprofits", "social enterprises",
    "corporate social responsibility", "ethical business", "sustainable business", "fair trade",
    "microfinance", "impact investing", "volunteering", "activism", "advocacy", "campaigning",
    "policy making", "governance", "public administration", "political science", "international relations",
    "diplomacy", "security studies", "intelligence studies", "military studies", "defense studies",
    "strategic studies", "peace and conflict studies", "human security", "national security",
    "global security", "cybersecurity", "insurgency", "counterinsurgency",
    "homeland security", "border security"]

export const POST = async () => {
    return NextResponse.json(await topicRepo.createManyTopics(seederTopics.map(t => { return { topic: t } })))
}