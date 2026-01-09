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
          📋 Психологический портрет клиента
        </h2>
        <p className="text-lg text-gray-600">
          {finalResult.name} — комплексное заключение для специалистов
        </p>
      </div>

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
            <h3 className="text-xl font-bold text-amber-900">🎯 {personalSimple}</h3>
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
            <h3 className="text-xl font-bold text-yellow-900">🎯 {destinySimple}</h3>
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
            <h3 className="text-xl font-bold text-green-900">🎯 {socialSimple}</h3>
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
            <h3 className="text-xl font-bold text-purple-900">🎯 {spiritualSimple}</h3>
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