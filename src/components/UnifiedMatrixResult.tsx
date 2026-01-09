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
  if (!hasAccess) return null;
  if (!result) return null;

  const memoizedData = useMemo(() => {
    if (!result) return null;

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
  }, [result]);

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

      <ShareButtons 
        name={finalResult.name} 
        birthDate={birthDate}
        matrixNumbers={{
          personal: finalResult.personal,
          destiny: finalResult.destiny,
          social: finalResult.social,
          spiritual: finalResult.spiritual
        }}
      />
    </div>
  );
};