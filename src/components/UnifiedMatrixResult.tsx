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
            🧠 Для психологов и коучей
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="font-bold text-purple-900 mb-2">🎯 Главная проблема клиента:</p>
            <p className="text-sm text-gray-800 mb-3">Внутренний конфликт 4-х энергий:</p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>• Аркан {result.personal} ({personal?.title}) — как он себя ощущает, его эго</li>
              <li>• Аркан {result.destiny} ({destiny?.title}) — чего от него ждёт жизнь</li>
              <li>• Аркан {result.social} ({social?.title}) — маска для общества</li>
              <li>• Аркан {result.spiritual} ({spiritual?.title}) — его глубинная суть</li>
            </ul>
            <p className="text-sm text-gray-800 mt-3">
              Человек живёт через <strong>{personal?.title}</strong>, общество видит <strong>{social?.title}</strong>, 
              но жизнь требует <strong>{destiny?.title}</strong>, а душа тянется к <strong>{spiritual?.title}</strong>. Отсюда внутренний разлад.
            </p>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="font-bold text-amber-900 mb-2">📿 Кармические задачи:</p>
            <ol className="text-sm text-gray-700 space-y-1 ml-5 list-decimal">
              <li>Принять Аркан {result.destiny} ({destiny?.title}) как истинное предназначение</li>
              <li>Интегрировать {personal?.title} с {destiny?.title} — использовать личные качества для предназначения</li>
              <li>Разоблачить {social?.title} как ложную идентичность — снять маску</li>
              <li>Активировать {spiritual?.title} — это связь с высшим и смысл жизни</li>
            </ol>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-bold text-green-900 mb-2">💬 Как говорить с клиентом:</p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li>✅ Используйте язык {personal?.title} — это его родной язык</li>
              <li>⚠️ НЕ давите на {destiny?.title} напрямую — он убежит</li>
              <li>🎭 Разоблачите {social?.title} как маску: "Это не ты, это защита"</li>
              <li>🙏 Активируйте {spiritual?.title} через духовные практики</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-bold text-blue-900 mb-2">📋 План терапии (пошагово):</p>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>ШАГ 1 (Сессии 1-3):</strong> Принятие {personal?.title} — это его данность, не враг</p>
              <p><strong>ШАГ 2 (Сессии 4-6):</strong> Разоблачение {social?.title} — когда и зачем появилась маска</p>
              <p><strong>ШАГ 3 (Сессии 7-10):</strong> Интеграция {destiny?.title} — принять как истинный путь</p>
              <p><strong>ШАГ 4 (Сессии 11-15):</strong> Активация {spiritual?.title} — духовные практики</p>
              <p><strong>ШАГ 5 (Сессии 16+):</strong> Жизнь из Единства — все 4 аркана работают вместе</p>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <p className="font-bold text-red-900 mb-2">🔮 Прогноз:</p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>✅ ЕСЛИ ПРИМЕТ:</strong> через 6-12 месяцев выход на предназначение ({professions}), деньги потоком, гармония в отношениях
            </p>
            <p className="text-sm text-gray-700">
              <strong>⚠️ ЕСЛИ НЕ ПРИМЕТ:</strong> кризисы, болезни, потеря работы, разрывы — судьба будет ломать до принятия {destiny?.title}
            </p>
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
