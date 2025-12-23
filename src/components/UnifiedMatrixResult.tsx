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

  return (
    <div className="space-y-8 mb-8">
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-indigo-900">
            🎯 Глубинный Портрет Личности
          </CardTitle>
          <p className="text-center text-indigo-700 text-lg mt-2">
            Полный анализ всех 4 энергий: кто вы, что ваше предназначение и как это проявляется
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white/70 backdrop-blur p-5 rounded-xl shadow-md">
            <h4 className="font-bold text-xl mb-4 text-purple-800 flex items-center gap-2">
              <Icon name="BarChart3" size={24} />
              📊 Сводный Анализ Всех Энергий
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <span className="font-semibold text-blue-800 flex items-center gap-2 mb-2">
                  <Icon name="User" size={18} />
                  👤 Личная Энергия
                </span>
                <p className="text-lg font-bold text-blue-900">{energyDescriptions[result.personal]?.title}</p>
                <p className="text-sm text-gray-700 mt-2">
                  {energyDescriptions[result.personal]?.description.split('\n')[0]}
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <span className="font-semibold text-purple-800 flex items-center gap-2 mb-2">
                  <Icon name="Target" size={18} />
                  🎯 Предназначение
                </span>
                <p className="text-lg font-bold text-purple-900">{energyDescriptions[result.destiny]?.title}</p>
                <p className="text-sm text-gray-700 mt-2">
                  {energyDescriptions[result.destiny]?.description.split('\n')[0]}
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <span className="font-semibold text-green-800 flex items-center gap-2 mb-2">
                  <Icon name="Users" size={18} />
                  👥 Социальная Энергия
                </span>
                <p className="text-lg font-bold text-green-900">{energyDescriptions[result.social]?.title}</p>
                <p className="text-sm text-gray-700 mt-2">
                  {energyDescriptions[result.social]?.description.split('\n')[0]}
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                <span className="font-semibold text-amber-800 flex items-center gap-2 mb-2">
                  <Icon name="Sparkles" size={18} />
                  ✨ Духовная Энергия
                </span>
                <p className="text-lg font-bold text-amber-900">{energyDescriptions[result.spiritual]?.title}</p>
                <p className="text-sm text-gray-700 mt-2">
                  {energyDescriptions[result.spiritual]?.description.split('\n')[0]}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur p-5 rounded-xl shadow-md">
            <h4 className="font-bold text-xl mb-4 text-purple-800 flex items-center gap-2">
              <Icon name="Brain" size={24} />
              🧠 Кто Этот Человек: Профессиональная Характеристика
            </h4>
            <div className="space-y-4 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <strong className="text-blue-900">Базовая природа:</strong>
                <p className="text-gray-700 mt-1">{energyDescriptions[result.personal]?.description.split('\n')[0]}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <strong className="text-purple-900">Жизненная задача:</strong>
                <p className="text-gray-700 mt-1">{energyDescriptions[result.destiny]?.description.split('\n')[0]}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <strong className="text-green-900">Как проявляется в обществе:</strong>
                <p className="text-gray-700 mt-1">{energyDescriptions[result.social]?.description.split('\n')[0]}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <strong className="text-amber-900">Внутренний мир:</strong>
                <p className="text-gray-700 mt-1">{energyDescriptions[result.spiritual]?.description.split('\n')[0]}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-5 rounded-xl shadow-md border-2 border-red-200">
              <h5 className="font-bold text-center mb-3 text-red-800 flex items-center justify-center gap-2">
                <Icon name="Heart" size={20} />
                💊 Здоровье
              </h5>
              <p className="text-xs text-gray-700">
                Ключевые зоны внимания на основе всех энергий. Работайте с чакрами связанными с арканами {result.personal}, {result.destiny}, {result.social}, {result.spiritual}. Следите за эмоциональным балансом и психосоматическими проявлениями.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-5 rounded-xl shadow-md border-2 border-pink-200">
              <h5 className="font-bold text-center mb-3 text-pink-800 flex items-center justify-center gap-2">
                <Icon name="HeartHandshake" size={20} />
                💕 Отношения
              </h5>
              <p className="text-xs text-gray-700">
                В партнёрстве проявляются все 4 энергии. Социальная ({result.social}) определяет стиль общения, духовная ({result.spiritual}) — глубину связи, личная ({result.personal}) — вашу индивидуальность в паре.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl shadow-md border-2 border-green-200">
              <h5 className="font-bold text-center mb-3 text-green-800 flex items-center justify-center gap-2">
                <Icon name="DollarSign" size={20} />
                💰 Финансы
              </h5>
              <p className="text-xs text-gray-700">
                Предназначение ({result.destiny}) показывает путь к деньгам, личная энергия ({result.personal}) — как зарабатывать, социальная ({result.social}) — как монетизировать связи.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-xl border-2 border-purple-300 shadow-lg">
            <h4 className="font-bold text-center text-xl mb-4 text-purple-900 flex items-center justify-center gap-2">
              <Icon name="Briefcase" size={24} />
              💼 Для Профессионалов: Как Использовать Эту Информацию
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/70 p-4 rounded-lg shadow">
                <p className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                  <Icon name="Users" size={18} />
                  👨‍💼 HR / Рекрутеры
                </p>
                <p className="text-gray-700">
                  Определите естественные таланты кандидата, его совместимость с командой, потенциал роста и мотивационные факторы. Матрица покажет, в какой роли человек раскроется лучше всего.
                </p>
              </div>
              
              <div className="bg-white/70 p-4 rounded-lg shadow">
                <p className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Icon name="Brain" size={18} />
                  🧠 Психологи / Коучи
                </p>
                <p className="text-gray-700">
                  Быстро поймите глубинные паттерны клиента, его блоки, кармические задачи и точки роста для работы. Матрица ускоряет диагностику в 10 раз.
                </p>
              </div>
              
              <div className="bg-white/70 p-4 rounded-lg shadow">
                <p className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <Icon name="Apple" size={18} />
                  🥗 Нутрициологи
                </p>
                <p className="text-gray-700">
                  Раздел здоровья указывает на слабые зоны организма, склонности к заболеваниям и психосоматические причины. Стройте питание с учётом энергетического типа.
                </p>
              </div>
              
              <div className="bg-white/70 p-4 rounded-lg shadow">
                <p className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                  <Icon name="TrendingUp" size={18} />
                  👔 Бизнес-консультанты
                </p>
                <p className="text-gray-700">
                  Финансовый раздел покажет, в какой сфере человек достигнет успеха и как ему лучше зарабатывать. Предназначение укажет на идеальную нишу.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedMatrixResult;
