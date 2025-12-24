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

  // Функция для создания объединённого портрета
  const createUnifiedPortrait = () => {
    return `
${result.name} — это человек, который сочетает в себе:

• ХАРАКТЕР (Аркан ${result.personal} - ${personal?.title}): ${personal?.description}

• ПРЕДНАЗНАЧЕНИЕ (Аркан ${result.destiny} - ${destiny?.title}): ${destiny?.description}

• СОЦИАЛЬНАЯ РОЛЬ (Аркан ${result.social} - ${social?.title}): ${social?.description}

• ДУХОВНАЯ СУТЬ (Аркан ${result.spiritual} - ${spiritual?.title}): ${spiritual?.description}

КЛЮЧЕВОЕ: Этот человек проживает жизнь через призму ${personal?.title} (как он себя ощущает), стремится реализовать ${destiny?.title} (его истинная цель), в обществе выглядит как ${social?.title} (как его воспринимают), а на духовном уровне он ${spiritual?.title} (глубинная суть).
    `.trim();
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-300 shadow-2xl mb-8">
      <CardHeader className="text-center space-y-4 pb-8">
        <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600">
          🎯 ПОЛНЫЙ ПОРТРЕТ ЛИЧНОСТИ
        </CardTitle>
        <p className="text-xl text-amber-900 font-semibold">
          {result.name} — Единый анализ всех 4 энергий
        </p>
        <p className="text-base text-gray-700 max-w-3xl mx-auto">
          Объединённый портрет: кто этот человек, как с ним работать, что делать специалисту
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* ОБЪЕДИНЁННЫЙ ПОРТРЕТ ЛИЧНОСТИ */}
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-8 rounded-2xl border-2 border-amber-400 shadow-2xl">
          <h3 className="text-3xl font-bold text-amber-900 mb-6 flex items-center gap-3">
            <Icon name="User" size={32} />
            👤 КТО ЭТОТ ЧЕЛОВЕК — ЕДИНЫЙ ПОРТРЕТ
          </h3>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-lg text-gray-800 text-lg leading-relaxed whitespace-pre-line">
            {createUnifiedPortrait()}
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-xl border-2 border-green-300">
              <p className="font-bold text-green-900 mb-2 flex items-center gap-2">
                <Icon name="ThumbsUp" size={20} />
                ✅ СИЛЬНЫЕ СТОРОНЫ:
              </p>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• <strong>Аркан {result.personal}:</strong> Основа личности — {personal?.title}</li>
                <li>• <strong>Аркан {result.destiny}:</strong> Предназначение в {destiny?.career?.split(',')[0]}</li>
                <li>• <strong>Аркан {result.social}:</strong> Социальные навыки — {social?.title}</li>
                <li>• <strong>Аркан {result.spiritual}:</strong> Духовная сила — {spiritual?.title}</li>
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border-2 border-red-300">
              <p className="font-bold text-red-900 mb-2 flex items-center gap-2">
                <Icon name="AlertTriangle" size={20} />
                ⚠️ СЛАБЫЕ СТОРОНЫ / БЛОКИ:
              </p>
              <ul className="text-sm text-gray-800 space-y-1">
                <li>• <strong>Аркан {result.personal}:</strong> Здоровье — {personal?.health?.split('.')[0]}</li>
                <li>• <strong>Аркан {result.destiny}:</strong> Конфликт с {personal?.title}</li>
                <li>• <strong>Аркан {result.social}:</strong> Маска вместо реальности</li>
                <li>• <strong>Аркан {result.spiritual}:</strong> Психосоматика — {spiritual?.health?.split('.')[0]}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ПОСОБИЕ ДЛЯ СПЕЦИАЛИСТОВ */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-8 rounded-2xl border-2 border-indigo-400 shadow-2xl">
          <h3 className="text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-3">
            <Icon name="BookOpen" size={32} />
            📖 ПОСОБИЕ ДЛЯ СПЕЦИАЛИСТОВ — КАК РАБОТАТЬ С ЭТИМ ЧЕЛОВЕКОМ
          </h3>

          {/* ДЛЯ ПСИХОЛОГОВ — РАСШИРЕННОЕ ПОСОБИЕ */}
          <div className="mb-6 bg-white/90 p-6 rounded-xl shadow-lg">
            <h4 className="text-2xl font-bold text-purple-900 mb-4 flex items-center gap-2">
              <Icon name="Brain" size={28} />
              🧠 ДЛЯ ПСИХОЛОГОВ И КОУЧЕЙ — ПОЛНОЕ ПОСОБИЕ
            </h4>
            
            <div className="space-y-4 text-gray-800">
              {/* ГЛАВНАЯ ПРОБЛЕМА */}
              <div>
                <p className="font-bold text-purple-900 text-lg mb-2">🎯 ГЛАВНАЯ ПРОБЛЕМА КЛИЕНТА:</p>
                <p className="text-sm bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <strong>Внутренний конфликт 4-х энергий:</strong><br/>
                  • <strong>Аркан {result.personal} ({personal?.title})</strong> — как он себя ощущает, его эго и идентичность<br/>
                  • <strong>Аркан {result.destiny} ({destiny?.title})</strong> — чего от него ждёт жизнь, его истинное предназначение<br/>
                  • <strong>Аркан {result.social} ({social?.title})</strong> — маска, которую он носит в обществе, защитный механизм<br/>
                  • <strong>Аркан {result.spiritual} ({spiritual?.title})</strong> — его глубинная духовная суть, которую он не осознаёт<br/><br/>
                  
                  <strong className="text-red-700">⚠️ Корень всех проблем:</strong> Человек живёт через {personal?.title}, общество видит его как {social?.title}, 
                  но жизнь требует от него реализации {destiny?.title}, а душа тянется к {spiritual?.title}. 
                  Это 4 разных направления — отсюда внутренний разлад, тревога, ощущение "я не на своём месте".
                </p>
              </div>

              {/* КАРМИЧЕСКИЕ ЗАДАЧИ */}
              <div>
                <p className="font-bold text-purple-900 text-lg mb-2">📿 КАРМИЧЕСКИЕ ЗАДАЧИ КЛИЕНТА:</p>
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500 space-y-2 text-sm">
                  <p><strong>1. Принять свой Аркан {result.destiny} ({destiny?.title}):</strong><br/>
                  Это его истинное предназначение. Пока он сопротивляется — жизнь будет наказывать через кризисы, болезни, потери.</p>
                  
                  <p><strong>2. Интегрировать Аркан {result.personal} ({personal?.title}) с {result.destiny}:</strong><br/>
                  {personal?.title} — не враг, а инструмент для реализации {destiny?.title}. Показать, как использовать личные качества для предназначения.</p>
                  
                  <p><strong>3. Разоблачить Аркан {result.social} ({social?.title}) как ложную идентичность:</strong><br/>
                  Это не он, а защита. Помочь снять маску и жить из истинного Я.</p>
                  
                  <p><strong>4. Активировать Аркан {result.spiritual} ({spiritual?.title}):</strong><br/>
                  Это его связь с высшим. Пока не активирован — жизнь бессмысленна, деньги не идут, отношения токсичны.</p>
                </div>
              </div>

              {/* ЧТО НУЖНО ПОБОРОТЬ */}
              <div>
                <p className="font-bold text-purple-900 text-lg mb-2">⚔️ ЧТО НУЖНО ПОБОРОТЬ В СЕБЕ:</p>
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 space-y-2 text-sm">
                  <p><strong>🔴 Из Аркана {result.personal} ({personal?.title}):</strong><br/>
                  Базовые страхи и блоки личности — {personal?.health?.split('•')[1]?.trim() || 'сопротивление предназначению'}</p>
                  
                  <p><strong>🟣 Из Аркана {result.destiny} ({destiny?.title}):</strong><br/>
                  Сопротивление своему предназначению, страх реализации — {destiny?.health?.split('•')[1]?.trim() || 'кармический блок'}</p>
                  
                  <p><strong>🟢 Из Аркана {result.social} ({social?.title}):</strong><br/>
                  Зависимость от чужого мнения, жизнь "на публику" вместо жизни для себя</p>
                  
                  <p><strong>🟡 Из Аркана {result.spiritual} ({spiritual?.title}):</strong><br/>
                  Духовная пустота, отрезанность от высшего — {spiritual?.health?.split('•')[1]?.trim() || 'психосоматические блоки'}</p>
                </div>
              </div>

              {/* КАК ГОВОРИТЬ */}
              <div>
                <p className="font-bold text-purple-900 text-lg mb-2">💬 КАК ГОВОРИТЬ С КЛИЕНТОМ:</p>
                <ul className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 space-y-2 text-sm">
                  <li><strong>✅ ИСПОЛЬЗУЙТЕ язык Аркана {result.personal}:</strong><br/>
                  Говорите через его {personal?.title} — так он услышит. Это его родной язык.</li>
                  
                  <li><strong>⚠️ НЕ ДАВИТЕ на Аркан {result.destiny} напрямую:</strong><br/>
                  Если скажете "ты должен быть {destiny?.title}" — он убежит. Вместо этого покажите, КАК его {personal?.title} может помочь стать {destiny?.title}.</li>
                  
                  <li><strong>🎭 РАЗОБЛАЧИТЕ Аркан {result.social} как маску:</strong><br/>
                  "То, как тебя видят другие ({social?.title}) — это не ты. Это защита. Ты гораздо глубже."</li>
                  
                  <li><strong>🙏 АКТИВИРУЙТЕ Аркан {result.spiritual} через практики:</strong><br/>
                  Медитации, духовные ретриты, работа с энергией — это путь к {spiritual?.title}.</li>
                </ul>
              </div>

              {/* ПЛАН ТЕРАПИИ */}
              <div>
                <p className="font-bold text-purple-900 text-lg mb-2">📋 ПЛАН ТЕРАПИИ (ПОШАГОВО):</p>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 space-y-3 text-sm">
                  <p><strong>ШАГ 1 (Сессии 1-3): Принятие Аркана {result.personal}</strong><br/>
                  Помочь клиенту увидеть и принять свой {personal?.title}. Это его данность, не враг. Проработать базовые страхи.</p>
                  
                  <p><strong>ШАГ 2 (Сессии 4-6): Разоблачение Аркана {result.social}</strong><br/>
                  Показать, что {social?.title} — это маска. Исследовать, когда и зачем она появилась. Дать разрешение снять её.</p>
                  
                  <p><strong>ШАГ 3 (Сессии 7-10): Интеграция Аркана {result.destiny}</strong><br/>
                  Помочь принять {destiny?.title} как истинный путь. Показать конкретные шаги: {destiny?.career}. Преодолеть сопротивление.</p>
                  
                  <p><strong>ШАГ 4 (Сессии 11-15): Активация Аркана {result.spiritual}</strong><br/>
                  Ввести духовные практики для {spiritual?.title}. Очистить психосоматику. Выйти на новый уровень осознанности.</p>
                  
                  <p><strong>ШАГ 5 (Сессии 16+): Жизнь из Единства</strong><br/>
                  Помочь жить одновременно из всех 4 арканов: {personal?.title} как инструмент → {destiny?.title} как цель → {social?.title} для взаимодействия → {spiritual?.title} как смысл.</p>
                </div>
              </div>

              {/* ЧТО ЖДЁТ КЛИЕНТА */}
              <div>
                <p className="font-bold text-purple-900 text-lg mb-2">🔮 ЧТО ЖДЁТ КЛИЕНТА (ПРОГНОЗ):</p>
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 space-y-2 text-sm">
                  <p><strong>✅ ЕСЛИ ПРИМЕТ ТЕРАПИЮ:</strong><br/>
                  Через 6-12 месяцев: выход на своё предназначение ({destiny?.career}), деньги потоком ({destiny?.finance}), 
                  гармония в отношениях, психосоматика уйдёт, энергия вернётся.</p>
                  
                  <p><strong>⚠️ ЕСЛИ НЕ ПРИМЕТ / БРОСИТ:</strong><br/>
                  Жизнь будет давить через кризисы: потеря работы, болезни ({personal?.health}), разрывы отношений, депрессия. 
                  Судьба будет ломать его до тех пор, пока он не примет {destiny?.title}.</p>
                </div>
              </div>

              {/* КЛЮЧ К ПРОРЫВУ */}
              <div>
                <p className="font-bold text-purple-900 text-lg mb-2">🔑 КЛЮЧ К ПРОРЫВУ:</p>
                <p className="text-sm bg-gradient-to-r from-yellow-100 to-amber-100 p-4 rounded-lg border-2 border-amber-400">
                  <strong className="text-amber-900">Главное озарение для клиента:</strong><br/>
                  "Твой {personal?.title} — это не ошибка. Это инструмент для реализации {destiny?.title}. 
                  То, что ты прятал за {social?.title}, и есть твоя сила. А {spiritual?.title} — это твоя связь с высшим, 
                  которая даст смысл всему. Когда все 4 энергии работают вместе — ты становишься собой. И жизнь начинается."
                </p>
              </div>

              {/* ЧЕГО ИЗБЕГАТЬ */}
              <div>
                <p className="font-bold text-purple-900 text-lg mb-2">❌ ЧЕГО ИЗБЕГАТЬ В ТЕРАПИИ:</p>
                <ul className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 space-y-1 text-sm text-red-800">
                  <li>• ❌ Критиковать {personal?.title} — это его ядро, он уйдёт в защиту</li>
                  <li>• ❌ Навязывать {destiny?.title} силой — он уйдёт в сопротивление</li>
                  <li>• ❌ Разоблачать {social?.title} публично — это травма</li>
                  <li>• ❌ Игнорировать {spiritual?.title} — без духовности нет исцеления</li>
                  <li>• ❌ Давать советы вместо вопросов — клиент должен САМ прийти к озарению</li>
                  <li>• ❌ Спешить — интеграция 4 энергий требует времени (минимум 6 месяцев)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ДЛЯ HR */}
          <div className="mb-6 bg-white/90 p-6 rounded-xl shadow-lg">
            <h4 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Icon name="Briefcase" size={24} />
              👨‍💼 ДЛЯ HR И РЕКРУТЕРОВ
            </h4>
            <div className="space-y-3 text-gray-800">
              <div>
                <p className="font-semibold text-blue-800">✅ НА КАКУЮ ДОЛЖНОСТЬ ПОДХОДИТ:</p>
                <p className="text-sm bg-blue-50 p-3 rounded mt-1">
                  <strong>Аркан {result.destiny} ({destiny?.title})</strong> — это его истинное призвание. 
                  Лучшие роли: {destiny?.career}. 
                  Будет успешен в задачах, где нужно {destiny?.finance}.
                </p>
              </div>

              <div>
                <p className="font-semibold text-blue-800">🤝 КАК ВПИШЕТСЯ В КОМАНДУ:</p>
                <p className="text-sm bg-green-50 p-3 rounded mt-1">
                  <strong>Аркан {result.social} ({social?.title})</strong> — так его видят коллеги. 
                  {social?.relationships}. 
                  Конфликты возможны, если в команде есть противоположные арканы.
                </p>
              </div>

              <div>
                <p className="font-semibold text-blue-800">💰 МОТИВАЦИЯ И ЗАРПЛАТА:</p>
                <p className="text-sm bg-yellow-50 p-3 rounded mt-1">
                  Мотивирован через {destiny?.finance}. 
                  НЕ мотивирован деньгами, если работа противоречит {destiny?.title}. 
                  Зарплатные ожидания: {personal?.finance}.
                </p>
              </div>

              <div>
                <p className="font-semibold text-blue-800">⚠️ РИСКИ ПРИ НАЙМЕ:</p>
                <ul className="text-sm space-y-1 mt-1 text-red-700">
                  <li>• Уйдёт через 3-6 месяцев, если роль не соответствует {destiny?.title}</li>
                  <li>• Конфликтен, если в команде давят на его {personal?.title}</li>
                  <li>• Выгорит, если заставлять отказаться от {spiritual?.title}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ДЛЯ НУТРИЦИОЛОГОВ */}
          <div className="mb-6 bg-white/90 p-6 rounded-xl shadow-lg">
            <h4 className="text-xl font-bold text-orange-900 mb-3 flex items-center gap-2">
              <Icon name="Apple" size={24} />
              🍎 ДЛЯ НУТРИЦИОЛОГОВ
            </h4>
            <div className="space-y-3 text-gray-800">
              <div>
                <p className="font-semibold text-orange-800">🔥 ПОЧЕМУ НЕ ХУДЕЕТ:</p>
                <div className="text-sm space-y-2 mt-1">
                  <p className="bg-red-50 p-2 rounded">
                    <strong>Аркан {result.personal}:</strong> Базовые проблемы — {personal?.health}. 
                    Это физиология, её нужно лечить.
                  </p>
                  <p className="bg-orange-50 p-2 rounded">
                    <strong>Аркан {result.destiny}:</strong> Кармический блок — {destiny?.health}. 
                    Вес как защита от реализации предназначения.
                  </p>
                  <p className="bg-yellow-50 p-2 rounded">
                    <strong>Аркан {result.spiritual}:</strong> Психосоматика — {spiritual?.health}. 
                    Заедает непрожитые эмоции и духовную пустоту.
                  </p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-orange-800">🥗 ЧТО ИСКЛЮЧИТЬ ИЗ РАЦИОНА:</p>
                <ul className="text-sm space-y-1 mt-1">
                  <li>• Для аркана {result.personal}: тяжёлая пища, жирное, мучное (проблемы с {personal?.health?.split('.')[0]})</li>
                  <li>• Для аркана {result.destiny}: сахар и быстрые углеводы (заедает стресс от нереализованности)</li>
                  <li>• Для аркана {result.spiritual}: алкоголь и кофеин (усиливает психосоматику)</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-orange-800">✅ ПЛАН ДЕЙСТВИЙ:</p>
                <ol className="text-sm space-y-1 mt-1 list-decimal ml-4">
                  <li>Пройти обследование на {personal?.health?.split(',')[0]} — это физика</li>
                  <li>Параллельно работать с психологом над {destiny?.title} — разблокировать кармический узел</li>
                  <li>Ввести практику осознанности для {spiritual?.title} — убрать заедание эмоций</li>
                  <li>Диета: белки + клетчатка, убрать сахар и мучное на 90 дней</li>
                </ol>
              </div>
            </div>
          </div>

          {/* ДЛЯ БИЗНЕС-КОУЧЕЙ */}
          <div className="bg-white/90 p-6 rounded-xl shadow-lg">
            <h4 className="text-xl font-bold text-green-900 mb-3 flex items-center gap-2">
              <Icon name="TrendingUp" size={24} />
              📈 ДЛЯ БИЗНЕС-КОУЧЕЙ И КОНСУЛЬТАНТОВ
            </h4>
            <div className="space-y-3 text-gray-800">
              <div>
                <p className="font-semibold text-green-800">💸 ПОЧЕМУ НЕТ ДЕНЕГ:</p>
                <p className="text-sm bg-red-50 p-3 rounded mt-1">
                  Главная проблема: человек зарабатывает через {personal?.title}, но деньги приходят только через {destiny?.title}. 
                  Конфликт энергий = нет денег. Нужно развернуть бизнес в сторону {destiny?.career}.
                </p>
              </div>

              <div>
                <p className="font-semibold text-green-800">🎯 В КАКОЙ НИШЕ БУДЕТ УСПЕХ:</p>
                <p className="text-sm bg-green-50 p-3 rounded mt-1">
                  <strong>100% попадание:</strong> {destiny?.career}. 
                  Монетизация: {destiny?.finance}. 
                  Конкретно: если сейчас занимается не этим — сменить нишу за 30 дней.
                </p>
              </div>

              <div>
                <p className="font-semibold text-green-800">🚀 КАК ВЫЙТИ НА ×10 ДОХОД:</p>
                <ol className="text-sm space-y-2 mt-1 list-decimal ml-4">
                  <li><strong>Шаг 1:</strong> Признать, что {personal?.title} — это не путь денег. Это эго.</li>
                  <li><strong>Шаг 2:</strong> Принять {destiny?.title} как денежное предназначение. Довериться.</li>
                  <li><strong>Шаг 3:</strong> Использовать {social?.title} для нетворкинга и продаж (это социальная маска, она работает).</li>
                  <li><strong>Шаг 4:</strong> Очистить {spiritual?.title} — убрать денежные блоки через духовные практики.</li>
                  <li><strong>Результат:</strong> Деньги пойдут потоком через 2-3 месяца.</li>
                </ol>
              </div>

              <div>
                <p className="font-semibold text-green-800">⚠️ ЧЕГО НЕ ДЕЛАТЬ:</p>
                <ul className="text-sm space-y-1 mt-1 text-red-700">
                  <li>• Не пытаться заработать через {personal?.title} — это тупик</li>
                  <li>• Не игнорировать {spiritual?.title} — там сидят денежные блоки из прошлых жизней</li>
                  <li>• Не строить бизнес на {social?.title} — это фасад, не фундамент</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* КРАТКАЯ СПРАВКА ПО ЭНЕРГИЯМ */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-2xl border-2 border-gray-400 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <Icon name="Info" size={28} />
            📋 КРАТКАЯ СПРАВКА ПО ВСЕМ 4 ЭНЕРГИЯМ
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl">
              <p className="font-bold text-red-700 mb-1">🔴 Аркан {result.personal} — {personal?.title}</p>
              <p className="text-xs text-gray-700">Личность: {personal?.description?.substring(0, 100)}...</p>
              <p className="text-xs text-gray-600 mt-1">Здоровье: {personal?.health?.substring(0, 80)}...</p>
            </div>

            <div className="bg-white p-4 rounded-xl">
              <p className="font-bold text-purple-700 mb-1">🟣 Аркан {result.destiny} — {destiny?.title}</p>
              <p className="text-xs text-gray-700">Предназначение: {destiny?.description?.substring(0, 100)}...</p>
              <p className="text-xs text-gray-600 mt-1">Карьера: {destiny?.career?.substring(0, 80)}...</p>
            </div>

            <div className="bg-white p-4 rounded-xl">
              <p className="font-bold text-green-700 mb-1">🟢 Аркан {result.social} — {social?.title}</p>
              <p className="text-xs text-gray-700">Социум: {social?.description?.substring(0, 100)}...</p>
              <p className="text-xs text-gray-600 mt-1">Отношения: {social?.relationships?.substring(0, 80)}...</p>
            </div>

            <div className="bg-white p-4 rounded-xl">
              <p className="font-bold text-amber-700 mb-1">🟡 Аркан {result.spiritual} — {spiritual?.title}</p>
              <p className="text-xs text-gray-700">Духовность: {spiritual?.description?.substring(0, 100)}...</p>
              <p className="text-xs text-gray-600 mt-1">Психосоматика: {spiritual?.health?.substring(0, 80)}...</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};