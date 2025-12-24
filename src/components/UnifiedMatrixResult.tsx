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

const extractProfessions = (finance: string | undefined) => {
  if (!finance) return '';
  const profSection = finance.split('🎓 ПРОФЕССИИ')[1];
  if (profSection) {
    return profSection.split(':')[1]?.trim() || '';
  }
  const sourcesSection = finance.split('💸 ИСТОЧНИКИ ДОХОДА:')[1];
  if (sourcesSection) {
    return sourcesSection.split('\n\n')[0]?.trim() || '';
  }
  return '';
};

const extractSources = (finance: string | undefined) => {
  if (!finance) return '';
  const sourcesSection = finance.split('💸 ИСТОЧНИКИ ДОХОДА:')[1];
  return sourcesSection?.split('\n\n')[0]?.trim() || '';
};

export const UnifiedMatrixResult = ({ result, hasAccess }: UnifiedMatrixResultProps) => {
  if (!hasAccess) return null;

  const personal = energyDescriptions[result.personal];
  const destiny = energyDescriptions[result.destiny];
  const social = energyDescriptions[result.social];
  const spiritual = energyDescriptions[result.spiritual];

  const professions = extractProfessions(destiny?.finance);
  const sources = extractSources(destiny?.finance);

  return (
    <div className="space-y-6 mb-8">
      {/* Заголовок */}
      <div className="text-center space-y-2 py-6">
        <h2 className="text-3xl font-bold text-gray-900">
          🎯 Полный портрет личности
        </h2>
        <p className="text-lg text-gray-600">
          {result.name} — анализ всех 4 энергий
        </p>
      </div>

      {/* КТО ВЫ НА САМОМ ДЕЛЕ */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="User" size={24} />
            Кто вы на самом деле
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <p className="text-gray-700 leading-relaxed">
            У вас внутри живут 4 разных "Я". Они часто спорят между собой — поэтому вы в замешательстве!
          </p>
          
          <div className="space-y-3">
            <div className="border-l-4 border-red-400 pl-4 py-2">
              <p className="font-bold text-red-900 mb-1">🔥 Ваше "Я-настоящий"</p>
              <p className="text-gray-800 mb-1">Вы — <strong>{personal?.title}</strong></p>
              <p className="text-sm text-gray-600">{personal?.description?.split('.').slice(0, 2).join('.')}.</p>
            </div>
            
            <div className="border-l-4 border-green-400 pl-4 py-2">
              <p className="font-bold text-green-900 mb-1">🎯 Ваше "Я-должен"</p>
              <p className="text-gray-800 mb-1">Предназначение — <strong>{destiny?.title}</strong></p>
              <p className="text-sm text-gray-600">{destiny?.description?.split('.').slice(0, 2).join('.')}.</p>
            </div>
            
            <div className="border-l-4 border-blue-400 pl-4 py-2">
              <p className="font-bold text-blue-900 mb-1">🎭 Ваше "Я-для-людей"</p>
              <p className="text-gray-800 mb-1">Люди видят — <strong>{social?.title}</strong></p>
              <p className="text-sm text-gray-600">{social?.description?.split('.').slice(0, 2).join('.')}.</p>
            </div>
            
            <div className="border-l-4 border-purple-400 pl-4 py-2">
              <p className="font-bold text-purple-900 mb-1">✨ Ваше "Я-глубинное"</p>
              <p className="text-gray-800 mb-1">Ваша душа — <strong>{spiritual?.title}</strong></p>
              <p className="text-sm text-gray-600">{spiritual?.description?.split('.').slice(0, 2).join('.')}.</p>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg mt-4">
            <p className="font-bold text-red-900 mb-2">⚠️ В чём ваша проблема:</p>
            <p className="text-gray-800">
              Вы живёте как <strong>{personal?.title}</strong>, люди ждут <strong>{social?.title}</strong>, 
              а жизнь требует <strong>{destiny?.title}</strong>, и душа тянется к <strong>{spiritual?.title}</strong>. 
              Все 4 "Я" спорят между собой!
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-bold text-green-900 mb-2">✅ Как решить:</p>
            <ol className="text-gray-800 space-y-1 ml-5 list-decimal">
              <li>Примите <strong>{personal?.title}</strong> — это ваш характер</li>
              <li>Начните делать <strong>{destiny?.title}</strong> — хоть по чуть-чуть</li>
              <li>Снимите маску <strong>{social?.title}</strong> — перестаньте притворяться</li>
              <li>Найдите смысл через <strong>{spiritual?.title}</strong></li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* ДЛЯ ПСИХОЛОГОВ И КОУЧЕЙ */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="Brain" size={24} />
            🧠 Для психологов и коучей — полное профессиональное пособие
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* ДИАГНОСТИКА */}
          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
            <p className="font-bold text-purple-900 mb-3 text-lg">🎯 ДИАГНОСТИКА: Главная проблема клиента</p>
            <p className="text-sm text-gray-800 mb-3 font-semibold">Внутренний конфликт 4-х энергий:</p>
            <div className="space-y-2 mb-4">
              <div className="bg-white p-3 rounded border-l-2 border-red-400">
                <p className="text-sm font-bold text-red-900">Аркан {result.personal} ({personal?.title}) — ЭГО</p>
                <p className="text-xs text-gray-700 mt-1">Как он себя ощущает, его идентичность. Это его "Я-реальное"</p>
              </div>
              <div className="bg-white p-3 rounded border-l-2 border-green-400">
                <p className="text-sm font-bold text-green-900">Аркан {result.destiny} ({destiny?.title}) — ПРЕДНАЗНАЧЕНИЕ</p>
                <p className="text-xs text-gray-700 mt-1">Чего от него ждёт жизнь. Это его "Я-должен стать"</p>
              </div>
              <div className="bg-white p-3 rounded border-l-2 border-blue-400">
                <p className="text-sm font-bold text-blue-900">Аркан {result.social} ({social?.title}) — МАСКА</p>
                <p className="text-xs text-gray-700 mt-1">Как его видит общество. Это его "Я-для-людей"</p>
              </div>
              <div className="bg-white p-3 rounded border-l-2 border-purple-400">
                <p className="text-sm font-bold text-purple-900">Аркан {result.spiritual} ({spiritual?.title}) — ДУША</p>
                <p className="text-xs text-gray-700 mt-1">Его глубинная суть. Это его "Я-истинное"</p>
              </div>
            </div>
            <div className="bg-red-100 p-3 rounded">
              <p className="text-sm text-gray-800 font-semibold mb-2">⚠️ КОРЕНЬ ПРОБЛЕМЫ:</p>
              <p className="text-sm text-gray-800">
                Человек живёт через <strong>{personal?.title}</strong>, общество видит <strong>{social?.title}</strong>, 
                но жизнь требует <strong>{destiny?.title}</strong>, а душа тянется к <strong>{spiritual?.title}</strong>. 
              </p>
              <p className="text-sm text-red-900 font-bold mt-2">→ Все 4 "Я" конфликтуют между собой = внутренний разлад</p>
            </div>
          </div>

          {/* ЗАЩИТНЫЕ МЕХАНИЗМЫ */}
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <p className="font-bold text-yellow-900 mb-3 text-lg">🛡️ ЗАЩИТНЫЕ МЕХАНИЗМЫ И СОПРОТИВЛЕНИЕ</p>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-yellow-900">1. Защита через {personal?.title}:</p>
                <p className="text-gray-700">Клиент будет цепляться за привычную идентичность. "Я такой, какой есть" — это его комфорт-зона</p>
                <p className="text-xs text-yellow-800 italic mt-1">Техника: не атакуйте {personal?.title}, а покажите как он помогает реализовать {destiny?.title}</p>
              </div>
              <div>
                <p className="font-semibold text-yellow-900">2. Защита через {social?.title}:</p>
                <p className="text-gray-700">Маска настолько срослась с личностью, что клиент думает "это и есть я". Он боится её снять</p>
                <p className="text-xs text-yellow-800 italic mt-1">Техника: покажите разницу между маской и истинным Я через телесные практики</p>
              </div>
              <div>
                <p className="font-semibold text-yellow-900">3. Сопротивление {destiny?.title}:</p>
                <p className="text-gray-700">Страх предназначения = страх ответственности. "Я не смогу", "Это не моё", "Я недостоин"</p>
                <p className="text-xs text-yellow-800 italic mt-1">Техника: микрошаги к предназначению, не требуйте сразу глобальных изменений</p>
              </div>
              <div>
                <p className="font-semibold text-yellow-900">4. Отрицание {spiritual?.title}:</p>
                <p className="text-gray-700">Духовная пустота заполняется суррогатами: алкоголь, работа, зависимости</p>
                <p className="text-xs text-yellow-800 italic mt-1">Техника: не навязывайте духовность, дайте почувствовать смысл через практики</p>
              </div>
            </div>
          </div>

          {/* ПСИХОТЕРАПЕВТИЧЕСКИЕ ТЕХНИКИ */}
          <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
            <p className="font-bold text-indigo-900 mb-3 text-lg">🔧 ПСИХОТЕРАПЕВТИЧЕСКИЕ ТЕХНИКИ (пошагово)</p>
            <div className="space-y-4">
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-indigo-900 mb-2">ТЕХНИКА 1: "Встреча 4-х Я" (гештальт)</p>
                <p className="text-sm text-gray-700 mb-2">Посадите клиента на 4 стула по очереди. На каждом стуле он говорит от лица одного аркана:</p>
                <ul className="text-xs text-gray-700 space-y-1 ml-4">
                  <li>• Стул 1: "Я {personal?.title}, и я чувствую..."</li>
                  <li>• Стул 2: "Я {destiny?.title}, и моя задача..."</li>
                  <li>• Стул 3: "Я {social?.title}, и люди видят меня как..."</li>
                  <li>• Стул 4: "Я {spiritual?.title}, и моя глубинная потребность..."</li>
                </ul>
                <p className="text-xs text-indigo-800 mt-2 italic">→ Клиент осознаёт конфликт энергий телесно</p>
              </div>

              <div className="bg-white p-3 rounded">
                <p className="font-bold text-indigo-900 mb-2">ТЕХНИКА 2: "Снятие маски" (психодрама)</p>
                <p className="text-sm text-gray-700 mb-2">Работа с {social?.title} как ложной идентичностью:</p>
                <ol className="text-xs text-gray-700 space-y-1 ml-5 list-decimal">
                  <li>Спросите: "Когда ты впервые надел маску {social?.title}?"</li>
                  <li>Клиент вспоминает травматичное событие детства</li>
                  <li>Проработайте это событие: "Маска защитила тебя ТОГДА"</li>
                  <li>Спросите: "Нужна ли она тебе СЕЙЧАС?"</li>
                  <li>Ритуал снятия: клиент символически снимает невидимую маску</li>
                </ol>
                <p className="text-xs text-indigo-800 mt-2 italic">→ Освобождение от ложной идентичности</p>
              </div>

              <div className="bg-white p-3 rounded">
                <p className="font-bold text-indigo-900 mb-2">ТЕХНИКА 3: "Интеграция через тело" (телесная терапия)</p>
                <p className="text-sm text-gray-700 mb-2">Где в теле живут конфликтующие энергии:</p>
                <ul className="text-xs text-gray-700 space-y-1 ml-4">
                  <li>• {personal?.title} → где ты это чувствуешь? (обычно солнечное сплетение)</li>
                  <li>• {destiny?.title} → где страх предназначения? (грудь, горло)</li>
                  <li>• {social?.title} → где живёт маска? (лицо, плечи)</li>
                  <li>• {spiritual?.title} → где пустота? (сердце, макушка)</li>
                </ul>
                <p className="text-xs text-gray-700 mt-2">Работайте с каждой зоной: дыхание, прикосновение, движение</p>
                <p className="text-xs text-indigo-800 mt-2 italic">→ Соматическое освобождение блоков</p>
              </div>

              <div className="bg-white p-3 rounded">
                <p className="font-bold text-indigo-900 mb-2">ТЕХНИКА 4: "Письмо предназначению" (когнитивная терапия)</p>
                <p className="text-sm text-gray-700 mb-2">Домашнее задание между сессиями:</p>
                <div className="text-xs text-gray-700 space-y-1">
                  <p className="font-semibold">Неделя 1: "Письмо от {personal?.title} к {destiny?.title}"</p>
                  <p className="ml-4">"Дорогое предназначение {destiny?.title}, я боюсь тебя, потому что..."</p>
                  <p className="font-semibold mt-2">Неделя 2: "Письмо от {destiny?.title} к {personal?.title}"</p>
                  <p className="ml-4">"Дорогой {personal?.title}, я не враг тебе. Я пришёл чтобы..."</p>
                  <p className="font-semibold mt-2">Неделя 3: "Письмо от {spiritual?.title} всем"</p>
                  <p className="ml-4">"Я ваша душа. Я хочу, чтобы вы все работали вместе..."</p>
                </div>
                <p className="text-xs text-indigo-800 mt-2 italic">→ Диалог между частями личности</p>
              </div>

              <div className="bg-white p-3 rounded">
                <p className="font-bold text-indigo-900 mb-2">ТЕХНИКА 5: "Активация {spiritual?.title}" (трансперсональная психология)</p>
                <p className="text-sm text-gray-700 mb-2">Духовные практики (не религия!):</p>
                <ul className="text-xs text-gray-700 space-y-1 ml-4">
                  <li>• Медитация: "Я есть больше, чем мои роли"</li>
                  <li>• Дыхание: холотропное или ребёфинг для доступа к духовному Я</li>
                  <li>• Природа: прогулки в одиночестве, связь с землёй</li>
                  <li>• Молчание: 1 день в неделю минимум слов</li>
                  <li>• Служение: бескорыстная помощь активирует {spiritual?.title}</li>
                </ul>
                <p className="text-xs text-indigo-800 mt-2 italic">→ Выход за пределы эго</p>
              </div>
            </div>
          </div>

          {/* КАРМИЧЕСКИЕ ЗАДАЧИ */}
          <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
            <p className="font-bold text-amber-900 mb-3 text-lg">📿 КАРМИЧЕСКИЕ ЗАДАЧИ И УРОКИ ДУШИ</p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-amber-900 text-sm">ЗАДАЧА 1: Принять {destiny?.title} как предназначение</p>
                <p className="text-xs text-gray-700 mt-1">Не просто знать, а ЖИТЬ через него. Каждое решение проверять: "Это в духе {destiny?.title}?"</p>
                <p className="text-xs text-amber-800 mt-1"><strong>Маркер принятия:</strong> деньги начинают приходить легче, появляется энергия</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-amber-900 text-sm">ЗАДАЧА 2: Интегрировать {personal?.title} с {destiny?.title}</p>
                <p className="text-xs text-gray-700 mt-1">Не убить {personal?.title}, а использовать его ДЛЯ {destiny?.title}. Личность — инструмент предназначения</p>
                <p className="text-xs text-amber-800 mt-1"><strong>Маркер интеграции:</strong> внутренний конфликт уходит, появляется целостность</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-amber-900 text-sm">ЗАДАЧА 3: Разоблачить {social?.title} как маску</p>
                <p className="text-xs text-gray-700 mt-1">Осознать: "Это не я, это защита". Снять маску и показать истинное лицо миру</p>
                <p className="text-xs text-amber-800 mt-1"><strong>Маркер снятия:</strong> приходят "свои" люди, уходят "чужие"</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-amber-900 text-sm">ЗАДАЧА 4: Активировать {spiritual?.title}</p>
                <p className="text-xs text-gray-700 mt-1">Найти связь с высшим, смысл жизни. Без этого всё остальное бессмысленно</p>
                <p className="text-xs text-amber-800 mt-1"><strong>Маркер активации:</strong> появляется глубокий смысл, внутренний покой</p>
              </div>
            </div>
          </div>

          {/* КАК ГОВОРИТЬ С КЛИЕНТОМ */}
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <p className="font-bold text-green-900 mb-3 text-lg">💬 ЯЗЫК ТЕРАПИИ: Как говорить с клиентом</p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-green-900 text-sm">✅ ЧТО ГОВОРИТЬ:</p>
                <ul className="text-xs text-gray-700 space-y-1 mt-2">
                  <li>• "Ты {personal?.title} — это твоя сила, не слабость"</li>
                  <li>• "{destiny?.title} — это не чужое, это твоё истинное Я"</li>
                  <li>• "{social?.title} защищал тебя, но сейчас он мешает"</li>
                  <li>• "{spiritual?.title} — это твоя связь с чем-то большим"</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-red-900 text-sm">❌ ЧТО НЕ ГОВОРИТЬ:</p>
                <ul className="text-xs text-gray-700 space-y-1 mt-2">
                  <li>• "Твой {personal?.title} — это проблема" (он закроется)</li>
                  <li>• "Ты ДОЛЖЕН стать {destiny?.title}" (сопротивление)</li>
                  <li>• "Твоя маска {social?.title} — фальшивая" (защита усилится)</li>
                  <li>• "Тебе нужна духовность" (навязывание)</li>
                </ul>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <p className="font-bold text-green-900 text-sm mb-2">🎯 ТЕРАПЕВТИЧЕСКИЕ ФРАЗЫ:</p>
                <div className="text-xs text-gray-700 space-y-1">
                  <p>→ "Что если {personal?.title} и {destiny?.title} не враги, а команда?"</p>
                  <p>→ "Когда ты в последний раз был собой без маски {social?.title}?"</p>
                  <p>→ "Что чувствует твоя душа ({spiritual?.title}), когда ты живёшь не своей жизнью?"</p>
                  <p>→ "Представь: все 4 части работают вместе. Как выглядит твоя жизнь?"</p>
                </div>
              </div>
            </div>
          </div>

          {/* ПЛАН ТЕРАПИИ */}
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="font-bold text-blue-900 mb-3 text-lg">📋 ПЛАН ТЕРАПИИ (16+ сессий)</p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-blue-900 text-sm">ШАГ 1 (Сессии 1-3): Принятие {personal?.title}</p>
                <p className="text-xs text-gray-700 mt-1"><strong>Цель:</strong> клиент перестаёт воевать с собой</p>
                <p className="text-xs text-gray-700 mt-1"><strong>Техники:</strong> работа с самокритикой, практика самопринятия</p>
                <p className="text-xs text-blue-800 mt-1"><strong>Результат:</strong> "Я {personal?.title}, и это нормально"</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-blue-900 text-sm">ШАГ 2 (Сессии 4-6): Разоблачение {social?.title}</p>
                <p className="text-xs text-gray-700 mt-1"><strong>Цель:</strong> клиент видит свою маску</p>
                <p className="text-xs text-gray-700 mt-1"><strong>Техники:</strong> психодрама "снятие маски", работа с детской травмой</p>
                <p className="text-xs text-blue-800 mt-1"><strong>Результат:</strong> "Я играл роль {social?.title}, но это не я"</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-blue-900 text-sm">ШАГ 3 (Сессии 7-10): Интеграция {destiny?.title}</p>
                <p className="text-xs text-gray-700 mt-1"><strong>Цель:</strong> клиент принимает предназначение</p>
                <p className="text-xs text-gray-700 mt-1"><strong>Техники:</strong> работа со страхами, микрошаги к предназначению</p>
                <p className="text-xs text-blue-800 mt-1"><strong>Результат:</strong> "Я начинаю жить как {destiny?.title}"</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-blue-900 text-sm">ШАГ 4 (Сессии 11-15): Активация {spiritual?.title}</p>
                <p className="text-xs text-gray-700 mt-1"><strong>Цель:</strong> клиент находит смысл</p>
                <p className="text-xs text-gray-700 mt-1"><strong>Техники:</strong> медитации, духовные практики, работа со смыслом</p>
                <p className="text-xs text-blue-800 mt-1"><strong>Результат:</strong> "Я чувствую связь с {spiritual?.title}"</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-blue-900 text-sm">ШАГ 5 (Сессии 16+): Жизнь из Единства</p>
                <p className="text-xs text-gray-700 mt-1"><strong>Цель:</strong> все 4 аркана работают как команда</p>
                <p className="text-xs text-gray-700 mt-1"><strong>Техники:</strong> интеграция через жизненные ситуации</p>
                <p className="text-xs text-blue-800 mt-1"><strong>Результат:</strong> "Я целостный, все части во мне гармоничны"</p>
              </div>
            </div>
          </div>

          {/* МАРКЕРЫ ПРОГРЕССА */}
          <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500">
            <p className="font-bold text-teal-900 mb-3 text-lg">📊 МАРКЕРЫ ПРОГРЕССА (как понять, что терапия работает)</p>
            <div className="space-y-2">
              <div className="bg-white p-2 rounded">
                <p className="font-bold text-teal-900 text-xs">Месяц 1-2:</p>
                <p className="text-xs text-gray-700">→ Клиент меньше критикует себя, принимает {personal?.title}</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-bold text-teal-900 text-xs">Месяц 3-4:</p>
                <p className="text-xs text-gray-700">→ Видит свою маску {social?.title}, начинает снимать её</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-bold text-teal-900 text-xs">Месяц 5-6:</p>
                <p className="text-xs text-gray-700">→ Делает первые шаги к {destiny?.title}, меняет работу/хобби</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-bold text-teal-900 text-xs">Месяц 7-9:</p>
                <p className="text-xs text-gray-700">→ Находит смысл через {spiritual?.title}, спокойствие внутри</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-bold text-teal-900 text-xs">Месяц 10-12:</p>
                <p className="text-xs text-gray-700">→ Живёт целостно, деньги/отношения/здоровье улучшаются</p>
              </div>
            </div>
          </div>

          {/* ПРОГНОЗ */}
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <p className="font-bold text-red-900 mb-3 text-lg">🔮 ПРОГНОЗ И РИСКИ</p>
            <div className="space-y-3">
              <div className="bg-green-100 p-3 rounded">
                <p className="font-bold text-green-900 text-sm mb-2">✅ ЕСЛИ КЛИЕНТ ПРИНИМАЕТ ТЕРАПИЮ:</p>
                <ul className="text-xs text-gray-800 space-y-1">
                  <li>→ Через 3-6 месяцев: внутренний конфликт ослабевает, появляется ясность</li>
                  <li>→ Через 6-12 месяцев: выход на предназначение ({professions})</li>
                  <li>→ Через 12+ месяцев: деньги потоком, гармония в отношениях, здоровье улучшается</li>
                </ul>
              </div>
              <div className="bg-red-100 p-3 rounded">
                <p className="font-bold text-red-900 text-sm mb-2">⚠️ ЕСЛИ КЛИЕНТ СОПРОТИВЛЯЕТСЯ:</p>
                <ul className="text-xs text-gray-800 space-y-1">
                  <li>→ Кризисы усиливаются (работа, деньги, отношения)</li>
                  <li>→ Болезни как сигнал от тела: {personal?.health?.split('.')[0]}</li>
                  <li>→ Депрессия от жизни "не своей жизнью"</li>
                  <li>→ Судьба будет "ломать" до принятия {destiny?.title}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ПРОТИВОПОКАЗАНИЯ */}
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-500">
            <p className="font-bold text-gray-900 mb-3 text-lg">⚠️ ПРОТИВОПОКАЗАНИЯ И ОГРАНИЧЕНИЯ</p>
            <div className="text-xs text-gray-700 space-y-2">
              <p><strong>НЕ работайте с матрицей, если:</strong></p>
              <ul className="space-y-1 ml-4">
                <li>• Острый психоз или обострение психического расстройства</li>
                <li>• Суицидальные намерения (сначала стабилизация!)</li>
                <li>• Клиент в активной зависимости (алкоголь, наркотики)</li>
                <li>• Недавняя тяжёлая травма (смерть близкого, изнасилование)</li>
              </ul>
              <p className="mt-2"><strong>В этих случаях:</strong> сначала базовая стабилизация, потом работа с матрицей</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ДЛЯ HR И РЕКРУТЕРОВ */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="Users" size={24} />
            👨‍💼 Для HR и рекрутеров
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-bold text-green-900 mb-2">✅ Идеальная должность:</p>
            <p className="text-sm text-gray-700 mb-2">
              Аркан {result.destiny} ({destiny?.title}) — это его ДНК
            </p>
            <p className="text-sm text-gray-700 mb-1"><strong>Лучшие роли:</strong> {professions}</p>
            <p className="text-sm text-gray-600">
              Почему именно это: если должность не соответствует — уйдёт через 3-6 месяцев
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-bold text-blue-900 mb-2">🤝 Анализ команды:</p>
            <p className="text-sm text-gray-700 mb-2">
              Аркан {result.social} ({social?.title}) — так его видят коллеги
            </p>
            <p className="text-sm text-gray-600">
              Риск конфликтов: если в команде давят на {personal?.title} — он уйдёт
            </p>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="font-bold text-amber-900 mb-2">💰 Мотивация и удержание:</p>
            <p className="text-sm text-gray-700 mb-2">
              НЕ мотивирован деньгами, если работа противоречит {destiny?.title}
            </p>
            <p className="text-sm text-gray-800 mb-2"><strong>Как удержать:</strong></p>
            <ol className="text-sm text-gray-700 space-y-1 ml-5 list-decimal">
              <li>Давать задачи по {destiny?.title}</li>
              <li>Признавать его {personal?.title}</li>
              <li>Позволять проявлять {social?.title}</li>
              <li>Дать смысл работы ({spiritual?.title})</li>
            </ol>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="font-bold text-purple-900 mb-2">🚀 Онбординг (90 дней):</p>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>День 1-7:</strong> Представить через {social?.title}, показать смысл работы</p>
              <p><strong>День 8-30:</strong> Дать задачи на {personal?.title}, вводить в {destiny?.title}</p>
              <p><strong>День 31-60:</strong> Оценить соответствие {destiny?.title}, если нет — расстаться</p>
              <p><strong>День 61-90:</strong> Стабилизация, работа через {destiny?.title}</p>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <p className="font-bold text-red-900 mb-2">⚠️ Риски и митигация:</p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>РИСК #1: Уход через 3-6 месяцев (роль не соответствует {destiny?.title})</li>
              <li>РИСК #2: Конфликты (давят на {personal?.title})</li>
              <li>РИСК #3: Выгорание (нет смысла, {spiritual?.title} не активирован)</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-bold text-green-900 mb-2">✅ Вердикт:</p>
            <p className="text-sm text-gray-700">
              <strong>НАНИМАТЬ, ЕСЛИ:</strong> должность соответствует {destiny?.title} минимум 70%
            </p>
            <p className="text-sm text-gray-700">
              <strong>НЕ НАНИМАТЬ, ЕСЛИ:</strong> роль противоречит {destiny?.title} — уйдёт через 3-6 месяцев
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ДЛЯ НУТРИЦИОЛОГОВ */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="Apple" size={24} />
            🍎 Для нутрициологов
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="font-bold text-red-900 mb-2">🔥 Диагностика — почему не худеет:</p>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-red-900">🔴 УРОВЕНЬ 1: Аркан {result.personal} ({personal?.title}) — ФИЗИОЛОГИЯ</p>
                <p className="text-gray-700">Что делать: обследование, анализы, лечить физику первым делом</p>
              </div>
              
              <div>
                <p className="font-semibold text-orange-900">🟠 УРОВЕНЬ 2: Аркан {result.destiny} ({destiny?.title}) — КАРМИЧЕСКИЙ БЛОК</p>
                <p className="text-gray-700">Что происходит: вес — защита от реализации {destiny?.title}</p>
                <p className="text-gray-600">Что делать: работа с психологом, разблокировать страх предназначения</p>
              </div>
              
              <div>
                <p className="font-semibold text-yellow-900">🟡 УРОВЕНЬ 3: Аркан {result.spiritual} ({spiritual?.title}) — ПСИХОСОМАТИКА</p>
                <p className="text-gray-700">Что происходит: заедает эмоции, духовную пустоту</p>
                <p className="text-gray-600">Что делать: духовные практики, медитации, поиск смысла</p>
              </div>
              
              <div>
                <p className="font-semibold text-purple-900">🟣 УРОВЕНЬ 4: Аркан {result.social} ({social?.title}) — СОЦИАЛЬНОЕ ДАВЛЕНИЕ</p>
                <p className="text-gray-700">Конфликт: общество видит {social?.title}, но внутри {personal?.title}</p>
                <p className="text-gray-600">Что делать: снять маску, жить как {personal?.title}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-bold text-green-900 mb-2">🥗 План питания (90 дней):</p>
            <div className="text-sm text-gray-700 space-y-2">
              <div>
                <p className="font-semibold">ЧТО ИСКЛЮЧИТЬ:</p>
                <ul className="ml-4 space-y-1">
                  <li>• Для {result.personal}: тяжёлая пища, жирное, мучное</li>
                  <li>• Для {result.destiny}: сахар, быстрые углеводы</li>
                  <li>• Для {result.spiritual}: алкоголь, кофеин</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">ЧТО ДОБАВИТЬ:</p>
                <p>• Белок 1.5-2г/кг, клетчатка 500г+ овощей, вода 30-40мл/кг</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-bold text-blue-900 mb-2">📋 Комплексный план:</p>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Неделя 1-2:</strong> Диагностика (анализы, УЗИ, замеры)</p>
              <p><strong>Неделя 3-4:</strong> Запуск (новый рацион, лечение, психолог, медитации)</p>
              <p><strong>Неделя 5-12:</strong> Основная работа (диета + движение + психолог + практики)</p>
              <p><strong>РЕЗУЛЬТАТ:</strong> -8-12 кг за 90 дней + улучшение здоровья</p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="font-bold text-amber-900 mb-2">🔑 Ключ к успеху:</p>
            <p className="text-sm text-gray-700 italic">
              "Вес — это защита от реализации {destiny?.title}. Пока не примешь предназначение, тело будет держать вес. 
              Когда станешь {destiny?.title}, вес уйдёт сам."
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ДЛЯ БИЗНЕС-КОУЧЕЙ */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="TrendingUp" size={24} />
            📈 Для бизнес-коучей
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="font-bold text-red-900 mb-2">💸 Диагностика — почему нет денег:</p>
            <p className="text-sm text-gray-800 mb-2">
              🔴 КОРЕНЬ ПРОБЛЕМЫ: работает через {personal?.title}, но деньги приходят ТОЛЬКО через {destiny?.title}
            </p>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Аркан {result.personal}: работает через {personal?.title} — НЕ денежный путь</p>
              <p>• Аркан {result.destiny}: истинное предназначение {professions}, пока не принят — денег нет</p>
              <p>• Аркан {result.social}: продаёт через маску {social?.title}, но это фасад</p>
              <p>• Аркан {result.spiritual}: денежные блоки, страх богатства, вина за деньги</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-bold text-green-900 mb-2">🎯 Правильная ниша — 100% попадание:</p>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Аркан {result.destiny} ({destiny?.title})</strong>
            </p>
            <p className="text-sm text-gray-700 mb-1"><strong>Ниши:</strong> {professions}</p>
            <p className="text-sm text-gray-600">
              Почему: это кармическое предназначение, вселенная помогает ТОЛЬКО здесь
            </p>
            <p className="text-sm text-red-700 font-semibold mt-2">
              Если сейчас НЕ это — сменить нишу за 30 дней!
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-bold text-blue-900 mb-2">🚀 План ×10 доход (90 дней):</p>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>ШАГ 1 (Неделя 1-2):</strong> Признать, что {personal?.title} — не путь денег</p>
              <p><strong>ШАГ 2 (Неделя 3-4):</strong> Принять {destiny?.title} как денежное предназначение</p>
              <p><strong>ШАГ 3 (Неделя 5-6):</strong> Сменить нишу на {professions}, запустить MVP</p>
              <p><strong>ШАГ 4 (Неделя 7-8):</strong> Использовать {social?.title} для продаж</p>
              <p><strong>ШАГ 5 (Неделя 9-12):</strong> Очистить {spiritual?.title} — убрать денежные блоки</p>
              <p className="font-semibold text-green-900 mt-2">РЕЗУЛЬТАТ: доход ×3-5 через 90 дней, ×10-15 через год</p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="font-bold text-purple-900 mb-2">💎 Денежные блоки:</p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Вопрос клиенту:</strong> "Что плохого случится, если станешь богатым через {destiny?.title}?"
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Типичные ответы: "Потеряю друзей", "Стану плохим", "Меня ограбят"
            </p>
            <p className="text-sm text-gray-700">
              <strong>Как очистить:</strong> осознать блок через {spiritual?.title}, простить, отпустить, заменить на новую установку
            </p>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="font-bold text-amber-900 mb-2">🔮 Прогноз:</p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>✅ ЕСЛИ СЛЕДУЕТ:</strong> месяц 1 — доход ×1.5, месяц 2-3 — ×3-5, месяц 4-6 — ×5-7, месяц 7-12 — ×10-15
            </p>
            <p className="text-sm text-gray-700">
              <strong>⚠️ ЕСЛИ НЕ МЕНЯЕТ НИШУ:</strong> доход стоит/падает, выгорание, бизнес закроется
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="font-bold text-yellow-900 mb-2">🔑 Ключ к богатству:</p>
            <p className="text-sm text-gray-700 italic">
              "Деньги приходят, когда живёшь через {destiny?.title}. Это твой денежный код. 
              Вселенная даст деньги ТОЛЬКО за {professions}. 
              Прими {destiny?.title}, очисти {spiritual?.title}, используй {social?.title} для продаж — это формула богатства."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};