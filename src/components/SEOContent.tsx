import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export const SEOContent = () => {
  return (
    <>
      {/* SEO-блок для специалистов */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 py-16 mb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Матрица судьбы — профессиональный инструмент для специалистов
          </h2>
          
          <p className="text-xl text-center text-gray-700 dark:text-gray-300 max-w-4xl mx-auto mb-12">
            Сервис расчёта и расшифровки матрицы судьбы для психологов, HR-специалистов, коучей и нутрициологов. 
            Диагностика личности клиента за 5 минут по дате рождения. Полное пособие с рекомендациями для работы с клиентами.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Для психологов */}
            <Card className="p-6 hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4">
                  <Icon name="Brain" size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-purple-900 dark:text-purple-100">
                  Для психологов и психотерапевтов
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 text-left w-full">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Диагностика клиента за 5 минут вместо 5 сессий</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Кармические задачи и блоки личности</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>План терапии из 5 этапов</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Прогноз результатов терапии</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Конкретные упражнения для работы</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Для HR */}
            <Card className="p-6 hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4">
                  <Icon name="Briefcase" size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-900 dark:text-blue-100">
                  Для HR и рекрутеров
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 text-left w-full">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Совместимость кандидата с командой</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Идеальная должность по предназначению</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Риски увольнения в первые 6 месяцев</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>План удержания сотрудника</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>90-дневный план онбординга</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Для коучей */}
            <Card className="p-6 hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-green-200 dark:border-green-800">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                  <Icon name="TrendingUp" size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-green-900 dark:text-green-100">
                  Для бизнес-коучей
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 text-left w-full">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Почему у клиента нет денег — 4 уровня</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Правильная ниша для x10 дохода</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Денежные блоки и как их убрать</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Прогноз дохода через 6-12 месяцев</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Практики для смены ниши</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Для нутрициологов */}
            <Card className="p-6 hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-orange-200 dark:border-orange-800">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4">
                  <Icon name="Apple" size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-orange-900 dark:text-orange-100">
                  Для нутрициологов
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 text-left w-full">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Почему клиент не худеет — психосоматика</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Кармический блок на лишний вес</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Индивидуальный план питания</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>90-дневная программа похудения</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Упражнения для работы с весом</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>

          {/* Ключевые преимущества для SEO */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-12">
            <h3 className="text-3xl font-bold text-center mb-8">
              Почему специалисты выбирают Матрицу Судьбы
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-indigo-600 mb-2">5 мин</div>
                <p className="text-lg font-semibold mb-2">Быстрая диагностика</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Полный анализ личности клиента за 5 минут по дате рождения вместо 5 сессий сбора анамнеза
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">95%</div>
                <p className="text-lg font-semibold mb-2">Точность анализа</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Клиенты узнают себя в расшифровке и подтверждают точность описания психологических паттернов
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-pink-600 mb-2">×3</div>
                <p className="text-lg font-semibold mb-2">Ускорение работы</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Работа с клиентом ускоряется в 3 раза благодаря точной диагностике блоков и предназначения
                </p>
              </div>
            </div>
          </div>

          {/* SEO-текст */}
          <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Что такое матрица судьбы и как она помогает специалистам</h2>
            
            <p className="text-lg leading-relaxed mb-6">
              <strong>Матрица судьбы</strong> — это метод психологической диагностики личности через дату рождения, 
              основанный на нумерологии арканов Таро. Система позволяет за 5 минут получить глубокий анализ клиента: 
              его предназначение, кармические задачи, психологические блоки, склонности к заболеваниям, финансовый потенциал.
            </p>

            <h3 className="text-2xl font-bold mb-3">Матрица судьбы для психологов</h3>
            <p className="mb-4">
              Психологи используют матрицу для быстрой диагностики клиента. Вместо 3-5 сессий сбора анамнеза, 
              психолог получает карту личности с указанием: кармических задач, защитных механизмов, родительских 
              сценариев, страхов и блоков. Это позволяет сразу начать глубинную терапевтическую работу.
            </p>

            <h3 className="text-2xl font-bold mb-3">Матрица судьбы для HR и рекрутеров</h3>
            <p className="mb-4">
              HR-специалисты применяют матрицу для оценки кандидатов на вакансии. Система показывает: 
              соответствует ли предназначение человека позиции, совместим ли он с командой, какие риски 
              увольнения, что мотивирует сотрудника. Это снижает текучку персонала на 40-60% и экономит 
              200-300 тысяч рублей на найме каждого сотрудника.
            </p>

            <h3 className="text-2xl font-bold mb-3">Матрица судьбы для коучей</h3>
            <p className="mb-4">
              Бизнес-коучи используют матрицу для определения правильной ниши клиента и выявления денежных блоков. 
              Система показывает, в какой сфере человек реализует предназначение и выйдет на доход x10, 
              какие подсознательные убеждения блокируют деньги, как активировать денежный поток.
            </p>

            <h3 className="text-2xl font-bold mb-3">Матрица судьбы для нутрициологов</h3>
            <p className="mb-4">
              Нутрициологи применяют матрицу для работы с психосоматикой лишнего веса. Система раскрывает 
              4 уровня причин веса: физиологию, кармический блок (вес как защита от предназначения), 
              психосоматику (заедание эмоций), социальное давление. Это повышает эффективность программ 
              похудения с 30% до 80% клиентов.
            </p>

            <h3 className="text-2xl font-bold mb-3">Как работает расчёт матрицы судьбы</h3>
            <p className="mb-4">
              Расчёт матрицы выполняется по дате рождения клиента за 30 секунд. Система вычисляет 4 ключевые 
              энергии (арканы): личность, предназначение, социальную роль, духовную суть. Каждая энергия 
              описывается через 22 аркана Таро (от Мага до Шута), каждый из которых имеет уникальные характеристики.
            </p>

            <h3 className="text-2xl font-bold mb-3">Что входит в расшифровку матрицы</h3>
            <p className="mb-4">
              Полная расшифровка матрицы включает: портрет личности (объединение 4 энергий), кармические задачи, 
              блоки и страхи, план работы для психолога (терапия из 5 этапов), рекомендации для HR (совместимость, 
              онбординг, удержание), диагностику для коуча (правильная ниша, денежные блоки, план x10), 
              программу для нутрициолога (психосоматика веса, 90-дневный план). Плюс конкретные упражнения 
              и практики для работы с клиентом.
            </p>
          </div>
        </div>
      </section>

      {/* Блок с ключевыми словами для SEO */}
      <div className="container mx-auto px-4 mb-12">
        <Card className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <h3 className="text-2xl font-bold mb-6 text-center">Популярные запросы специалистов</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              'матрица судьбы для психологов',
              'расчет матрицы судьбы онлайн',
              'матрица судьбы для HR',
              'диагностика по дате рождения',
              'психосоматика лишнего веса',
              'кармические задачи человека',
              'совместимость сотрудника с командой',
              'денежные блоки клиента',
              'предназначение по матрице',
              'расшифровка матрицы судьбы',
              'нумерология для бизнеса',
              'арканы таро значение',
              'психологический портрет клиента',
              'онбординг по матрице',
              'правильная ниша для бизнеса'
            ].map((keyword, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
              >
                {keyword}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};
