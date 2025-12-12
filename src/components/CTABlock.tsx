import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CTABlockProps {
  onCalculate: () => void;
}

export function CTABlock({ onCalculate }: CTABlockProps) {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-sm font-medium text-primary mb-4">
            <Icon name="Sparkles" size={16} />
            Бесплатный расчёт за 30 секунд
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Готовы узнать своё предназначение?
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Присоединяйтесь к 25 000+ людей, которые уже изменили свою жизнь благодаря матрице судьбы
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 gap-2"
              onClick={onCalculate}
            >
              <Icon name="Calculator" />
              Рассчитать мою матрицу
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="CheckCircle" size={16} className="text-green-600" />
              <span>Без регистрации</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 mt-8 border-t border-border">
            <div>
              <div className="text-3xl font-bold text-primary mb-1">25 000+</div>
              <div className="text-sm text-muted-foreground">Расчётов</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">4.9</div>
              <div className="text-sm text-muted-foreground">Рейтинг</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">98%</div>
              <div className="text-sm text-muted-foreground">Довольны</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
