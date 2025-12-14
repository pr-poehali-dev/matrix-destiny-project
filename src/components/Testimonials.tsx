import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Testimonial {
  name: string;
  age: number;
  city: string;
  rating: number;
  text: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Елена',
    age: 34,
    city: 'Москва',
    rating: 5,
    text: 'Невероятная точность! Матрица описала все мои жизненные этапы и проблемы со здоровьем, о которых я даже не упоминала. Теперь понимаю, почему у меня были сложности с карьерой — работала не по своему предназначению. Спасибо за открытие!',
    date: '2 дня назад'
  },
  {
    name: 'Дмитрий',
    age: 41,
    city: 'Санкт-Петербург',
    rating: 5,
    text: 'Скептически относился к нумерологии, но решил попробовать. Был шокирован точностью — описание полностью совпало с моей личностью и жизненными задачами. Отчёт очень подробный, сохранил себе весь текст. Рекомендую всем!',
    date: '5 дней назад'
  },
  {
    name: 'Анна',
    age: 28,
    city: 'Казань',
    rating: 5,
    text: 'Сделала расчёт для себя и мужа. Теперь понимаю, почему у нас возникали конфликты — мы просто не понимали энергии друг друга. Матрица помогла нам наладить отношения. Это работает! ❤️',
    date: '1 неделю назад'
  },
  {
    name: 'Сергей',
    age: 37,
    city: 'Новосибирск',
    rating: 5,
    text: 'Давно искал своё призвание. Расшифровка матрицы показала, что я должен работать с людьми и обучать. Через месяц открыл свою школу, клиенты идут потоком. Всё сходится! Спасибо за этот инструмент самопознания.',
    date: '2 недели назад'
  },
  {
    name: 'Ольга',
    age: 45,
    city: 'Екатеринбург',
    rating: 5,
    text: 'Рассчитала матрицу для всей семьи — себя, мужа и двоих детей. Теперь понимаю особенности каждого и знаю, как правильно их поддерживать. Дети стали спокойнее, в семье наступила гармония. Бесценная информация!',
    date: '3 недели назад'
  }
];

export function Testimonials() {
  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Отзывы наших пользователей
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Более 25 000 человек уже узнали свою судьбу и изменили жизнь к лучшему
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{testimonial.name}, {testimonial.age}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.city}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Icon key={i} name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {testimonial.text}
                </p>
                <p className="text-xs text-muted-foreground">{testimonial.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}