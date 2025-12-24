import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { energyDescriptions } from '@/data/arcana-descriptions';

interface UnifiedMatrixResultProps {
  result: {
    personal: number;
    destiny: number;
    social: number;
    spiritual: number;
    name: string;
  };
  hasAccess: boolean;
}

export const UnifiedMatrixResult = ({ result, hasAccess }: UnifiedMatrixResultProps) => {
  if (!hasAccess) return null;

  const personal = energyDescriptions[result.personal];
  const destiny = energyDescriptions[result.destiny];
  const social = energyDescriptions[result.social];
  const spiritual = energyDescriptions[result.spiritual];

  return (
    <Card className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-300 shadow-2xl mb-8">
      <CardHeader className="text-center space-y-4 pb-8">
        <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600">
          🎯 ПОЛНЫЙ ПОРТРЕТ ЛИЧНОСТИ
        </CardTitle>
        <p className="text-xl text-amber-900 font-semibold">
          {result.name} — Единый анализ всех 4 энергий
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* КТО ЭТОТ ЧЕЛОВЕК */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-8 rounded-2xl border-2 border-purple-400 shadow-2xl">
          <h3 className="text-3xl font-bold text-purple-900 mb-6 flex items-center gap-3">
            <Icon name="User" size={32} />
            👤 КТО ЭТОТ ЧЕЛОВЕК
          </h3>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-lg text-gray-800 text-lg leading-relaxed space-y-4">
            <p>
              <strong>{result.name}</strong> — это человек, который объединяет в себе 4 энергии:
            </p>
            
            <div className="space-y-3">
              <p>
                <strong className="text-amber-700">🔥 ХАРАКТЕР (Аркан {result.personal} - {personal?.title}):</strong><br/>
                {personal?.description}
              </p>
              
              <p>
                <strong className="text-yellow-700">🎯 ПРЕДНАЗНАЧЕНИЕ (Аркан {result.destiny} - {destiny?.title}):</strong><br/>
                {destiny?.description}
              </p>
              
              <p>
                <strong className="text-green-700">🤝 СОЦИАЛЬНАЯ РОЛЬ (Аркан {result.social} - {social?.title}):</strong><br/>
                {social?.description}
              </p>
              
              <p>
                <strong className="text-indigo-700">✨ ДУХОВНАЯ СУТЬ (Аркан {result.spiritual} - {spiritual?.title}):</strong><br/>
                {spiritual?.description}
              </p>
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
              <p className="font-bold text-amber-900">КЛЮЧЕВОЕ:</p>
              <p className="text-gray-800">
                Этот человек проживает жизнь через призму <strong>{personal?.title}</strong> (как он себя ощущает), 
                стремится реализовать <strong>{destiny?.title}</strong> (его истинная цель), 
                в обществе выглядит как <strong>{social?.title}</strong> (как его воспринимают), 
                а на духовном уровне он <strong>{spiritual?.title}</strong> (глубинная суть).
              </p>
            </div>
          </div>
        </div>

        {/* ГЛАВНОЕ ПРЕДНАЗНАЧЕНИЕ */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-8 rounded-2xl border-2 border-yellow-400 shadow-2xl">
          <h3 className="text-3xl font-bold text-yellow-900 mb-6 flex items-center gap-3">
            <Icon name="Target" size={32} />
            🎯 ГЛАВНОЕ ПРЕДНАЗНАЧЕНИЕ
          </h3>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-lg text-gray-800 leading-relaxed space-y-4">
            <p className="text-xl font-bold text-yellow-800">
              Ваша миссия — {destiny?.title}
            </p>
            
            <p className="text-lg">
              {destiny?.description}
            </p>

            <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <p className="font-bold text-green-900 mb-2">💼 Профессии и деньги:</p>
              <p className="text-gray-800">{destiny?.career}</p>
              <p className="text-gray-800 mt-2"><strong>Финансы:</strong> {destiny?.finance}</p>
            </div>
          </div>
        </div>

        {/* ТАЛАНТЫ И ДАРЫ - ОБЪЕДИНЕННЫЕ */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-8 rounded-2xl border-2 border-green-400 shadow-2xl">
          <h3 className="text-3xl font-bold text-green-900 mb-6 flex items-center gap-3">
            <Icon name="Sparkles" size={32} />
            ✨ ВАШИ ТАЛАНТЫ И ДАРЫ (из всех 4 энергий)
          </h3>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-bold text-amber-700 mb-2">🔥 Из Личности (Аркан {result.personal} - {personal?.title}):</p>
                <ul className="text-sm text-gray-800 space-y-1 list-disc list-inside">
                  <li>Основа личности — {personal?.title}</li>
                  <li>Личная сила и характер</li>
                  <li>Природные таланты и склонности</li>
                  <li>Ваша уникальность</li>
                </ul>
              </div>
              
              <div>
                <p className="font-bold text-yellow-700 mb-2">🎯 Из Предназначения (Аркан {result.destiny} - {destiny?.title}):</p>
                <ul className="text-sm text-gray-800 space-y-1 list-disc list-inside">
                  <li>Предназначение в {destiny?.career?.split(',')[0]}</li>
                  <li>Главная миссия жизни</li>
                  <li>Путь к успеху и деньгам</li>
                  <li>Кармическая задача</li>
                </ul>
              </div>
              
              <div>
                <p className="font-bold text-green-700 mb-2">🤝 Из Социальной роли (Аркан {result.social} - {social?.title}):</p>
                <ul className="text-sm text-gray-800 space-y-1 list-disc list-inside">
                  <li>Социальные навыки — {social?.title}</li>
                  <li>Умение работать с людьми</li>
                  <li>Ваша роль в обществе</li>
                  <li>Как вас видят другие</li>
                </ul>
              </div>
              
              <div>
                <p className="font-bold text-indigo-700 mb-2">✨ Из Духовной сути (Аркан {result.spiritual} - {spiritual?.title}):</p>
                <ul className="text-sm text-gray-800 space-y-1 list-disc list-inside">
                  <li>Духовная сила — {spiritual?.title}</li>
                  <li>Духовная мудрость</li>
                  <li>Связь с высшим смыслом</li>
                  <li>Глубинная суть</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <p className="font-bold text-yellow-900 mb-2">🌟 ГЛАВНЫЙ ДАРЫ:</p>
              <p className="text-gray-800">
                Когда вы объедините все 4 энергии — вы станете <strong>{personal?.title}</strong> (характер) + 
                <strong> {destiny?.title}</strong> (миссия) + <strong> {social?.title}</strong> (общество) + 
                <strong> {spiritual?.title}</strong> (дух). Это и есть ваша уникальная сила!
              </p>
            </div>
          </div>
        </div>

        {/* ВЫЗОВЫ И УРОКИ - ОБЪЕДИНЕННЫЕ */}
        <div className="bg-gradient-to-r from-red-100 to-pink-100 p-8 rounded-2xl border-2 border-red-400 shadow-2xl">
          <h3 className="text-3xl font-bold text-red-900 mb-6 flex items-center gap-3">
            <Icon name="AlertTriangle" size={32} />
            ⚠️ ВЫЗОВЫ И УРОКИ (что нужно преодолеть)
          </h3>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-lg">
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <p className="font-bold text-red-900 mb-2">🔴 Из Личности (Аркан {result.personal} - {personal?.title}):</p>
                <ul className="text-sm text-gray-800 space-y-1 list-disc list-inside">
                  <li>Не застревать в своем характере</li>
                  <li>Не навязывать свою волю</li>
                  <li>Здоровье: {personal?.health?.split('.')[0]}</li>
                </ul>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <p className="font-bold text-orange-900 mb-2">🟠 Из Предназначения (Аркан {result.destiny} - {destiny?.title}):</p>
                <ul className="text-sm text-gray-800 space-y-1 list-disc list-inside">
                  <li>Принять свою миссию</li>
                  <li>Не сопротивляться призванию</li>
                  <li>Кармический урок: {destiny?.health?.split('.')[0]}</li>
                </ul>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <p className="font-bold text-yellow-900 mb-2">🟡 Из Социальной роли (Аркан {result.social} - {social?.title}):</p>
                <ul className="text-sm text-gray-800 space-y-1 list-disc list-inside">
                  <li>Снять маску для общества</li>
                  <li>Жить не "на публику"</li>
                  <li>Не зависеть от чужого мнения</li>
                </ul>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <p className="font-bold text-purple-900 mb-2">🟣 Из Духовной сути (Аркан {result.spiritual} - {spiritual?.title}):</p>
                <ul className="text-sm text-gray-800 space-y-1 list-disc list-inside">
                  <li>Активировать духовность</li>
                  <li>Найти смысл жизни</li>
                  <li>Психосоматика: {spiritual?.health?.split('.')[0]}</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <p className="font-bold text-red-900 mb-2">🔥 ГЛАВНЫЙ УРОК ЖИЗНИ:</p>
              <p className="text-gray-800">
                Ваш главный вызов — объединить все 4 энергии в одну. Пока вы живете только через <strong>{personal?.title}</strong> 
                (свой характер), игнорируя <strong>{destiny?.title}</strong> (предназначение), прячась за <strong>{social?.title}</strong> 
                (маска для общества) и забывая про <strong>{spiritual?.title}</strong> (духовность) — будут кризисы, болезни, провалы. 
                <strong> Когда все 4 энергии работают вместе — вы становитесь целостным!</strong>
              </p>
            </div>
          </div>
        </div>

        {/* ЗДОРОВЬЕ */}
        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-8 rounded-2xl border-2 border-blue-400 shadow-2xl">
          <h3 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
            <Icon name="Heart" size={32} />
            ❤️ ЗДОРОВЬЕ И СЛАБЫЕ ЗОНЫ
          </h3>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-lg space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <p className="font-bold text-red-900 mb-2">🩺 Физическое здоровье (Аркан {result.personal} - {personal?.title}):</p>
              <p className="text-gray-800">{personal?.health}</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <p className="font-bold text-orange-900 mb-2">⚡ Кармическое здоровье (Аркан {result.destiny} - {destiny?.title}):</p>
              <p className="text-gray-800">{destiny?.health}</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <p className="font-bold text-purple-900 mb-2">🧘 Психосоматика (Аркан {result.spiritual} - {spiritual?.title}):</p>
              <p className="text-gray-800">{spiritual?.health}</p>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <p className="font-bold text-yellow-900 mb-2">💡 РЕКОМЕНДАЦИИ:</p>
              <p className="text-gray-800">
                Следите за зонами из Аркана {result.personal}. Кармические болезни приходят, если не реализуете {destiny?.title}. 
                Психосоматика лечится через активацию {spiritual?.title}. <strong>Здоровье — это баланс всех 4 энергий!</strong>
              </p>
            </div>
          </div>
        </div>

        {/* ОТНОШЕНИЯ */}
        <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-8 rounded-2xl border-2 border-pink-400 shadow-2xl">
          <h3 className="text-3xl font-bold text-pink-900 mb-6 flex items-center gap-3">
            <Icon name="Heart" size={32} />
            💕 ОТНОШЕНИЯ И СОВМЕСТИМОСТЬ
          </h3>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-lg space-y-4">
            <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
              <p className="font-bold text-amber-900 mb-2">🔥 В отношениях вы проявляетесь через (Аркан {result.personal} - {personal?.title}):</p>
              <p className="text-gray-800">{personal?.relationships}</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <p className="font-bold text-green-900 mb-2">🤝 В обществе вас видят как (Аркан {result.social} - {social?.title}):</p>
              <p className="text-gray-800">{social?.relationships}</p>
            </div>

            <div className="mt-4 p-4 bg-pink-50 rounded-lg border-l-4 border-pink-500">
              <p className="font-bold text-pink-900 mb-2">💝 КЛЮЧ К ГАРМОНИИ:</p>
              <p className="text-gray-800">
                В отношениях важно быть собой ({personal?.title}), не прятаться за маску ({social?.title}), 
                реализовывать свое предназначение ({destiny?.title}) и жить с духовностью ({spiritual?.title}). 
                <strong>Тогда придут правильные люди!</strong>
              </p>
            </div>
          </div>
        </div>

        {/* ФИНАНСЫ */}
        <div className="bg-gradient-to-r from-emerald-100 to-green-100 p-8 rounded-2xl border-2 border-emerald-400 shadow-2xl">
          <h3 className="text-3xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
            <Icon name="DollarSign" size={32} />
            💰 ДЕНЬГИ И ФИНАНСЫ
          </h3>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-lg space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <p className="font-bold text-red-900 mb-2">❌ Через что НЕ придут деньги (Аркан {result.personal} - {personal?.title}):</p>
              <p className="text-gray-800">{personal?.finance}</p>
              <p className="text-sm text-red-700 mt-2">Это ваш характер, но не денежный путь!</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <p className="font-bold text-green-900 mb-2">✅ Через что ПРИДУТ деньги (Аркан {result.destiny} - {destiny?.title}):</p>
              <p className="text-gray-800">{destiny?.finance}</p>
              <p className="text-sm text-green-700 mt-2">Это ваш денежный код! Деньги идут только через предназначение!</p>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <p className="font-bold text-yellow-900 mb-2">💎 ФОРМУЛА БОГАТСТВА:</p>
              <p className="text-gray-800">
                Используйте силу {personal?.title} (ваш характер) → для реализации {destiny?.title} (предназначение) → 
                продавайте через {social?.title} (ваша социальная роль) → активируйте {spiritual?.title} (убирает денежные блоки). 
                <strong>Тогда деньги потекут рекой!</strong>
              </p>
            </div>
          </div>
        </div>

        {/* КОНКРЕТНЫЙ ПЛАН ДЕЙСТВИЙ */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-8 rounded-2xl border-2 border-indigo-400 shadow-2xl">
          <h3 className="text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-3">
            <Icon name="CheckSquare" size={32} />
            📋 ЧТО ДЕЛАТЬ ПРЯМО СЕЙЧАС — КОНКРЕТНЫЙ ПЛАН
          </h3>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-lg space-y-6">
            {/* НЕДЕЛЯ 1 */}
            <div className="p-6 bg-green-50 rounded-xl border-2 border-green-300">
              <p className="font-bold text-green-900 text-xl mb-4">✅ НЕДЕЛЯ 1 — Принятие себя</p>
              
              <div className="space-y-3">
                <div>
                  <p className="font-bold text-gray-900 mb-2">🔥 ШАГ 1: Примите свой характер (Аркан {result.personal} - {personal?.title})</p>
                  <ul className="text-sm text-gray-800 space-y-1 ml-4">
                    <li>• <strong>ЧТО ДЕЛАТЬ:</strong> Каждый день записывайте 3 проявления вашего {personal?.title} — когда вы были собой</li>
                    <li>• <strong>ПРИМЕР:</strong> "Сегодня я проявил {personal?.title}, когда..." (запишите ситуацию)</li>
                    <li>• <strong>ЗАЧЕМ:</strong> Чтобы принять себя таким, какой вы есть. Это основа!</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-bold text-gray-900 mb-2">🩺 ШАГ 2: Проверьте здоровье</p>
                  <ul className="text-sm text-gray-800 space-y-1 ml-4">
                    <li>• <strong>СЛАБЫЕ ЗОНЫ:</strong> {personal?.health?.split('•')[0]}</li>
                    <li>• <strong>ЧТО ДЕЛАТЬ:</strong> Запишитесь на обследование этих зон (анализы, УЗИ, врач)</li>
                    <li>• <strong>ЗАЧЕМ:</strong> Предупредить болезни, пока они не начались</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* НЕДЕЛЯ 2-4 */}
            <div className="p-6 bg-yellow-50 rounded-xl border-2 border-yellow-300">
              <p className="font-bold text-yellow-900 text-xl mb-4">🎯 НЕДЕЛЯ 2-4 — Поиск предназначения</p>
              
              <div className="space-y-3">
                <div>
                  <p className="font-bold text-gray-900 mb-2">🔍 ШАГ 3: Найдите свое предназначение (Аркан {result.destiny} - {destiny?.title})</p>
                  <ul className="text-sm text-gray-800 space-y-1 ml-4">
                    <li>• <strong>ВАШЕ ПРЕДНАЗНАЧЕНИЕ:</strong> {destiny?.career?.split('.')[0]}</li>
                    <li>• <strong>ЧТО ДЕЛАТЬ:</strong> Выпишите 10 способов, как заработать на {destiny?.title}</li>
                    <li>• <strong>ПРИМЕР:</strong> Если предназначение "психолог" → консультации, курсы, статьи, книги...</li>
                    <li>• <strong>ПРАКТИКА:</strong> Выберите 1 способ и сделайте первый шаг (создайте аккаунт, напишите пост, найдите клиента)</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-bold text-gray-900 mb-2">💰 ШАГ 4: Откройте денежный поток</p>
                  <ul className="text-sm text-gray-800 space-y-1 ml-4">
                    <li>• <strong>ДЕНЕЖНЫЙ КОД:</strong> {destiny?.finance?.split('.')[0]}</li>
                    <li>• <strong>ЧТО ДЕЛАТЬ:</strong> Сделайте первую продажу через свое предназначение (даже за 500₽)</li>
                    <li>• <strong>ЗАЧЕМ:</strong> Доказать себе, что деньги идут через {destiny?.title}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* МЕСЯЦ 2 */}
            <div className="p-6 bg-orange-50 rounded-xl border-2 border-orange-300">
              <p className="font-bold text-orange-900 text-xl mb-4">🎭 МЕСЯЦ 2 — Снятие маски</p>
              
              <div className="space-y-3">
                <div>
                  <p className="font-bold text-gray-900 mb-2">🎭 ШАГ 5: Снимите социальную маску (Аркан {result.social} - {social?.title})</p>
                  <ul className="text-sm text-gray-800 space-y-1 ml-4">
                    <li>• <strong>ПРОБЛЕМА:</strong> Вы притворяетесь {social?.title} для общества, но это не вы</li>
                    <li>• <strong>ЧТО ДЕЛАТЬ:</strong> Скажите правду 3 людям — кто вы на самом деле ({personal?.title})</li>
                    <li>• <strong>ПРИМЕР:</strong> "Я не {social?.title}, я {personal?.title}. Вот что я хочу делать..."</li>
                    <li>• <strong>ЗАЧЕМ:</strong> Жить не "на публику", а для себя</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-bold text-gray-900 mb-2">🤝 ШАГ 6: Найдите свою команду</p>
                  <ul className="text-sm text-gray-800 space-y-1 ml-4">
                    <li>• <strong>ЧТО ДЕЛАТЬ:</strong> Найдите 3 людей, которые поддержат ваше предназначение ({destiny?.title})</li>
                    <li>• <strong>ГДЕ ИСКАТЬ:</strong> Сообщества, курсы, конференции по вашей теме</li>
                    <li>• <strong>ЗАЧЕМ:</strong> Окружение решает всё. Без поддержки не удержитесь</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* МЕСЯЦ 3 */}
            <div className="p-6 bg-purple-50 rounded-xl border-2 border-purple-300">
              <p className="font-bold text-purple-900 text-xl mb-4">✨ МЕСЯЦ 3 — Духовная активация</p>
              
              <div className="space-y-3">
                <div>
                  <p className="font-bold text-gray-900 mb-2">🙏 ШАГ 7: Активируйте духовность (Аркан {result.spiritual} - {spiritual?.title})</p>
                  <ul className="text-sm text-gray-800 space-y-1 ml-4">
                    <li>• <strong>ПРОБЛЕМА:</strong> {spiritual?.health?.split('•')[0]}</li>
                    <li>• <strong>ЧТО ДЕЛАТЬ:</strong> Медитация 10 минут каждый день (утром или вечером)</li>
                    <li>• <strong>КАК:</strong> Сядьте тихо, закройте глаза, дышите. Спросите: "В чем смысл моей жизни?"</li>
                    <li>• <strong>ЗАЧЕМ:</strong> Подключиться к высшему. Без духовности нет энергии</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-bold text-gray-900 mb-2">🧘 ШАГ 8: Очистите денежные блоки</p>
                  <ul className="text-sm text-gray-800 space-y-1 ml-4">
                    <li>• <strong>УПРАЖНЕНИЕ:</strong> Напишите ответ на вопрос: "Что плохого случится, если я стану богатым через {destiny?.title}?"</li>
                    <li>• <strong>ПРИМЕР БЛОКОВ:</strong> "Потеряю друзей", "Стану плохим", "Меня ограбят"</li>
                    <li>• <strong>ЧТО ДЕЛАТЬ:</strong> Для каждого блока напишите: "Это не правда, потому что..."</li>
                    <li>• <strong>ЗАЧЕМ:</strong> Убрать подсознательные страхи денег</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ИТОГОВЫЙ ЧЕКЛИСТ */}
            <div className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-400">
              <p className="font-bold text-green-900 text-xl mb-4">✅ ЧЕКЛИСТ НА 90 ДНЕЙ</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-bold text-gray-900 mb-2">📝 ЕЖЕДНЕВНО:</p>
                  <ul className="text-sm text-gray-800 space-y-1">
                    <li>✅ Записать 3 проявления {personal?.title}</li>
                    <li>✅ Медитация 10 минут</li>
                    <li>✅ Действие по {destiny?.title}</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-bold text-gray-900 mb-2">📅 ЕЖЕНЕДЕЛЬНО:</p>
                  <ul className="text-sm text-gray-800 space-y-1">
                    <li>✅ Встреча с поддерживающими людьми</li>
                    <li>✅ Продажа через {destiny?.title}</li>
                    <li>✅ Работа с денежными блоками</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-bold text-gray-900 mb-2">📆 ЕЖЕМЕСЯЧНО:</p>
                  <ul className="text-sm text-gray-800 space-y-1">
                    <li>✅ Проверка здоровья (слабые зоны)</li>
                    <li>✅ Анализ дохода через {destiny?.title}</li>
                    <li>✅ Оценка: живу ли я из маски?</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-bold text-gray-900 mb-2">🎯 ЧЕРЕЗ 90 ДНЕЙ:</p>
                  <ul className="text-sm text-gray-800 space-y-1">
                    <li>✅ Доход через {destiny?.title} вырос</li>
                    <li>✅ Здоровье улучшилось</li>
                    <li>✅ Появились правильные люди</li>
                    <li>✅ Жизнь обрела смысл</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ФИНАЛЬНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ */}
            <div className="p-6 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl border-2 border-amber-400">
              <p className="font-bold text-amber-900 text-2xl mb-3 text-center">🔥 НАЧНИТЕ ПРЯМО СЕЙЧАС!</p>
              <p className="text-gray-800 text-center text-lg">
                <strong>ШАГ 1 СЕГОДНЯ:</strong> Возьмите лист бумаги и напишите: "Я {result.name}, мой характер — {personal?.title}, 
                моя миссия — {destiny?.title}. Сегодня я делаю первый шаг: ____________" (впишите конкретное действие)
              </p>
              <p className="text-center text-sm text-gray-600 mt-3">
                Пока не напишете — ничего не изменится. <strong>Действие решает всё!</strong>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};