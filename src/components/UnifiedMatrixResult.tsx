import { useMemo, useState } from 'react';
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

  const [openSections, setOpenSections] = useState({
    portrait: true,
    health: false,
    finance: false,
    relations: false,
    career: false,
    detailPersonal: false,
    detailDestiny: false,
    detailSocial: false,
    detailSpiritual: false,
    psychologists: false,
    hr: false,
    nutritionists: false,
    coaches: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
              <CardHeader 
                className="cursor-pointer hover:bg-red-100/50 transition-colors"
                onClick={() => toggleSection('health')}
              >
                <CardTitle className="flex items-center justify-between gap-2 text-2xl">
                  <div className="flex items-center gap-2">
                    <Icon name="Activity" className="text-red-600" size={28} />
                    {healthConclusion.title}
                  </div>
                  <Icon name={openSections.health ? "ChevronUp" : "ChevronDown"} size={24} className="text-red-600" />
                </CardTitle>
              </CardHeader>
              {openSections.health && (
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
              )}
            </Card>

            {/* ФИНАНСЫ — СИНТЕЗ */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
              <CardHeader 
                className="cursor-pointer hover:bg-green-100/50 transition-colors"
                onClick={() => toggleSection('finance')}
              >
                <CardTitle className="flex items-center justify-between gap-2 text-2xl">
                  <div className="flex items-center gap-2">
                    <Icon name="DollarSign" className="text-green-600" size={28} />
                    {financeConclusion.title}
                  </div>
                  <Icon name={openSections.finance ? "ChevronUp" : "ChevronDown"} size={24} className="text-green-600" />
                </CardTitle>
              </CardHeader>
              {openSections.finance && (
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
              )}
            </Card>

            {/* ОТНОШЕНИЯ — СИНТЕЗ */}
            <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-300">
              <CardHeader 
                className="cursor-pointer hover:bg-pink-100/50 transition-colors"
                onClick={() => toggleSection('relations')}
              >
                <CardTitle className="flex items-center justify-between gap-2 text-2xl">
                  <div className="flex items-center gap-2">
                    <Icon name="Heart" className="text-pink-600" size={28} />
                    {relationsConclusion.title}
                  </div>
                  <Icon name={openSections.relations ? "ChevronUp" : "ChevronDown"} size={24} className="text-pink-600" />
                </CardTitle>
              </CardHeader>
              {openSections.relations && (
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
              )}
            </Card>

            {/* РАБОТА И РЕАЛИЗАЦИЯ — СИНТЕЗ */}
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300">
              <CardHeader 
                className="cursor-pointer hover:bg-amber-100/50 transition-colors"
                onClick={() => toggleSection('career')}
              >
                <CardTitle className="flex items-center justify-between gap-2 text-2xl">
                  <div className="flex items-center gap-2">
                    <Icon name="Briefcase" className="text-amber-600" size={28} />
                    {careerConclusion.title}
                  </div>
                  <Icon name={openSections.career ? "ChevronUp" : "ChevronDown"} size={24} className="text-amber-600" />
                </CardTitle>
              </CardHeader>
              {openSections.career && (
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
              )}
            </Card>
          </>
        );
      })()}

      {/* ДЕТАЛЬНЫЕ РАСШИФРОВКИ ПО КАЖДОЙ ЭНЕРГИИ */}
      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300">
        <CardHeader 
          className="cursor-pointer hover:bg-amber-100/50 transition-colors"
          onClick={() => toggleSection('detailPersonal')}
        >
          <CardTitle className="flex items-center justify-between gap-2 text-2xl">
            <div className="flex items-center gap-2">
              <Icon name="User" className="text-amber-600" size={28} />
              Детальная расшифровка: Личное (Аркан {finalResult.personal})
            </div>
            <Icon name={openSections.detailPersonal ? "ChevronUp" : "ChevronDown"} size={24} className="text-amber-600" />
          </CardTitle>
        </CardHeader>
        {openSections.detailPersonal && (
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
        )}
      </Card>

      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
        <CardHeader 
          className="cursor-pointer hover:bg-yellow-100/50 transition-colors"
          onClick={() => toggleSection('detailDestiny')}
        >
          <CardTitle className="flex items-center justify-between gap-2 text-2xl">
            <div className="flex items-center gap-2">
              <Icon name="Target" className="text-yellow-600" size={28} />
              Детальная расшифровка: Предназначение (Аркан {finalResult.destiny})
            </div>
            <Icon name={openSections.detailDestiny ? "ChevronUp" : "ChevronDown"} size={24} className="text-yellow-600" />
          </CardTitle>
        </CardHeader>
        {openSections.detailDestiny && (
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
        )}
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-300">
        <CardHeader 
          className="cursor-pointer hover:bg-green-100/50 transition-colors"
          onClick={() => toggleSection('detailSocial')}
        >
          <CardTitle className="flex items-center justify-between gap-2 text-2xl">
            <div className="flex items-center gap-2">
              <Icon name="Users" className="text-green-600" size={28} />
              Детальная расшифровка: Социальное (Аркан {finalResult.social})
            </div>
            <Icon name={openSections.detailSocial ? "ChevronUp" : "ChevronDown"} size={24} className="text-green-600" />
          </CardTitle>
        </CardHeader>
        {openSections.detailSocial && (
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
        )}
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300">
        <CardHeader 
          className="cursor-pointer hover:bg-purple-100/50 transition-colors"
          onClick={() => toggleSection('detailSpiritual')}
        >
          <CardTitle className="flex items-center justify-between gap-2 text-2xl">
            <div className="flex items-center gap-2">
              <Icon name="Sparkles" className="text-purple-600" size={28} />
              Детальная расшифровка: Духовное (Аркан {finalResult.spiritual})
            </div>
            <Icon name={openSections.detailSpiritual ? "ChevronUp" : "ChevronDown"} size={24} className="text-purple-600" />
          </CardTitle>
        </CardHeader>
        {openSections.detailSpiritual && (
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
        )}
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

      {/* ПРОФЕССИОНАЛЬНЫЕ БЛОКИ — ВИДИМАЯ ИНФОРМАЦИЯ ДЛЯ СПЕЦИАЛИСТОВ */}
      <div className="space-y-6">
        <div className="text-center py-6">
          <h2 className="text-3xl font-bold text-orange-900">
            🎯 Для Профессионалов — Полная Диагностика
          </h2>
          <p className="text-lg text-gray-600 mt-2">
            Всё что нужно знать о клиенте для эффективной работы
          </p>
        </div>

        {/* ДЛЯ ПСИХОЛОГОВ */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300">
          <CardHeader 
            className="cursor-pointer hover:bg-indigo-100/50 transition-colors"
            onClick={() => toggleSection('psychologists')}
          >
            <CardTitle className="flex items-center justify-between gap-2 text-2xl">
              <div className="flex items-center gap-2">
                <Icon name="Brain" className="text-indigo-600" size={28} />
                🧠 Для Психологов и Коучей — Полная Диагностика
              </div>
              <Icon name={openSections.psychologists ? "ChevronUp" : "ChevronDown"} size={24} className="text-indigo-600" />
            </CardTitle>
          </CardHeader>
          {openSections.psychologists && (
          <CardContent className="space-y-4">
            <div className="bg-indigo-100 p-4 rounded-lg border-l-4 border-indigo-600">
              <h3 className="font-bold text-indigo-900 mb-2">👤 Портрет личности клиента</h3>
              <div className="text-gray-800 space-y-2">
                <p><strong>Кто он на самом деле ({personalSimple}):</strong><br/>
                {personal.description.split('\n\n')[0]}</p>
                <p className="mt-3"><strong>Его истинное призвание ({destinySimple}):</strong><br/>
                {destiny.description.split('\n\n')[0]}</p>
                <p className="mt-3"><strong>Его маска для общества ({socialSimple}):</strong><br/>
                {social.description.split('\n\n')[0]}</p>
                <p className="mt-3"><strong>Что чувствует душа ({spiritualSimple}):</strong><br/>
                {spiritual.description.split('\n\n')[0]}</p>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
              <h3 className="font-bold text-red-900 mb-2">🎯 Главная проблема — Почему нет счастья</h3>
              <div className="text-gray-800 space-y-3">
                <p><strong>Внутренний конфликт 4-х энергий:</strong><br/>
                • {personalSimple} (как он себя ощущает) хочет одного<br/>
                • {destinySimple} (чего от него ждёт жизнь) требует другого<br/>
                • {socialSimple} (как его видят люди) третьего<br/>
                • {spiritualSimple} (его душа) страдает от пустоты<br/><br/>
                → Все 4 "Я" тянут в разные стороны = разрыв личности!</p>
                
                <p className="mt-3"><strong>Конкретные симптомы:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Не понимает кто он на самом деле</li>
                  <li>Живёт "не свою жизнь"</li>
                  <li>Постоянно носит маску — устал притворяться</li>
                  <li>Боится своего предназначения</li>
                  <li>Чувствует пустоту внутри</li>
                  <li>Нет энергии и мотивации</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
              <h3 className="font-bold text-yellow-900 mb-2">😔 Почему депрессия и тревожность</h3>
              <div className="text-gray-700 space-y-2">
                <p><strong>ДЕПРЕССИЯ возникает когда:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Не живёт через {destinySimple} (своё предназначение) — душа говорит "стоп"</li>
                  <li>Подавляет {personalSimple} (свою истинную природу) — энергия падает</li>
                  <li>Потерял связь с {spiritualSimple} (смысл жизни) — внутренняя пустота</li>
                  <li>Слишком долго носит маску {socialSimple} — эмоциональное истощение</li>
                </ul>

                <p className="mt-3"><strong>ТРЕВОЖНОСТЬ возникает когда:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Внутренний конфликт между всеми 4 энергиями → нервная система перегружена</li>
                  <li>Страх принять {destinySimple} (предназначение) → тревога от неопределённости</li>
                  <li>Живёт как {socialSimple} (маска), а душа требует быть {personalSimple} → постоянный стресс</li>
                  <li>Игнорирует сигналы {spiritualSimple} → экзистенциальная тревога</li>
                </ul>

                <p className="mt-3 font-semibold text-yellow-900">
                  💡 Ключ: Депрессия и тревога — это НЕ болезнь, а сигнал что человек живёт НЕ по своей матрице!
                </p>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-bold text-orange-900 mb-2">🔧 Практические техники работы</h3>
              <div className="space-y-3 text-gray-700">
                <div>
                  <p className="font-semibold text-orange-900">ТЕХНИКА 1: "Встреча 4-х Я" (гештальт)</p>
                  <p className="text-sm">Посадите клиента на 4 стула. На каждом он говорит от лица одного аркана. 
                  Например: "Я {personalSimple}, и я чувствую...", затем "Я {destinySimple}, и моя задача...". 
                  Клиент телесно осознаёт конфликт энергий.</p>
                </div>

                <div>
                  <p className="font-semibold text-orange-900">ТЕХНИКА 2: "Снятие маски" (психодрама)</p>
                  <p className="text-sm">Спросите: "Когда ты впервые надел маску {socialSimple}?" 
                  Вспоминает травму детства. Проработайте: "Маска защитила тебя ТОГДА, но сейчас она мешает". 
                  Ритуал: клиент символически снимает невидимую маску.</p>
                </div>

                <div>
                  <p className="font-semibold text-orange-900">ТЕХНИКА 3: "Диалог с предназначением"</p>
                  <p className="text-sm">Домашнее задание: "Напиши письмо от {personalSimple} к {destinySimple}: 
                  Дорогое предназначение, я боюсь тебя, потому что...". Затем письмо-ответ от {destinySimple}. 
                  Помогает принять свой путь.</p>
                </div>

                <div>
                  <p className="font-semibold text-orange-900">ТЕХНИКА 4: "Где в теле живёт конфликт?"</p>
                  <p className="text-sm">Телесная терапия: "{personalSimple} — где ты это чувствуешь?" (обычно солнечное сплетение). 
                  "{destinySimple} — где страх?" (грудь, горло). Работайте с каждой зоной: дыхание, прикосновение, движение.</p>
                </div>

                <div>
                  <p className="font-semibold text-orange-900">ТЕХНИКА 5: "Активация души"</p>
                  <p className="text-sm">Для {spiritualSimple}: медитация "Я есть больше, чем мои роли". 
                  Дыхательные практики (холотропное дыхание). Молчание 1 день в неделю. 
                  Служение (бескорыстная помощь активирует душу).</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-400">
              <h3 className="font-bold text-indigo-900 mb-2">🗣️ Терапевтический язык — Что говорить</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>✅ Говорите:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>"Ты {personalSimple} — это твоя сила, не слабость"</li>
                  <li>"{destinySimple} — это не чужое, это твоё истинное Я"</li>
                  <li>"{socialSimple} защищал тебя когда-то, но сейчас мешает"</li>
                  <li>"Что если все 4 части работают вместе, а не воюют?"</li>
                </ul>

                <p className="mt-3"><strong>❌ НЕ говорите:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>"Твой {personalSimple} — это проблема" (он закроется)</li>
                  <li>"Ты ДОЛЖЕН стать {destinySimple}" (сопротивление усилится)</li>
                  <li>"Твоя маска — фальшивая" (защита усилится)</li>
                  <li>"Просто прими себя" (слишком абстрактно)</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-bold text-indigo-900 mb-2">📿 Кармические задачи клиента</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>1. Принять {destinySimple} как предназначение</strong><br/>
                <span className="text-sm">Не просто знать, а ЖИТЬ через него. Проверка каждого решения: "Это в духе {destinySimple}?"</span></li>
                
                <li><strong>2. Интегрировать {personalSimple} с {destinySimple}</strong><br/>
                <span className="text-sm">Не убить личность, а использовать её ДЛЯ предназначения. {personalSimple} — инструмент для {destinySimple}.</span></li>
                
                <li><strong>3. Разоблачить {socialSimple} как маску</strong><br/>
                <span className="text-sm">Осознать: "Это не я, это защита". Снять маску и показать истинное лицо миру.</span></li>
                
                <li><strong>4. Активировать {spiritualSimple}</strong><br/>
                <span className="text-sm">Найти связь с высшим, смысл жизни. Без этого всё остальное бессмысленно.</span></li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
              <h3 className="font-bold text-green-900 mb-2">📋 План терапии — 5 этапов</h3>
              <div className="space-y-3 text-gray-700">
                <div>
                  <p className="font-semibold">ШАГ 1 (Сессии 1-3): Принятие {personalSimple}</p>
                  <p className="text-sm">Цель: клиент перестаёт воевать с собой.<br/>
                  Техники: работа с самокритикой, практика самопринятия, телесные практики.<br/>
                  Результат: "Я {personalSimple}, и это нормально"</p>
                </div>

                <div>
                  <p className="font-semibold">ШАГ 2 (Сессии 4-6): Разоблачение {socialSimple}</p>
                  <p className="text-sm">Цель: клиент видит свою маску и понимает когда она появилась.<br/>
                  Техники: психодрама "снятие маски", работа с детской травмой, регрессия.<br/>
                  Результат: "Я играл роль {socialSimple}, но это не я"</p>
                </div>

                <div>
                  <p className="font-semibold">ШАГ 3 (Сессии 7-10): Интеграция {destinySimple}</p>
                  <p className="text-sm">Цель: клиент принимает предназначение как свой истинный путь.<br/>
                  Техники: работа со страхами, микрошаги к предназначению, визуализация будущего.<br/>
                  Результат: "Я начинаю жить как {destinySimple}"</p>
                </div>

                <div>
                  <p className="font-semibold">ШАГ 4 (Сессии 11-15): Активация {spiritualSimple}</p>
                  <p className="text-sm">Цель: клиент находит смысл и связь с высшим.<br/>
                  Техники: медитации, духовные практики, работа со смыслом жизни, служение.<br/>
                  Результат: "Я чувствую связь с {spiritualSimple}, есть смысл"</p>
                </div>

                <div>
                  <p className="font-semibold">ШАГ 5 (Сессии 16+): Жизнь из Единства</p>
                  <p className="text-sm">Цель: все 4 аркана работают как команда, нет внутреннего конфликта.<br/>
                  Техники: интеграция через жизненные ситуации, поддержка в реальной жизни.<br/>
                  Результат: "Я целостный, все части во мне гармоничны"</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">📊 Маркеры прогресса — Как понять что работает</h3>
              <div className="text-gray-700 space-y-2">
                <p><strong>Месяц 1-2:</strong> Клиент меньше критикует себя, принимает {personalSimple}. Депрессия ослабевает.</p>
                <p><strong>Месяц 3-4:</strong> Видит свою маску {socialSimple}, начинает снимать её. Появляется энергия.</p>
                <p><strong>Месяц 5-6:</strong> Делает первые шаги к {destinySimple}: меняет работу, начинает хобби. Тревога уходит.</p>
                <p><strong>Месяц 7-9:</strong> Находит смысл через {spiritualSimple}. Внутренний покой, нет пустоты.</p>
                <p><strong>Месяц 10-12:</strong> Живёт целостно. Деньги, отношения, здоровье улучшаются. Счастлив!</p>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-purple-900 mb-2">🔮 Прогноз терапии</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-green-700">✅ ЕСЛИ КЛИЕНТ ПРИНИМАЕТ РАБОТУ:</p>
                  <ul className="text-gray-700 list-disc ml-6 space-y-1 text-sm">
                    <li>Через 3-6 месяцев: внутренний конфликт ослабевает, появляется ясность и энергия</li>
                    <li>Через 6-12 месяцев: выход на предназначение ({professions}), начинает зарабатывать</li>
                    <li>Через 12+ месяцев: деньги потоком, гармония в отношениях, здоровье улучшается, счастлив</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-red-700">⚠️ ЕСЛИ КЛИЕНТ СОПРОТИВЛЯЕТСЯ:</p>
                  <ul className="text-gray-700 list-disc ml-6 space-y-1 text-sm">
                    <li>Кризисы усиливаются: потеря работы, разрыв отношений, финансовые проблемы</li>
                    <li>Болезни как сигнал от тела: {extractHealthZones(personal.health)}</li>
                    <li>Депрессия углубляется: живёт "не своей жизнью", потеря смысла</li>
                    <li>Судьба будет "ломать" через кризисы до принятия {destinySimple}</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
          )}
        </Card>

        {/* ДЛЯ HR */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300">
          <CardHeader 
            className="cursor-pointer hover:bg-blue-100/50 transition-colors"
            onClick={() => toggleSection('hr')}
          >
            <CardTitle className="flex items-center justify-between gap-2 text-2xl">
              <div className="flex items-center gap-2">
                <Icon name="Users" className="text-blue-600" size={28} />
                👨‍💼 Для HR и Рекрутеров — Полный Профиль Кандидата
              </div>
              <Icon name={openSections.hr ? "ChevronUp" : "ChevronDown"} size={24} className="text-blue-600" />
            </CardTitle>
          </CardHeader>
          {openSections.hr && (
          <CardContent className="space-y-4">
            <div className="bg-blue-100 p-4 rounded-lg border-l-4 border-blue-600">
              <h3 className="font-bold text-blue-900 mb-2">👤 Психологический портрет кандидата</h3>
              <div className="text-gray-800 space-y-2 text-sm">
                <p><strong>Истинное Я — {personalSimple}:</strong><br/>
                {personal.description.split('.').slice(0, 2).join('.')}. В работе проявляется как: 
                {personal.finance?.split('.').slice(0, 2).join('.') || 'независимый профессионал'}</p>
                
                <p><strong>Профессиональное предназначение — {destinySimple}:</strong><br/>
                {destiny.description.split('.').slice(0, 2).join('.')}. <br/>
                <span className="font-semibold">Лучшие роли:</span> {professions || 'см. детальную расшифровку'}</p>
                
                <p><strong>Как его видят коллеги — {socialSimple}:</strong><br/>
                {social.description.split('.')[0]}. <br/>
                ⚠️ ВАЖНО: Это маска, не его истинное лицо! Под ней живёт {personalSimple}.</p>
                
                <p><strong>Что действительно важно — {spiritualSimple}:</strong><br/>
                {spiritual.description.split('.').slice(0, 2).join('.')}.<br/>
                Работа БЕЗ смысла = быстрое выгорание!</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400">
              <h3 className="font-bold text-blue-900 mb-2">🎯 На что способен этот человек</h3>
              <div className="text-gray-700 space-y-2 text-sm">
                <p><strong>Сильные стороны:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Природные таланты {personalSimple}: {personal.description.split('ТАЛАНТЫ')[1]?.split('•').slice(1, 4).join(' •') || 'уникальные способности к своей сфере'}</li>
                  <li>Максимальная продуктивность в роли {destinySimple}: здесь он на 200% эффективности</li>
                  <li>Может использовать {socialSimple} для работы с клиентами/партнёрами</li>
                  <li>Глубокая мотивация через {spiritualSimple} — если видит смысл, работает с душой</li>
                </ul>

                <p className="mt-3"><strong>Ограничения и риски:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>В роли НЕ {destinySimple} — работает на 50% мощности, быстро выгорает</li>
                  <li>Если давят на {personalSimple} — закрывается, конфликтует или увольняется</li>
                  <li>Если заставляют постоянно носить маску {socialSimple} — эмоциональное истощение через 6-12 месяцев</li>
                  <li>Без смысла ({spiritualSimple}) — превращается в "отбывающего время"</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
              <h3 className="font-bold text-yellow-900 mb-2">💡 Идеальная должность и среда</h3>
              <div className="text-gray-700 space-y-2">
                <p><strong>Аркан {finalResult.destiny} ({destinySimple}) — это его профессиональная ДНК</strong></p>
                
                <p className="text-sm mt-2"><strong>🎯 Лучшие роли:</strong> {professions || 'см. детальную расшифровку'}</p>
                
                <p className="text-sm mt-2"><strong>📈 Где максимально эффективен:</strong><br/>
                {destiny.finance?.split('💸')[0]?.trim() || 'В сфере соответствующей предназначению'}</p>

                <p className="text-sm mt-2"><strong>💰 Денежный потенциал:</strong><br/>
                В правильной роли — высокий и растущий. В неправильной — средний и падающий.</p>

                <p className="text-sm mt-2"><strong>⏱️ Продуктивность:</strong><br/>
                В своей роли — 200% (работает с удовольствием, генерирует идеи, мотивирован)<br/>
                Не в своей — 50% (делает минимум, нет инициативы, ждёт конца дня)</p>

                <div className="bg-red-50 p-3 rounded mt-3 border border-red-200">
                  <p className="font-semibold text-red-900 text-sm">⚠️ КРИТИЧНО:</p>
                  <p className="text-sm">Если должность НЕ соответствует {destinySimple} хотя бы на 70% → 
                  гарантированный уход через 3-6 месяцев. Деньгами его не удержите!</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
              <h3 className="font-bold text-green-900 mb-2">🔥 Что его мотивирует — Реально</h3>
              <div className="text-gray-700 space-y-3">
                <div>
                  <p className="font-semibold text-green-900">✅ МОТИВИРОВАН (по приоритету):</p>
                  <ol className="list-decimal ml-6 space-y-1 text-sm">
                    <li><strong>Соответствие {destinySimple}:</strong> Работа по предназначению = бесконечная энергия и результат. 
                    Это главный мотиватор, без него остальное не работает!</li>
                    <li><strong>Признание {personalSimple}:</strong> Когда видят его истинные качества, а не только маску. 
                    Публичная похвала за то, какой он на самом деле.</li>
                    <li><strong>Смысл через {spiritualSimple}:</strong> Понимание "зачем я это делаю", вклад в большее. 
                    Без смысла работает формально.</li>
                    <li><strong>Деньги:</strong> Важны, но НЕ первичны! Деньги — следствие правильной роли и признания.</li>
                  </ol>
                </div>

                <div className="mt-3">
                  <p className="font-semibold text-red-900">❌ НЕ МОТИВИРОВАН:</p>
                  <ul className="list-disc ml-6 space-y-1 text-sm">
                    <li>Деньгами, если работа противоречит {destinySimple} (не купите лояльность!)</li>
                    <li>Когда не видят его {personalSimple}, а ценят только маску {socialSimple}</li>
                    <li>Когда требуют постоянно носить маску — истощение</li>
                    <li>Работой без смысла — "просто делай" не работает с {spiritualSimple}</li>
                    <li>Карьерой ради карьеры — если это не {destinySimple}, не интересно</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">🎓 Как удержать — 7 правил</h3>
              <ol className="space-y-2 text-gray-700 list-decimal ml-6">
                <li className="text-sm"><strong>Давайте задачи строго по {destinySimple}</strong><br/>
                Это его зона гениальности. Здесь он эффективен и счастлив.</li>
                
                <li className="text-sm"><strong>Признавайте публично его {personalSimple}</strong><br/>
                На планёрках отмечайте его истинные качества, не только результаты.</li>
                
                <li className="text-sm"><strong>Разрешайте проявлять {socialSimple} для внешних</strong><br/>
                Пусть использует маску для клиентов/партнёров, но не требуйте носить её 24/7 в команде.</li>
                
                <li className="text-sm"><strong>Объясняйте смысл работы (для {spiritualSimple})</strong><br/>
                Перед каждой задачей: "Это важно, потому что..." Связывайте с большей целью.</li>
                
                <li className="text-sm"><strong>НЕ пытайтесь переделать — работайте с тем, что есть</strong><br/>
                {personalSimple} — это данность. Примите его таким и используйте сильные стороны.</li>
                
                <li className="text-sm"><strong>Создайте пространство для роста в {destinySimple}</strong><br/>
                Дайте возможность развиваться именно в этом направлении. Обучение, проекты, ответственность.</li>
                
                <li className="text-sm"><strong>Регулярная обратная связь</strong><br/>
                1-on-1 минимум раз в месяц. Спрашивайте: "Чувствуешь смысл? Достаточно свободы быть собой?"</li>
              </ol>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
              <h3 className="font-bold text-red-900 mb-2">⚠️ Риски и красные флаги</h3>
              <div className="space-y-3 text-gray-700">
                <div>
                  <p className="font-semibold text-red-900">РИСК #1: Уход через 3-6 месяцев</p>
                  <p className="text-sm"><strong>Причина:</strong> Роль не соответствует {destinySimple}<br/>
                  <strong>Признаки:</strong> Низкая мотивация с первых недель, частые больничные, пассивность, делает минимум<br/>
                  <strong>Профилактика:</strong> Давайте задачи строго по {destinySimple}, проверьте соответствие роли на 70%+</p>
                </div>

                <div>
                  <p className="font-semibold text-red-900">РИСК #2: Конфликты в команде</p>
                  <p className="text-sm"><strong>Причина:</strong> Команда давит на его {personalSimple}, не принимает его таким, какой он есть<br/>
                  <strong>Признаки:</strong> Замкнутость, агрессия в ответ на критику, избегание общения, работа в одиночку<br/>
                  <strong>Профилактика:</strong> Дайте свободу быть собой, объясните команде его сильные стороны</p>
                </div>

                <div>
                  <p className="font-semibold text-red-900">РИСК #3: Выгорание через 6-12 месяцев</p>
                  <p className="text-sm"><strong>Причина:</strong> Нет смысла в работе, {spiritualSimple} не активирован<br/>
                  <strong>Признаки:</strong> Усталость, цинизм, формальное отношение, потеря энергии, "отбывает время"<br/>
                  <strong>Профилактика:</strong> Регулярно напоминайте о смысле работы, связывайте задачи с большей целью</p>
                </div>

                <div>
                  <p className="font-semibold text-red-900">РИСК #4: Эмоциональное истощение</p>
                  <p className="text-sm"><strong>Причина:</strong> Постоянно носит маску {socialSimple}, не может быть {personalSimple}<br/>
                  <strong>Признаки:</strong> Раздражительность, апатия, частые болезни, снижение продуктивности<br/>
                  <strong>Профилактика:</strong> Позвольте быть собой хотя бы в команде, не требуйте маску 24/7</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold text-yellow-900 mb-2">📊 Итоговый вердикт HR</h3>
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded border border-green-300">
                  <p className="font-semibold text-green-700">✅ НАНИМАТЬ, ЕСЛИ:</p>
                  <ul className="text-gray-700 list-disc ml-6 text-sm space-y-1 mt-2">
                    <li>Должность соответствует {destinySimple} минимум на 70%</li>
                    <li>Команда готова принять его {personalSimple} (его истинную природу)</li>
                    <li>Можете обеспечить смысл работы (для {spiritualSimple})</li>
                    <li>Готовы дать свободу проявлять индивидуальность</li>
                    <li>Роль предполагает рост именно в направлении {destinySimple}</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-3 rounded border border-red-300">
                  <p className="font-semibold text-red-700">❌ НЕ НАНИМАТЬ, ЕСЛИ:</p>
                  <ul className="text-gray-700 list-disc ml-6 text-sm space-y-1 mt-2">
                    <li>Роль противоречит {destinySimple} → гарантированный уход через 3-6 месяцев</li>
                    <li>Требуется "стандартный" сотрудник без индивидуальности</li>
                    <li>В команде токсичная среда, давят на личность</li>
                    <li>Работа без смысла, только ради денег → выгорит за полгода</li>
                    <li>Нужно постоянно носить маску, нельзя быть собой</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded border border-blue-300 mt-3">
                  <p className="font-semibold text-blue-900">💡 РЕКОМЕНДАЦИЯ:</p>
                  <p className="text-sm text-gray-700">
                    <strong>Лучшая роль:</strong> {professions || destinySimple}<br/>
                    <strong>Мотивация:</strong> Смысл + признание {personalSimple} + свобода быть собой<br/>
                    <strong>Удержание:</strong> Задачи по {destinySimple} + уважение к {personalSimple} + смысл для {spiritualSimple}<br/>
                    <strong>Прогноз:</strong> При правильной роли — долгосрочный ценный сотрудник с высокой продуктивностью
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          )}
        </Card>

        {/* ДЛЯ НУТРИЦИОЛОГОВ */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
          <CardHeader 
            className="cursor-pointer hover:bg-green-100/50 transition-colors"
            onClick={() => toggleSection('nutritionists')}
          >
            <CardTitle className="flex items-center justify-between gap-2 text-2xl">
              <div className="flex items-center gap-2">
                <Icon name="Apple" className="text-green-600" size={28} />
                🍎 Для Нутрициологов — Полная Диагностика Клиента
              </div>
              <Icon name={openSections.nutritionists ? "ChevronUp" : "ChevronDown"} size={24} className="text-green-600" />
            </CardTitle>
          </CardHeader>
          {openSections.nutritionists && (
          <CardContent className="space-y-4">
            <div className="bg-green-100 p-4 rounded-lg border-l-4 border-green-600">
              <h3 className="font-bold text-green-900 mb-2">👤 Портрет клиента и пищевое поведение</h3>
              <div className="text-gray-800 space-y-2 text-sm">
                <p><strong>Истинное Я ({personalSimple}):</strong><br/>
                {personal.description.split('.')[0]}. Это влияет на его отношения с едой и телом.</p>
                
                <p><strong>Предназначение ({destinySimple}):</strong><br/>
                {destiny.description.split('.')[0]}. ⚠️ Вес часто защищает от реализации этого! 
                Пока не примет {destinySimple} — тело держит вес как броню.</p>
                
                <p><strong>Социальная маска ({socialSimple}):</strong><br/>
                {social.description.split('.')[0]}. Под этой маской он скрывает истинные эмоции и ЗАЕДАЕТ их!</p>
                
                <p><strong>Духовная пустота ({spiritualSimple}):</strong><br/>
                {spiritual.description.split('.')[0]}. Заедает отсутствие смысла жизни, пытается заполнить пустоту едой.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-green-400">
              <h3 className="font-bold text-green-900 mb-2">🍽️ Его пищевое поведение — Что происходит</h3>
              <div className="text-gray-700 space-y-2 text-sm">
                <p><strong>ЗАЕДАЕТ когда:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Конфликт между {personalSimple} (кто он) и {destinySimple} (кем должен стать)</li>
                  <li>Носит маску {socialSimple} и не может быть собой → накапливает стресс</li>
                  <li>Душа {spiritualSimple} чувствует пустоту → компенсирует едой</li>
                  <li>Боится реализовать {destinySimple} → тело держит вес для защиты</li>
                </ul>

                <p className="mt-3"><strong>ПЕРЕЕДАЕТ когда:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Подавляет свою истинную природу {personalSimple}</li>
                  <li>Игнорирует сигналы {destinySimple} о смене жизни</li>
                  <li>Живёт НЕ по своему пути — еда = утешение</li>
                </ul>

                <p className="mt-3"><strong>ТЯНЕТ НА СЛАДКОЕ когда:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Не хватает "сладости жизни" — живёт не своей жизнью</li>
                  <li>{spiritualSimple} (душа) требует смысла → компенсирует сахаром</li>
                  <li>Нет радости от реализации {destinySimple}</li>
                </ul>

                <p className="mt-3 font-semibold text-green-900">
                  💡 Главное: Вес — это НЕ проблема с едой, а сигнал что человек живёт НЕ по матрице!
                </p>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
              <h3 className="font-bold text-red-900 mb-2">🔥 Диагностика — Почему не худеет (4 уровня)</h3>
              <p className="text-sm text-gray-700 mb-3">Работать нужно на ВСЕХ 4 уровнях одновременно. Иначе вес вернётся!</p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-bold text-red-900">🔴 УРОВЕНЬ 1: {personalSimple} — ФИЗИОЛОГИЯ</h4>
              <div className="text-gray-700 mt-2 space-y-2 text-sm">
                <p><strong>Проблемные зоны тела:</strong><br/>
                {extractHealthZones(personal.health) || 'см. раздел здоровье'}</p>
                
                <p><strong>Что нужно проверить ПЕРВЫМ ДЕЛОМ:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Анализы крови: гормоны (ТТГ, Т3, Т4, кортизол, инсулин), сахар, холестерин</li>
                  <li>УЗИ щитовидной железы и органов брюшной полости</li>
                  <li>Проверка инсулинорезистентности (индекс HOMA)</li>
                  <li>Гормоны половые (эстроген, тестостерон, прогестерон)</li>
                  <li>Кишечник: проверка на дисбиоз, воспаления</li>
                </ul>

                <p className="mt-2 font-semibold">Что делать:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Лечить физику ПЕРВЫМ ДЕЛОМ — без этого диета не работает!</li>
                  <li>Направить к эндокринологу при гормональных проблемах</li>
                  <li>Восстановить работу кишечника (пробиотики, ферменты)</li>
                  <li>Убрать воспаления (противовоспалительная диета)</li>
                </ul>

                <p className="mt-2 bg-red-100 p-2 rounded font-semibold text-red-900">
                  ⚠️ Без лечения физики похудение НЕВОЗМОЖНО! Это фундамент!
                </p>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-bold text-orange-900">🟠 УРОВЕНЬ 2: {destinySimple} — КАРМИЧЕСКИЙ БЛОК</h4>
              <div className="text-gray-700 mt-2 space-y-2 text-sm">
                <p><strong>Что происходит:</strong><br/>
                Вес — это ЗАЩИТА от реализации {destinySimple}. Человек подсознательно БОИТСЯ своего предназначения, 
                и тело держит вес как броню, чтобы "не высовываться", "остаться незаметным".</p>
                
                <p><strong>Механизм:</strong><br/>
                {destiny.description.split('.').slice(0, 2).join('.')}. <br/>
                Человек думает: "Если я стану {destinySimple}, от меня будут требовать больше, это ответственность, 
                я не справлюсь". → Тело держит вес = защита от призвания.</p>

                <p><strong>Что делать:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Направить к психологу для работы со страхом предназначения</li>
                  <li>Параллельно начать микрошаги к {destinySimple}: хобби, курсы, 15 мин/день</li>
                  <li>Объяснить клиенту связь: "Вес = защита от {destinySimple}. Когда примешь путь, вес уйдёт"</li>
                  <li>Визуализация: "Представь себя в роли {destinySimple} — что чувствуешь? Страх? Работаем с ним"</li>
                </ul>

                <p className="mt-2 bg-orange-100 p-2 rounded font-semibold text-orange-900">
                  ⚠️ Пока не примет {destinySimple} — вес ВСЕГДА вернётся! Это ключевой уровень!
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-bold text-yellow-900">🟡 УРОВЕНЬ 3: {spiritualSimple} — ПСИХОСОМАТИКА</h4>
              <div className="text-gray-700 mt-2 space-y-2 text-sm">
                <p><strong>Что происходит:</strong><br/>
                Заедает духовную пустоту и отсутствие смысла жизни. {spiritualSimple} требует наполнения, 
                но человек пытается заполнить эту пустоту едой — это не работает!</p>
                
                <p><strong>Симптомы:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Ест не от голода, а от скуки и пустоты</li>
                  <li>Тянет на сладкое — компенсация "несладкой жизни"</li>
                  <li>Ночные походы к холодильнику — заедает экзистенциальную тоску</li>
                  <li>Переедание после стрессов — еда = единственный источник "радости"</li>
                </ul>

                <p><strong>Что делать:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Духовные практики: медитации 10 мин утром, йога, прогулки на природе</li>
                  <li>Поиск смысла жизни через {spiritualSimple} — философия, духовные книги, практики</li>
                  <li>Работа с эмоциями: дневник питания + эмоций (что чувствовал перед едой?)</li>
                  <li>Техники осознанного питания: есть медленно, без гаджетов, чувствовать вкус</li>
                  <li>Найти источники радости кроме еды: хобби, творчество, служение</li>
                </ul>

                <p className="mt-2 bg-yellow-100 p-2 rounded font-semibold text-yellow-900">
                  ⚠️ Без смысла жизни — заедание продолжится бесконечно!
                </p>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-bold text-purple-900">🟣 УРОВЕНЬ 4: {socialSimple} — СОЦИАЛЬНОЕ ДАВЛЕНИЕ</h4>
              <div className="text-gray-700 mt-2 space-y-2 text-sm">
                <p><strong>Конфликт:</strong><br/>
                Общество видит его как {socialSimple}, но внутри он {personalSimple}. 
                Постоянно носит маску → накапливает стресс → заедает!</p>
                
                <p><strong>Механизм:</strong><br/>
                "{socialSimple} должен быть таким-то" — требования общества<br/>
                "{personalSimple} хочет быть собой" — внутренняя природа<br/>
                → Конфликт → стресс → еда = единственный способ справиться</p>

                <p><strong>Что делать:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Помочь снять маску {socialSimple} хотя бы дома</li>
                  <li>Разрешить быть {personalSimple} — "Ты имеешь право быть собой"</li>
                  <li>Работа с самопринятием: "Я {personalSimple}, и это нормально"</li>
                  <li>Убрать токсичное окружение, которое давит на личность</li>
                  <li>Практика: 1 раз в неделю делать что-то "не в стиле {socialSimple}"</li>
                </ul>

                <p className="mt-2 bg-purple-100 p-2 rounded font-semibold text-purple-900">
                  ⚠️ Снятие маски = снижение стресса = автоматический уход веса!
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
              <h3 className="font-bold text-green-900 mb-2">🔑 Ключ к успеху — Формула похудения</h3>
              <div className="text-gray-700 space-y-2">
                <p className="font-semibold text-green-900 text-base">
                  "Вес — это защита от реализации {destinySimple}. <br/>
                  Пока человек не примет своё предназначение, тело будет держать вес как броню.<br/>
                  Когда он станет жить как {destinySimple}, вес уйдёт САМ — это произойдёт естественно."
                </p>

                <p className="mt-3 text-sm"><strong>Ваша задача как нутрициолога:</strong></p>
                <ol className="list-decimal ml-6 space-y-1 text-sm">
                  <li><strong>Вылечить физику (уровень 1):</strong> анализы, УЗИ, лечение гормонов, кишечника</li>
                  <li><strong>Направить к психологу:</strong> работа со страхом {destinySimple}, принятие предназначения</li>
                  <li><strong>Дать духовные практики:</strong> медитации, поиск смысла через {spiritualSimple}</li>
                  <li><strong>Помочь снять маску:</strong> принятие {personalSimple}, работа с самооценкой</li>
                  <li><strong>Дать правильное питание:</strong> персонализированная диета + БАДы</li>
                </ol>

                <p className="mt-3 bg-green-100 p-3 rounded font-semibold text-green-900">
                  💡 Работайте со ВСЕМИ 4 уровнями одновременно! Иначе — эффект йо-йо через 3-6 месяцев!
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-green-400">
              <h3 className="font-bold text-green-900 mb-2">🥗 План питания (персональный)</h3>
              <div className="text-gray-700 space-y-3 text-sm">
                <div>
                  <p className="font-semibold">ЧТО ИСКЛЮЧИТЬ:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Сахар и быстрые углеводы — это "заедание пустоты {spiritualSimple}"</li>
                    <li>Продукты-триггеры стресса для {personalSimple}</li>
                    <li>Всё, что даёт ложную энергию вместо работы по {destinySimple}</li>
                    <li>Алкоголь — блокирует связь с высшим ({spiritualSimple})</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">ЧТО ДОБАВИТЬ:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Белок: 1.5-2г/кг веса (насыщение + сохранение мышц)</li>
                    <li>Клетчатка: 500г+ овощей в день (очищение, сытость)</li>
                    <li>Вода: 30-40мл/кг веса (детокс, метаболизм)</li>
                    <li>Хорошие жиры: омега-3, орехи, авокадо (гормоны, мозг)</li>
                    <li>Медленные углеводы: крупы, бобовые (энергия)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold">РЕЖИМ:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>3-4 приёма пищи в день, без перекусов</li>
                    <li>Последний приём за 3 часа до сна</li>
                    <li>Осознанное питание: медленно, без гаджетов</li>
                    <li>Дневник питания + эмоций (отслеживать триггеры)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">📋 Комплексный план работы (12 недель)</h3>
              <div className="text-gray-700 space-y-2 text-sm">
                <p><strong>Неделя 1-2: ДИАГНОСТИКА</strong><br/>
                Анализы, УЗИ, замеры, дневник питания. Первая встреча с психологом для работы с {destinySimple}.</p>
                
                <p><strong>Неделя 3-4: ЗАПУСК</strong><br/>
                Новый рацион, начало лечения физики, психолог 1 раз в неделю, медитации 10 мин утром.</p>
                
                <p><strong>Неделя 5-8: ОСНОВНАЯ РАБОТА</strong><br/>
                Диета + движение + психолог + духовные практики. Контроль веса 1 раз в неделю. Работа со всеми 4 уровнями!</p>
                
                <p><strong>Неделя 9-12: ИНТЕГРАЦИЯ</strong><br/>
                Клиент начинает жить через {destinySimple}, снимает маску {socialSimple}, находит смысл {spiritualSimple}. 
                Вес уходит естественно.</p>

                <p className="mt-3 font-semibold">Встречи с вами:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Неделя 1-4: каждую неделю</li>
                  <li>Неделя 5-12: раз в 2 недели</li>
                  <li>После: раз в месяц поддержка</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">📊 Прогноз — 2 сценария</h3>
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded border border-green-300">
                  <p className="font-semibold text-green-700">✅ ЕСЛИ РАБОТАЕТ НА ВСЕХ 4 УРОВНЯХ:</p>
                  <div className="text-gray-700 text-sm space-y-1 mt-2">
                    <p><strong>Месяц 1-3:</strong> -8-12 кг, улучшение анализов, контроль питания налажен</p>
                    <p><strong>Месяц 4-6:</strong> -еще 5-8 кг, начинает жить через {destinySimple}, энергия растёт</p>
                    <p><strong>Месяц 7-12:</strong> выход на целевой вес, стабилизация</p>
                    <p className="font-semibold text-green-900 mt-2">→ Вес НЕ возвращается, потому что изменилась ЖИЗНЬ!</p>
                  </div>
                </div>

                <div className="bg-red-50 p-3 rounded border border-red-300">
                  <p className="font-semibold text-red-700">⚠️ ЕСЛИ РАБОТАЕТ ТОЛЬКО С ДИЕТОЙ (игнорирует уровни 2-4):</p>
                  <div className="text-gray-700 text-sm space-y-1 mt-2">
                    <p><strong>Месяц 1-2:</strong> -3-5 кг (только вода, не жир)</p>
                    <p><strong>Месяц 3:</strong> плато, вес стоит, мотивация падает</p>
                    <p><strong>Месяц 4+:</strong> откат, вес возвращается + еще больше</p>
                    <p className="font-semibold text-red-900 mt-2">→ Без работы с {destinySimple} вес ВСЕГДА вернётся! Это закон!</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          )}
        </Card>

        {/* ДЛЯ БИЗНЕС-КОУЧЕЙ */}
        <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-300">
          <CardHeader 
            className="cursor-pointer hover:bg-orange-100/50 transition-colors"
            onClick={() => toggleSection('coaches')}
          >
            <CardTitle className="flex items-center justify-between gap-2 text-2xl">
              <div className="flex items-center gap-2">
                <Icon name="TrendingUp" className="text-orange-600" size={28} />
                📈 Для Бизнес-Коучей — Полный Финансовый Профиль
              </div>
              <Icon name={openSections.coaches ? "ChevronUp" : "ChevronDown"} size={24} className="text-orange-600" />
            </CardTitle>
          </CardHeader>
          {openSections.coaches && (
          <CardContent className="space-y-4">
            <div className="bg-orange-100 p-4 rounded-lg border-l-4 border-orange-600">
              <h3 className="font-bold text-orange-900 mb-2">👤 Финансовый портрет клиента</h3>
              <div className="text-gray-800 space-y-2 text-sm">
                <p><strong>Как зарабатывает сейчас ({personalSimple}):</strong><br/>
                {personal.finance?.split('.').slice(0, 2).join('.') || 'Работает через свою природу, но это не приносит больших денег'}</p>
                
                <p><strong>Истинный денежный код ({destinySimple}):</strong><br/>
                {destiny.description.split('.')[0]}. <br/>
                <span className="font-semibold">Денежные профессии:</span> {professions || 'см. детальную расшифровку'}<br/>
                ⚠️ Деньги приходят ТОЛЬКО через {destinySimple}!</p>
                
                <p><strong>Как продаёт себя ({socialSimple}):</strong><br/>
                {social.description.split('.')[0]}. Это его маска для клиентов/партнёров.<br/>
                ⚠️ Если продаёт только маску — клиенты чувствуют фальшь!</p>
                
                <p><strong>Денежные блоки ({spiritualSimple}):</strong><br/>
                {spiritual.description.split('.')[0]}. <br/>
                {spiritual.health?.split('.')[0] || 'Есть глубинные страхи относительно богатства'}</p>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
              <h3 className="font-bold text-red-900 mb-2">💸 Диагностика — Почему нет денег (4 уровня блокировки)</h3>
              <div className="text-gray-700 space-y-3 text-sm">
                <p className="font-semibold text-red-900 text-base">🔴 КОРЕНЬ ПРОБЛЕМЫ:</p>
                <p>Работает через {personalSimple}, но деньги приходят ТОЛЬКО через {destinySimple}!<br/>
                Это как пытаться открыть дверь не тем ключом — можно стараться годами, но дверь не откроется.</p>
                
                <div className="bg-red-100 p-3 rounded mt-2">
                  <p className="font-semibold text-red-900">4 УРОВНЯ БЛОКИРОВКИ:</p>
                  <ul className="list-disc ml-6 space-y-2 mt-2">
                    <li><strong>Уровень 1 — {personalSimple} (характер):</strong><br/>
                    Работает в сфере соответствующей характеру, но это даёт {personal.finance?.split('•')[1] || 'средний доход'} — НЕ денежный путь!</li>
                    
                    <li><strong>Уровень 2 — {destinySimple} (предназначение):</strong><br/>
                    Истинная денежная ниша: {professions}. Пока не принят — денег нет, потому что вселенная помогает ТОЛЬКО на пути предназначения!</li>
                    
                    <li><strong>Уровень 3 — {socialSimple} (маска):</strong><br/>
                    Продаёт через маску, показывает фасад. Клиенты чувствуют неискренность — не покупают или не возвращаются!</li>
                    
                    <li><strong>Уровень 4 — {spiritualSimple} (душа):</strong><br/>
                    Денежные блоки: {spiritual.health?.split('.').slice(0, 2).join('.') || 'страх богатства, вина за деньги, страх ответственности'}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-orange-400">
              <h3 className="font-bold text-orange-900 mb-2">🎯 На что способен финансово</h3>
              <div className="text-gray-700 space-y-2 text-sm">
                <p><strong>Потенциал дохода:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>В правильной нише ({destinySimple}): ×10-50 от текущего дохода за 12-24 месяца</li>
                  <li>В неправильной нише ({personalSimple}): текущий доход ±20%, потолок близко</li>
                </ul>

                <p className="mt-2"><strong>Почему так:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>В {destinySimple} — вселенная помогает: приходят "свои" клиенты, открываются возможности, энергия бесконечная</li>
                  <li>В {personalSimple} — работа против течения: нужно продавливать, клиентов мало, постоянное выгорание</li>
                </ul>

                <p className="mt-2"><strong>Что мешает зарабатывать больше:</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Не принял {destinySimple} как свой путь (страх ответственности)</li>
                  <li>Работает в неправильной нише</li>
                  <li>Продаёт маску {socialSimple} вместо себя</li>
                  <li>Денежные блоки {spiritualSimple} (вина, страх, ограничивающие убеждения)</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-100 p-4 rounded-lg border-l-4 border-green-600">
              <h3 className="font-bold text-green-900 mb-2">🎯 Правильная ниша — 100% попадание</h3>
              <div className="text-gray-800 space-y-2">
                <p className="text-base"><strong>Аркан {finalResult.destiny}: {destinySimple}</strong> — это его кармическое предназначение и денежный код</p>
                
                <p className="text-sm mt-2"><strong>💼 Конкретные ниши:</strong><br/>
                {professions || 'см. детальную расшифровку'}</p>
                
                <p className="text-sm mt-2"><strong>💰 Как монетизировать:</strong><br/>
                {destiny.finance?.split('.').slice(0, 3).join('.') || 'Через экспертность и уникальность'}</p>

                <p className="text-sm mt-2"><strong>Почему ИМЕННО эта ниша:</strong></p>
                <ul className="list-disc ml-6 space-y-1 text-sm">
                  <li>Это кармическое предназначение — вселенная помогает ТОЛЬКО здесь</li>
                  <li>Работа не ощущается работой — бесконечная энергия</li>
                  <li>Приходят "свои" клиенты автоматически</li>
                  <li>Деньги текут легко, без продавливания</li>
                  <li>Растёт экспертность и репутация естественно</li>
                </ul>

                <div className="bg-red-50 p-3 rounded mt-3 border border-red-200">
                  <p className="font-semibold text-red-900 text-sm">⚠️ ЕСЛИ СЕЙЧАС ДРУГАЯ НИША:</p>
                  <p className="text-sm">Сменить нишу за 30 дней! Не нужно бросать всё резко — начни {destinySimple} как side-проект, 
                  15 мин/день. Через 3-6 месяцев он даст больше денег чем основная работа.</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">🚀 План ×10 доход за 90 дней</h3>
              <div className="space-y-3 text-gray-700">
                <div className="text-sm">
                  <p className="font-semibold text-blue-900">НЕДЕЛЯ 1-2: Осознание</p>
                  <p><strong>Задача:</strong> Признать, что {personalSimple} — не путь больших денег<br/>
                  <strong>Действия:</strong> Анализ текущего бизнеса, подсчёт реального дохода, осознание потолка<br/>
                  <strong>Результат:</strong> "Да, я в тупике. Нужно менять нишу"</p>
                </div>

                <div className="text-sm">
                  <p className="font-semibold text-blue-900">НЕДЕЛЯ 3-4: Принятие</p>
                  <p><strong>Задача:</strong> Принять {destinySimple} как денежное призвание<br/>
                  <strong>Действия:</strong> Изучение ниши {professions}, поиск менторов, анализ конкурентов<br/>
                  <strong>Результат:</strong> "Это моё! Я могу зарабатывать здесь"</p>
                </div>

                <div className="text-sm">
                  <p className="font-semibold text-blue-900">НЕДЕЛЯ 5-6: Запуск</p>
                  <p><strong>Задача:</strong> Сменить нишу на {destinySimple}, запустить MVP<br/>
                  <strong>Действия:</strong> Создать минимальный продукт/услугу, анонс в соцсетях, первые клиенты<br/>
                  <strong>Результат:</strong> MVP запущен, 1-3 платных клиента</p>
                </div>

                <div className="text-sm">
                  <p className="font-semibold text-blue-900">НЕДЕЛЯ 7-8: Продажи</p>
                  <p><strong>Задача:</strong> Использовать {socialSimple} для продаж (маска — для клиентов)<br/>
                  <strong>Действия:</strong> Продающие посты, звонки, встречи, но показывать себя настоящего ({personalSimple})<br/>
                  <strong>Результат:</strong> 5-10 клиентов, доход ×1.5-2 от стартового</p>
                </div>

                <div className="text-sm">
                  <p className="font-semibold text-blue-900">НЕДЕЛЯ 9-12: Очистка блоков</p>
                  <p><strong>Задача:</strong> Очистить {spiritualSimple} — убрать денежные блоки<br/>
                  <strong>Действия:</strong> Медитации, работа с убеждениями, прощение, отпускание страхов<br/>
                  <strong>Результат:</strong> Блоки ушли, деньги текут легче</p>
                </div>

                <p className="font-bold mt-3 text-base text-orange-900">
                  📊 ОЖИДАЕМЫЙ РЕЗУЛЬТАТ:<br/>
                  Доход ×3-5 через 90 дней, ×10-15 через 12 месяцев
                </p>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
              <h3 className="font-bold text-purple-900 mb-2">💎 Денежные блоки — Как найти и очистить</h3>
              <div className="text-gray-700 space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-purple-900">Техника поиска блоков:</p>
                  <p><strong>Вопрос клиенту:</strong> "Что плохого случится, если ты станешь богатым через {destinySimple}?"</p>
                  
                  <p className="mt-2"><strong>Типичные ответы (денежные блоки):</strong></p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>"Потеряю друзей" (блок: одиночество богатых)</li>
                    <li>"Стану плохим человеком" (блок: богатство = зло)</li>
                    <li>"Меня ограбят / убьют" (блок: страх безопасности)</li>
                    <li>"Не смогу управлять деньгами" (блок: некомпетентность)</li>
                    <li>"Это не по-христиански" (блок: религиозный)</li>
                    <li>"Не заслуживаю" (блок: недостойность)</li>
                  </ul>
                </div>

                <div className="bg-purple-100 p-3 rounded mt-3">
                  <p className="font-semibold text-purple-900">Как очистить блоки:</p>
                  <ol className="list-decimal ml-6 space-y-2 mt-2">
                    <li><strong>Осознать блок:</strong> Записать все страхи и убеждения о деньгах</li>
                    <li><strong>Найти корень:</strong> "Когда я впервые так подумал? Что случилось?" (обычно детство, родители)</li>
                    <li><strong>Простить:</strong> Себя, родителей, ситуацию. "Это было тогда, сейчас по-другому"</li>
                    <li><strong>Заменить установку:</strong> Вместо "Богатые — плохие" → "Богатство даёт свободу помогать"</li>
                    <li><strong>Медитация {spiritualSimple}:</strong> 10 мин утром на связь с высшим, просить разрешения быть богатым</li>
                  </ol>
                </div>

                <p className="mt-3 text-sm"><strong>Работа с духовным уровнем ({spiritualSimple}):</strong></p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Медитации на принятие богатства: "Я достоин изобилия"</li>
                  <li>Благодарность: каждый день 10 благодарностей за деньги</li>
                  <li>Служение: часть дохода на благотворительность (снимает вину)</li>
                  <li>Связь с высшим: "Деньги — это энергия для реализации {destinySimple}"</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-bold text-yellow-900 mb-2">🔧 Как использовать все 4 энергии для денег</h3>
              <div className="text-gray-700 space-y-2 text-sm">
                <div className="bg-amber-100 p-3 rounded">
                  <p className="font-semibold text-amber-900">1. {personalSimple} — ИНСТРУМЕНТ</p>
                  <p>Используй свой характер КАК ИНСТРУМЕНТ для {destinySimple}. <br/>
                  Например: {personalSimple} даёт уникальность, харизму, подход — применяй это в {destinySimple}!</p>
                </div>

                <div className="bg-yellow-100 p-3 rounded">
                  <p className="font-semibold text-yellow-900">2. {destinySimple} — НИША</p>
                  <p>Работай ТОЛЬКО в этой нише. Все другие ниши — распыление энергии и денег.<br/>
                  {destinySimple} = твой денежный код, вселенная помогает ТОЛЬКО здесь!</p>
                </div>

                <div className="bg-green-100 p-3 rounded">
                  <p className="font-semibold text-green-900">3. {socialSimple} — ДЛЯ ПРОДАЖ</p>
                  <p>Используй маску {socialSimple} для привлечения клиентов и продаж.<br/>
                  Но НЕ живи в ней 24/7! В работе показывай {personalSimple} — искренность притягивает.</p>
                </div>

                <div className="bg-purple-100 p-3 rounded">
                  <p className="font-semibold text-purple-900">4. {spiritualSimple} — СМЫСЛ</p>
                  <p>Работа через {destinySimple} должна иметь СМЫСЛ для {spiritualSimple}.<br/>
                  Не просто деньги, а служение, помощь людям, вклад в мир. Это даёт энергию!</p>
                </div>

                <p className="font-semibold text-yellow-900 mt-3 text-base">
                  💡 Формула богатства: {personalSimple} (инструмент) + {destinySimple} (ниша) + {socialSimple} (продажи) + {spiritualSimple} (смысл) = ∞ денег
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
              <h3 className="font-bold text-green-900 mb-2">🔑 Ключ к богатству</h3>
              <p className="text-gray-700">
                "Деньги приходят, когда живёшь через {destinySimple}. Это твой денежный код, твоя денежная чакра.<br/><br/>
                Вселенная даст деньги ТОЛЬКО за {professions || destinySimple}, потому что это твоё ПРЕДНАЗНАЧЕНИЕ.<br/><br/>
                Прими {destinySimple}, очисти {spiritualSimple}, используй {socialSimple} для продаж, 
                применяй {personalSimple} как уникальность — это формула богатства."
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">📊 Прогноз — 2 сценария</h3>
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded border border-green-300">
                  <p className="font-semibold text-green-700">✅ ЕСЛИ СЛЕДУЕТ ПЛАНУ:</p>
                  <div className="text-gray-700 text-sm space-y-1 mt-2">
                    <p><strong>Месяц 1:</strong> доход ×1.5 (первые клиенты в {destinySimple})</p>
                    <p><strong>Месяц 2-3:</strong> ×3-5 (ниша набирает обороты, сарафан)</p>
                    <p><strong>Месяц 4-6:</strong> ×5-7 (стабильный поток, репутация растёт)</p>
                    <p><strong>Месяц 7-12:</strong> ×10-15 (масштабирование, системы)</p>
                    <p className="font-semibold text-green-900 mt-2">→ Работа в кайф, деньги текут легко, клиенты сами приходят!</p>
                  </div>
                </div>

                <div className="bg-red-50 p-3 rounded border border-red-300">
                  <p className="font-semibold text-red-700">⚠️ ЕСЛИ НЕ МЕНЯЕТ НИШУ:</p>
                  <div className="text-gray-700 text-sm space-y-1 mt-2">
                    <p>Доход стоит на месте или падает</p>
                    <p>Постоянное выгорание, работа через силу</p>
                    <p>Клиентов мало, нужно продавливать каждую сделку</p>
                    <p>Через 12-24 месяца — бизнес закроется или кризис</p>
                    <p className="font-semibold text-red-900 mt-2">→ Пока не работает через {destinySimple} — больших денег НЕ БУДЕТ! Это закон!</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          )}
        </Card>
      </div>

      <ShareButtons 
        result={finalResult} 
        birthDate={birthDate}
      />
    </div>
  );
};