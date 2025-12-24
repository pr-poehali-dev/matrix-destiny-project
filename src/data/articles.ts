export interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  category: 'psychology' | 'coaching' | 'practice';
  readTime: number;
  image: string;
}

export const articles: Article[] = [];
