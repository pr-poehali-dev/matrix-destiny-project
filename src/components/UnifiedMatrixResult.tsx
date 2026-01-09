import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { energyDescriptions, arcanaSimpleNames } from '@/data/arcana-descriptions';
import { ShareButtons } from '@/components/ShareButtons';

interface UnifiedMatrixResultProps {
  result: {
    personal: number;
    destiny: number;
    social: number;
    spiritual: number;
    name: string;
  } | null;
  hasAccess: boolean;
  birthDate: string;
}

const extractProfessions = (finance: string | undefined) => {
  if (!finance) return '';
  const profSection = finance.split('🎓 ПРОФЕССИИ')[1];
  if (profSection) {
    return profSection.split(':')[1]?.split('\n\n')[0]?.trim() || '';
  }
  return '';
};

const extractHealthZones = (health: string | undefined) => {
  if (!health) return '';
  const zoneSection = health.split('⚠️ ЗОНЫ ОСОБОГО ВНИМАНИЯ')[1];
  if (zoneSection) {
    return zoneSection.split('\n\n')[0]?.trim() || '';
  }
  return '';
};

const extractHealthCauses = (health: string | undefined) => {
  if (!health) return '';
  const causeSection = health.split('🔬 ВОЗМОЖНЫЕ ПРИЧИНЫ')[1];
  if (causeSection) {
    return causeSection.split('\n\n')[0]?.trim() || '';
  }
  return '';
};

const extractRelationshipStyle = (relationships: string | undefined) => {
  if (!relationships) return '';
  const styleSection = relationships.split('🎭 СТИЛЬ ОТНОШЕНИЙ')[1];
  if (styleSection) {
    return styleSection.split('\n\n')[0]?.trim() || '';
  }
  return '';
};

const extractRelationshipNeeds = (relationships: string | undefined) => {
  if (!relationships) return '';
  const needSection = relationships.split('💝 ЧТО НУЖНО')[1];
  if (needSection) {
    return needSection.split('\n\n')[0]?.trim() || '';
  }
  return '';
};

const extractRelationshipDestroys = (relationships: string | undefined) => {
  if (!relationships) return '';
  const destroySection = relationships.split('⚡ ЧТО РАЗРУШАЕТ')[1];
  if (destroySection) {
    return destroySection.split('\n\n')[0]?.trim() || '';
  }
  return '';
};

// Функция для синтеза единого заключения по здоровью из 4 арканов
const synthesizeHealthConclusion = (
  personal: any,
  destiny: any,
  social: any,
  spiritual: any,
  personalSimple: string,
  destinySimple: string,
  socialSimple: string,
  spiritualSimple: string
) => {
  // Извлекаем ключевые зоны риска из каждого аркана
  const zones = [
    extractHealthZones(personal.health),
    extractHealthZones(destiny.health),
    extractHealthZones(social.health),
    extractHealthZones(spiritual.health)
  ].filter(z => z);

  const causes = [
    extractHealthCauses(personal.health),
    extractHealthCauses(destiny.health),
    extractHealthCauses(social.health),
    extractHealthCauses(spiritual.health)
  ].filter(c => c);

  return {
    title: '🏥 ЗДОРОВЬЕ — Единое заключение',
    conflict: `Ваше тело — это поле битвы 4 энергий:\n\n• ${personalSimple} (характер) создаёт базовую конституцию\n• ${destinySimple} (предназначение) — если НЕ живёте им, тело болеет\n• ${socialSimple} (маска) — когда носите маску 24/7, тело устаёт\n• ${spiritualSimple} (душа) — без духовности возникает пустота и психосоматика`,
    mainRisk: '⚠️ ГЛАВНЫЙ РИСК',
    mainRiskText: `Если вы НЕ живёте через ${destinySimple} (ваше предназначение), тело будет саботировать вас болезнями. Это способ судьбы сказать: "Ты идёшь не туда!"`,
    zones: zones.slice(0, 3).join('\n'),
    rootCause: `🔬 КОРНЕВАЯ ПРИЧИНА БОЛЕЗНЕЙ:\n\nФизический уровень (${personalSimple}): проблемы с конкретными органами\nКармический уровень (${destinySimple}): болезни от неприня��ия предназначения\nСоциальный уровень (${socialSimple}): стресс от постоянной маски\nДуховный уровень (${spiritualSimple}): психосоматика от пустоты`,
    actionPlan: `✅ ЧТО ДЕЛАТЬ:\n\n1️⃣ Лечите физику (${personalSimple}) — обследование, анализы, врачи\n2️⃣ Примите предназначение (${destinySimple}) — начните жить им хотя бы 15 минут в день\n3️⃣ Снимите маску (${socialSimple}) — хотя бы дома будьте собой\n4️⃣ Активируйте душу (${spiritualSimple}) — медитации, духовные практики`
  };
};

// Функция для синтеза единого заключения по финансам
const synthesizeFinanceConclusion = (
  personal: any,
  destiny: any,
  social: any,
  spiritual: any,
  personalSimple: string,
  destinySimple: string,
  socialSimple: string,
  spiritualSimple: string
) => {
  const professions = extractProfessions(destiny.finance);

  return {
    title: '💰 ДЕНЬГИ И ФИНАНСЫ — Единое заключение',
    diagnosis: `🔴 ПОЧЕМУ НЕТ ДЕНЕГ (диагностика):\n\nВы работаете через ${personalSimple}, но деньги приходят ТОЛЬКО через ${destinySimple}!\n\nВот что происходит:\n• Вы зарабатываете как ${personalSimple} — это даёт мало денег\n• Продаёте себя через маску ${socialSimple} — клиенты чувствуют фальшь\n• Ваше истинное призвание ${destinySimple} — не реализовано\n• Денежные блоки ${spiritualSimple} — страх богатства, вина за деньги`,
    moneyCode: `🎯 ВАШ ДЕНЕЖНЫЙ КОД:\n\n${destinySimple} — это ваше кармическое предназначение.\nВселенная даст деньги ТОЛЬКО за эту деятельность!\n\n💼 Конкретные ниши: ${professions || 'см. раздел Предназначение'}`,
    blockages: `💎 4 УРОВНЯ ДЕНЕЖНЫХ БЛОКОВ:\n\n1️⃣ ${personalSimple}: работаете в неправильной сфере\n2️⃣ ${destinySimple}: не приняли своё предназначение\n3️⃣ ${socialSimple}: продаёте фасад, а не себя\n4️⃣ ${spiritualSimple}: вина за деньги, страх богатства`,
    solution: `🚀 ПЛАН ×10 ДОХОД (90 ДНЕЙ):\n\nНеделя 1-2: Признать, что ${personalSimple} — не путь денег\nНеделя 3-4: Принять ${destinySimple} как денежное призвание\nНеделя 5-6: Сменить нишу на ${professions || destinySimple}, запустить MVP\nНеделя 7-8: Использовать ${socialSimple} для продаж (это ваш фасад для клиентов)\nНеделя 9-12: Очистить ${spiritualSimple} — медитации, проработка денежных блоков\n\n📊 РЕЗУЛЬТАТ: доход ×3-5 через 90 дней, ×10-15 через год`
  };
};

// Функция для синтеза единого заключения по отношениям
const synthesizeRelationshipsConclusion = (
  personal: any,
  destiny: any,
  social: any,
  spiritual: any,
  personalSimple: string,
  destinySimple: string,
  socialSimple: string,
  spiritualSimple: string
) => {
  return {
    title: '💕 ОТНОШЕНИЯ И ЛЮБОВЬ — Единое заключение',
    problem: `⚠️ ПОЧЕМУ НЕТ ОТНОШЕНИЙ / ПОСТОЯННЫЕ КОНФЛИКТЫ:\n\nВнутри вас 4 разных "Я", которые ищут 4 разных партнёров:\n\n• ${personalSimple} (истинное Я) — хочет быть собой\n• ${destinySimple} (предназначение) — ищет того, кто поддержит миссию\n• ${socialSimple} (маска) — привлекает людей к фасаду, не к вам\n• ${spiritualSimple} (душа) — тянется к родственной душе\n\n→ Все 4 "Я" тянут в разные стороны = хаос в отношениях!`,
    rootCause: `🔬 КОРЕНЬ ПРОБЛЕМЫ:\n\nВы встречаетесь через маску ${socialSimple}\nПартнёр влюбляется в неё, а не в вас\nЗатем вы показываете ${personalSimple} — партнёр в шоке: "Ты не такой!"\nВы требуете поддержки ${destinySimple}, но партнёр этого не понимает\nДуша ${spiritualSimple} чувствует пустоту — нет духовной связи\n\n→ Результат: конфликты, разрывы, "не мой человек"`,
    whatNeeded: `✅ ЧТО НУЖНО ДЛЯ ГАРМОНИИ:\n\n1️⃣ Снимите маску ${socialSimple} — будьте собой с первой встречи\n2️⃣ Покажите ${personalSimple} — пусть видят вас настоящего\n3️⃣ Найдите того, кто поддержит ${destinySimple} — вашу миссию\n4️⃣ Ищите духовную связь ${spiritualSimple} — не просто физику`,
    compatibility: `💑 ИДЕАЛЬНЫЙ ПАРТНЁР ДЛЯ ВАС:\n\nКто примет ${personalSimple}\nКто поддержит ${destinySimple}\nКому не нужна маска ${socialSimple}\nС кем есть связь ${spiritualSimple}\n\n→ Такой человек = ваша судьба`,
    actionPlan: `🛠 ЧТО ДЕЛАТЬ ПРЯМО СЕЙЧАС:\n\n• В новых знакомствах: не надевайте ${socialSimple}, сразу будьте ${personalSimple}\n• В текущих отношениях: снимите маску, покажите себя настоящего\n• Говорите о ${destinySimple}: "Вот моя миссия, ты со мной?"\n• Ищите духовную связь: медитации вдвоём, глубокие разговоры о смысле`
  };
};

// Функция для синтеза заключения по работе и реализации
const synthesizeCareerConclusion = (
  personal: any,
  destiny: any,
  social: any,
  spiritual: any,
  personalSimple: string,
  destinySimple: string,
  socialSimple: string,
  spiritualSimple: string
) => {
  const professions = extractProfessions(destiny.finance);

  return {
    title: '🎯 РАБОТА И РЕАЛИЗАЦИЯ — Единое заключение',
    conflict: `⚠️ ВАШ ВНУТРЕННИЙ КОНФЛИКТ НА РАБОТЕ:\n\nВы работаете как ${personalSimple} (ваш характер)\nЛюди видят ${socialSimple} (вашу маску)\nНо ваше истинное призвание — ${destinySimple}\nА душа ${spiritualSimple} требует смысла\n\n→ Все 4 энергии конфликтуют = выгорание, нет результата`,
    wrongPath: `🔴 ПРИЗНАКИ, ЧТО ВЫ НЕ НА СВОЁМ МЕСТЕ:\n\n• Работа через силу (${personalSimple} сопротивляется)\n• Постоянно играете роль (${socialSimple} устали носить)\n• Нет смысла в работе (${spiritualSimple} чувствует пустоту)\n• Нет денег/результата (не живёте ${destinySimple})\n\n→ Это сигнал судьбы: "Ты идёшь не туда!"`,
    rightPath: `✅ ВАШЕ ИСТИННОЕ ПРИЗВАНИЕ:\n\n${destinySimple} — это ваш денежный код\n\n💼 Конкретные профессии: ${professions || 'см. детальную расшифровку'}\n\nПочему именно это:\n• Вселенная помогает ТОЛЬКО здесь\n• Деньги текут легко\n• Работа не ощущается работой\n• Приходят "свои" клиенты\n• Есть смысл и энергия`,
    howToIntegrate: `🔧 КАК ИНТЕГРИРОВАТЬ ВСЕ 4 ЭНЕРГИИ В РАБОТЕ:\n\n1️⃣ Используйте ${personalSimple} КАК ИНСТРУМЕНТ для ${destinySimple}\n   Ваш характер — не проблема, а уникальная сила\n\n2️⃣ Используйте ${socialSimple} ДЛЯ ПРОДАЖ\n   Маска нужна для клиентов, но не живите в ней 24/7\n\n3️⃣ Работайте через ${destinySimple}\n   Смените нишу на своё призвание — за 30 дней!\n\n4️⃣ Найдите смысл ${spiritualSimple}\n   Работа должна быть служением, не просто деньгами`,
    transitionPlan: `🚀 ПЛАН ПЕРЕХОДА (90 ДНЕЙ):\n\nНеделя 1-2: Осознайте, что ${personalSimple} ≠ ${destinySimple}\nНеделя 3-4: Изучите ${destinySimple}: курсы, книги, менторы\nНеделя 5-6: Начните ${destinySimple} как хобби (15 мин/день)\nНеделя 7-10: Первые клиенты/проекты через ${destinySimple}\nНеделя 11-12: Переход на ${destinySimple} как основная деятельность\n\n📊 РЕЗУЛЬТАТ: через 6-12 месяцев — полная реализация в ${destinySimple}`
  };
};

export const UnifiedMatrixResult = ({ result, hasAccess, birthDate }: UnifiedMatrixResultProps) => {
  const memoizedData = useMemo(() => {
    if (!hasAccess) return null;
    if (!result) return null;
    if (typeof result !== 'object') return null;

    const hasValidNumbers = (
      typeof result.personal === 'number' && 
      typeof result.destiny === 'number' && 
      typeof result.social === 'number' && 
      typeof result.spiritual === 'number' &&
      result.personal >= 1 && result.personal <= 22 &&
      result.destiny >= 1 && result.destiny <= 22 &&
      result.social >= 1 && result.social <= 22 &&
      result.spiritual >= 1 && result.spiritual <= 22
    );

    if (!hasValidNumbers) return null;

    const personal = energyDescriptions[result.personal];
    const destiny = energyDescriptions[result.destiny];
    const social = energyDescriptions[result.social];
    const spiritual = energyDescriptions[result.spiritual];

    if (!personal || !destiny || !social || !spiritual) return null;

    return {
      result,
      personal,
      destiny,
      social,
      spiritual,
      professions: extractProfessions(destiny.finance),
      healthZones: extractHealthZones(personal.health),
      healthCauses: extractHealthCauses(personal.health),
      relStyle: extractRelationshipStyle(personal.relationships),
      relNeeds: extractRelationshipNeeds(personal.relationships),
      relDestroys: extractRelationshipDestroys(personal.relationships),
      personalSimple: arcanaSimpleNames[result.personal] || personal.title,
      socialSimple: arcanaSimpleNames[result.social] || social.title,
      destinySimple: arcanaSimpleNames[result.destiny] || destiny.title,
      spiritualSimple: arcanaSimpleNames[result.spiritual] || spiritual.title
    };
  }, [result, hasAccess]);

  if (!memoizedData) return null;

  const {
    result: finalResult,
    personal,
    destiny,
    social,
    spiritual,
    professions,
    healthZones,
    healthCauses,
    relStyle,
    relNeeds,
    relDestroys,
    personalSimple,
    socialSimple,
    destinySimple,
    spiritualSimple
  } = memoizedData;

  return (
    <div className="space-y-6 mb-8">
      <div className="text-center space-y-2 py-6">
        <h2 className="text-3xl font-bold text-gray-900">
          📋 Ваша Матрица Судьбы — Полная Расшифровка
        </h2>
        <p className="text-lg text-gray-600">
          {finalResult.name} — Кто вы на самом деле и зачем пришли в этот мир
        </p>
      </div>

      {/* ЧТО ТАКОЕ 4 ЭНЕРГИИ - ПРОСТЫМ ЯЗЫКОМ */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="Info" className="text-blue-600" size={28} />
            Что означают эти 4 энергии?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-gray-700 leading-relaxed">
            Внутри каждого человека живут <strong>4 разных "Я"</strong>, которые часто конфликтуют между собой. 
            Из-за этого вы чувствуете внутренний разлад, не понимаете кто вы на самом деле, и что делать со своей жизнью.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
              <h3 className="font-bold text-amber-900 mb-2">🧠 Личное (Аркан {finalResult.personal})</h3>
              <p className="text-sm text-gray-700">
                <strong>Ваш истинный характер.</strong> Как вы себя чувствуете изнутри, ваша природа. 
                Это то, каким вас создала судьба.
              </p>
              <p className="text-xs text-amber-700 mt-2">👉 {personalSimple}</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h3 className="font-bold text-yellow-900 mb-2">🎯 Предназначение (Аркан {finalResult.destiny})</h3>
              <p className="text-sm text-gray-700">
                <strong>Зачем вы пришли в мир.</strong> Ваша главная миссия, через которую должны реализоваться. 
                Здесь ваши деньги и смысл жизни.
              </p>
              <p className="text-xs text-yellow-700 mt-2">👉 {destinySimple}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <h3 className="font-bold text-green-900 mb-2">🌍 Социальная маска (Аркан {finalResult.social})</h3>
              <p className="text-sm text-gray-700">
                <strong>Как вас видят люди.</strong> Это НЕ вы! Это защитная роль, которую надели в детстве. 
                Задача — снять маску и быть собой.
              </p>
              <p className="text-xs text-green-700 mt-2">👉 {socialSimple}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <h3 className="font-bold text-purple-900 mb-2">✨ Духовное (Аркан {finalResult.spiritual})</h3>
              <p className="text-sm text-gray-700">
                <strong>Ваша душа и смысл.</strong> Связь с чем-то большим, ваш духовный путь. 
                Без этого чувствуете пустоту внутри.
              </p>
              <p className="text-xs text-purple-700 mt-2">👉 {spiritualSimple}</p>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300 mt-4">
            <p className="font-bold text-red-900 mb-2">⚠️ Ваша главная проблема:</p>
            <p className="text-gray-700">
              Все 4 "Я" конфликтуют между собой → внутренний разлад → кризисы, болезни, нет денег, нет отношений!
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300 mt-4">
            <p className="font-bold text-green-900 mb-2">✅ Решение:</p>
            <p className="text-gray-700">
              Научиться жить всеми 4 энергиями гармонично: принять себя ({personalSimple}), снять маску ({socialSimple}), 
              идти к предназначению ({destinySimple}), и найти смысл ({spiritualSimple}).
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="FileText" className="text-purple-600" size={28} />
            Единое заключение
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-base leading-relaxed">
          <div className="space-y-3">
            <p className="font-semibold text-gray-800">
              🧠 <span className="underline">Личностный профиль:</span> {personalSimple}
            </p>
            <p className="ml-6 text-gray-700">{personal.description}</p>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-gray-800">
              🎯 <span className="underline">Предназначение:</span> {destinySimple}
            </p>
            <p className="ml-6 text-gray-700">{destiny.description}</p>
            {professions && (
              <div className="ml-6 bg-white/60 p-3 rounded-lg">
                <p className="font-medium text-gray-800">🎓 Подходящие профессии:</p>
                <p className="text-gray-700 mt-1">{professions}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-gray-800">
              🌍 <span className="underline">Социальная роль:</span> {socialSimple}
            </p>
            <p className="ml-6 text-gray-700">{social.description}</p>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-gray-800">
              ✨ <span className="underline">Духовный путь:</span> {spiritualSimple}
            </p>
            <p className="ml-6 text-gray-700">{spiritual.description}</p>
          </div>

          {(healthZones || healthCauses) && (
            <div className="space-y-3 bg-red-50/60 p-4 rounded-lg border border-red-200">
              <p className="font-semibold text-gray-800">
                🏥 <span className="underline">Здоровье:</span>
              </p>
              {healthZones && (
                <div className="ml-6">
                  <p className="font-medium text-gray-800">⚠️ Зоны внимания:</p>
                  <p className="text-gray-700 mt-1">{healthZones}</p>
                </div>
              )}
              {healthCauses && (
                <div className="ml-6 mt-2">
                  <p className="font-medium text-gray-800">🔬 Возможные причины:</p>
                  <p className="text-gray-700 mt-1">{healthCauses}</p>
                </div>
              )}
            </div>
          )}

          {(relStyle || relNeeds || relDestroys) && (
            <div className="space-y-3 bg-pink-50/60 p-4 rounded-lg border border-pink-200">
              <p className="font-semibold text-gray-800">
                💑 <span className="underline">Отношения:</span>
              </p>
              {relStyle && (
                <div className="ml-6">
                  <p className="font-medium text-gray-800">🎭 Стиль отношений:</p>
                  <p className="text-gray-700 mt-1">{relStyle}</p>
                </div>
              )}
              {relNeeds && (
                <div className="ml-6 mt-2">
                  <p className="font-medium text-gray-800">💝 Что нужно:</p>
                  <p className="text-gray-700 mt-1">{relNeeds}</p>
                </div>
              )}
              {relDestroys && (
                <div className="ml-6 mt-2">
                  <p className="font-medium text-gray-800">⚡ Что разрушает:</p>
                  <p className="text-gray-700 mt-1">{relDestroys}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* СИНТЕЗИРОВАННЫЕ ЗАКЛЮЧЕНИЯ ПО СФЕРАМ ЖИЗНИ */}
      {(() => {
        const healthConclusion = synthesizeHealthConclusion(personal, destiny, social, spiritual, personalSimple, destinySimple, socialSimple, spiritualSimple);
        const financeConclusion = synthesizeFinanceConclusion(personal, destiny, social, spiritual, personalSimple, destinySimple, socialSimple, spiritualSimple);
        const relationsConclusion = synthesizeRelationshipsConclusion(personal, destiny, social, spiritual, personalSimple, destinySimple, socialSimple, spiritualSimple);
        const careerConclusion = synthesizeCareerConclusion(personal, destiny, social, spiritual, personalSimple, destinySimple, socialSimple, spiritualSimple);

        return (
          <>
            {/* ЗДОРОВЬЕ — СИНТЕЗ */}
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Icon name="Activity" className="text-red-600" size={28} />
                  {healthConclusion.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-100 p-4 rounded-lg border-l-4 border-red-600">
                  <p className="text-gray-800 whitespace-pre-line">{healthConclusion.conflict}</p>
                </div>
                <div className="bg-white/80 p-4 rounded-lg">
                  <p className="font-bold text-red-900 mb-2">{healthConclusion.mainRisk}</p>
                  <p className="text-gray-700">{healthConclusion.mainRiskText}</p>
                </div>
                {healthConclusion.zones && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="font-bold text-orange-900 mb-2">🎯 Зоны риска (топ-3):</p>
                    <p className="text-gray-700 whitespace-pre-line">{healthConclusion.zones}</p>
                  </div>
                )}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">{healthConclusion.rootCause}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                  <p className="text-gray-700 whitespace-pre-line font-medium">{healthConclusion.actionPlan}</p>
                </div>
              </CardContent>
            </Card>

            {/* ФИНАНСЫ — СИНТЕЗ */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Icon name="DollarSign" className="text-green-600" size={28} />
                  {financeConclusion.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-100 p-4 rounded-lg border-l-4 border-red-600">
                  <p className="text-gray-800 whitespace-pre-line">{financeConclusion.diagnosis}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg border-l-4 border-green-600">
                  <p className="text-gray-800 whitespace-pre-line font-semibold">{financeConclusion.moneyCode}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">{financeConclusion.blockages}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                  <p className="text-gray-700 whitespace-pre-line font-medium">{financeConclusion.solution}</p>
                </div>
              </CardContent>
            </Card>

            {/* ОТНОШЕНИЯ — СИНТЕЗ */}
            <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Icon name="Heart" className="text-pink-600" size={28} />
                  {relationsConclusion.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-pink-100 p-4 rounded-lg border-l-4 border-pink-600">
                  <p className="text-gray-800 whitespace-pre-line">{relationsConclusion.problem}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">{relationsConclusion.rootCause}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                  <p className="text-gray-700 whitespace-pre-line font-medium">{relationsConclusion.whatNeeded}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">{relationsConclusion.compatibility}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">{relationsConclusion.actionPlan}</p>
                </div>
              </CardContent>
            </Card>

            {/* РАБОТА И РЕАЛИЗАЦИЯ — СИНТЕЗ */}
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Icon name="Briefcase" className="text-amber-600" size={28} />
                  {careerConclusion.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-100 p-4 rounded-lg border-l-4 border-amber-600">
                  <p className="text-gray-800 whitespace-pre-line">{careerConclusion.conflict}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">{careerConclusion.wrongPath}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg border-l-4 border-green-600">
                  <p className="text-gray-800 whitespace-pre-line font-semibold">{careerConclusion.rightPath}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">{careerConclusion.howToIntegrate}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                  <p className="text-gray-700 whitespace-pre-line font-medium">{careerConclusion.transitionPlan}</p>
                </div>
              </CardContent>
            </Card>
          </>
        );
      })()}

      {/* ДЕТАЛЬНЫЕ РАСШИФРОВКИ ПО КАЖДОЙ ЭНЕРГИИ */}
      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="User" className="text-amber-600" size={28} />
            Детальная расшифровка: Личное (Аркан {finalResult.personal})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <div className="bg-amber-100 p-4 rounded-lg mb-4 border-l-4 border-amber-600">
              <h3 className="text-2xl font-bold text-amber-900 mb-2">🎯 {personalSimple}</h3>
              <p className="text-lg text-gray-800">
                <strong>Кто вы по характеру:</strong> Это ваше истинное "Я" — как вы себя чувствуете изнутри, 
                какой вы на самом деле, когда снимаете все маски. Это ваша природа, с которой вы родились.
              </p>
            </div>
            <div className="whitespace-pre-wrap text-gray-700">{personal.description}</div>
            
            <h4 className="text-lg font-bold text-red-800 mt-6">💊 Здоровье</h4>
            <div className="whitespace-pre-wrap text-gray-700 bg-red-50 p-4 rounded-lg">{personal.health}</div>
            
            <h4 className="text-lg font-bold text-pink-800 mt-6">💕 Отношения</h4>
            <div className="whitespace-pre-wrap text-gray-700 bg-pink-50 p-4 rounded-lg">{personal.relationships}</div>
            
            <h4 className="text-lg font-bold text-green-800 mt-6">💰 Финансы</h4>
            <div className="whitespace-pre-wrap text-gray-700 bg-green-50 p-4 rounded-lg">{personal.finance}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="Target" className="text-yellow-600" size={28} />
            Детальная расшифровка: Предназначение (Аркан {finalResult.destiny})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <div className="bg-yellow-100 p-4 rounded-lg mb-4 border-l-4 border-yellow-600">
              <h3 className="text-2xl font-bold text-yellow-900 mb-2">🎯 {destinySimple}</h3>
              <p className="text-lg text-gray-800">
                <strong>Ваша миссия в жизни:</strong> Это то, ЗАЧЕМ вы пришли в этот мир. 
                Ваше главное предназначение, через которое вы должны реализоваться. 
                Если вы НЕ живёте это — чувствуете пустоту, нет денег, нет смысла.
              </p>
            </div>
            <div className="whitespace-pre-wrap text-gray-700">{destiny.description}</div>
            
            <h4 className="text-lg font-bold text-red-800 mt-6">💊 Здоровье</h4>
            <div className="whitespace-pre-wrap text-gray-700 bg-red-50 p-4 rounded-lg">{destiny.health}</div>
            
            <h4 className="text-lg font-bold text-pink-800 mt-6">💕 Отношения</h4>
            <div className="whitespace-pre-wrap text-gray-700 bg-pink-50 p-4 rounded-lg">{destiny.relationships}</div>
            
            <h4 className="text-lg font-bold text-green-800 mt-6">💰 Финансы и Профессии</h4>
            <div className="whitespace-pre-wrap text-gray-700 bg-green-50 p-4 rounded-lg">{destiny.finance}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="Users" className="text-green-600" size={28} />
            Детальная расшифровка: Социальное (Аркан {finalResult.social})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <div className="bg-green-100 p-4 rounded-lg mb-4 border-l-4 border-green-600">
              <h3 className="text-2xl font-bold text-green-900 mb-2">🎯 {socialSimple}</h3>
              <p className="text-lg text-gray-800">
                <strong>Ваша социальная маска:</strong> Это то, КАК вас видят другие люди со стороны. 
                Это НЕ настоящий вы! Это защитная роль, которую вы надели, чтобы выжить в обществе. 
                Задача — снять эту маску и быть собой.
              </p>
            </div>
            <div className="whitespace-pre-wrap text-gray-700">{social.description}</div>
            
            <h4 className="text-lg font-bold text-red-800 mt-6">💊 Здоровье</h4>
            <div className="whitespace-pre-wrap text-gray-700 bg-red-50 p-4 rounded-lg">{social.health}</div>
            
            <h4 className="text-lg font-bold text-pink-800 mt-6">💕 Отношения</h4>
            <div className="whitespace-pre-wrap text-gray-700 bg-pink-50 p-4 rounded-lg">{social.relationships}</div>
            
            <h4 className="text-lg font-bold text-green-800 mt-6">💰 Финансы</h4>
            <div className="whitespace-pre-wrap text-gray-700 bg-green-50 p-4 rounded-lg">{social.finance}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="Sparkles" className="text-purple-600" size={28} />
            Детальная расшифровка: Духовное (Аркан {finalResult.spiritual})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <div className="bg-purple-100 p-4 rounded-lg mb-4 border-l-4 border-purple-600">
              <h3 className="text-2xl font-bold text-purple-900 mb-2">🎯 {spiritualSimple}</h3>
              <p className="text-lg text-gray-800">
                <strong>Ваша душа и смысл жизни:</strong> Это ваша глубинная суть — связь с чем-то большим, чем вы. 
                Ваш духовный путь, то что наполняет смыслом. Если игнорируете — чувствуете пустоту внутри, 
                даже если есть деньги и успех.
              </p>
            </div>
            <div className="whitespace-pre-wrap text-gray-700">{spiritual.description}</div>
            
            <h4 className="text-lg font-bold text-red-800 mt-6">💊 Здоровье</h4>
            <div className="whitespace-pre-wrap text-gray-700 bg-red-50 p-4 rounded-lg">{spiritual.health}</div>
            
            <h4 className="text-lg font-bold text-pink-800 mt-6">💕 Отношения</h4>
            <div className="whitespace-pre-wrap text-gray-700 bg-pink-50 p-4 rounded-lg">{spiritual.relationships}</div>
            
            <h4 className="text-lg font-bold text-green-800 mt-6">💰 Финансы</h4>
            <div className="whitespace-pre-wrap text-gray-700 bg-green-50 p-4 rounded-lg">{spiritual.finance}</div>
          </div>
        </CardContent>
      </Card>

      {/* ИТОГОВЫЙ ПЛАН ДЕЙСТВИЙ */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="CheckCircle2" className="text-orange-600" size={28} />
            План действий на 90 дней
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-orange-900 mb-4">🎯 Ваша главная проблема</h3>
            <p className="text-gray-700 text-lg">
              Внутри вас живут 4 разных "Я", которые конфликтуют:
            </p>
            <ul className="mt-3 space-y-2 text-gray-700">
              <li>• <strong>{personalSimple}</strong> — как вы себя ощущаете</li>
              <li>• <strong>{destinySimple}</strong> — чего от вас ждёт жизнь</li>
              <li>• <strong>{socialSimple}</strong> — как вас видят люди</li>
              <li>• <strong>{spiritualSimple}</strong> — ваша глубинная суть</li>
            </ul>
            <p className="mt-4 text-gray-700 font-semibold">
              Все 4 энергии конфликтуют = внутренний разлушается, кризисы, болезни!
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-green-900 mb-4">✅ Решение: 4 шага к целостности</h3>
            
            <div className="space-y-4">
              <div className="border-l-4 border-amber-500 pl-4">
                <h4 className="font-bold text-amber-900">ШАГ 1 (Недели 1-3): Примите себя ({personalSimple})</h4>
                <p className="text-gray-700 mt-2">
                  Перестаньте воевать с собой. Ваш характер {personalSimple} — это данность, а не проблема. 
                  Каждый день говорите: "Я {personalSimple}, и это нормально".
                </p>
                <p className="text-sm text-gray-600 mt-2">⏱ Практика: 10 минут утром на принятие себя</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-bold text-green-900">ШАГ 2 (Недели 4-6): Снимите маску ({socialSimple})</h4>
                <p className="text-gray-700 mt-2">
                  {socialSimple} — это защитная маска, не вы. Начните быть собой хотя бы с близкими. 
                  1 раз в неделю делайте что-то "не в своём стиле" {socialSimple}.
                </p>
                <p className="text-sm text-gray-600 mt-2">🎯 Цель: почувствовать себя без маски</p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-bold text-yellow-900">ШАГ 3 (Недели 7-10): Идите к предназначению ({destinySimple})</h4>
                <p className="text-gray-700 mt-2">
                  НЕ бросайте всё резко! Начните с 15 минут в день на {destinySimple}. 
                  {professions && `Например: ${professions}`}
                </p>
                <p className="text-sm text-gray-600 mt-2">📈 Результат: через 6 месяцев вы будете жить предназначением</p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-bold text-purple-900">ШАГ 4 (Недели 11-12): Активируйте душу ({spiritualSimple})</h4>
                <p className="text-gray-700 mt-2">
                  Найдите свою духовную практику: медитация, йога, природа, творчество, служение. 
                  10 минут тишины каждое утро — просто сидите, дышите, слушайте свою душу.
                </p>
                <p className="text-sm text-gray-600 mt-2">🙏 Цель: почувствовать связь с чем-то большим</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border-2 border-green-300">
            <h3 className="text-xl font-bold text-green-900 mb-3">🎯 Ожидаемый результат</h3>
            <div className="space-y-3 text-gray-700">
              <div>
                <p className="font-semibold">Через 1-3 месяца:</p>
                <ul className="mt-1 space-y-1">
                  <li>✅ Внутренний конфликт ослабевает</li>
                  <li>✅ Появляется ясность "что делать дальше"</li>
                  <li>✅ Больше энергии, меньше тревоги</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">Через 3-6 месяцев:</p>
                <ul className="mt-1 space-y-1">
                  <li>✅ Вы на пути к {destinySimple}</li>
                  <li>✅ Приходят "свои" люди</li>
                  <li>✅ Деньги начинают течь легче</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">Через 6-12 месяцев:</p>
                <ul className="mt-1 space-y-1">
                  <li>✅ Вы живёте своё предназначение</li>
                  <li>✅ Гармония в отношениях</li>
                  <li>✅ Финансовый поток стабилен</li>
                  <li>✅ Здоровье улучшается</li>
                  <li>✅ Вы целостны!</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border-2 border-red-300">
            <h3 className="text-xl font-bold text-red-900 mb-3">⚠️ Что будет, если НЕ принять себя</h3>
            <p className="text-gray-700 mb-3">
              Судьба будет "ломать" вас кризисами, пока вы не пойдёте к {destinySimple}:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>→ Потеря работы или выгорание</li>
              <li>→ Разрыв отношений</li>
              <li>→ Болезни тела: {healthZones || 'см. раздел Здоровье'}</li>
              <li>→ Финансовые кризисы</li>
              <li>→ Депрессия и потеря смысла</li>
            </ul>
            <p className="mt-4 text-gray-700 font-semibold">
              Это НЕ наказание! Это способ судьбы сказать: "Эй, ты идёшь не туда! Вернись к своему {destinySimple}!"
            </p>
          </div>
        </CardContent>
      </Card>

      <ShareButtons 
        result={finalResult} 
        birthDate={birthDate}
      />
    </div>
  );
};