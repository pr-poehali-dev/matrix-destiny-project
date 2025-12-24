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
          {result.name} — Кто вы, что делать, как жить
        </p>
        <p className="text-base text-gray-700 max-w-3xl mx-auto">
          Единый анализ всех 4 энергий: характер, предназначение, здоровье, отношения, деньги, профессии. 
          Для психологов, HR, нутрициологов, коучей — всё о человеке в одном месте.
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* ГЛАВНОЕ: КТО ЭТОТ ЧЕЛОВЕК */}
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-6 rounded-2xl border-2 border-amber-300 shadow-xl">
          <h3 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-3">
            <Icon name="User" size={28} />
            👤 КТО ЭТОТ ЧЕЛОВЕК
          </h3>
          
          <div className="space-y-4 text-base leading-relaxed">
            <div className="bg-white/80 p-5 rounded-xl shadow-md">
              <p className="text-gray-800">
                <strong className="text-amber-900 text-lg">Личная энергия ({result.personal} - {personal?.title}):</strong><br/>
                {personal?.description}
              </p>
            </div>

            <div className="bg-white/80 p-5 rounded-xl shadow-md">
              <p className="text-gray-800">
                <strong className="text-amber-900 text-lg">Предназначение ({result.destiny} - {destiny?.title}):</strong><br/>
                {destiny?.description}
              </p>
            </div>

            <div className="bg-white/80 p-5 rounded-xl shadow-md">
              <p className="text-gray-800">
                <strong className="text-green-900 text-lg">Социальная энергия ({result.social} - {social?.title}):</strong><br/>
                {social?.description}
              </p>
            </div>

            <div className="bg-white/80 p-5 rounded-xl shadow-md">
              <p className="text-gray-800">
                <strong className="text-amber-900 text-lg">Духовная энергия ({result.spiritual} - {spiritual?.title}):</strong><br/>
                {spiritual?.description}
              </p>
            </div>
          </div>
        </div>

        {/* ЗДОРОВЬЕ И ПИТАНИЕ */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border-2 border-red-300 shadow-xl">
          <h3 className="text-2xl font-bold text-red-900 mb-4 flex items-center gap-3">
            <Icon name="Heart" size={28} />
            💊 ЗДОРОВЬЕ И ПИТАНИЕ
          </h3>
          
          <div className="space-y-4 text-base leading-relaxed">
            <div className="bg-white/80 p-5 rounded-xl shadow-md">
              <p className="text-red-800 font-semibold mb-2">🔴 Личная энергия — базовое здоровье:</p>
              <p className="text-gray-800 whitespace-pre-line">{personal?.health}</p>
            </div>

            <div className="bg-white/80 p-5 rounded-xl shadow-md">
              <p className="text-purple-800 font-semibold mb-2">🟣 Предназначение — кармические болезни:</p>
              <p className="text-gray-800 whitespace-pre-line">{destiny?.health}</p>
            </div>

            <div className="bg-white/80 p-5 rounded-xl shadow-md">
              <p className="text-green-800 font-semibold mb-2">🟢 Социальное — стресс и общество:</p>
              <p className="text-gray-800 whitespace-pre-line">{social?.health}</p>
            </div>

            <div className="bg-white/80 p-5 rounded-xl shadow-md">
              <p className="text-amber-800 font-semibold mb-2">🟡 Духовное — психосоматика:</p>
              <p className="text-gray-800 whitespace-pre-line">{spiritual?.health}</p>
            </div>

            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-5 rounded-xl border-2 border-orange-300">
              <p className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                <Icon name="UtensilsCrossed" size={20} />
                🍎 ДЛЯ НУТРИЦИОЛОГА — ЧТО НЕЛЬЗЯ ЕСТЬ И ПОЧЕМУ НЕ ХУДЕЕТ:
              </p>
              <ul className="space-y-2 text-gray-800 text-sm">
                <li>• <strong>Аркан {result.personal}:</strong> Проблемы с {personal?.health?.includes('пищеварени') ? 'пищеварением' : personal?.health?.includes('печен') ? 'печенью' : personal?.health?.includes('желудк') ? 'желудком' : 'обменом веществ'}. Исключить тяжелую пищу, следить за режимом.</li>
                <li>• <strong>Аркан {result.destiny}:</strong> Кармические блоки мешают похудению. Работать с эмоциями и стрессом — они блокируют метаболизм.</li>
                <li>• <strong>Аркан {result.social}:</strong> Стресс от общения ведет к заеданию. Убрать сахар и быстрые углеводы.</li>
                <li>• <strong>Аркан {result.spiritual}:</strong> Психосоматика — вес как защита. Нужна работа с психологом + правильное питание.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ОТНОШЕНИЯ И ЛЮБОВЬ */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-2xl border-2 border-pink-300 shadow-xl">
          <h3 className="text-2xl font-bold text-pink-900 mb-4 flex items-center gap-3">
            <Icon name="HeartHandshake" size={28} />
            💕 ОТНОШЕНИЯ И ЛЮБОВЬ
          </h3>
          
          <div className="space-y-4 text-base leading-relaxed">
            <div className="bg-white/80 p-5 rounded-xl shadow-md">
              <p className="text-blue-800 font-semibold mb-2">💙 Личная энергия — как вы в отношениях:</p>
              <p className="text-gray-800 whitespace-pre-line">{personal?.relationships}</p>
            </div>

            <div className="bg-white/80 p-5 rounded-xl shadow-md">
              <p className="text-purple-800 font-semibold mb-2">💜 Предназначение — партнёр для реализации:</p>
              <p className="text-gray-800 whitespace-pre-line">{destiny?.relationships}</p>
            </div>

            <div className="bg-white/80 p-5 rounded-xl shadow-md">
              <p className="text-green-800 font-semibold mb-2">💚 Социальное — что видят другие:</p>
              <p className="text-gray-800 whitespace-pre-line">{social?.relationships}</p>
            </div>

            <div className="bg-white/80 p-5 rounded-xl shadow-md">
              <p className="text-amber-800 font-semibold mb-2">🧡 Духовное — глубина связи:</p>
              <p className="text-gray-800 whitespace-pre-line">{spiritual?.relationships}</p>
            </div>
          </div>
        </div>

        {/* ДЕНЬГИ И ПРОФЕССИЯ */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-300 shadow-xl">
          <h3 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-3">
            <Icon name="DollarSign" size={28} />
            💰 ДЕНЬГИ И ПРОФЕССИЯ — ПОЧЕМУ НЕТ ДЕНЕГ
          </h3>
          
          <div className="space-y-4 text-base leading-relaxed">
            <div className="bg-white/80 p-5 rounded-xl shadow-md">
              <p className="text-blue-800 font-semibold mb-2">💵 Личная энергия — как зарабатывать:</p>
              <p className="text-gray-800 whitespace-pre-line">{personal?.finance}</p>
            </div>

            <div className="bg-white/80 p-5 rounded-xl shadow-md">
              <p className="text-purple-800 font-semibold mb-2">💸 Предназначение — где найти деньги:</p>
              <p className="text-gray-800 whitespace-pre-line">{destiny?.finance}</p>
            </div>

            <div className="bg-white/80 p-5 rounded-xl shadow-md">
              <p className="text-green-800 font-semibold mb-2">💲 Социальное — монетизация связей:</p>
              <p className="text-gray-800 whitespace-pre-line">{social?.finance}</p>
            </div>

            <div className="bg-white/80 p-5 rounded-xl shadow-md">
              <p className="text-amber-800 font-semibold mb-2">💴 Духовное — внутренние блоки:</p>
              <p className="text-gray-800 whitespace-pre-line">{spiritual?.finance}</p>
            </div>

            <div className="bg-gradient-to-r from-yellow-100 to-green-100 p-5 rounded-xl border-2 border-yellow-300">
              <p className="font-bold text-green-900 mb-3 flex items-center gap-2">
                <Icon name="Briefcase" size={20} />
                💼 ДЛЯ HR И КОУЧЕЙ — КАКАЯ ВАКАНСИЯ ПОДХОДИТ:
              </p>
              <ul className="space-y-2 text-gray-800 text-sm">
                <li>• <strong>Аркан {result.destiny} ({destiny?.title}):</strong> Это его жизненное призвание — здесь он будет успешен и счастлив</li>
                <li>• <strong>Аркан {result.personal} ({personal?.title}):</strong> Его естественные таланты — что получается легко</li>
                <li>• <strong>Аркан {result.social} ({social?.title}):</strong> Как он работает в команде, его социальная роль</li>
                <li>• <strong>Аркан {result.spiritual} ({spiritual?.title}):</strong> Внутренняя мотивация — что его вдохновляет работать</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ДЛЯ ПРОФЕССИОНАЛОВ */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-2xl border-2 border-purple-300 shadow-xl">
          <h3 className="text-2xl font-bold text-purple-900 mb-4 flex items-center gap-3 justify-center">
            <Icon name="Briefcase" size={28} />
            💼 КАК ИСПОЛЬЗОВАТЬ ЭТУ ИНФОРМАЦИЮ
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/90 p-5 rounded-xl shadow-lg">
              <p className="font-bold text-purple-900 mb-3 flex items-center gap-2 text-lg">
                <Icon name="Users" size={20} />
                👨‍💼 ДЛЯ HR / РЕКРУТЕРОВ:
              </p>
              <ul className="space-y-2 text-gray-800 text-sm">
                <li>✅ Аркан предназначения ({result.destiny}) — в какой роли человек раскроется максимально</li>
                <li>✅ Социальный аркан ({result.social}) — как впишется в команду, стиль общения</li>
                <li>✅ Личный аркан ({result.personal}) — его сильные стороны и таланты</li>
                <li>✅ Духовный аркан ({result.spiritual}) — внутренняя мотивация, что его вдохновляет</li>
                <li>⚠️ Если вакансия НЕ совпадает с арканом предназначения — человек выгорит через 1-2 года</li>
              </ul>
            </div>

            <div className="bg-white/90 p-5 rounded-xl shadow-lg">
              <p className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-lg">
                <Icon name="Brain" size={20} />
                🧠 ДЛЯ ПСИХОЛОГОВ:
              </p>
              <ul className="space-y-2 text-gray-800 text-sm">
                <li>✅ Видите ВСЕ блоки клиента сразу — в отношениях, деньгах, здоровье, предназначении</li>
                <li>✅ Понимаете, откуда идут проблемы (кармические, социальные, психосоматические)</li>
                <li>✅ Можете сразу работать с корнем проблемы, а не симптомами</li>
                <li>✅ Первая консультация становится прорывной — клиент видит полную картину</li>
                <li>⚠️ Аркан {result.destiny} — его кармическая задача, не решив которую он будет страдать</li>
              </ul>
            </div>

            <div className="bg-white/90 p-5 rounded-xl shadow-lg">
              <p className="font-bold text-orange-900 mb-3 flex items-center gap-2 text-lg">
                <Icon name="Apple" size={20} />
                🍎 ДЛЯ НУТРИЦИОЛОГОВ:
              </p>
              <ul className="space-y-2 text-gray-800 text-sm">
                <li>✅ Видите все проблемные зоны здоровья по 4 арканам</li>
                <li>✅ Понимаете, почему человек не худеет (психосоматика, кармические блоки, стресс)</li>
                <li>✅ Знаете, какие органы слабые — на что делать акцент в питании</li>
                <li>✅ Видите связь веса с эмоциями — если не убрать психологические блоки, диета не поможет</li>
                <li>⚠️ Часто вес — это защита (аркан {result.spiritual}). Нужна работа с психологом + питание</li>
              </ul>
            </div>

            <div className="bg-white/90 p-5 rounded-xl shadow-lg">
              <p className="font-bold text-green-900 mb-3 flex items-center gap-2 text-lg">
                <Icon name="TrendingUp" size={20} />
                📈 ДЛЯ КОУЧЕЙ:
              </p>
              <ul className="space-y-2 text-gray-800 text-sm">
                <li>✅ Мгновенно видите, в чем проблемы клиента (деньги, отношения, призвание)</li>
                <li>✅ Знаете, что его блокирует от успеха (страхи, кармические долги, неверная профессия)</li>
                <li>✅ Понимаете его зону гениальности — где он станет №1</li>
                <li>✅ Видите, почему нет денег и как их привлечь (аркан предназначения = денежный поток)</li>
                <li>⚠️ Если клиент работает НЕ по предназначению ({result.destiny}) — деньги будут уходить</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ИТОГОВЫЕ РЕКОМЕНДАЦИИ */}
        <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-6 rounded-2xl border-2 border-indigo-400 shadow-xl">
          <h3 className="text-2xl font-bold text-center text-indigo-900 mb-4 flex items-center justify-center gap-3">
            <Icon name="Lightbulb" size={28} />
            💡 ЧТО ДЕЛАТЬ — ИТОГОВЫЕ РЕКОМЕНДАЦИИ
          </h3>

          <div className="space-y-4 text-base">
            <div className="bg-white/90 p-5 rounded-xl shadow-md">
              <p className="font-bold text-indigo-900 mb-2">1️⃣ НАЙДИТЕ СВОЁ ПРЕДНАЗНАЧЕНИЕ:</p>
              <p className="text-gray-800">
                Ваш аркан предназначения — <strong>{result.destiny} ({destiny?.title})</strong>. 
                Это ваша жизненная миссия. Если вы работаете не в этой сфере — вы несчастны и денег нет. 
                Перечитайте раздел "Предназначение — где найти деньги" выше. Найдите работу/бизнес в этой области.
              </p>
            </div>

            <div className="bg-white/90 p-5 rounded-xl shadow-md">
              <p className="font-bold text-red-900 mb-2">2️⃣ ЗАЙМИТЕСЬ ЗДОРОВЬЕМ ПРЯМО СЕЙЧАС:</p>
              <p className="text-gray-800">
                У вас 4 аркана = 4 зоны риска в здоровье. Прочитайте все 4 раздела "Здоровье" выше. 
                Обратитесь к врачу, если есть симптомы. Найдите нутрициолога, который знает матрицу — 
                он составит питание с учетом ваших слабых зон.
              </p>
            </div>

            <div className="bg-white/90 p-5 rounded-xl shadow-md">
              <p className="font-bold text-pink-900 mb-2">3️⃣ НАЛАДЬТЕ ОТНОШЕНИЯ:</p>
              <p className="text-gray-800">
                Перечитайте все 4 раздела "Отношения" выше. Вы поймете, почему у вас сложности в любви. 
                Работайте с психологом или коучем — покажите ему эту матрицу. Он увидит ваши блоки и поможет.
              </p>
            </div>

            <div className="bg-white/90 p-5 rounded-xl shadow-md">
              <p className="font-bold text-green-900 mb-2">4️⃣ ПРИВЛЕКИТЕ ДЕНЬГИ:</p>
              <p className="text-gray-800">
                Деньги идут только через предназначение (аркан {result.destiny}). Если вы работаете не там — 
                денег не будет, сколько бы вы ни старались. Перечитайте раздел "Деньги и профессия" выше. 
                Найдите коуча, покажите ему эту матрицу — он поможет найти вашу денежную нишу.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};