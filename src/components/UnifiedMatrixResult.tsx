import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { energyDescriptions } from '@/data/arcana-descriptions';
import { ShareButtons } from '@/components/ShareButtons';

interface UnifiedMatrixResultProps {
  result: {
    personal: number;
    destiny: number;
    social: number;
    spiritual: number;
    name: string;
  };
  hasAccess: boolean;
  birthDate: string;
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

export const UnifiedMatrixResult = ({ result, hasAccess, birthDate }: UnifiedMatrixResultProps) => {
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
          📋 Психологический портрет клиента
        </h2>
        <p className="text-lg text-gray-600">
          {result.name} — комплексный анализ личности
        </p>
      </div>

      {/* ЕДИНОЕ ЗАКЛЮЧЕНИЕ */}
      <Card id="personal-profile">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="FileText" size={24} />
            Заключение специалиста
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Структура личности */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-purple-200 pb-2">
              🧠 Кто перед вами: структура личности
            </h3>
            <p className="text-gray-800 leading-relaxed">
              Перед вами человек с <strong>внутренним конфликтом четырёх "Я"</strong>: 
              истинное "Я-настоящий" (Аркан {result.personal} — {personal?.title}), 
              социальная маска "Я-для-людей" (Аркан {result.social} — {social?.title}), 
              призвание "Я-должен" (Аркан {result.destiny} — {destiny?.title}) и 
              глубинная душа "Я-глубинное" (Аркан {result.spiritual} — {spiritual?.title}).
            </p>
            <p className="text-gray-800 leading-relaxed">
              <strong>Основная проблема:</strong> {personal?.title} внутри борется с ожиданиями общества ({social?.title}), 
              не понимая своего истинного предназначения ({destiny?.title}), что приводит к потере связи с собственной душой ({spiritual?.title}).
            </p>
          </div>
          
          <div className="space-y-4">
            {/* ЛИЧНОЕ Я */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border-l-4 border-red-500">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Heart" size={20} className="text-red-600" />
                <p className="font-bold text-red-900 text-lg">🔥 Ваше "Я-настоящий" — Аркан {result.personal}</p>
              </div>
              <div className="bg-white p-3 rounded mb-3">
                <p className="text-gray-900 font-bold mb-2">Вы — <strong>{personal?.title}</strong></p>
                <p className="text-sm text-gray-700 mb-2">{personal?.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold text-red-900 text-sm mb-1">💊 Здоровье:</p>
                  <p className="text-xs text-gray-700">{personal?.health?.split('.').slice(0, 3).join('.')}.</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold text-red-900 text-sm mb-1">💕 Отношения:</p>
                  <p className="text-xs text-gray-700">{personal?.relationships?.split('.').slice(0, 3).join('.')}.</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded mt-3">
                <p className="font-semibold text-red-900 text-sm mb-1">💰 Финансы:</p>
                <p className="text-xs text-gray-700 mb-1">{personal?.finance?.split('.').slice(0, 2).join('.')}.</p>
                <p className="text-xs text-gray-700"><strong>Источники дохода:</strong> {sources || personal?.finance?.split('💸')[1]?.split('•').slice(1, 4).join(', ').substring(0, 100)}</p>
              </div>
            </div>
            
            {/* ПРЕДНАЗНАЧЕНИЕ */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Target" size={20} className="text-green-600" />
                <p className="font-bold text-green-900 text-lg">🎯 Ваше "Я-должен" — Аркан {result.destiny}</p>
              </div>
              <div className="bg-white p-3 rounded mb-3">
                <p className="text-gray-900 font-bold mb-2">Предназначение — <strong>{destiny?.title}</strong></p>
                <p className="text-sm text-gray-700 mb-2">{destiny?.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold text-green-900 text-sm mb-1">💊 Здоровье:</p>
                  <p className="text-xs text-gray-700">{destiny?.health?.split('.').slice(0, 3).join('.')}.</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold text-green-900 text-sm mb-1">💕 Отношения:</p>
                  <p className="text-xs text-gray-700">{destiny?.relationships?.split('.').slice(0, 3).join('.')}.</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded mt-3">
                <p className="font-semibold text-green-900 text-sm mb-1">💰 Профессии и деньги:</p>
                <p className="text-xs text-gray-700 mb-1"><strong>Лучшие роли:</strong> {professions}</p>
                <p className="text-xs text-gray-700"><strong>Денежный код:</strong> {destiny?.finance?.split('.').slice(0, 2).join('.')}.</p>
              </div>
            </div>
            
            {/* СОЦИАЛЬНАЯ МАСКА */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Users" size={20} className="text-blue-600" />
                <p className="font-bold text-blue-900 text-lg">🎭 Ваше "Я-для-людей" — Аркан {result.social}</p>
              </div>
              <div className="bg-white p-3 rounded mb-3">
                <p className="text-gray-900 font-bold mb-2">Люди видят — <strong>{social?.title}</strong></p>
                <p className="text-sm text-gray-700 mb-2">{social?.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold text-blue-900 text-sm mb-1">💊 Здоровье:</p>
                  <p className="text-xs text-gray-700">{social?.health?.split('.').slice(0, 3).join('.')}.</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold text-blue-900 text-sm mb-1">💕 Отношения:</p>
                  <p className="text-xs text-gray-700">{social?.relationships?.split('.').slice(0, 3).join('.')}.</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded mt-3">
                <p className="font-semibold text-blue-900 text-sm mb-1">⚠️ Важно понимать:</p>
                <p className="text-xs text-gray-700">Это НЕ ваше истинное лицо, а адаптация к обществу. Под этой маской скрывается ваш настоящий {personal?.title}</p>
              </div>
            </div>
            
            {/* ДУХОВНОЕ Я */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-purple-500">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Sparkles" size={20} className="text-purple-600" />
                <p className="font-bold text-purple-900 text-lg">✨ Ваше "Я-глубинное" — Аркан {result.spiritual}</p>
              </div>
              <div className="bg-white p-3 rounded mb-3">
                <p className="text-gray-900 font-bold mb-2">Ваша душа — <strong>{spiritual?.title}</strong></p>
                <p className="text-sm text-gray-700 mb-2">{spiritual?.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold text-purple-900 text-sm mb-1">💊 Здоровье:</p>
                  <p className="text-xs text-gray-700">{spiritual?.health?.split('.').slice(0, 3).join('.')}.</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold text-purple-900 text-sm mb-1">💕 Отношения:</p>
                  <p className="text-xs text-gray-700">{spiritual?.relationships?.split('.').slice(0, 3).join('.')}.</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded mt-3">
                <p className="font-semibold text-purple-900 text-sm mb-1">🙏 Духовный путь:</p>
                <p className="text-xs text-gray-700">{spiritual?.finance?.split('.').slice(0, 2).join('.')}.</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg mt-4 border-l-4 border-red-500">
            <p className="font-bold text-red-900 mb-3 text-lg">⚠️ В чём ваша проблема:</p>
            <p className="text-gray-800 mb-3">
              Вы живёте как <strong>{personal?.title}</strong>, люди ждут <strong>{social?.title}</strong>, 
              а жизнь требует <strong>{destiny?.title}</strong>, и душа тянется к <strong>{spiritual?.title}</strong>. 
            </p>
            <p className="text-red-900 font-bold">→ Все 4 "Я" конфликтуют между собой = внутренний разлад, кризисы, болезни!</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <p className="font-bold text-green-900 mb-3 text-lg">✅ Как решить (пошаговый план):</p>
            <ol className="text-gray-800 space-y-2 ml-5 list-decimal">
              <li><strong>Примите {personal?.title}</strong> — это ваш характер, не воюйте с собой</li>
              <li><strong>Начните делать {destiny?.title}</strong> — хоть по чуть-чуть, микрошаги каждый день</li>
              <li><strong>Снимите маску {social?.title}</strong> — перестаньте притворяться, будьте собой</li>
              <li><strong>Найдите смысл через {spiritual?.title}</strong> — медитации, природа, духовные практики</li>
            </ol>
            <p className="text-green-900 font-semibold mt-3">→ Когда все 4 "Я" работают вместе — вы становитесь целостным!</p>
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
            👨‍💼 Для HR и рекрутеров — полный профиль кандидата
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* ПРОФИЛЬ ЛИЧНОСТИ */}
          <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
            <p className="font-bold text-indigo-900 mb-3 text-lg">👤 ПРОФИЛЬ ЛИЧНОСТИ КАНДИДАТА</p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-indigo-900 text-sm mb-2">КТО ЭТОТ ЧЕЛОВЕК (4 слоя личности):</p>
                <div className="text-xs text-gray-700 space-y-2">
                  <div className="border-l-2 border-red-400 pl-2">
                    <p className="font-semibold text-red-900">Истинное Я — Аркан {result.personal} ({personal?.title})</p>
                    <p className="mt-1">{personal?.description?.split('.').slice(0, 3).join('.')}.</p>
                    <p className="mt-1 text-red-800"><strong>В работе:</strong> {personal?.description?.split('.').slice(3, 5).join('.')}.</p>
                  </div>
                  <div className="border-l-2 border-green-400 pl-2">
                    <p className="font-semibold text-green-900">Предназначение — Аркан {result.destiny} ({destiny?.title})</p>
                    <p className="mt-1">{destiny?.description?.split('.').slice(0, 2).join('.')}.</p>
                    <p className="mt-1 text-green-800"><strong>Лучшие роли:</strong> {professions}</p>
                  </div>
                  <div className="border-l-2 border-blue-400 pl-2">
                    <p className="font-semibold text-blue-900">Социальная маска — Аркан {result.social} ({social?.title})</p>
                    <p className="mt-1">Так его видят коллеги на первый взгляд. {social?.description?.split('.')[0]}.</p>
                    <p className="mt-1 text-blue-800"><strong>Внимание:</strong> это НЕ его истинное лицо, это адаптация!</p>
                  </div>
                  <div className="border-l-2 border-purple-400 pl-2">
                    <p className="font-semibold text-purple-900">Глубинные ценности — Аркан {result.spiritual} ({spiritual?.title})</p>
                    <p className="mt-1">Что действительно важно для этого человека. {spiritual?.description?.split('.').slice(0, 2).join('.')}.</p>
                    <p className="mt-1 text-purple-800"><strong>Мотивация:</strong> работа должна иметь смысл для {spiritual?.title}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ПОВЕДЕНЧЕСКИЙ ПРОФИЛЬ */}
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <p className="font-bold text-yellow-900 mb-3 text-lg">🎯 ПОВЕДЕНЧЕСКИЙ ПРОФИЛЬ НА РАБОТЕ</p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-yellow-900 text-sm mb-2">Как он работает (через {personal?.title}):</p>
                <div className="text-xs text-gray-700 space-y-1">
                  <p>• <strong>Стиль работы:</strong> {personal?.title === 'Маг (1 аркан)' ? 'Креативный, инициативный, начинает новое' : personal?.title === 'Император (4 аркан)' ? 'Системный, управленческий, создаёт структуры' : 'См. описание личного аркана'}</p>
                  <p>• <strong>Сильные стороны:</strong> {personal?.description?.split('.').slice(4, 6).join('.')}</p>
                  <p>• <strong>Слабые стороны:</strong> может проявлять теневые качества {personal?.title} под стрессом</p>
                  <p>• <strong>Конфликты:</strong> возникают когда давят на его {personal?.title}</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-yellow-900 text-sm mb-2">Что видят коллеги (маска {social?.title}):</p>
                <div className="text-xs text-gray-700 space-y-1">
                  <p>• <strong>Первое впечатление:</strong> {social?.title} — это его адаптация к социуму</p>
                  <p>• <strong>В команде:</strong> {social?.relationships?.split('.')[0]}</p>
                  <p>• <strong>Ловушка:</strong> если оценивать только по маске — получите разочарование</p>
                  <p>• <strong>Реальность:</strong> под маской {social?.title} скрывается {personal?.title}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ИДЕАЛЬНАЯ ДОЛЖНОСТЬ */}
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <p className="font-bold text-green-900 mb-3 text-lg">✅ ИДЕАЛЬНАЯ ДОЛЖНОСТЬ И РОЛЬ</p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-green-900 text-sm mb-2">Аркан {result.destiny} ({destiny?.title}) — это его профессиональная ДНК</p>
                <div className="text-xs text-gray-700 space-y-2">
                  <p><strong>🎯 Лучшие роли:</strong> {professions}</p>
                  <p><strong>💼 Где он максимально эффективен:</strong> {destiny?.finance?.split('💸')[0]}</p>
                  <p><strong>💰 Денежный потенциал:</strong> Максимальный доход ТОЛЬКО в этих ролях</p>
                  <p><strong>⏱️ Продуктивность:</strong> В своей роли — 200%, не в своей — 50%</p>
                </div>
              </div>
              <div className="bg-red-100 p-3 rounded">
                <p className="font-bold text-red-900 text-sm mb-2">⚠️ КРИТИЧНО: Соответствие роли</p>
                <div className="text-xs text-gray-700 space-y-1">
                  <p>• Если должность НЕ соответствует {destiny?.title} → уйдёт через 3-6 месяцев</p>
                  <p>• Если заставить работать против предназначения → выгорание, конфликты</p>
                  <p>• Если роль соответствует на 70%+ → остаётся годами, растёт</p>
                  <p className="font-bold text-red-900 mt-2">→ Проверьте: описание вакансии совпадает с {destiny?.title}?</p>
                </div>
              </div>
            </div>
          </div>

          {/* АДАПТАЦИЯ В КОМАНДЕ */}
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="font-bold text-blue-900 mb-3 text-lg">🤝 АДАПТАЦИЯ В КОМАНДЕ</p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-blue-900 text-sm mb-2">Как он взаимодействует с коллегами:</p>
                <div className="text-xs text-gray-700 space-y-2">
                  <p><strong>Его маска {social?.title}:</strong> так его воспринимают в первые 1-3 месяца</p>
                  <p><strong>Реальное поведение {personal?.title}:</strong> проявляется после адаптации</p>
                  <p><strong>В конфликтах:</strong> {personal?.relationships?.split('.').slice(0, 2).join('.')}</p>
                  <p><strong>Идеальные коллеги:</strong> те, кто принимает его {personal?.title}</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-blue-900 text-sm mb-2">⚠️ Риски конфликтов:</p>
                <div className="text-xs text-gray-700 space-y-1">
                  <p className="text-red-800">• Если в команде давят на {personal?.title} — он уйдёт</p>
                  <p className="text-red-800">• Если требуют быть {social?.title} 24/7 — выгорание</p>
                  <p className="text-red-800">• Если роль противоречит {destiny?.title} — саботаж</p>
                  <p className="text-green-800 mt-2">✅ Решение: давайте свободу быть {personal?.title} + роль по {destiny?.title}</p>
                </div>
              </div>
            </div>
          </div>

          {/* МОТИВАЦИЯ */}
          <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
            <p className="font-bold text-amber-900 mb-3 text-lg">💰 МОТИВАЦИЯ И УДЕРЖАНИЕ</p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-amber-900 text-sm mb-2">Что его действительно мотивирует:</p>
                <div className="text-xs text-gray-700 space-y-2">
                  <p><strong>1. Соответствие {destiny?.title}:</strong> работа по предназначению = энергия и результат</p>
                  <p><strong>2. Признание {personal?.title}:</strong> видеть его истинные качества, не маску</p>
                  <p><strong>3. Смысл через {spiritual?.title}:</strong> {spiritual?.description?.split('.')[0]}</p>
                  <p><strong>4. Деньги:</strong> НЕ первичны! Деньги — следствие правильной роли</p>
                </div>
              </div>
              <div className="bg-red-100 p-3 rounded">
                <p className="font-bold text-red-900 text-sm mb-2">❌ Что его ДЕмотивирует:</p>
                <div className="text-xs text-gray-700 space-y-1">
                  <p>• Работа противоречит {destiny?.title} → даже за большие деньги НЕ мотивирован</p>
                  <p>• Не видят его {personal?.title} → чувствует себя невидимым</p>
                  <p>• Требуют постоянно носить маску {social?.title} → выгорание</p>
                  <p>• Работа без смысла → {spiritual?.title} не получает питания</p>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <p className="font-bold text-green-900 text-sm mb-2">✅ КАК УДЕРЖАТЬ (чек-лист):</p>
                <ol className="text-xs text-gray-700 space-y-1 ml-5 list-decimal">
                  <li>Давайте задачи строго по {destiny?.title}</li>
                  <li>Признавайте публично его {personal?.title}</li>
                  <li>Разрешайте проявлять {social?.title} для внешних</li>
                  <li>Объясняйте смысл работы (для {spiritual?.title})</li>
                  <li>НЕ пытайтесь переделать — работайте с тем, что есть</li>
                </ol>
              </div>
            </div>
          </div>

          {/* ОНБОРДИНГ */}
          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
            <p className="font-bold text-purple-900 mb-3 text-lg">🚀 ОНБОРДИНГ (первые 90 дней)</p>
            <div className="space-y-2">
              <div className="bg-white p-2 rounded">
                <p className="font-bold text-purple-900 text-xs">День 1-7: Знакомство через {social?.title}</p>
                <p className="text-xs text-gray-700">• Представьте команде через его социальную роль (он пока в маске)</p>
                <p className="text-xs text-gray-700">• Покажите СМЫСЛ работы (важно для {spiritual?.title})</p>
                <p className="text-xs text-gray-700">• Дайте простые задачи для адаптации</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-bold text-purple-900 text-xs">День 8-30: Проявление {personal?.title}</p>
                <p className="text-xs text-gray-700">• Начнёт снимать маску и показывать истинное Я</p>
                <p className="text-xs text-gray-700">• Давайте задачи на его сильные стороны {personal?.title}</p>
                <p className="text-xs text-gray-700">• Вводите постепенно в роль {destiny?.title}</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-bold text-purple-900 text-xs">День 31-60: Проверка соответствия</p>
                <p className="text-xs text-gray-700">• Оцените: работает ли он через {destiny?.title}?</p>
                <p className="text-xs text-gray-700">• Если НЕТ → честно обсудите или расстаньтесь</p>
                <p className="text-xs text-gray-700">• Если ДА → усиливайте роль по предназначению</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-bold text-purple-900 text-xs">День 61-90: Стабилизация</p>
                <p className="text-xs text-gray-700">• Полная работа через {destiny?.title}</p>
                <p className="text-xs text-gray-700">• Результаты станут видны</p>
                <p className="text-xs text-gray-700">• Обратная связь и планирование роста</p>
              </div>
            </div>
          </div>

          {/* РИСКИ И КРАСНЫЕ ФЛАГИ */}
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <p className="font-bold text-red-900 mb-3 text-lg">⚠️ РИСКИ И КРАСНЫЕ ФЛАГИ</p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-red-900 text-sm mb-2">РИСК #1: Уход через 3-6 месяцев</p>
                <p className="text-xs text-gray-700 mb-1"><strong>Причина:</strong> роль не соответствует {destiny?.title}</p>
                <p className="text-xs text-gray-700 mb-1"><strong>Признаки:</strong> низкая мотивация, частые больничные, пассивность</p>
                <p className="text-xs text-green-800"><strong>Профилактика:</strong> давайте задачи строго по {destiny?.title}</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-red-900 text-sm mb-2">РИСК #2: Конфликты в команде</p>
                <p className="text-xs text-gray-700 mb-1"><strong>Причина:</strong> команда давит на его {personal?.title}</p>
                <p className="text-xs text-gray-700 mb-1"><strong>Признаки:</strong> замкнутость, агрессия, избегание общения</p>
                <p className="text-xs text-green-800"><strong>Профилактика:</strong> дайте свободу быть собой</p>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-red-900 text-sm mb-2">РИСК #3: Выгорание</p>
                <p className="text-xs text-gray-700 mb-1"><strong>Причина:</strong> нет смысла, {spiritual?.title} не активирован</p>
                <p className="text-xs text-gray-700 mb-1"><strong>Признаки:</strong> усталость, цинизм, формальное отношение</p>
                <p className="text-xs text-green-800"><strong>Профилактика:</strong> регулярно напоминайте о смысле работы</p>
              </div>
            </div>
          </div>

          {/* ИТОГОВЫЙ ВЕРДИКТ */}
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-500">
            <p className="font-bold text-gray-900 mb-3 text-lg">📊 ИТОГОВЫЙ ВЕРДИКТ HR</p>
            <div className="space-y-3">
              <div className="bg-green-100 p-3 rounded">
                <p className="font-bold text-green-900 text-sm mb-2">✅ НАНИМАТЬ, ЕСЛИ:</p>
                <ul className="text-xs text-gray-700 space-y-1 ml-4">
                  <li>• Должность соответствует {destiny?.title} минимум на 70%</li>
                  <li>• Команда готова принять его {personal?.title}</li>
                  <li>• Можете обеспечить смысл работы (для {spiritual?.title})</li>
                  <li>• Готовы дать свободу проявлять индивидуальность</li>
                </ul>
              </div>
              <div className="bg-red-100 p-3 rounded">
                <p className="font-bold text-red-900 text-sm mb-2">❌ НЕ НАНИМАТЬ, ЕСЛИ:</p>
                <ul className="text-xs text-gray-700 space-y-1 ml-4">
                  <li>• Роль противоречит {destiny?.title} → уйдёт через 3-6 месяцев</li>
                  <li>• Требуется "стандартный" сотрудник → он индивидуален</li>
                  <li>• В команде токсичная среда → конфликты неизбежны</li>
                  <li>• Работа без смысла, только ради денег → выгорит</li>
                </ul>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="font-bold text-blue-900 text-sm mb-2">💡 РЕКОМЕНДАЦИЯ:</p>
                <p className="text-xs text-gray-700">
                  <strong>Лучшая роль:</strong> {professions}<br/>
                  <strong>Мотивация:</strong> смысл + признание + свобода быть собой<br/>
                  <strong>Удержание:</strong> задачи по {destiny?.title} + уважение к {personal?.title}<br/>
                  <strong>Прогноз:</strong> при правильной роли — долгосрочный ценный сотрудник
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ДЛЯ НУТРИЦИОЛОГОВ */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="Apple" size={24} />
            🍎 Для нутрициологов — полный профиль клиента
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* ПРОФИЛЬ КЛИЕНТА */}
          <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500">
            <p className="font-bold text-teal-900 mb-3 text-lg">👤 КТО ЭТОТ ЧЕЛОВЕК</p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-teal-900 text-sm mb-2">Психологический портрет:</p>
                <div className="text-xs text-gray-700 space-y-2">
                  <p><strong>Истинное Я ({personal?.title}):</strong> {personal?.description?.split('.')[0]}. Это влияет на его пищевое поведение</p>
                  <p><strong>Предназначение ({destiny?.title}):</strong> Вес часто защищает от реализации этого. Пока не примет {destiny?.title} — тело держит вес</p>
                  <p><strong>Социальная маска ({social?.title}):</strong> Под этой маской он скрывает истинные эмоции и заедает их</p>
                  <p><strong>Духовная пустота ({spiritual?.title}):</strong> {spiritual?.description?.split('.')[0]}. Заедает отсутствие смысла</p>
                </div>
              </div>
              <div className="bg-red-100 p-3 rounded">
                <p className="font-bold text-red-900 text-sm mb-2">⚠️ Его пищевое поведение:</p>
                <div className="text-xs text-gray-700 space-y-1">
                  <p>• <strong>Заедает:</strong> конфликт между {personal?.title} и {destiny?.title}</p>
                  <p>• <strong>Переедает:</strong> когда носит маску {social?.title} и не может быть собой</p>
                  <p>• <strong>Тянет на сладкое:</strong> компенсирует пустоту {spiritual?.title}</p>
                  <p>• <strong>Вес = защита:</strong> от страха реализовать {destiny?.title}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4-УРОВНЕВАЯ ДИАГНОСТИКА */}
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <p className="font-bold text-red-900 mb-3 text-lg">🔥 ДИАГНОСТИКА: Почему не худеет (4 уровня)</p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-red-900 text-sm">🔴 УРОВЕНЬ 1: {personal?.title} — ФИЗИОЛОГИЯ</p>
                <div className="text-xs text-gray-700 mt-2 space-y-1">
                  <p><strong>Проблема:</strong> {personal?.health?.split('.')[0]}</p>
                  <p><strong>Что делать:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Полное обследование: анализы крови (гормоны, сахар, холестерин)</li>
                    <li>• УЗИ щитовидной железы, органов брюшной полости</li>
                    <li>• Проверка на инсулинорезистентность</li>
                    <li>• Лечить физику ПЕРВЫМ ДЕЛОМ</li>
                  </ul>
                  <p className="text-red-800 font-semibold mt-2">→ Без лечения физики похудение невозможно!</p>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-orange-900 text-sm">🟠 УРОВЕНЬ 2: {destiny?.title} — КАРМИЧЕСКИЙ БЛОК</p>
                <div className="text-xs text-gray-700 mt-2 space-y-1">
                  <p><strong>Что происходит:</strong> Вес — защита от реализации {destiny?.title}</p>
                  <p><strong>Механизм:</strong> {destiny?.description?.split('.').slice(0, 2).join('.')}. Человек БОИТСЯ этого → тело держит вес как броню</p>
                  <p><strong>Что делать:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Направить к психологу для работы со страхом предназначения</li>
                    <li>• Параллельно начать микрошаги к {destiny?.title} (хобби, курсы)</li>
                    <li>• Объяснить связь: принятие {destiny?.title} = уход веса</li>
                  </ul>
                  <p className="text-orange-800 font-semibold mt-2">→ Пока не примет предназначение — вес вернётся!</p>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-yellow-900 text-sm">🟡 УРОВЕНЬ 3: {spiritual?.title} — ПСИХОСОМАТИКА</p>
                <div className="text-xs text-gray-700 mt-2 space-y-1">
                  <p><strong>Что происходит:</strong> Заедает духовную пустоту и отсутствие смысла</p>
                  <p><strong>Проблема:</strong> {spiritual?.health?.split('.').slice(0, 2).join('.')}</p>
                  <p><strong>Что делать:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Духовные практики: медитации, йога, прогулки на природе</li>
                    <li>• Поиск смысла жизни через {spiritual?.title}</li>
                    <li>• Работа с эмоциями: дневник питания + эмоций</li>
                    <li>• Техники осознанного питания</li>
                  </ul>
                  <p className="text-yellow-800 font-semibold mt-2">→ Без смысла жизни — заедание продолжится!</p>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-purple-900 text-sm">🟣 УРОВЕНЬ 4: {social?.title} — СОЦИАЛЬНОЕ ДАВЛЕНИЕ</p>
                <div className="text-xs text-gray-700 mt-2 space-y-1">
                  <p><strong>Конфликт:</strong> Общество видит {social?.title}, но внутри он {personal?.title}</p>
                  <p><strong>Механизм:</strong> Постоянно носит маску → накапливает стресс → заедает</p>
                  <p><strong>Что делать:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Помочь снять маску {social?.title}</li>
                    <li>• Разрешить быть {personal?.title}</li>
                    <li>• Работа с самопринятием</li>
                    <li>• Убрать токсичное окружение</li>
                  </ul>
                  <p className="text-purple-800 font-semibold mt-2">→ Снятие маски = снижение стресса = уход веса!</p>
                </div>
              </div>
            </div>
          </div>

          {/* ПЛАН ПИТАНИЯ */}
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <p className="font-bold text-green-900 mb-3 text-lg">🥗 ПЛАН ПИТАНИЯ (90 дней)</p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-green-900 text-sm mb-2">ЧТО ИСКЛЮЧИТЬ (персонально):</p>
                <div className="text-xs text-gray-700 space-y-1">
                  <p><strong>Для {result.personal} ({personal?.title}):</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Тяжёлая пища, жирное, мучное</li>
                    <li>• Продукты, которые он заедает стресс</li>
                  </ul>
                  <p className="mt-2"><strong>Для {result.destiny} ({destiny?.title}):</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Сахар и быстрые углеводы</li>
                    <li>• Всё, что даёт ложную энергию вместо работы по предназначению</li>
                  </ul>
                  <p className="mt-2"><strong>Для {result.spiritual} ({spiritual?.title}):</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Алкоголь, кофеин (блокируют связь с высшим)</li>
                    <li>• Продукты, которыми заедает духовную пустоту</li>
                  </ul>
                </div>
              </div>
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-green-900 text-sm mb-2">ЧТО ДОБАВИТЬ:</p>
                <div className="text-xs text-gray-700 space-y-1">
                  <p>• <strong>Белок:</strong> 1.5-2г/кг веса (насыщение + сохранение мышц)</p>
                  <p>• <strong>Клетчатка:</strong> 500г+ овощей в день (очищение)</p>
                  <p>• <strong>Вода:</strong> 30-40мл/кг веса (детокс)</p>
                  <p>• <strong>Хорошие жиры:</strong> омега-3, орехи, авокадо</p>
                  <p>• <strong>Медленные углеводы:</strong> крупы, бобовые</p>
                </div>
              </div>
            </div>
          </div>

          {/* КОМПЛЕКСНЫЙ ПЛАН */}
          <div className="bg-blue-50 p-4 rounded-lg
border-l-4 border-blue-500">
            <p className="font-bold text-blue-900 mb-3 text-lg">📋 КОМПЛЕКСНЫЙ ПЛАН РАБОТЫ (12 недель)</p>
            <div className="space-y-2">
              <div className="bg-white p-2 rounded">
                <p className="font-bold text-blue-900 text-xs">Неделя 1-2: Диагностика</p>
                <p className="text-xs text-gray-700">• Анализы: кровь, гормоны, УЗИ</p>
                <p className="text-xs text-gray-700">• Замеры: вес, объёмы, % жира</p>
                <p className="text-xs text-gray-700">• Психологическая диагностика: дневник питания + эмоций</p>
                <p className="text-xs text-gray-700">• Определение уровня проблемы (1-4)</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-bold text-blue-900 text-xs">Неделя 3-4: Запуск</p>
                <p className="text-xs text-gray-700">• Новый рацион (белки, клетчатка, вода)</p>
                <p className="text-xs text-gray-700">• Лечение физических проблем</p>
                <p className="text-xs text-gray-700">• Направление к психологу (если уровень 2-3)</p>
                <p className="text-xs text-gray-700">• Старт духовных практик (если уровень 3)</p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="font-bold text-blue-900 text-xs">Неделя 5-12: Основная работа</p>
                <p className="text-xs text-gray-700">• Диета + движение (ходьба 10000 шагов)</p>
                <p className="text-xs text-gray-700">• Психолог 1 раз в неделю</p>
                <p className="text-xs text-gray-700">• Духовные практики ежедневно</p>
                <p className="text-xs text-gray-700">• Контроль каждые 2 недели</p>
              </div>
              <div className="bg-green-100 p-2 rounded">
                <p className="font-bold text-green-900 text-xs">РЕЗУЛЬТАТ через 90 дней:</p>
                <p className="text-xs text-gray-700">• -8-12 кг веса</p>
                <p className="text-xs text-gray-700">• Улучшение анализов</p>
                <p className="text-xs text-gray-700">• Контроль пищевого поведения</p>
                <p className="text-xs text-gray-700">• Начало работы с {destiny?.title}</p>
              </div>
            </div>
          </div>

          {/* КЛЮЧ К УСПЕХУ */}
          <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
            <p className="font-bold text-amber-900 mb-3 text-lg">🔑 КЛЮЧ К УСПЕХУ</p>
            <div className="bg-white p-3 rounded">
              <p className="text-sm text-gray-700 italic mb-3">
                "Вес — это защита от реализации {destiny?.title}. Пока человек не примет своё предназначение, тело будет держать вес как броню. 
                Когда он станет жить как {destiny?.title}, вес уйдёт сам — это произойдёт естественно."
              </p>
              <div className="text-xs text-gray-700 space-y-2">
                <p><strong>Ваша задача как нутрициолога:</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>1. Вылечить физику (уровень 1)</li>
                  <li>2. Направить к психологу для работы с {destiny?.title} (уровень 2)</li>
                  <li>3. Дать духовные практики для {spiritual?.title} (уровень 3)</li>
                  <li>4. Помочь снять маску {social?.title} (уровень 4)</li>
                  <li>5. Дать правильное питание</li>
                </ul>
                <p className="font-bold text-amber-900 mt-3">→ Работайте со ВСЕМИ 4 уровнями одновременно!</p>
              </div>
            </div>
          </div>

          {/* ПРОГНОЗ */}
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-500">
            <p className="font-bold text-gray-900 mb-3 text-lg">📊 ПРОГНОЗ</p>
            <div className="space-y-2">
              <div className="bg-green-100 p-3 rounded">
                <p className="font-bold text-green-900 text-sm mb-2">✅ ЕСЛИ РАБОТАЕТ НА ВСЕХ УРОВНЯХ:</p>
                <div className="text-xs text-gray-700 space-y-1">
                  <p>• Месяц 1-3: -8-12 кг, улучшение анализов, контроль питания</p>
                  <p>• Месяц 4-6: -еще 5-8 кг, начинает жить через {destiny?.title}</p>
                  <p>• Месяц 7-12: выход на целевой вес, стабилизация</p>
                  <p className="font-bold text-green-900 mt-2">→ Вес НЕ возвращается, т.к. изменилась жизнь!</p>
                </div>
              </div>
              <div className="bg-red-100 p-3 rounded">
                <p className="font-bold text-red-900 text-sm mb-2">⚠️ ЕСЛИ РАБОТАЕТ ТОЛЬКО С ДИЕТОЙ:</p>
                <div className="text-xs text-gray-700 space-y-1">
                  <p>• Месяц 1-2: -3-5 кг (только вода)</p>
                  <p>• Месяц 3: плато, вес стоит</p>
                  <p>• Месяц 4+: откат, вес возвращается</p>
                  <p className="font-bold text-red-900 mt-2">→ Без работы с предназначением вес ВСЕГДА вернётся!</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ДЛЯ БИЗНЕС-КОУЧЕЙ */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="TrendingUp" size={24} />
            📈 Для бизнес-коучей — полный финансовый профиль
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* ПРОФИЛЬ КЛИЕНТА */}
          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
            <p className="font-bold text-purple-900 mb-3 text-lg">👤 КТО ЭТОТ ЧЕЛОВЕК (финансовый профиль)</p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded">
                <p className="font-bold text-purple-900 text-sm mb-2">Его отношение к деньгам:</p>
                <div className="text-xs text-gray-700 space-y-2">
                  <p><strong>Через {personal?.title} зарабатывает:</strong> {personal?.finance?.split('💸')[1]?.split('•')[1] || 'см. личный аркан'}</p>
                  <p><strong>Истинный денежный код ({destiny?.title}):</strong> {professions}</p>
                  <p><strong>Продаёт через маску ({social?.title}):</strong> но это фасад, клиенты чувствуют фальшь</p>
                  <p><strong>Денежные блоки ({spiritual?.title}):</strong> {spiritual?.health?.split('.')[0]}</p>
                  <p className="text-red-800 font-bold mt-2">→ Работает через {personal?.title}, но деньги приходят ТОЛЬКО через {destiny?.title}!</p>
                </div>
              </div>
            </div>
          </div>

          {/* ДИАГНОСТИКА */}
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <p className="font-bold text-red-900 mb-3 text-lg">💸 ДИАГНОСТИКА: Почему нет денег (4 уровня блокировки)</p>
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

      {/* КНОПКИ СКАЧИВАНИЯ ПРОФИЛЕЙ */}
      <ShareButtons result={result} birthDate={birthDate} />
    </div>
  );
};