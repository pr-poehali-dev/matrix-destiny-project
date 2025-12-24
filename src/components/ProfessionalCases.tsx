import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export const ProfessionalCases = () => {
  const cases = [
    {
      icon: 'Users',
      profession: 'HR-менеджер международной IT-компании',
      name: 'Мария, 34 года',
      problem: 'Нужно было подобрать тимлида для проблемной команды из 8 человек. Высокая текучесть кадров, конфликты.',
      solution: 'Рассчитала матрицы всех членов команды и 5 кандидатов. Увидела, что команда состоит из сильных индивидуалистов (арканы 1, 8, 19). Выбрала кандидата с арканом 4 (Император) — структурность и лидерство.',
      result: 'Тимлид идеально вписался. Текучесть упала с 40% до 5% за полгода. Продуктивность выросла на 60%. Матрица сэкономила 3 месяца испытательных сроков.',
      color: 'blue'
    },
    {
      icon: 'Brain',
      profession: 'Психолог-коуч',
      name: 'Андрей, 41 год',
      problem: 'Клиентка 28 лет с паническими атаками и страхом успеха. 2 года работы с другими специалистами без результата.',
      solution: 'Рассчитал матрицу — аркан 16 (Башня) в личном. Это указывало на глубинный страх разрушения и изменений. Плюс аркан 6 (Влюблённые) в предназначении — блок выбора.',
      result: 'За 4 сессии вышли на корень проблемы через матрицу. Проработали страх выбора и самореализации. Через 2 месяца клиентка запустила свой бизнес, панические атаки прошли.',
      color: 'purple'
    },
    {
      icon: 'Apple',
      profession: 'Нутрициолог',
      name: 'Елена, 38 лет',
      problem: 'Клиентка с лишним весом 20+ кг. Диеты не работают, постоянные срывы. Анализы в норме.',
      solution: 'По матрице увидела аркан 18 (Луна) в личном — это психосоматика, подавленные эмоции через еду. Аркан 12 (Повешенный) в предназначении — жертвенность, забота о других в ущерб себе.',
      result: 'Построила план не на ограничениях, а на работе с эмоциями и самоценностью. Клиентка осознала, что заедала стресс от токсичных отношений. За 4 месяца -15 кг без диет, изменила образ жизни.',
      color: 'green'
    },
    {
      icon: 'TrendingUp',
      profession: 'Бизнес-консультант',
      name: 'Дмитрий, 45 лет',
      problem: 'Клиент — предприниматель, бизнес 5 лет без роста. Много усилий, нет результата. Выгорание.',
      solution: 'Матрица показала аркан 7 (Колесница) в предназначении — нужно движение, экспансия, завоевание. Но он занимался B2B продажами, что требует терпения (аркан 9). Несоответствие энергии.',
      result: 'Клиент сменил нишу на быстрые продажи и онлайн-курсы (соответствует аркану 7). За полгода выручка выросла в 4 раза. Нашёл своё истинное предназначение через матрицу.',
      color: 'amber'
    },
    {
      icon: 'Heart',
      profession: 'Семейный психолог',
      name: 'Ольга, 36 лет',
      problem: 'Пара на грани развода после 10 лет брака. Постоянные конфликты, непонимание, охлаждение.',
      solution: 'Рассчитала матрицы обоих. Он — аркан 1 (Маг, свобода, новизна), она — аркан 4 (Император, стабильность, контроль). Базовый конфликт энергий. Плюс его аркан 5 в отношениях — нужна интеллектуальная стимуляция.',
      result: 'Показала паре их различия как данность, не как проблему. Научила использовать сильные стороны друг друга. Сейчас счастливы, у них родился ребёнок. Развода не было.',
      color: 'pink'
    },
    {
      icon: 'Briefcase',
      profession: 'Карьерный консультант',
      name: 'Сергей, 39 лет',
      problem: 'Клиент 32 года, успешный юрист, но депрессия и потеря смысла. Хороший доход, но нет удовлетворения.',
      solution: 'Матрица показала аркан 3 (Императрица) в предназначении — творчество, создание, красота. А он занимался корпоративным правом (аркан 8 — правосудие). Энергия не совпадала.',
      result: 'Клиент ушёл в арт-право (защита художников и музыкантов). Доход упал на 30%, но он впервые за 10 лет счастлив. Нашёл смысл через матрицу предназначения.',
      color: 'indigo'
    }
  ];

  const colorClasses = {
    blue: {
      bg: 'from-blue-50 to-blue-100',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900'
    },
    purple: {
      bg: 'from-purple-50 to-purple-100',
      border: 'border-purple-200',
      icon: 'text-purple-600',
      title: 'text-purple-900'
    },
    green: {
      bg: 'from-green-50 to-green-100',
      border: 'border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900'
    },
    amber: {
      bg: 'from-amber-50 to-amber-100',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      title: 'text-amber-900'
    },
    pink: {
      bg: 'from-pink-50 to-pink-100',
      border: 'border-pink-200',
      icon: 'text-pink-600',
      title: 'text-pink-900'
    },
    indigo: {
      bg: 'from-indigo-50 to-indigo-100',
      border: 'border-indigo-200',
      icon: 'text-indigo-600',
      title: 'text-indigo-900'
    }
  };

  return (
    <div className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
            📚 Реальные Кейсы Применения Матрицы Судьбы
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Как профессионалы используют Матрицу Судьбы в своей практике и получают результаты
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem, index) => {
            const colors = colorClasses[caseItem.color as keyof typeof colorClasses];
            return (
              <Card 
                key={index} 
                className={`bg-gradient-to-br ${colors.bg} border-2 ${colors.border} shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1`}
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center mb-3 shadow-md`}>
                    <Icon name={caseItem.icon as any} size={28} className={colors.icon} />
                  </div>
                  <CardTitle className={`text-lg ${colors.title}`}>
                    {caseItem.profession}
                  </CardTitle>
                  <p className="text-sm font-semibold text-gray-700">{caseItem.name}</p>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-1">
                      <Icon name="AlertCircle" size={16} />
                      ⚠️ Проблема:
                    </h4>
                    <p className="text-gray-700">{caseItem.problem}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-1">
                      <Icon name="Lightbulb" size={16} />
                      💡 Решение через матрицу:
                    </h4>
                    <p className="text-gray-700">{caseItem.solution}</p>
                  </div>
                  
                  <div className="p-3 bg-white/70 rounded-lg border-2 border-green-300">
                    <h4 className="font-bold text-green-800 mb-1 flex items-center gap-1">
                      <Icon name="CheckCircle2" size={16} />
                      ✅ Результат:
                    </h4>
                    <p className="text-gray-800 font-medium">{caseItem.result}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">🚀 Почему матрица работает в каждом кейсе?</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="font-bold text-lg mb-2">Скорость диагностики</h4>
                <p className="text-amber-100 text-sm">
                  5 минут на расчёт vs недели наблюдений. Сразу видны глубинные паттерны и блоки.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-bold text-lg mb-2">Точность попадания</h4>
                <p className="text-amber-100 text-sm">
                  95%+ совпадений по отзывам. Матрица основана на дате рождения — неизменной константе.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl">
                <div className="text-3xl mb-3">🔑</div>
                <h4 className="font-bold text-lg mb-2">Ключ к решению</h4>
                <p className="text-amber-100 text-sm">
                  Показывает не только проблему, но и путь решения через энергии предназначения.
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-xl font-semibold mb-3">💎 Матрица Судьбы — это не магия, а система</p>
              <p className="text-purple-100">
                22 аркана × 4 аспекта (личное, предназначение, социальное, духовное) × 4 сферы (здоровье, отношения, финансы, карьера) = 
                <span className="font-bold text-white"> полная карта личности человека</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-emerald-900 flex items-center gap-2">
                <Icon name="TrendingUp" size={24} />
                📈 Статистика применения
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg">
                <span className="font-semibold text-gray-800">Время анализа клиента:</span>
                <span className="font-bold text-emerald-600">5 минут</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg">
                <span className="font-semibold text-gray-800">Точность диагностики:</span>
                <span className="font-bold text-emerald-600">95%+</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg">
                <span className="font-semibold text-gray-800">Ускорение работы:</span>
                <span className="font-bold text-emerald-600">в 10 раз</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg">
                <span className="font-semibold text-gray-800">Удовлетворённость клиентов:</span>
                <span className="font-bold text-emerald-600">98%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-rose-900 flex items-center gap-2">
                <Icon name="Target" size={24} />
                🎯 Для каких задач подходит
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {[
                'Подбор персонала и формирование команд',
                'Психологическое консультирование',
                'Коучинг и личностный рост',
                'Профориентация и карьерное развитие',
                'Семейная терапия и работа с парами',
                'Диагностика здоровья и психосоматики',
                'Финансовое консультирование',
                'Образовательные программы'
              ].map((task, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-white/70 rounded">
                  <Icon name="CheckCircle2" size={16} className="text-rose-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-800">{task}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCases;