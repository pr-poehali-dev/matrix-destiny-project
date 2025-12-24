import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { articles } from '@/data/articles';
import ReactMarkdown from 'react-markdown';

const categoryLabels = {
  psychology: 'Психология',
  coaching: 'Коучинг',
  practice: 'Практика'
};

const categoryColors = {
  psychology: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  coaching: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
  practice: 'bg-green-500/10 text-green-700 border-green-500/20'
};

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = articles.find(a => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Статья не найдена</CardTitle>
            <CardDescription>Запрошенная статья не существует</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/blog">
              <Button>
                <Icon name="ArrowLeft" className="mr-2" size={16} />
                Вернуться к статьям
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const relatedArticles = articles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/blog">
            <Button variant="ghost" size="sm">
              <Icon name="ArrowLeft" className="mr-2" size={16} />
              Все статьи
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              На главную
            </Button>
          </Link>
        </div>

        <article className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="aspect-[21/9] overflow-hidden rounded-xl mb-6">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <Badge className={categoryColors[article.category]}>
                {categoryLabels[article.category]}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Icon name="Clock" size={14} />
                {article.readTime} минут чтения
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {article.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {article.subtitle}
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="prose prose-lg max-w-none pt-6">
              <ReactMarkdown
                components={{
                  h2: ({children}) => (
                    <h2 className="text-3xl font-bold mt-8 mb-4 text-primary">{children}</h2>
                  ),
                  h3: ({children}) => (
                    <h3 className="text-2xl font-semibold mt-6 mb-3">{children}</h3>
                  ),
                  p: ({children}) => (
                    <p className="text-base leading-relaxed mb-4 text-foreground">{children}</p>
                  ),
                  ul: ({children}) => (
                    <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
                  ),
                  ol: ({children}) => (
                    <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
                  ),
                  li: ({children}) => (
                    <li className="text-foreground">{children}</li>
                  ),
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic bg-primary/5 rounded-r">
                      {children}
                    </blockquote>
                  ),
                  strong: ({children}) => (
                    <strong className="font-bold text-primary">{children}</strong>
                  ),
                  hr: () => <hr className="my-8 border-border" />
                }}
              >
                {article.content}
              </ReactMarkdown>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20 mb-12">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">
                Готовы попробовать на практике?
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Link to="/payment">
                <Button size="lg" className="text-lg px-8">
                  <Icon name="Sparkles" className="mr-2" />
                  Начать бесплатный период
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Без привязки карты • Отмена в любой момент
              </p>
            </CardContent>
          </Card>

          {relatedArticles.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Читайте также</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Card
                    key={relatedArticle.id}
                    className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                    onClick={() => {
                      navigate(`/blog/${relatedArticle.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <Badge className={`${categoryColors[relatedArticle.category]} mb-2 w-fit`}>
                        {categoryLabels[relatedArticle.category]}
                      </Badge>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {relatedArticle.title}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}