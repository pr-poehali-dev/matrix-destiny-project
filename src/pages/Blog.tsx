import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { articles } from '@/data/articles';

const categoryLabels = {
  psychology: 'Психология',
  coaching: 'Коучинг',
  practice: 'Практика',
  nutrition: 'Нутрициология'
};

const categoryColors = {
  psychology: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  coaching: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
  practice: 'bg-green-500/10 text-green-700 border-green-500/20',
  nutrition: 'bg-orange-500/10 text-orange-700 border-orange-500/20'
};

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = selectedCategory
    ? articles.filter(article => article.category === selectedCategory)
    : articles;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <Icon name="ArrowLeft" className="mr-2" size={16} />
              На главную
            </Button>
          </Link>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            База знаний для специалистов
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Практические статьи о том, как психологам и коучам использовать матрицу судьбы для повышения эффективности работы с клиентами
          </p>
        </header>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="gap-2"
          >
            <Icon name="Grid" size={16} />
            Все статьи
          </Button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              onClick={() => setSelectedCategory(key)}
              className="gap-2"
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredArticles.map((article) => (
            <Link key={article.id} to={`/blog/${article.id}`}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={categoryColors[article.category]}>
                      {categoryLabels[article.category]}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Icon name="Clock" size={14} />
                      {article.readTime} мин
                    </span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {article.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full group-hover:bg-primary/10">
                    Читать статью
                    <Icon name="ArrowRight" className="ml-2" size={16} />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">
              Начните использовать матрицу в работе
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="grid md:grid-cols-3 gap-4 w-full mb-6">
              <div className="flex items-start gap-3 p-4 bg-card rounded-lg">
                <Icon name="Zap" className="text-primary flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Быстрая диагностика</h3>
                  <p className="text-sm text-muted-foreground">
                    Узнайте клиента за 5 минут вместо 5 сессий
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-card rounded-lg">
                <Icon name="TrendingUp" className="text-accent flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Больше клиентов</h3>
                  <p className="text-sm text-muted-foreground">
                    WOW-эффект запускает поток рекомендаций
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-card rounded-lg">
                <Icon name="DollarSign" className="text-primary flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Выше средний чек</h3>
                  <p className="text-sm text-muted-foreground">
                    Премиум-позиционирование позволяет поднять цены
                  </p>
                </div>
              </div>
            </div>
            <Link to="/payment">
              <Button size="lg" className="text-lg px-8">
                <Icon name="Sparkles" className="mr-2" />
                Попробовать бесплатно 7 дней
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Без привязки карты • Отмена в любой момент
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}