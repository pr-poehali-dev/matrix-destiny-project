import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button 
          variant="ghost" 
          className="mb-8 gap-2"
          onClick={() => navigate('/')}
        >
          <Icon name="ArrowLeft" size={20} />
          Назад к калькулятору
        </Button>

        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-primary mb-4">
            О методе матрицы судьбы
          </h1>
          <p className="text-xl text-muted-foreground">
            Древняя система самопознания, адаптированная для современного мира
          </p>
        </header>

        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Icon name="BookOpen" className="text-primary" />
              Что такое матрица судьбы?
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Матрица судьбы — это метод анализа личности на основе даты рождения, объединяющий древние знания нумерологии, арканов Таро и современной психологии. Этот инструмент позволяет понять своё истинное предназначение, сильные стороны и зоны роста.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Icon name="Lightbulb" className="text-primary" />
              История метода
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Метод матрицы судьбы был разработан на основе многовековых знаний различных эзотерических традиций:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Icon name="Check" size={20} className="text-primary mt-1 flex-shrink-0" />
                  <span><strong>Нумерология Пифагора</strong> — наука о числах и их влиянии на судьбу человека</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" size={20} className="text-primary mt-1 flex-shrink-0" />
                  <span><strong>22 аркана Таро</strong> — архетипические образы, описывающие жизненные уроки</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" size={20} className="text-primary mt-1 flex-shrink-0" />
                  <span><strong>Современная психология</strong> — научный подход к интерпретации результатов</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Icon name="Target" className="text-primary" />
              Что показывает матрица?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Предназначение</h3>
                      <p className="text-sm text-muted-foreground">
                        Ваша уникальная миссия в этой жизни, таланты и способности
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="Heart" size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Отношения</h3>
                      <p className="text-sm text-muted-foreground">
                        Особенности построения гармоничных личных отношений
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="Activity" size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Здоровье</h3>
                      <p className="text-sm text-muted-foreground">
                        Зоны внимания в организме и рекомендации по поддержке здоровья
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="DollarSign" size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Финансы</h3>
                      <p className="text-sm text-muted-foreground">
                        Пути реализации и способы привлечения изобилия
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Icon name="Microscope" className="text-primary" />
              Научное обоснование
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Хотя матрица судьбы имеет эзотерические корни, метод находит подтверждение в современных исследованиях:
              </p>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Психология личности</h4>
                    <p className="text-sm text-muted-foreground">
                      Архетипы матрицы коррелируют с типологиями личности (MBTI, Большая пятёрка), описывая устойчивые паттерны поведения
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Хронопсихология</h4>
                    <p className="text-sm text-muted-foreground">
                      Исследования показывают, что время рождения влияет на формирование личности через биоритмы и сезонные факторы
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Нейропластичность</h4>
                    <p className="text-sm text-muted-foreground">
                      Понимание своих особенностей через матрицу активирует осознанность и способствует позитивным изменениям в жизни
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Icon name="CheckCircle" className="text-primary" />
              Как использовать матрицу?
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Матрица судьбы — это инструмент самопознания и развития. Используйте расшифровку для:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">1.</span>
                  <span><strong>Понимания себя</strong> — осознайте свои сильные стороны и зоны роста</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">2.</span>
                  <span><strong>Выбора профессии</strong> — найдите дело, соответствующее вашему предназначению</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">3.</span>
                  <span><strong>Улучшения отношений</strong> — поймите особенности партнёра и детей</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">4.</span>
                  <span><strong>Заботы о здоровье</strong> — узнайте зоны внимания в организме</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="text-center py-12 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">Готовы узнать своё предназначение?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Рассчитайте матрицу судьбы прямо сейчас — это займёт всего 30 секунд
            </p>
            <Button size="lg" className="gap-2" onClick={() => navigate('/')}>
              <Icon name="Calculator" />
              Рассчитать матрицу
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
