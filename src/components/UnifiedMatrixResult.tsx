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
  };
  hasAccess: boolean;
  birthDate: string;
}

// Функция для извлечения простого описания аркана (убираем технические детали)
const getSimplePersonality = (desc: string | undefined) => {
  if (!desc) return '';
  // Берём первые 2-3 предложения из description
  return desc.split('\n\n').slice(0, 2).join(' ').substring(0, 300);
};

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
  const zones = health.split('🔴 ЗОНЫ ОСОБОГО ВНИМАНИЯ:')[1];
  return zones?.split('⚡')[0]?.trim() || '';
};

const extractHealthCauses = (health: string | undefined) => {
  if (!health) return '';
  const causes = health.split('⚡ ПРИЧИНЫ ЗАБОЛЕВАНИЙ:')[1];
  return causes?.split('🌿')[0]?.trim() || '';
};

const extractRelationshipStyle = (rel: string | undefined) => {
  if (!rel) return '';
  const style = rel.split('🎭 ВАШ СТИЛЬ В ОТНОШЕНИЯХ:')[1];
  return style?.split('✅')[0]?.trim() || '';
};

const extractRelationshipNeeds = (rel: string | undefined) => {
  if (!rel) return '';
  const needs = rel.split('✅ ЧТО ВАМ НУЖНО ОТ ПАРТНЕРА:')[1];
  return needs?.split('❌')[0]?.trim() || '';
};

const extractRelationshipDestroys = (rel: string | undefined) => {
  if (!rel) return '';
  const destroys = rel.split('❌ ЧТО РАЗРУШАЕТ ВАШИ ОТНОШЕНИЯ:')[1];
  return destroys?.split('🔑')[0]?.trim() || '';
};

export const UnifiedMatrixResult = ({ result, hasAccess, birthDate }: UnifiedMatrixResultProps) => {
  if (!hasAccess) return null;

  const personal = energyDescriptions[result.personal];
  const destiny = energyDescriptions[result.destiny];
  const social = energyDescriptions[result.social];
  const spiritual = energyDescriptions[result.spiritual];

  if (!personal || !destiny || !social || !spiritual) {
    return <div className="text-center py-10 text-red-600">Ошибка загрузки данных арканов</div>;
  }

  const professions = extractProfessions(destiny?.finance);
  const healthZones = extractHealthZones(personal?.health);
  const healthCauses = extractHealthCauses(personal?.health);
  const relStyle = extractRelationshipStyle(personal?.relationships);
  const relNeeds = extractRelationshipNeeds(personal?.relationships);
  const relDestroys = extractRelationshipDestroys(personal?.relationships);

  // Получаем простые имена арканов
  const personalSimple = arcanaSimpleNames[result.personal] || personal?.title || 'Неизвестный тип';
  const socialSimple = arcanaSimpleNames[result.social] || social?.title || 'Неизвестный тип';
  const destinySimple = arcanaSimpleNames[result.destiny] || destiny?.title || 'Неизвестный тип';
  const spiritualSimple = arcanaSimpleNames[result.spiritual] || spiritual?.title || 'Неизвестный тип';

  return (
    <div className="space-y-6 mb-8">
      {/* Заголовок */}
      <div className="text-center space-y-2 py-6">
        <h2 className="text-3xl font-bold text-gray-900">
          📋 Психологический портрет клиента
        </h2>
        <p className="text-lg text-gray-600">
          {result.name} — комплексное заключение для специалистов
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
          {/* КТО ПЕРЕД ВАМИ */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900 border-b-2 border-purple-200 pb-2">
              🧠 Кто перед вами: портрет личности
            </h3>
            <div className="bg-purple-50 p-4 rounded-lg space-y-3 text-gray-800 leading-relaxed">
              <p>
                <strong className="text-purple-900">Истинная суть человека:</strong> По своей природе это <strong>{personalSimple}</strong>. 
                {getSimplePersonality(personal?.description)} 
                Это его настоящее "Я", которое он часто прячет от окружающих.
              </p>
              
              <p>
                <strong className="text-blue-900">Социальная маска:</strong> В обществе человек надевает маску <strong>{socialSimple}</strong>. 
                {getSimplePersonality(social?.description)} 
                Это НЕ его истинное лицо — это защитная реакция, способ адаптации к ожиданиям общества.
              </p>
              
              <p>
                <strong className="text-green-900">Предназначение:</strong> Его душа пришла в этот мир, чтобы реализовать энергию <strong>{destinySimple}</strong>. 
                {getSimplePersonality(destiny?.description)} 
                Когда человек занимается своим призванием, жизнь становится лёгкой и деньги приходят сами.
              </p>
              
              <p>
                <strong className="text-pink-900">Глубинная суть души:</strong> На самом глубоком уровне это <strong>{spiritualSimple}</strong>. 
                {getSimplePersonality(spiritual?.description)} 
                Это то, ради чего душа воплотилась на Земле — её высшая миссия.
              </p>
            </div>
          </div>

          {/* В ЧЁМ ПРОБЛЕМА */}
          <div className="space-y-3 bg-red-50 p-5 rounded-lg border-l-4 border-red-500">
            <h3 className="text-xl font-bold text-red-900 flex items-center gap-2">
              <Icon name="AlertTriangle" size={20} />
              ⚠️ В чём проблема этого человека
            </h3>
            <div className="space-y-3 text-gray-800">
              <p>
                <strong>1. Внутренний конфликт:</strong> Человек живёт как "{socialSimple}" (социальная роль), 
                хотя внутри чувствует себя "{personalSimple}" (истинное "Я"). 
                Это создаёт хроническое напряжение, усталость, ощущение "я живу не своей жизнью".
              </p>
              
              <p>
                <strong>2. Непонимание призвания:</strong> Не реализует энергию "{destinySimple}", 
                поэтому:
              </p>
              <ul className="ml-6 space-y-1 text-sm">
                <li>• Деньги даются тяжело, приходится много работать за малый результат</li>
                <li>• Карьера буксует, нет удовлетворения от работы</li>
                <li>• Постоянное чувство "не на своём месте"</li>
                <li>• Завистливо смотрит на тех, кто нашёл себя</li>
              </ul>
              
              <p>
                <strong>3. Потеря смысла жизни:</strong> Душа ("{spiritualSimple}") не получает своего питания. 
                Отсюда: депрессия, апатия, экзистенциальный кризис, вопросы "зачем всё это?", "в чём смысл?".
              </p>
              
              <p>
                <strong>4. Психосоматические проблемы:</strong> Подавление истинных желаний и непроявленность души ведут к болезням. 
                Слабые зоны: {healthZones}
              </p>
              
              <p className="text-sm italic text-red-800">
                <strong>Главная проблема в одном предложении:</strong> Человек притворяется кем-то другим, не делает то, для чего пришёл, 
                и не понимает смысла своей жизни.
              </p>
            </div>
          </div>

          {/* КАК ПОМОЧЬ */}
          <div className="space-y-4 bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
            <h3 className="text-xl font-bold text-green-900 flex items-center gap-2">
              <Icon name="HeartPulse" size={20} />
              💡 Как помочь: пошаговый план терапии
            </h3>
            
            <div className="space-y-4 text-gray-800">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-bold text-green-900 mb-2">
                  ШАГ 1: Вернуть контакт с истинным "Я"
                </p>
                <p className="text-sm mb-2">
                  <strong>Цель:</strong> Разрешить человеку быть "{personalSimple}" — не прятаться за маску.
                </p>
                <p className="text-sm mb-2">
                  <strong>Работаем с убеждением:</strong> "Я имею право быть собой. Меня не обязательно всем любить."
                </p>
                <p className="text-sm">
                  <strong>Практики:</strong> Ведение дневника истинных желаний ("что я хочу на самом деле?"), 
телесные практики для возвращения в контакт с собой, упражнения на самопринятие.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-bold text-green-900 mb-2">
                  ШАГ 2: Найти своё предназначение
                </p>
                <p className="text-sm mb-2">
                  <strong>Цель:</strong> Направить энергию в реализацию призвания "{destinySimple}".
                </p>
                <p className="text-sm mb-2">
                  <strong>Профессии для реализации:</strong> {professions}
                </p>
                <p className="text-sm">
                  <strong>Важно объяснить:</strong> Это не просто работа — это путь души. 
                  Когда занимаешься своим делом, деньги приходят легко, а жизнь обретает смысл.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-bold text-green-900 mb-2">
                  ШАГ 3: Снять социальную маску
                </p>
                <p className="text-sm mb-2">
                  <strong>Цель:</strong> Объяснить, что маска "{socialSimple}" — это НЕ он. 
                  Это защитная реакция, способ выживания в обществе.
                </p>
                <p className="text-sm mb-2">
                  <strong>Работаем с вопросом:</strong> "Кому я пытаюсь понравиться? Чьё одобрение мне нужно? Почему?"
                </p>
                <p className="text-sm">
                  <strong>Практики:</strong> Учиться говорить "нет", устанавливать границы, разрешить себе быть "плохим" в глазах других, 
                  экспериментировать с искренностью в безопасных условиях.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-bold text-green-900 mb-2">
                  ШАГ 4: Подключить душу и найти высший смысл
                </p>
                <p className="text-sm mb-2">
                  <strong>Цель:</strong> Активировать энергию "{spiritualSimple}" — 
                  глубинную суть, ради которой душа пришла на Землю.
                </p>
                <p className="text-sm mb-2">
                  <strong>Работаем с вопросом:</strong> "Ради чего я живу? Какой след хочу оставить в мире?"
                </p>
                <p className="text-sm">
                  <strong>Практики:</strong> Духовные практики (медитации, молитвы, работа с энергией), 
                  поиск высшего смысла в ежедневных действиях, служение людям через своё призвание.
                </p>
              </div>
            </div>
          </div>

          {/* ЗДОРОВЬЕ */}
          <div className="space-y-3 bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <Icon name="Activity" size={20} />
              💊 Здоровье: психосоматика и рекомендации
            </h3>
            <div className="space-y-3 text-gray-800 text-sm">
              <p>
                <strong>Слабые зоны организма:</strong> {healthZones}
              </p>
              <p>
                <strong>Психологические причины болезней:</strong> {healthCauses}
              </p>
              <p>
                <strong className="text-blue-900">Главная причина психосоматики:</strong> Когда человек не живёт как "{personalSimple}" 
                и не реализует "{destinySimple}", тело начинает сигнализировать болезнями. 
                Это способ подсознания сказать: "Ты идёшь не туда!"
              </p>
              <p className="bg-white p-3 rounded">
                <strong>Что делать:</strong> Параллельно с психотерапией работать с телом — 
                телесные практики, йога, дыхание, массаж. Тело хранит всю непрожитую боль.
              </p>
            </div>
          </div>

          {/* ОТНОШЕНИЯ */}
          <div className="space-y-3 bg-pink-50 p-5 rounded-lg border-l-4 border-pink-500">
            <h3 className="text-xl font-bold text-pink-900 flex items-center gap-2">
              <Icon name="Heart" size={20} />
              💕 Отношения: паттерны и кармические уроки
            </h3>
            <div className="space-y-3 text-gray-800 text-sm">
              <p>
                <strong>Стиль в любви:</strong> {relStyle}
              </p>
              <p>
                <strong>Что нужно от партнёра:</strong> {relNeeds}
              </p>
              <p>
                <strong>Что разрушает отношения:</strong> {relDestroys}
              </p>
              <p className="bg-white p-3 rounded">
                <strong className="text-pink-900">Главный урок в любви:</strong> Человек притягивает партнёров, которые либо усиливают его маску 
                ("{socialSimple}"), либо показывают его тень. 
                Пока не примет себя как "{personalSimple}", 
                отношения будут повторять один и тот же сценарий.
              </p>
              <p className="text-xs italic text-pink-800">
                Совет для специалиста: Работайте с паттернами выбора партнёров, детскими травмами, страхами быть отвергнутым.
              </p>
            </div>
          </div>

          {/* ДЕНЬГИ И КАРЬЕРА */}
          <div className="space-y-3 bg-yellow-50 p-5 rounded-lg border-l-4 border-yellow-500">
            <h3 className="text-xl font-bold text-yellow-900 flex items-center gap-2">
              <Icon name="DollarSign" size={20} />
              💰 Деньги и карьера: как разблокировать поток
            </h3>
            <div className="space-y-3 text-gray-800 text-sm">
              <p>
                <strong>Профессии для реализации души:</strong> {professions}
              </p>
              <p>
                <strong className="text-yellow-900">Почему сейчас нет денег:</strong> Человек не работает по своему предназначению ("{destinySimple}"). 
                Он занимается не тем, тратит энергию впустую, поэтому Вселенная не поддерживает его финансово.
              </p>
              <p className="bg-white p-3 rounded">
                <strong>Как разблокировать деньги:</strong> Найти работу/проект, где можно реализовать свои природные таланты. 
                Когда человек занимается своим делом, деньги приходят легко — это закон Вселенной.
              </p>
              <p className="text-xs italic text-yellow-800">
                Важно: Деньги — это энергия благодарности за то, что ты делаешь своё дело. 
                Если дело чужое — благодарности (денег) не будет.
              </p>
            </div>
          </div>

          {/* ИТОГОВОЕ РЕЗЮМЕ */}
          <div className="space-y-3 bg-gradient-to-r from-purple-100 to-pink-100 p-5 rounded-lg border-2 border-purple-300">
            <h3 className="text-xl font-bold text-purple-900 flex items-center gap-2">
              <Icon name="CheckCircle" size={20} />
              ✅ Резюме для специалиста
            </h3>
            <div className="space-y-2 text-gray-900 text-sm leading-relaxed">
              <p>
                <strong>Кто перед вами:</strong> Человек-"{personalSimple}", 
                который притворяется "{socialSimple}", 
                не реализует "{destinySimple}" 
                и потерял связь с "{spiritualSimple}".
              </p>
              <p>
                <strong>Главная проблема:</strong> Внутренний конфликт четырёх "Я", непонимание своего места в мире, 
                потеря смысла жизни.
              </p>
              <p>
                <strong>План работы:</strong> Вернуть контакт с собой → найти призвание → снять маску → подключить душу.
              </p>
              <p>
                <strong>Прогноз:</strong> При правильной работе через 6-12 месяцев человек обретёт внутреннюю целостность, 
                найдёт своё дело, выйдет на новый финансовый уровень и почувствует смысл жизни.
              </p>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Кнопки шаринга */}
      <ShareButtons name={result.name} birthDate={birthDate} />
    </div>
  );
};