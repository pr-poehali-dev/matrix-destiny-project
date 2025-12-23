import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export const ProfessionalPromoMain = () => {
  return (
    <div className="my-16">
      <Card className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white shadow-2xl border-none overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoMnYyaC0yVjMwem0tMiAwaDJ2MmgtMlYzMHptLTIgMGgydjJoLTJWMzB6bS0yIDBoMnYyaC0yVjMwem0tMiAwaDJ2MmgtMlYzMHptLTIgMGgydjJoLTJWMzB6bS0yIDBoMnYyaC0yVjMwem0tMiAwaDJ2MmgtMlYzMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <CardContent className="relative p-8 md:p-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-6 shadow-2xl">
                <Icon name="Briefcase" size={48} className="text-white" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                💼 Для Профессионалов
              </h2>
              
              <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
                <strong>Матрица Судьбы</strong> — незаменимый инструмент для HR, психологов, нутрициологов и коучей. 
                Узнайте о человеке <strong className="text-yellow-300">ВСЁ за 5 минут</strong> и помогайте клиентам быстрее и эффективнее!
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white/15 backdrop-blur-md p-6 rounded-2xl border-2 border-white/30 hover:bg-white/25 hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="text-6xl mb-4 text-center">👨‍💼</div>
                <h3 className="font-bold text-2xl mb-3 text-center text-yellow-300">HR и Рекрутеры</h3>
                <p className="text-white/95 text-center leading-relaxed">
                  <strong>Подбирайте идеальных кандидатов</strong> за 5 минут! 
                  Видите совместимость с командой, мотивацию, потенциал роста. 
                  Снижайте текучесть на <strong className="text-yellow-300">40%</strong>.
                </p>
              </div>

              <div className="bg-white/15 backdrop-blur-md p-6 rounded-2xl border-2 border-white/30 hover:bg-white/25 hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="text-6xl mb-4 text-center">🧠</div>
                <h3 className="font-bold text-2xl mb-3 text-center text-yellow-300">Психологи и Коучи</h3>
                <p className="text-white/95 text-center leading-relaxed">
                  <strong>Мгновенная диагностика</strong> глубинных блоков клиента! 
                  Первая консультация становится прорывной. 
                  Работайте с корнем проблемы, а не симптомами.
                </p>
              </div>

              <div className="bg-white/15 backdrop-blur-md p-6 rounded-2xl border-2 border-white/30 hover:bg-white/25 hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="text-6xl mb-4 text-center">🍎</div>
                <h3 className="font-bold text-2xl mb-3 text-center text-yellow-300">Нутрициологи</h3>
                <p className="text-white/95 text-center leading-relaxed">
                  <strong>Видите все слабые зоны</strong> здоровья сразу! 
                  Понимаете, почему клиент не худеет (психосоматика, блоки). 
                  Результаты в <strong className="text-yellow-300">3 раза быстрее</strong>.
                </p>
              </div>

              <div className="bg-white/15 backdrop-blur-md p-6 rounded-2xl border-2 border-white/30 hover:bg-white/25 hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="text-6xl mb-4 text-center">📈</div>
                <h3 className="font-bold text-2xl mb-3 text-center text-yellow-300">Бизнес-Коучи</h3>
                <p className="text-white/95 text-center leading-relaxed">
                  <strong>Находите зону гениальности</strong> клиента мгновенно! 
                  Видите, почему нет денег и как их привлечь. 
                  Выводите на <strong className="text-yellow-300">×10 доход</strong>.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-md p-8 rounded-2xl border-2 border-yellow-300/50 shadow-2xl">
              <h3 className="text-3xl font-bold text-center mb-6 text-yellow-300">
                ⚡ Что Даёт Матрица Профессионалам:
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 bg-white/10 p-4 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-white">✓</div>
                    <div>
                      <p className="font-semibold text-lg text-white">Глубинное понимание личности</p>
                      <p className="text-white/90 text-sm">Характер, таланты, кармические задачи, блоки — всё за 5 минут</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-white/10 p-4 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-white">✓</div>
                    <div>
                      <p className="font-semibold text-lg text-white">Точная диагностика проблем</p>
                      <p className="text-white/90 text-sm">Почему нет денег, не худеет, проблемы в отношениях — видите причину</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-white/10 p-4 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center font-bold text-white">✓</div>
                    <div>
                      <p className="font-semibold text-lg text-white">Все расчёты всегда под рукой</p>
                      <p className="text-white/90 text-sm">Открывайте во время сессии расчёты всех клиентов — всё сохраняется автоматически</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-white/10 p-4 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-white">✓</div>
                    <div>
                      <p className="font-semibold text-lg text-white">Совместимость и предсказания</p>
                      <p className="text-white/90 text-sm">Кто подойдёт в команду, какой партнёр нужен, успешность на должности</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 bg-white/10 p-4 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-white">✓</div>
                    <div>
                      <p className="font-semibold text-lg text-white">Карта здоровья</p>
                      <p className="text-white/90 text-sm">Все слабые органы, психосоматика, связь веса с эмоциями</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-white/10 p-4 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-white">✓</div>
                    <div>
                      <p className="font-semibold text-lg text-white">Финансовый потенциал</p>
                      <p className="text-white/90 text-sm">Денежное предназначение, как заработать, где найти деньги</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-white/10 p-4 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-white">✓</div>
                    <div>
                      <p className="font-semibold text-lg text-white">Конкретные рекомендации</p>
                      <p className="text-white/90 text-sm">Что делать, какая профессия, как лечиться, что есть — готовый план</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border-2 border-white/40 inline-block shadow-2xl">
                <p className="text-2xl font-bold mb-2 text-yellow-300">
                  🎯 Уже <span className="text-4xl">10,000+</span> профессионалов используют Матрицу
                </p>
                <p className="text-xl text-white/95">
                  Психологи, HR, нутрициологи, коучи экономят <strong className="text-yellow-300">часы</strong> времени на диагностике
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <p className="text-lg text-white/90 mb-4">
                💡 <strong>Это не гадание, а научный инструмент</strong> на основе нумерологии и психологии
              </p>
              <p className="text-3xl font-bold text-yellow-300 drop-shadow-lg">
                ⏱️ Всего от 200₽ — и вы видите полную картину личности клиента!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};