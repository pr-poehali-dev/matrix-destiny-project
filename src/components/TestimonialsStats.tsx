import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export const TestimonialsStats = () => {
  return (
    <div className="py-12 bg-gradient-to-b from-amber-50/50 to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
            📊 Матрица Судьбы в цифрах
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Реальные результаты работы с инструментом от профессионалов
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="text-5xl mb-3">👥</div>
              <div className="text-4xl font-bold text-blue-700 mb-2">10,000+</div>
              <p className="text-sm text-gray-700 font-medium">
                Специалистов используют матрицу в работе
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="text-5xl mb-3">✅</div>
              <div className="text-4xl font-bold text-green-700 mb-2">95%</div>
              <p className="text-sm text-gray-700 font-medium">
                Точность диагностики по отзывам клиентов
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="text-5xl mb-3">⚡</div>
              <div className="text-4xl font-bold text-amber-700 mb-2">5 мин</div>
              <p className="text-sm text-gray-700 font-medium">
                Среднее время полного анализа личности
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="p-6 text-center">
              <div className="text-5xl mb-3">🚀</div>
              <div className="text-4xl font-bold text-purple-700 mb-2">×3</div>
              <p className="text-sm text-gray-700 font-medium">
                Ускорение работы с клиентом
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white border-2 border-gray-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Icon name="Users" size={32} className="text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">HR-специалисты</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Снижение текучести персонала на <strong>40-60%</strong>
                  </p>
                  <p className="text-xs text-gray-600">
                    Подбирают кандидатов с учётом матрицы, проверяют совместимость с командой и культурой компании
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-gray-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Icon name="Brain" size={32} className="text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Психологи</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Экономия <strong>5-7 сессий</strong> на диагностике
                  </p>
                  <p className="text-xs text-gray-600">
                    Сразу видят глубинные блоки, кармические задачи, страхи и защитные механизмы клиента
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-gray-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Icon name="TrendingUp" size={32} className="text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Коучи и консультанты</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Рост выручки клиентов на <strong>100-300%</strong>
                  </p>
                  <p className="text-xs text-gray-600">
                    Определяют истинное предназначение, снимают денежные блоки, выводят на новый уровень дохода
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              🏆 Присоединяйтесь к профессионалам
            </h3>
            <p className="text-lg mb-6 text-indigo-100">
              Более 10,000 психологов, HR, коучей и консультантов уже используют Матрицу Судьбы как основной инструмент диагностики. 
              Начните работать эффективнее уже сегодня!
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Icon name="CheckCircle2" size={18} />
                <span>Без обучения</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Icon name="CheckCircle2" size={18} />
                <span>Работает сразу</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Icon name="CheckCircle2" size={18} />
                <span>Результат за 5 минут</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Icon name="CheckCircle2" size={18} />
                <span>Подходит для всех ниш</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
