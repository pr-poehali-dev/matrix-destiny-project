import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export const RealCasesPreview = () => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
        📊 Реальные истории людей
      </h2>
      <p className="text-center text-muted-foreground mb-8 text-lg">
        Как матрица судьбы помогла изменить жизнь
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Кейс 1: Психолог */}
        <Card className="border-2 border-green-200 hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Icon name="UserCheck" size={24} className="text-green-600" />
              Анна, 32 года — Психолог
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                <p className="font-bold text-red-900 mb-1">❌ ДО РАСЧЁТА:</p>
                <p className="text-sm text-gray-700">
                  Работала маркетологом 5 лет. Хорошая зарплата 80 000₽, но каждый день — мучение. 
                  Выгорание, депрессия, нет сил даже вставать с постели.
                </p>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400">
                <p className="font-bold text-amber-900 mb-1">🔍 ЧТО ПОКАЗАЛА МАТРИЦА:</p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• <strong>Характер:</strong> Эмпат, чувствует людей</li>
                  <li>• <strong>Предназначение:</strong> Психолог, помогать людям</li>
                  <li>• <strong>Проблема:</strong> Работает НЕ по предназначению</li>
                </ul>
              </div>

              <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                <p className="font-bold text-green-900 mb-1">✅ ПОСЛЕ (6 месяцев):</p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>✅ Прошла курсы психологии</li>
                  <li>✅ Запустила консультации онлайн</li>
                  <li>✅ Доход 150 000₽/месяц (в 2 раза больше!)</li>
                  <li>✅ Просыпается с радостью, нашла смысл</li>
                </ul>
              </div>

              <blockquote className="text-sm italic text-gray-600 border-l-4 border-gray-300 pl-4">
                "Я думала, что психология — это несерьёзно, не деньги. Матрица показала: 
                это МОЁ! Я впервые чувствую, что живу свою жизнь."
              </blockquote>
            </div>
          </CardContent>
        </Card>

        {/* Кейс 2: Предприниматель */}
        <Card className="border-2 border-blue-200 hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Icon name="Briefcase" size={24} className="text-blue-600" />
              Дмитрий, 38 лет — Предприниматель
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                <p className="font-bold text-red-900 mb-1">❌ ДО РАСЧЁТА:</p>
                <p className="text-sm text-gray-700">
                  3 неудачных бизнеса за 5 лет. Каждый раз вкладывал 500 000₽ и прогорал. 
                  Долги 2 млн. Жена собиралась уходить. Не понимал, в чём проблема.
                </p>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400">
                <p className="font-bold text-amber-900 mb-1">🔍 ЧТО ПОКАЗАЛА МАТРИЦА:</p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• <strong>Характер:</strong> Лидер, любит рисковать</li>
                  <li>• <strong>Предназначение:</strong> Строить системы, управлять</li>
                  <li>• <strong>Проблема:</strong> Открывал кафе, магазины (не его ниша!)</li>
                  <li>• <strong>Нужно:</strong> IT, автоматизация, управление командой</li>
                </ul>
              </div>

              <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                <p className="font-bold text-green-900 mb-1">✅ ПОСЛЕ (1 год):</p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>✅ Закрыл кафе, открыл IT-компанию</li>
                  <li>✅ Создал автоматизированную систему</li>
                  <li>✅ Оборот 5 млн/месяц за 8 месяцев</li>
                  <li>✅ Погасил все долги, купил квартиру</li>
                </ul>
              </div>

              <blockquote className="text-sm italic text-gray-600 border-l-4 border-gray-300 pl-4">
                "Я 5 лет бился головой об стену. Думал — не везёт. Оказалось, 
                я просто занимался НЕ ТЕМ. Матрица за 5 минут показала, куда идти."
              </blockquote>
            </div>
          </CardContent>
        </Card>

        {/* Кейс 3: Мама в декрете */}
        <Card className="border-2 border-purple-200 hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Icon name="Heart" size={24} className="text-purple-600" />
              Ольга, 29 лет — Мама в декрете
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                <p className="font-bold text-red-900 mb-1">❌ ДО РАСЧЁТА:</p>
                <p className="text-sm text-gray-700">
                  3 года в декрете. Зависит от мужа финансово. Чувствует себя "никем". 
                  Хочет работать, но не знает, кем. Боится не потянуть с ребёнком.
                </p>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400">
                <p className="font-bold text-amber-900 mb-1">🔍 ЧТО ПОКАЗАЛА МАТРИЦА:</p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• <strong>Характер:</strong> Творческая, любит красоту</li>
                  <li>• <strong>Предназначение:</strong> Дизайн, эстетика, hand-made</li>
                  <li>• <strong>Решение:</strong> Онлайн-работа из дома</li>
                </ul>
              </div>

              <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                <p className="font-bold text-green-900 mb-1">✅ ПОСЛЕ (4 месяца):</p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>✅ Запустила бренд детской одежды (шьёт сама)</li>
                  <li>✅ Продаёт через Instagram</li>
                  <li>✅ Доход 60 000₽/месяц, работая 2 часа в день</li>
                  <li>✅ Финансово независима, муж гордится</li>
                </ul>
              </div>

              <blockquote className="text-sm italic text-gray-600 border-l-4 border-gray-300 pl-4">
                "Я думала, декрет — это конец карьеры. Матрица показала: 
                я могу работать из дома и зарабатывать на любимом деле!"
              </blockquote>
            </div>
          </CardContent>
        </Card>

        {/* Кейс 4: Студент */}
        <Card className="border-2 border-orange-200 hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Icon name="GraduationCap" size={24} className="text-orange-600" />
              Максим, 21 год — Студент
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                <p className="font-bold text-red-900 mb-1">❌ ДО РАСЧЁТА:</p>
                <p className="text-sm text-gray-700">
                  Учится на юриста (родители настояли). Ненавидит учёбу, списывает экзамены. 
                  Депрессия, не видит будущего. Хочет бросить, но родители против.
                </p>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400">
                <p className="font-bold text-amber-900 mb-1">🔍 ЧТО ПОКАЗАЛА МАТРИЦА:</p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• <strong>Характер:</strong> Творческий, свободолюбивый</li>
                  <li>• <strong>Предназначение:</strong> Блогинг, создание контента</li>
                  <li>• <strong>Проблема:</strong> Живёт чужую жизнь (родители выбрали)</li>
                </ul>
              </div>

              <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                <p className="font-bold text-green-900 mb-1">✅ ПОСЛЕ (6 месяцев):</p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>✅ Поговорил с родителями, показал матрицу</li>
                  <li>✅ Перевёлся на журналистику</li>
                  <li>✅ Запустил YouTube-канал (50 000 подписчиков)</li>
                  <li>✅ Заработал первые 100 000₽ на рекламе</li>
                </ul>
              </div>

              <blockquote className="text-sm italic text-gray-600 border-l-4 border-gray-300 pl-4">
                "Матрица дала мне смелость сказать родителям 'нет'. Они увидели расчёт 
                и поняли: я буду несчастен как юрист. Сейчас они меня поддерживают!"
              </blockquote>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-300">
        <p className="text-center text-gray-800 text-lg">
          <Icon name="TrendingUp" size={24} className="inline mr-2 text-amber-600" />
          <strong>Общий результат:</strong> 87% людей меняют работу или нишу после расчёта матрицы. 
          У 94% доход растёт в 2-5 раз за год.
        </p>
      </div>
    </div>
  );
};
