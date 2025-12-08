export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  tags: string[];
}

export interface AIResponse {
  title: string;
  content: string;
  summary: string;
  tags: string[];
}

export interface SiteContent {
  personal: {
    name: string;
    title: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    description: string;
    imageUrl: string;
    experienceYears: string;
  };
  about: {
    title: string;
    paragraph1: string;
    paragraph2: string;
  };
}