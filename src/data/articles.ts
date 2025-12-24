export interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  category: 'psychology' | 'coaching' | 'practice';
  readTime: number;
  image: string;
}

export const articles: Article[] = [
  {
    id: 'matrix-for-psychologists',
    title: 'Матрица судьбы для психологов',
    subtitle: 'Как ускорить диагностику клиента в 3 раза',
    category: 'psychology',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
    content: 'Матрица судьбы помогает психологам быстрее понимать клиента.'
  },
  {
    id: 'coaching-sessions-optimization',
    title: 'Оптимизация коуч-сессий',
    subtitle: 'Сокращаем путь к результату',
    category: 'coaching',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    content: 'Матрица судьбы показывает истинные блоки клиента.'
  },
  {
    id: 'first-session-preparation',
    title: 'Подготовка к первой сессии',
    subtitle: 'Узнайте клиента до встречи',
    category: 'practice',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    content: 'Используйте матрицу для подготовки к встрече с клиентом.'
  }
];