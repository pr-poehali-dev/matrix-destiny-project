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

      {/* НА ЧЁМ ЗАРАБАТЫВАТЬ */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="DollarSign" size={24} />
            На чём вы будете зарабатывать деньги
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="text-center py-3 bg-amber-50 rounded-lg">
            <p className="text-2xl font-bold text-amber-900">{destiny?.title}</p>
            <p className="text-sm text-gray-600">Это ваш денежный код!</p>
          </div>

          <div className="border-l-4 border-red-400 pl-4 py-2">
            <p className="font-bold text-red-900 mb-1">❌ Почему сейчас нет денег:</p>
            <p className="text-gray-700 text-sm">
              Вы работаете НЕ по предназначению {destiny?.title}. 
              Вселенная даёт деньги ТОЛЬКО за то, для чего вы пришли!
            </p>
          </div>

          <div className="border-l-4 border-green-400 pl-4 py-2">
            <p className="font-bold text-green-900 mb-1">✅ Что делать:</p>
            <ol className="text-gray-700 text-sm space-y-1 ml-4 list-decimal">
              <li>Найдите способ заработка через {destiny?.title}</li>
              <li>Начните делать это — хоть по 1 часу в день</li>
              <li>Терпение! Первые деньги через 1-3 месяца</li>
            </ol>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="font-bold text-blue-900 mb-1">💼 Конкретные профессии:</p>
            <p className="text-gray-700 text-sm">
              {destiny?.finance?.split('🎓 ПРОФЕССИИ')[1]?.split(':')[1]?.trim() || 
               destiny?.finance?.split('💸 ИСТОЧНИКИ ДОХОДА:')[1]?.split('\n\n')[0]?.trim()}
            </p>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="font-bold text-purple-900 mb-1">💸 Источники дохода:</p>
            <p className="text-gray-700 text-sm whitespace-pre-line">
              {destiny?.finance?.split('💸 ИСТОЧНИКИ ДОХОДА:')[1]?.split('\n\n')[0]?.trim()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ТАЛАНТЫ */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="Sparkles" size={24} />
            Что у вас получается легко
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          <p className="text-gray-700">
            У вас есть уникальные таланты, которых нет у других. Но вы, вероятно, их не замечаете!
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="border-l-4 border-red-400 pl-3 py-2">
              <p className="font-bold text-red-900 text-sm mb-1">👊 Ваша сила</p>
              <p className="text-gray-700 text-sm">{personal?.title} — ваш характер</p>
            </div>

            <div className="border-l-4 border-amber-400 pl-3 py-2">
              <p className="font-bold text-amber-900 text-sm mb-1">🎯 Ваша миссия</p>
              <p className="text-gray-700 text-sm">{destiny?.title} — предназначение</p>
            </div>

            <div className="border-l-4 border-blue-400 pl-3 py-2">
              <p className="font-bold text-blue-900 text-sm mb-1">🗣️ Ваше общение</p>
              <p className="text-gray-700 text-sm">{social?.title} — как вас видят</p>
            </div>

            <div className="border-l-4 border-purple-400 pl-3 py-2">
              <p className="font-bold text-purple-900 text-sm mb-1">🙏 Ваша мудрость</p>
              <p className="text-gray-700 text-sm">{spiritual?.title} — ваша душа</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ЧТО ТОРМОЗИТ */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="AlertTriangle" size={24} />
            Что вас тормозит в жизни
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          <p className="text-gray-700">
            У вас есть 4 проблемы, которые мешают быть счастливым и зарабатывать деньги.
          </p>

          <div className="space-y-3">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-bold text-red-900 mb-2">❌ Проблема #1: Вы слишком {personal?.title} (аркан {result.personal})</p>
              <p className="text-gray-700 text-sm mb-2">
                Вы застряли в своем характере и не развиваетесь дальше.
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Что это значит:</strong> {personal?.description?.split('.').slice(0, 1).join('.')}
              </p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="font-bold text-orange-900 mb-2">❌ Проблема #2: Вы НЕ делаете {destiny?.title} (аркан {result.destiny})</p>
              <p className="text-gray-700 text-sm mb-2">
                Ваше предназначение — {destiny?.title}, но вы этим не занимаетесь!
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Что это значит:</strong> {destiny?.description?.split('\n').find(line => line.includes('ГЛАВНОЕ ПРЕДНАЗНАЧЕНИЕ'))?.replace('🎯 ГЛАВНОЕ ПРЕДНАЗНАЧЕНИЕ:', '').trim() || destiny?.description?.split('.').slice(0, 2).join('.')}
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="font-bold text-yellow-900 mb-2">❌ Проблема #3: Вы носите маску {social?.title} (аркан {result.social})</p>
              <p className="text-gray-700 text-sm mb-2">
                Люди видят вас как {social?.title}, но это НЕ настоящий вы!
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Что это значит:</strong> {social?.description?.split('.').slice(0, 1).join('.')}
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="font-bold text-purple-900 mb-2">❌ Проблема #4: Нет смысла жизни — не развиваете {spiritual?.title} (аркан {result.spiritual})</p>
              <p className="text-gray-700 text-sm mb-2">
                Ваша душа — {spiritual?.title}, но вы не развиваете эту часть себя.
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Что это значит:</strong> {spiritual?.description?.split('.').slice(0, 1).join('.')}
              </p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg mt-4">
            <p className="font-bold text-green-900 mb-2">✅ Что делать — простыми словами:</p>
            <ol className="text-gray-800 text-sm space-y-2 ml-5 list-decimal">
              <li>Примите себя как {personal?.title} — это ваш характер, он не плохой</li>
              <li>Начните делать {destiny?.title} — хоть по чуть-чуть! Даже 1 час в день</li>
              <li>Снимите маску {social?.title} — перестаньте притворяться</li>
              <li>Найдите смысл через {spiritual?.title} — медитация 10 минут каждый день</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* ЗДОРОВЬЕ */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="Heart" size={24} />
            Ваше здоровье — что будет болеть
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          <p className="text-gray-700">
            У вас есть 3 зоны риска по здоровью. Эти органы болеют первыми, если вы живёте "не своей жизнью".
          </p>

          <div className="space-y-3">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-bold text-red-900 mb-2">🩺 Зона #1: Ваши слабые органы</p>
              <p className="text-gray-700 text-sm mb-2">
                Из-за вашего характера {personal?.title} у вас слабые органы.
              </p>
              <p className="text-gray-600 text-sm">{personal?.health?.split('🔴')[1]?.split('⚡')[0] || personal?.health?.split('.').slice(0, 2).join('.')}</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="font-bold text-orange-900 mb-2">⚡ Зона #2: Болезни от "не того дела"</p>
              <p className="text-gray-700 text-sm mb-2">
                Если вы НЕ занимаетесь {destiny?.title} — начнутся кармические болезни.
              </p>
              <p className="text-gray-600 text-sm">{destiny?.health?.split('🔴')[1]?.split('⚡')[0] || destiny?.health?.split('.').slice(0, 2).join('.')}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="font-bold text-purple-900 mb-2">🧘 Зона #3: Болезни от стресса</p>
              <p className="text-gray-700 text-sm mb-2">
                Когда у вас нет смысла жизни ({spiritual?.title}) — появляются болезни от нервов.
              </p>
              <p className="text-gray-600 text-sm">{spiritual?.health?.split('🔴')[1]?.split('⚡')[0] || spiritual?.health?.split('.').slice(0, 2).join('.')}</p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="font-bold text-yellow-900 mb-2">💡 Главное про здоровье:</p>
            <div className="text-gray-700 text-sm space-y-1">
              <p>1️⃣ Проверьте слабые органы — запишитесь к врачу СЕЙЧАС</p>
              <p>2️⃣ Начните делать {destiny?.title} — кармические болезни САМИ уйдут</p>
              <p>3️⃣ Найдите смысл жизни — психосоматика лечится только так</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ОТНОШЕНИЯ */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="Heart" size={24} />
            Почему у вас нет отношений
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          <p className="text-gray-700">
            Проблема в том, что вы показываете людям НЕ себя. Вы носите маску — и привлекаете не тех людей!
          </p>

          <div className="bg-red-50 p-4 rounded-lg">
            <p className="font-bold text-red-900 mb-2">❌ Проблема: Вы притворяетесь {social?.title}</p>
            <p className="text-gray-700 text-sm mb-2">
              Люди видят вас как {social?.title}. Но это МАСКА! Вы играете роль, чтобы нравиться.
            </p>
            <p className="text-gray-600 text-sm">{social?.relationships?.split('.').slice(0, 2).join('.')}.</p>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <p className="font-bold text-amber-900 mb-2">💔 А кто вы на самом деле:</p>
            <p className="text-gray-700 text-sm mb-2">
              На самом деле вы — {personal?.title}. Совсем другой человек!
            </p>
            <p className="text-gray-600 text-sm">{personal?.relationships?.split('.').slice(0, 2).join('.')}.</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-bold text-green-900 mb-2">✅ Как найти правильные отношения:</p>
            <ol className="text-gray-700 text-sm space-y-2 ml-5 list-decimal">
              <li>Снимите маску {social?.title} — будьте собой</li>
              <li>Начните делать {destiny?.title} — когда вы счастливы от дела, вы привлекательны</li>
              <li>Будьте собой с первого дня — не притворяйтесь</li>
              <li>Развивайте {spiritual?.title} — ищите смысл в себе, а не в партнёре</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* ФИНАНСЫ */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="DollarSign" size={24} />
            Почему у вас нет денег
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          <p className="text-gray-700">
            Вы работаете НЕ по предназначению! Поэтому деньги "утекают сквозь пальцы".
          </p>

          <div className="bg-red-50 p-4 rounded-lg">
            <p className="font-bold text-red-900 mb-2">❌ Вот почему сейчас нет денег:</p>
            <p className="text-gray-700 text-sm mb-2">
              Вы пытаетесь зарабатывать через {personal?.title} (ваш характер). Но это НЕ ваш денежный путь!
            </p>
            <p className="text-gray-600 text-sm">{personal?.finance?.split('.').slice(0, 2).join('.')}.</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-bold text-green-900 mb-2">✅ Вот откуда придут деньги:</p>
            <p className="text-gray-700 text-sm mb-2">
              Деньги придут ТОЛЬКО через {destiny?.title}! Это ваш ДЕНЕЖНЫЙ КОД.
            </p>
            <p className="text-gray-600 text-sm">{destiny?.finance?.split('.').slice(0, 2).join('.')}.</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-bold text-blue-900 mb-2">💼 Конкретно: На чём зарабатывать</p>
            <p className="text-gray-700 text-sm">
              {destiny?.finance?.split('🎓 ПРОФЕССИИ')[1]?.split(':')[1]?.trim() || 
               destiny?.finance?.split('💸 ИСТОЧНИКИ ДОХОДА:')[1]?.split('\n\n')[0]?.trim()}
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="font-bold text-yellow-900 mb-2">🚀 Ваш план ×10 доход:</p>
            <div className="text-gray-700 text-sm space-y-2">
              <p><strong>Неделя 1-2:</strong> Признайте: "{personal?.title} не даёт денег. Мой путь — {destiny?.title}"</p>
              <p><strong>Неделя 3-4:</strong> Выберите ОДНУ профессию из списка выше. Начните изучать</p>
              <p><strong>Месяц 2:</strong> Сделайте первую работу (бесплатно для опыта, потом за деньги)</p>
              <p><strong>Месяц 3-6:</strong> Работайте параллельно. Когда доход сравняется — увольняйтесь!</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* КОНКРЕТНЫЙ ПЛАН */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Icon name="CheckSquare" size={24} />
            Что делать прямо сейчас
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* Неделя 1 */}
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-bold text-green-900 mb-3">✅ Неделя 1 — Признайте, какой вы человек</p>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-gray-900 mb-1">📝 Шаг 1: Заведите дневник "Какой я на самом деле"</p>
                <p className="text-gray-700">По вашим расчётам вы: {personal?.title}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">🏥 Шаг 2: Проверьте здоровье</p>
                <p className="text-gray-700">Запишитесь к врачу и проверьте: {personal?.health?.split('•')[0]}</p>
              </div>
            </div>
          </div>

          {/* Неделя 2-4 */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="font-bold text-yellow-900 mb-3">💰 Неделя 2-4 — Найдите, на чём зарабатывать</p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700"><strong>Ваше денежное предназначение:</strong> {destiny?.title}</p>
              <p className="text-gray-700"><strong>Профессии для вас:</strong> {destiny?.finance?.split('🎓 ПРОФЕССИИ')[1]?.split(':')[1]?.split('.')[0]?.trim() || destiny?.finance?.split('💸 ИСТОЧНИКИ ДОХОДА:')[1]?.split('\n\n')[0]?.split('\n').slice(0, 3).join(', ')}</p>
              <p className="text-gray-700"><strong>Задание:</strong> Выпишите 10 способов заработка на {destiny?.title}</p>
            </div>
          </div>

          {/* Месяц 2 */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="font-bold text-orange-900 mb-3">🎭 Месяц 2 — Перестаньте притворяться</p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">Люди видят вас как {social?.title}, но внутри вы — {personal?.title}</p>
              <p className="text-gray-700"><strong>Задание:</strong> Признайтесь 3 людям, кто вы на самом деле</p>
            </div>
          </div>

          {/* Месяц 3 */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="font-bold text-purple-900 mb-3">🙏 Месяц 3 — Найдите смысл жизни</p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">Ваша глубинная суть — {spiritual?.title}</p>
              <p className="text-gray-700"><strong>Задание:</strong> Медитация 10 минут каждый день</p>
            </div>
          </div>

          {/* Итоговый чеклист */}
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-bold text-green-900 mb-3">✅ Чеклист на 90 дней</p>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold text-gray-900 mb-1">📝 Ежедневно:</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• Записать 3 проявления {personal?.title}</li>
                  <li>• Медитация 10 минут</li>
                  <li>• Действие по {destiny?.title}</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">🎯 Через 90 дней:</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• Доход через {destiny?.title} вырос</li>
                  <li>• Здоровье улучшилось</li>
                  <li>• Появились правильные люди</li>
                  <li>• Жизнь обрела смысл</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Финальный призыв */}
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-4 rounded-lg text-center">
            <p className="font-bold text-amber-900 text-xl mb-2">🔥 Начните прямо сейчас!</p>
            <p className="text-gray-800 text-sm">
              <strong>Шаг 1 сегодня:</strong> Возьмите лист бумаги и напишите: 
              "Я {result.name}, мой характер — {personal?.title}, моя миссия — {destiny?.title}. 
              Сегодня я делаю первый шаг: ____________"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};