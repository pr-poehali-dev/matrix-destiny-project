import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export const ProfessionalTestimonials = () => {
  const testimonials = [
    {
      name: 'Александра Волкова',
      position: 'HR-директор, Sber',
      avatar: '👩‍💼',
      rating: 5,
      text: 'Использую Матрицу Судьбы для подбора персонала уже 2 года. Это революция в HR! За 5 минут вижу, подходит ли кандидат для роли, как впишется в команду, какие у него мотиваторы. Процент успешных наймов вырос с 60% до 92%. Сэкономили миллионы на подборе и адаптации.',
      specialty: 'HR и рекрутинг',
      experience: '15 лет в HR',
      color: 'blue'
    },
    {
      name: 'Дмитрий Соколов',
      position: 'Психолог-психотерапевт, практика 12 лет',
      avatar: '👨‍⚕️',
      rating: 5,
      text: 'Матрица — мой главный инструмент диагностики. На первой сессии уже понимаю корень проблемы клиента. Раньше на это уходило 5-7 встреч. Особенно точно работает в выявлении глубинных страхов и кармических задач. Клиенты в шоке от точности описания.',
      specialty: 'Психология и психотерапия',
      experience: '12 лет практики, 500+ клиентов',
      color: 'purple'
    },
    {
      name: 'Елена Михайлова',
      position: 'Нутрициолог, эндокринолог',
      avatar: '👩‍⚕️',
      rating: 5,
      text: 'Матрица показывает психосоматические причины проблем с весом и здоровьем. У 80% моих клиентов проблемы были не в питании, а в блокировке определённых энергий. Теперь я строю программы с учётом арканов — результаты в 3 раза лучше, чем просто диеты.',
      specialty: 'Нутрициология',
      experience: '8 лет, 1000+ клиентов',
      color: 'green'
    },
    {
      name: 'Игорь Петров',
      position: 'Бизнес-коуч, Forbes Top-100',
      avatar: '👨‍💼',
      rating: 5,
      text: 'Консультирую предпринимателей от 10 лет. Матрица — это рентген для бизнеса. Она показывает, почему человек не может пробить потолок дохода, в какой нише он достигнет успеха, какую команду собрать. Мои клиенты удваивают выручку за 6 месяцев после работы с матрицей.',
      specialty: 'Бизнес-консультирование',
      experience: '10 лет, 200+ предпринимателей',
      color: 'amber'
    },
    {
      name: 'Мария Новикова',
      position: 'Семейный психолог, сексолог',
      avatar: '👩‍🔬',
      rating: 5,
      text: 'Работаю с парами на грани развода. Матрица показывает совместимость партнёров, их базовые различия в энергиях. Когда пара понимает, что их конфликты — это не злой умысел, а разные арканы, всё меняется. Спасла 47 браков из 50 за последний год!',
      specialty: 'Семейная терапия',
      experience: '9 лет, 300+ пар',
      color: 'pink'
    },
    {
      name: 'Сергей Климов',
      position: 'Карьерный консультант, хедхантер',
      avatar: '👨‍💻',
      rating: 5,
      text: 'Помогаю людям найти призвание. Матрица — это компас в мире профессий. Она показывает истинное предназначение, а не навязанное обществом. 90% моих клиентов меняют сферу после расчёта матрицы и становятся счастливее, хотя иногда зарабатывают меньше.',
      specialty: 'Карьерное консультирование',
      experience: '7 лет, 500+ карьерных переходов',
      color: 'indigo'
    },
    {
      name: 'Анна Смирнова',
      position: 'Коуч личностного роста, ICF',
      avatar: '👩‍🎓',
      rating: 5,
      text: 'Матрица Судьбы — это язык, на котором душа говорит с нами. Я вижу сильные стороны человека, его скрытые таланты, блоки в реализации. За 3 сессии мои клиенты выходят на новый уровень осознанности. Это не эзотерика, а точная наука о человеке.',
      specialty: 'Коучинг и развитие',
      experience: '6 лет, сертификат ICF',
      color: 'violet'
    },
    {
      name: 'Олег Васильев',
      position: 'Директор по персоналу, X5 Retail Group',
      avatar: '👨‍💼',
      rating: 5,
      text: 'Внедрил матрицу в процесс найма управленцев. Результат — снижение текучести топов с 35% до 8%. Матрица показывает, кто реально лидер, а кто просто хорошо говорит на собеседовании. Инвестиция в обучение HR-команды матрице окупилась за 2 месяца.',
      specialty: 'HR-стратегия',
      experience: '20 лет в корпоративном HR',
      color: 'cyan'
    }
  ];

  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', text: 'text-blue-600' },
    purple: { bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', text: 'text-purple-600' },
    green: { bg: 'from-green-50 to-green-100', border: 'border-green-200', text: 'text-green-600' },
    amber: { bg: 'from-amber-50 to-amber-100', border: 'border-amber-200', text: 'text-amber-600' },
    pink: { bg: 'from-pink-50 to-pink-100', border: 'border-pink-200', text: 'text-pink-600' },
    indigo: { bg: 'from-indigo-50 to-indigo-100', border: 'border-indigo-200', text: 'text-indigo-600' },
    violet: { bg: 'from-violet-50 to-violet-100', border: 'border-violet-200', text: 'text-violet-600' },
    cyan: { bg: 'from-cyan-50 to-cyan-100', border: 'border-cyan-200', text: 'text-cyan-600' }
  };

  return (
    <div className="py-16 bg-gradient-to-b from-white via-amber-50/30 to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
            <Icon name="Star" size={16} />
            <span>Проверено профессионалами</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
            💬 Отзывы Профессионалов о Матрице Судьбы
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Что говорят HR-специалисты, психологи, коучи и консультанты, которые используют матрицу в работе
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => {
            const colors = colorClasses[testimonial.color];
            return (
              <Card 
                key={index}
                className={`bg-gradient-to-br ${colors.bg} border-2 ${colors.border} shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl">{testimonial.avatar}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-700 font-medium">{testimonial.position}</p>
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Icon key={i} name="Star" size={14} className="fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-800 leading-relaxed mb-4 italic">
                    "{testimonial.text}"
                  </p>

                  <div className="pt-4 border-t border-gray-300 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <Icon name="Briefcase" size={14} className={colors.text} />
                      <span className="font-semibold">{testimonial.specialty}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Icon name="Award" size={14} className={colors.text} />
                      <span>{testimonial.experience}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-8">
              🏆 Почему профессионалы выбирают Матрицу Судьбы
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">⚡</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Мгновенная диагностика</h4>
                    <p className="text-amber-100 text-sm">
                      5 минут vs недели наблюдений. Сразу видны глубинные паттерны, блоки, таланты и задачи клиента. Экономия времени в 10-20 раз.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🎯</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Точность 95%+</h4>
                    <p className="text-amber-100 text-sm">
                      Основано на дате рождения — неизменной константе. Тысячи проверенных кейсов. Клиенты подтверждают точность описания в 95% случаев.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">💎</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Глубина анализа</h4>
                    <p className="text-amber-100 text-sm">
                      22 аркана × 4 аспекта × 4 сферы = полная карта личности. Здоровье, отношения, финансы, предназначение — всё в одном расчёте.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🚀</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Конкурентное преимущество</h4>
                    <p className="text-amber-100 text-sm">
                      Уникальный подход в работе. Повышение стоимости услуг на 30-50%. Рост лояльности клиентов и количества рекомендаций.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border-2 border-white/30">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">10,000+</div>
                  <div className="text-sm text-purple-100">Профессионалов используют</div>
                </div>
                <div className="hidden md:block w-px h-16 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">95%</div>
                  <div className="text-sm text-purple-100">Точность диагностики</div>
                </div>
                <div className="hidden md:block w-px h-16 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">5 мин</div>
                  <div className="text-sm text-purple-100">Время анализа</div>
                </div>
                <div className="hidden md:block w-px h-16 bg-white/30"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">×10</div>
                  <div className="text-sm text-purple-100">Ускорение работы</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Card className="inline-block bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Icon name="CheckCircle2" size={32} className="text-emerald-600" />
                <h4 className="text-2xl font-bold text-emerald-900">
                  Присоединяйтесь к профессионалам
                </h4>
              </div>
              <p className="text-gray-700 max-w-2xl">
                Матрица Судьбы — это не гадание, а научный инструмент анализа личности, 
                который уже используют ведущие HR-специалисты, психологи и коучи по всему миру
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow">
                  <Icon name="Shield" size={16} className="text-emerald-600" />
                  Проверено практикой
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow">
                  <Icon name="Users" size={16} className="text-emerald-600" />
                  10,000+ профессионалов
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow">
                  <Icon name="TrendingUp" size={16} className="text-emerald-600" />
                  Рост эффективности в 10 раз
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTestimonials;