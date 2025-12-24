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
    <Card className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-300 shadow-2xl mb-8">
      <CardHeader className="text-center space-y-4 pb-8">
        <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600">
          🎯 ПОЛНЫЙ ПОРТРЕТ ЛИЧНОСТИ
        </CardTitle>
        <p className="text-xl text-amber-900 font-semibold">
          {result.name} — Единый анализ всех 4 энергий
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* КТО ЭТОТ ЧЕЛОВЕК */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-8 rounded-2xl border-2 border-purple-400 shadow-2xl">
          <h3 className="text-3xl font-bold text-purple-900 mb-6 flex items-center gap-3">
            <Icon name="User" size={32} />
            👤 КТО ВЫ НА САМОМ ДЕЛЕ
          </h3>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-lg text-gray-800 leading-relaxed space-y-6">
            <div className="text-center bg-amber-50 p-4 rounded-lg border-2 border-amber-300">
              <p className="text-2xl font-bold text-amber-900 mb-2">{result.name}</p>
              <p className="text-gray-700">У вас внутри живут 4 разных "Я". Они часто спорят между собой — поэтому вы в замешательстве!</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <p className="font-bold text-red-900 mb-2 text-lg">🔥 ВАШЕ "Я-НАСТОЯЩИЙ" (кто вы внутри)</p>
                <p className="text-gray-800 mb-2">Вы — <strong>{personal?.title}</strong></p>
                <p className="text-sm text-gray-700">{personal?.description?.split('.').slice(0, 2).join('.')}.</p>
                <p className="text-xs text-gray-600 mt-2 italic">Это ваш настоящий характер. Не маска, не то, что от вас хотят — а то, какой вы ЕСТЬ.</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                <p className="font-bold text-green-900 mb-2 text-lg">🎯 ВАШЕ "Я-ДОЛЖЕН" (для чего вы пришли)</p>
                <p className="text-gray-800 mb-2">Ваше предназначение — <strong>{destiny?.title}</strong></p>
                <p className="text-sm text-gray-700">{destiny?.description?.split('.').slice(0, 2).join('.')}.</p>
                <p className="text-xs text-gray-600 mt-2 italic">Это не работа. Это то, БЕЗ ЧЕГО вы не будете счастливы. Пока не делаете это — будут кризисы!</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <p className="font-bold text-blue-900 mb-2 text-lg">🎭 ВАШЕ "Я-ДЛЯ-ЛЮДЕЙ" (какую маску носите)</p>
                <p className="text-gray-800 mb-2">Люди видят вас как <strong>{social?.title}</strong></p>
                <p className="text-sm text-gray-700">{social?.description?.split('.').slice(0, 2).join('.')}.</p>
                <p className="text-xs text-gray-600 mt-2 italic">Это МАСКА! Вы притворяетесь {social?.title}, чтобы нравиться. Но это выматывает — вы играете роль!</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                <p className="font-bold text-purple-900 mb-2 text-lg">✨ ВАШЕ "Я-ГЛУБИННОЕ" (смысл вашей жизни)</p>
                <p className="text-gray-800 mb-2">Ваша душа — <strong>{spiritual?.title}</strong></p>
                <p className="text-sm text-gray-700">{spiritual?.description?.split('.').slice(0, 2).join('.')}.</p>
                <p className="text-xs text-gray-600 mt-2 italic">Это ваша связь с высшим. Без этого жизнь кажется пустой, даже если есть деньги и успех.</p>
              </div>
            </div>

            <div className="mt-6 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-2 border-red-300">
              <p className="font-bold text-red-900 text-xl mb-3">⚠️ В ЧЁМ ВАША ПРОБЛЕМА:</p>
              <p className="text-gray-800 mb-3">
                Вы живёте как <strong>{personal?.title}</strong> (ваш характер), 
                люди ждут от вас <strong>{social?.title}</strong> (маска), 
                а жизнь требует <strong>{destiny?.title}</strong> (предназначение), 
                и душа тянется к <strong>{spiritual?.title}</strong> (смысл).
              </p>
              <p className="text-gray-800 font-bold">
                Все 4 "Я" СПОРЯТ между собой! Поэтому вы в замешательстве, усталости, не знаете, чего хотите.
              </p>
            </div>

            <div className="mt-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
              <p className="font-bold text-green-900 text-xl mb-3">✅ КАК РЕШИТЬ:</p>
              <ol className="text-gray-800 space-y-2 ml-6 list-decimal">
                <li>Примите <strong>{personal?.title}</strong> (ваш характер) — это ОК</li>
                <li>Начните делать <strong>{destiny?.title}</strong> (предназначение) — хоть по чуть-чуть</li>
                <li>Снимите маску <strong>{social?.title}</strong> — перестаньте притворяться</li>
                <li>Найдите смысл через <strong>{spiritual?.title}</strong> (медитация, размышления)</li>
              </ol>
              <p className="text-gray-800 mt-3 font-bold">
                Когда все 4 "Я" объединятся — вы станете ЦЕЛОСТНЫМ! Придёт энергия, деньги, смысл.
              </p>
            </div>
          </div>
        </div>

        {/* ГЛАВНОЕ ПРЕДНАЗНАЧЕНИЕ */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-8 rounded-2xl border-2 border-yellow-400 shadow-2xl">
          <h3 className="text-3xl font-bold text-yellow-900 mb-6 flex items-center gap-3">
            <Icon name="Target" size={32} />
            💰 НА ЧЁМ ВЫ БУДЕТЕ ЗАРАБАТЫВАТЬ ДЕНЬГИ
          </h3>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-lg text-gray-800 leading-relaxed space-y-6">
            <div className="bg-amber-50 p-5 rounded-lg border-2 border-amber-300 text-center">
              <p className="text-3xl font-bold text-amber-900 mb-2">{destiny?.title}</p>
              <p className="text-sm text-gray-600">Это НЕ просто профессия — это ваш ДЕНЕЖНЫЙ КОД!</p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <p className="font-bold text-red-900 mb-2 text-lg">❌ ПОЧЕМУ СЕЙЧАС НЕТ ДЕНЕГ:</p>
              <p className="text-gray-800">
                Вы, скорее всего, работаете НЕ по предназначению {destiny?.title}. 
                Вселенная даёт деньги ТОЛЬКО за то, для чего вы пришли! 
                Пока вы занимаетесь другим — деньги будут "уходить сквозь пальцы".
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <p className="font-bold text-green-900 mb-2 text-lg">✅ ЧТО ДЕЛАТЬ, ЧТОБЫ ПОЯВИЛИСЬ ДЕНЬГИ:</p>
              <ol className="text-gray-800 space-y-2 ml-6 list-decimal">
                <li><strong>Найдите способ заработка через {destiny?.title}</strong> (даже если сейчас кажется нереальным)</li>
                <li><strong>Начните делать это</strong> — хоть по 1 часу в день, хоть бесплатно первые разы</li>
                <li><strong>Терпение!</strong> Первые деньги придут через 1-3 месяца. Через год — будет в 5-10 раз больше</li>
              </ol>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <p className="font-bold text-blue-900 mb-2 text-lg">💼 КОНКРЕТНЫЕ ПРОФЕССИИ ДЛЯ ВАС:</p>
              <p className="text-gray-800 mb-2">{destiny?.career}</p>
              <p className="text-sm text-gray-600 italic">
                Выберите ОДНУ из этих профессий (которая больше нравится) и начните изучать. 
                Не обязательно менять работу сразу — начните параллельно!
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <p className="font-bold text-purple-900 mb-2 text-lg">💸 КАК БУДУТ ПРИХОДИТЬ ДЕНЬГИ:</p>
              <p className="text-gray-800">{destiny?.finance}</p>
              <p className="text-sm text-gray-600 mt-2 italic">
                Это ваш ЕСТЕСТВЕННЫЙ денежный поток. Когда вы делаете {destiny?.title} — 
                деньги идут легко, клиенты сами находят вас, всё получается!
              </p>
            </div>

            <div className="mt-4 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-400">
              <p className="font-bold text-green-900 text-xl mb-3">🚀 РЕАЛЬНЫЙ ПРИМЕР:</p>
              <p className="text-gray-800 mb-2">
                Человек с предназначением "{destiny?.title}" работал 5 лет бухгалтером за 40 000₽. 
                Постоянно не хватало денег, кредиты.
              </p>
              <p className="text-gray-800">
                Когда начал делать {destiny?.career?.split(',')[0]} (сначала бесплатно, потом за деньги) — 
                через 6 месяцев зарабатывал уже 150 000₽/месяц. Через год — 300 000₽.
              </p>
              <p className="text-sm text-green-700 font-bold mt-2">
                ✅ Деньги идут ТОЛЬКО через предназначение. Это закон вселенной!
              </p>
            </div>
          </div>
        </div>

        {/* ТАЛАНТЫ И ДАРЫ */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-8 rounded-2xl border-2 border-green-400 shadow-2xl">
          <h3 className="text-3xl font-bold text-green-900 mb-6 flex items-center gap-3">
            <Icon name="Sparkles" size={32} />
            ✨ ЧТО У ВАС ПОЛУЧАЕТСЯ ЛЕГКО
          </h3>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-lg space-y-6">
            <div className="text-center bg-green-50 p-4 rounded-lg border-2 border-green-300">
              <p className="text-lg text-gray-800">
                У вас есть <strong>уникальные таланты</strong>, которых нет у других. 
                Но вы, вероятно, их не замечаете или обесцениваете!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <p className="font-bold text-red-900 mb-2 text-lg">👊 ВАША СИЛА:</p>
                <p className="text-gray-800 mb-2">Вы — <strong>{personal?.title}</strong></p>
                <p className="text-sm text-gray-700">
                  Это значит: вам легко дается то, что связано с вашим характером {personal?.title}. 
                  Другие этого не умеют!
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                <p className="font-bold text-amber-900 mb-2 text-lg">🎯 ВАША МИССИЯ:</p>
                <p className="text-gray-800 mb-2">Ваше предназначение — <strong>{destiny?.title}</strong></p>
                <p className="text-sm text-gray-700">
                  Когда вы занимаетесь {destiny?.career?.split(',')[0]} — это получается само, 
                  без усилий. Вам это интересно и легко!
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <p className="font-bold text-blue-900 mb-2 text-lg">🗣️ ВАШЕ ОБЩЕНИЕ:</p>
                <p className="text-gray-800 mb-2">Люди видят вас как <strong>{social?.title}</strong></p>
                <p className="text-sm text-gray-700">
                  Вы умеете общаться с людьми через {social?.title}. 
                  Это поможет продавать, находить клиентов, заводить знакомства!
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                <p className="font-bold text-purple-900 mb-2 text-lg">🙏 ВАША МУДРОСТЬ:</p>
                <p className="text-gray-800 mb-2">Ваша душа — <strong>{spiritual?.title}</strong></p>
                <p className="text-sm text-gray-700">
                  У вас есть глубинное понимание жизни через {spiritual?.title}. 
                  Когда вы находите смысл — вы можете ВСЁ!
                </p>
              </div>
            </div>

            <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border-2 border-yellow-400">
              <p className="font-bold text-yellow-900 text-xl mb-3">🔥 ВАША СУПЕРСИЛА:</p>
              <p className="text-gray-800 text-lg">
                Когда вы объедините все 4 таланта:
              </p>
              <p className="text-gray-800 mt-2">
                <strong>{personal?.title}</strong> (сила) + 
                <strong> {destiny?.title}</strong> (предназначение) + 
                <strong> {social?.title}</strong> (общение) + 
                <strong> {spiritual?.title}</strong> (мудрость) = 
                <strong className="text-green-700"> ВАША УНИКАЛЬНОСТЬ!</strong>
              </p>
              <p className="text-sm text-gray-600 mt-2 italic">
                Никто другой не может быть таким же! Это только ваша комбинация.
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
              <p className="font-bold text-orange-900 mb-2 text-lg">⚠️ ПОЧЕМУ ВЫ НЕ ИСПОЛЬЗУЕТЕ СВОИ ТАЛАНТЫ:</p>
              <ul className="text-gray-800 space-y-1 ml-6 list-decimal">
                <li>Вы думаете, что это "не таланты, все так могут"</li>
                <li>Вы работаете НЕ по предназначению</li>
                <li>Окружение говорит: "Это несерьёзно, не заработаешь"</li>
                <li>Страх сделать первый шаг</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ВЫЗОВЫ И УРОКИ - ОБЪЕДИНЕННЫЕ */}
        <div className="bg-gradient-to-r from-red-100 to-pink-100 p-8 rounded-2xl border-2 border-red-400 shadow-2xl">
          <h3 className="text-3xl font-bold text-red-900 mb-6 flex items-center gap-3">
            <Icon name="AlertTriangle" size={32} />
            ⚠️ ВЫЗОВЫ И УРОКИ (что нужно преодолеть)
          </h3>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-lg">
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <p className="font-bold text-red-900 mb-2">🔴 Из Личности (Аркан {result.personal} - {personal?.title}):</p>
                <ul className="text-sm text-gray-800 space-y-1 list-disc list-inside">
                  <li>Не застревать в своем характере</li>
                  <li>Не навязывать свою волю</li>
                  <li>Здоровье: {personal?.health?.split('.')[0]}</li>
                </ul>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <p className="font-bold text-orange-900 mb-2">🟠 Из Предназначения (Аркан {result.destiny} - {destiny?.title}):</p>
                <ul className="text-sm text-gray-800 space-y-1 list-disc list-inside">
                  <li>Принять свою миссию</li>
                  <li>Не сопротивляться призванию</li>
                  <li>Кармический урок: {destiny?.health?.split('.')[0]}</li>
                </ul>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <p className="font-bold text-yellow-900 mb-2">🟡 Из Социальной роли (Аркан {result.social} - {social?.title}):</p>
                <ul className="text-sm text-gray-800 space-y-1 list-disc list-inside">
                  <li>Снять маску для общества</li>
                  <li>Жить не "на публику"</li>
                  <li>Не зависеть от чужого мнения</li>
                </ul>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <p className="font-bold text-purple-900 mb-2">🟣 Из Духовной сути (Аркан {result.spiritual} - {spiritual?.title}):</p>
                <ul className="text-sm text-gray-800 space-y-1 list-disc list-inside">
                  <li>Активировать духовность</li>
                  <li>Найти смысл жизни</li>
                  <li>Психосоматика: {spiritual?.health?.split('.')[0]}</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <p className="font-bold text-red-900 mb-2">🔥 ГЛАВНЫЙ УРОК ЖИЗНИ:</p>
              <p className="text-gray-800">
                Ваш главный вызов — объединить все 4 энергии в одну. Пока вы живете только через <strong>{personal?.title}</strong> 
                (свой характер), игнорируя <strong>{destiny?.title}</strong> (предназначение), прячась за <strong>{social?.title}</strong> 
                (маска для общества) и забывая про <strong>{spiritual?.title}</strong> (духовность) — будут кризисы, болезни, провалы. 
                <strong> Когда все 4 энергии работают вместе — вы становитесь целостным!</strong>
              </p>
            </div>
          </div>
        </div>

        {/* ЗДОРОВЬЕ */}
        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-8 rounded-2xl border-2 border-blue-400 shadow-2xl">
          <h3 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
            <Icon name="Heart" size={32} />
            ❤️ ЗДОРОВЬЕ И СЛАБЫЕ ЗОНЫ
          </h3>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-lg space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <p className="font-bold text-red-900 mb-2">🩺 Физическое здоровье (Аркан {result.personal} - {personal?.title}):</p>
              <p className="text-gray-800">{personal?.health}</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <p className="font-bold text-orange-900 mb-2">⚡ Кармическое здоровье (Аркан {result.destiny} - {destiny?.title}):</p>
              <p className="text-gray-800">{destiny?.health}</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <p className="font-bold text-purple-900 mb-2">🧘 Психосоматика (Аркан {result.spiritual} - {spiritual?.title}):</p>
              <p className="text-gray-800">{spiritual?.health}</p>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <p className="font-bold text-yellow-900 mb-2">💡 РЕКОМЕНДАЦИИ:</p>
              <p className="text-gray-800">
                Следите за зонами из Аркана {result.personal}. Кармические болезни приходят, если не реализуете {destiny?.title}. 
                Психосоматика лечится через активацию {spiritual?.title}. <strong>Здоровье — это баланс всех 4 энергий!</strong>
              </p>
            </div>
          </div>
        </div>

        {/* ОТНОШЕНИЯ */}
        <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-8 rounded-2xl border-2 border-pink-400 shadow-2xl">
          <h3 className="text-3xl font-bold text-pink-900 mb-6 flex items-center gap-3">
            <Icon name="Heart" size={32} />
            💕 ОТНОШЕНИЯ И СОВМЕСТИМОСТЬ
          </h3>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-lg space-y-4">
            <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
              <p className="font-bold text-amber-900 mb-2">🔥 В отношениях вы проявляетесь через (Аркан {result.personal} - {personal?.title}):</p>
              <p className="text-gray-800">{personal?.relationships}</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <p className="font-bold text-green-900 mb-2">🤝 В обществе вас видят как (Аркан {result.social} - {social?.title}):</p>
              <p className="text-gray-800">{social?.relationships}</p>
            </div>

            <div className="mt-4 p-4 bg-pink-50 rounded-lg border-l-4 border-pink-500">
              <p className="font-bold text-pink-900 mb-2">💝 КЛЮЧ К ГАРМОНИИ:</p>
              <p className="text-gray-800">
                В отношениях важно быть собой ({personal?.title}), не прятаться за маску ({social?.title}), 
                реализовывать свое предназначение ({destiny?.title}) и жить с духовностью ({spiritual?.title}). 
                <strong>Тогда придут правильные люди!</strong>
              </p>
            </div>
          </div>
        </div>

        {/* ФИНАНСЫ */}
        <div className="bg-gradient-to-r from-emerald-100 to-green-100 p-8 rounded-2xl border-2 border-emerald-400 shadow-2xl">
          <h3 className="text-3xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
            <Icon name="DollarSign" size={32} />
            💰 ДЕНЬГИ И ФИНАНСЫ
          </h3>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-lg space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <p className="font-bold text-red-900 mb-2">❌ Через что НЕ придут деньги (Аркан {result.personal} - {personal?.title}):</p>
              <p className="text-gray-800">{personal?.finance}</p>
              <p className="text-sm text-red-700 mt-2">Это ваш характер, но не денежный путь!</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <p className="font-bold text-green-900 mb-2">✅ Через что ПРИДУТ деньги (Аркан {result.destiny} - {destiny?.title}):</p>
              <p className="text-gray-800">{destiny?.finance}</p>
              <p className="text-sm text-green-700 mt-2">Это ваш денежный код! Деньги идут только через предназначение!</p>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <p className="font-bold text-yellow-900 mb-2">💎 ФОРМУЛА БОГАТСТВА:</p>
              <p className="text-gray-800">
                Используйте силу {personal?.title} (ваш характер) → для реализации {destiny?.title} (предназначение) → 
                продавайте через {social?.title} (ваша социальная роль) → активируйте {spiritual?.title} (убирает денежные блоки). 
                <strong>Тогда деньги потекут рекой!</strong>
              </p>
            </div>
          </div>
        </div>

        {/* КОНКРЕТНЫЙ ПЛАН ДЕЙСТВИЙ */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-8 rounded-2xl border-2 border-indigo-400 shadow-2xl">
          <h3 className="text-3xl font-bold text-indigo-900 mb-6 flex items-center gap-3">
            <Icon name="CheckSquare" size={32} />
            📋 ЧТО ДЕЛАТЬ ПРЯМО СЕЙЧАС — КОНКРЕТНЫЙ ПЛАН
          </h3>
          
          <div className="bg-white/90 p-6 rounded-xl shadow-lg space-y-6">
            {/* НЕДЕЛЯ 1 */}
            <div className="p-6 bg-green-50 rounded-xl border-2 border-green-300">
              <p className="font-bold text-green-900 text-xl mb-4">✅ НЕДЕЛЯ 1 — Признайте, какой вы человек</p>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-bold text-gray-900 mb-3 text-lg">📝 ШАГ 1: Заведите дневник "Какой я на самом деле"</p>
                  
                  <div className="mb-3">
                    <p className="text-gray-800 mb-2"><strong>По вашим расчётам вы:</strong> {personal?.title}</p>
                    <p className="text-gray-700 text-sm">Это ваш настоящий характер. Не то, что от вас хотят другие, а то, какой вы есть внутри.</p>
                  </div>
                  
                  <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-400 mb-3">
                    <p className="font-semibold text-gray-900 mb-2">ЧТО ДЕЛАТЬ:</p>
                    <p className="text-gray-800 mb-2">Каждый вечер перед сном записывайте в блокнот 3 ситуации за день, где вы были собой:</p>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4">
                      <li>• Когда вы сказали то, что думаете (даже если другим не понравилось)</li>
                      <li>• Когда вы сделали выбор по своему желанию (не как все)</li>
                      <li>• Когда вы почувствовали себя "в своей тарелке"</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    <p className="font-semibold text-gray-900 mb-1">ПРИМЕР ЗАПИСИ:</p>
                    <p className="text-sm text-gray-700 italic">"Сегодня на работе я предложил новый способ решения задачи. Все сначала не поняли, но я объяснил — и получилось! Чувствовал себя уверенно."</p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-bold text-gray-900 mb-3 text-lg">🏥 ШАГ 2: Проверьте здоровье (прямо на этой неделе!)</p>
                  
                  <div className="bg-red-50 p-3 rounded border-l-4 border-red-400 mb-3">
                    <p className="font-semibold text-gray-900 mb-2">⚠️ ВАШИ СЛАБЫЕ МЕСТА:</p>
                    <p className="text-gray-800">{personal?.health?.split('•')[0]}</p>
                    <p className="text-sm text-gray-600 mt-2">Именно эти органы у вас болеют первыми, если вы живёте "не своей жизнью".</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                    <p className="font-semibold text-gray-900 mb-2">ЧТО СДЕЛАТЬ:</p>
                    <ol className="text-sm text-gray-700 space-y-1 ml-4 list-decimal">
                      <li>Откройте приложение вашей поликлиники (или позвоните)</li>
                      <li>Запишитесь к терапевту на приём</li>
                      <li>Скажите врачу: "Я хочу проверить [назовите ваши слабые зоны выше]"</li>
                      <li>Сдайте анализы, сделайте УЗИ</li>
                    </ol>
                    <p className="text-xs text-gray-600 mt-2">💡 Не ждите, пока заболит! Сейчас можно предотвратить.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* НЕДЕЛЯ 2-4 */}
            <div className="p-6 bg-yellow-50 rounded-xl border-2 border-yellow-300">
              <p className="font-bold text-yellow-900 text-xl mb-4">💰 НЕДЕЛЯ 2-4 — Найдите, на чём зарабатывать деньги</p>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-bold text-gray-900 mb-3 text-lg">🎯 ШАГ 3: Выпишите 10 способов заработка</p>
                  
                  <div className="mb-3">
                    <p className="text-gray-800 mb-2"><strong>Ваше денежное предназначение:</strong> {destiny?.title}</p>
                    <p className="text-gray-700 text-sm mb-2">Это та сфера, где деньги будут идти к вам легко. Не через то, что вы умеете, а через то, для чего вы пришли в мир.</p>
                    <p className="text-gray-700 text-sm font-medium">Профессии для вас: {destiny?.career?.split('.')[0]}</p>
                  </div>
                  
                  <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-400 mb-3">
                    <p className="font-semibold text-gray-900 mb-2">ЧТО ДЕЛАТЬ:</p>
                    <p className="text-gray-800 mb-2">Возьмите лист бумаги и ручку. Напишите заголовок: "10 способов заработать на {destiny?.title}"</p>
                    <p className="text-gray-700 text-sm mb-2">Не думайте долго — пишите всё, что приходит в голову. Даже если кажется глупым!</p>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    <p className="font-semibold text-gray-900 mb-2">ПРИМЕРЫ (если ваше предназначение "психолог"):</p>
                    <ol className="text-sm text-gray-700 space-y-1 ml-4 list-decimal">
                      <li>Консультации 1-на-1 онлайн (за 2000₽/час)</li>
                      <li>Групповые сессии в Zoom (5 человек × 1000₽)</li>
                      <li>Телеграм-канал с платной подпиской</li>
                      <li>Курс "Как справиться со стрессом" (5000₽)</li>
                      <li>Книга или электронная брошюра (500₽)</li>
                      <li>Вебинары раз в неделю (1000₽ с человека)</li>
                      <li>Работа в школе психологом (зарплата)</li>
                      <li>Корпоративные тренинги для компаний</li>
                      <li>YouTube канал + реклама</li>
                      <li>Статьи в журналы (гонорар за текст)</li>
                    </ol>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400 mt-3">
                    <p className="font-semibold text-gray-900 mb-1">ТЕПЕРЬ ДЕЙСТВИЕ:</p>
                    <p className="text-sm text-gray-700">Выберите ОДИН способ из списка (самый простой для вас). Сделайте первый шаг сегодня:</p>
                    <ul className="text-xs text-gray-600 mt-2 ml-4">
                      <li>• Создайте аккаунт в соцсети для этого</li>
                      <li>• Напишите первый пост "Я помогаю с..."</li>
                      <li>• Скажите 5 знакомым, что начали этим заниматься</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-bold text-gray-900 mb-3 text-lg">💵 ШАГ 4: Заработайте первые 500 рублей</p>
                  
                  <div className="bg-green-50 p-3 rounded border-l-4 border-green-400 mb-3">
                    <p className="font-semibold text-gray-900 mb-2">ЗАДАЧА НА ЭТУ НЕДЕЛЮ:</p>
                    <p className="text-gray-800 mb-2">Сделайте ПЕРВУЮ продажу через своё предназначение. Хоть за 500₽!</p>
                    <p className="text-sm text-gray-700">Не за большие деньги. Просто докажите себе, что кто-то готов заплатить вам за {destiny?.title}.</p>
                  </div>
                  
                  <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-400">
                    <p className="font-semibold text-gray-900 mb-2">КАК ЭТО СДЕЛАТЬ:</p>
                    <ol className="text-sm text-gray-700 space-y-2 ml-4 list-decimal">
                      <li>Напишите пост: "Я помогаю с [ваша тема]. Первая консультация — 500₽ вместо 2000₽"</li>
                      <li>Отправьте 10 знакомым в личку: "Привет! Я начал помогать людям с [тема]. Нужна помощь?"</li>
                      <li>Когда человек согласится — созвонитесь, помогите, возьмите 500₽</li>
                    </ol>
                    <p className="text-xs text-gray-600 mt-2">💡 Важно не заработать миллион, а понять: "Я могу!"</p>
                  </div>
                </div>
              </div>
            </div>

            {/* МЕСЯЦ 2 */}
            <div className="p-6 bg-orange-50 rounded-xl border-2 border-orange-300">
              <p className="font-bold text-orange-900 text-xl mb-4">🎭 МЕСЯЦ 2 — Перестаньте притворяться</p>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-bold text-gray-900 mb-3 text-lg">😷 ШАГ 5: Признайтесь 3 людям, кто вы на самом деле</p>
                  
                  <div className="mb-3">
                    <p className="text-gray-800 mb-2"><strong>В чём проблема:</strong></p>
                    <p className="text-gray-700 text-sm mb-2">Люди видят вас как <strong>{social?.title}</strong>. Но внутри вы — <strong>{personal?.title}</strong>.</p>
                    <p className="text-gray-700 text-sm">Вы играете роль "{social?.title}", чтобы нравиться другим. Но это выматывает! Вы тратите энергию на притворство.</p>
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded border-l-4 border-red-400 mb-3">
                    <p className="font-semibold text-gray-900 mb-2">ЧТО ДЕЛАТЬ:</p>
                    <p className="text-gray-800 mb-2">Выберите 3 близких людей (друг, родственник, коллега). Скажите им правду:</p>
                    <p className="text-sm text-gray-700 italic">"Знаешь, я всё время пытаюсь быть {social?.title}, чтобы всем нравиться. Но на самом деле я — {personal?.title}. Я хочу заниматься {destiny?.career?.split('.')[0]}. Поддержишь?"</p>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    <p className="font-semibold text-gray-900 mb-2">ЧТО СЛУЧИТСЯ:</p>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4">
                      <li>✅ Кто-то поддержит: "Наконец-то ты стал собой!"</li>
                      <li>❌ Кто-то не поймёт: "Ты изменился, мне не нравится"</li>
                    </ul>
                    <p className="text-xs text-gray-600 mt-2">💡 Это нормально! Те, кто осуждает — они любили вашу маску, а не вас.</p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-bold text-gray-900 mb-3 text-lg">👥 ШАГ 6: Найдите "своих" людей</p>
                  
                  <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-400 mb-3">
                    <p className="font-semibold text-gray-900 mb-2">ЗАДАЧА:</p>
                    <p className="text-gray-800 mb-2">Найдите 3 человек, которые занимаются тем же, что и вы ({destiny?.title}), и поддерживают вас.</p>
                    <p className="text-sm text-gray-700">Без "своих" людей вы быстро сдадитесь. Окружение решает ВСЁ!</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                    <p className="font-semibold text-gray-900 mb-2">ГДЕ ИСКАТЬ:</p>
                    <ol className="text-sm text-gray-700 space-y-2 ml-4 list-decimal">
                      <li><strong>Телеграм-каналы</strong> по вашей теме (введите в поиск "{destiny?.career?.split('.')[0]}")</li>
                      <li><strong>Курсы и вебинары</strong> — там собираются такие же люди</li>
                      <li><strong>Встречи и конференции</strong> (даже онлайн) по вашей профессии</li>
                      <li><strong>Комментарии в Instagram/YouTube</strong> — пишите людям, которые тоже этим занимаются</li>
                    </ol>
                    <p className="text-xs text-gray-600 mt-2">💬 Напишите первым: "Привет! Я тоже занимаюсь [тема]. Давай общаться?"</p>
                  </div>
                </div>
              </div>
            </div>

            {/* МЕСЯЦ 3 */}
            <div className="p-6 bg-purple-50 rounded-xl border-2 border-purple-300">
              <p className="font-bold text-purple-900 text-xl mb-4">🙏 МЕСЯЦ 3 — Найдите смысл жизни</p>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-bold text-gray-900 mb-3 text-lg">🧘 ШАГ 7: Медитация 10 минут каждый день</p>
                  
                  <div className="mb-3">
                    <p className="text-gray-800 mb-2"><strong>В чём проблема:</strong></p>
                    <p className="text-gray-700 text-sm mb-2">Ваша глубинная суть — {spiritual?.title}. Но вы от неё отрезаны.</p>
                    <p className="text-gray-700 text-sm">Поэтому жизнь кажется пустой. Вы работаете, зарабатываете, но внутри — пустота. Нет смысла!</p>
                  </div>
                  
                  <div className="bg-indigo-50 p-3 rounded border-l-4 border-indigo-400 mb-3">
                    <p className="font-semibold text-gray-900 mb-2">ЧТО ДЕЛАТЬ:</p>
                    <p className="text-gray-800 mb-2">Каждый день (утром ИЛИ вечером) — 10 минут медитации.</p>
                    <p className="text-sm text-gray-700 font-medium mb-2">Инструкция для новичков:</p>
                    <ol className="text-sm text-gray-700 space-y-1 ml-4 list-decimal">
                      <li>Сядьте на стул или пол (спина прямая)</li>
                      <li>Закройте глаза</li>
                      <li>Дышите носом медленно: вдох 4 секунды, выдох 4 секунды</li>
                      <li>Про себя спросите: "В чём смысл моей жизни? Зачем я пришёл в мир?"</li>
                      <li>Не ждите ответа сразу! Просто дышите и слушайте тишину</li>
                      <li>Через 10 минут откройте глаза</li>
                    </ol>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                    <p className="font-semibold text-gray-900 mb-1">ЧТО СЛУЧИТСЯ:</p>
                    <p className="text-sm text-gray-700">Первую неделю — ничего. Будет скучно. Это нормально!</p>
                    <p className="text-sm text-gray-700 mt-1">Через 2-3 недели придут ответы. Вы вдруг поймёте, ЗАЧЕМ вам нужно {destiny?.title}. Появится смысл!</p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-bold text-gray-900 mb-3 text-lg">💸 ШАГ 8: Уберите страх денег</p>
                  
                  <div className="mb-3">
                    <p className="text-gray-800 mb-2"><strong>В чём проблема:</strong></p>
                    <p className="text-gray-700 text-sm">У вас внутри сидит страх богатства. Вы сами не знаете об этом! Но подсознание блокирует деньги.</p>
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded border-l-4 border-red-400 mb-3">
                    <p className="font-semibold text-gray-900 mb-2">УПРАЖНЕНИЕ "НАЙДИ СВОЙ БЛОК":</p>
                    <p className="text-gray-800 mb-2">Возьмите лист бумаги. Напишите вопрос:</p>
                    <p className="text-sm text-gray-700 italic mb-2">"Что ПЛОХОГО случится, если я стану богатым через {destiny?.title}?"</p>
                    <p className="text-gray-800 mb-2">Пишите первое, что приходит в голову. Не думайте!</p>
                  </div>
                  
                  <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-400 mb-3">
                    <p className="font-semibold text-gray-900 mb-2">ТИПИЧНЫЕ ОТВЕТЫ (блоки):</p>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4">
                      <li>❌ "Потеряю друзей" (они позавидуют)</li>
                      <li>❌ "Стану плохим человеком" (деньги портят)</li>
                      <li>❌ "Меня ограбят"</li>
                      <li>❌ "Богатые — злые"</li>
                      <li>❌ "Родители осудят" (у нас так не принято)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                    <p className="font-semibold text-gray-900 mb-2">ТЕПЕРЬ ОЧИСТКА:</p>
                    <p className="text-gray-800 mb-2">Для КАЖДОГО блока напишите рядом:</p>
                    <p className="text-sm text-gray-700 italic mb-2">"Это не правда, потому что..." (и объясните почему)</p>
                    <p className="text-xs text-gray-600 mt-2">Пример: "Потеряю друзей" → "Это не правда, потому что настоящие друзья радуются моему успеху. Кто уйдёт — значит, не были друзьями."</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ИТОГОВЫЙ ЧЕКЛИСТ */}
            <div className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-400">
              <p className="font-bold text-green-900 text-xl mb-4">✅ ЧЕКЛИСТ НА 90 ДНЕЙ</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-bold text-gray-900 mb-2">📝 ЕЖЕДНЕВНО:</p>
                  <ul className="text-sm text-gray-800 space-y-1">
                    <li>✅ Записать 3 проявления {personal?.title}</li>
                    <li>✅ Медитация 10 минут</li>
                    <li>✅ Действие по {destiny?.title}</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-bold text-gray-900 mb-2">📅 ЕЖЕНЕДЕЛЬНО:</p>
                  <ul className="text-sm text-gray-800 space-y-1">
                    <li>✅ Встреча с поддерживающими людьми</li>
                    <li>✅ Продажа через {destiny?.title}</li>
                    <li>✅ Работа с денежными блоками</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-bold text-gray-900 mb-2">📆 ЕЖЕМЕСЯЧНО:</p>
                  <ul className="text-sm text-gray-800 space-y-1">
                    <li>✅ Проверка здоровья (слабые зоны)</li>
                    <li>✅ Анализ дохода через {destiny?.title}</li>
                    <li>✅ Оценка: живу ли я из маски?</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-bold text-gray-900 mb-2">🎯 ЧЕРЕЗ 90 ДНЕЙ:</p>
                  <ul className="text-sm text-gray-800 space-y-1">
                    <li>✅ Доход через {destiny?.title} вырос</li>
                    <li>✅ Здоровье улучшилось</li>
                    <li>✅ Появились правильные люди</li>
                    <li>✅ Жизнь обрела смысл</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ФИНАЛЬНЫЙ ПРИЗЫВ К ДЕЙСТВИЮ */}
            <div className="p-6 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl border-2 border-amber-400">
              <p className="font-bold text-amber-900 text-2xl mb-3 text-center">🔥 НАЧНИТЕ ПРЯМО СЕЙЧАС!</p>
              <p className="text-gray-800 text-center text-lg">
                <strong>ШАГ 1 СЕГОДНЯ:</strong> Возьмите лист бумаги и напишите: "Я {result.name}, мой характер — {personal?.title}, 
                моя миссия — {destiny?.title}. Сегодня я делаю первый шаг: ____________" (впишите конкретное действие)
              </p>
              <p className="text-center text-sm text-gray-600 mt-3">
                Пока не напишете — ничего не изменится. <strong>Действие решает всё!</strong>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};