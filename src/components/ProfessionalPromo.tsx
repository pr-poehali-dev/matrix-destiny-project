import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export const ProfessionalPromo = () => {
  return (
    <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-2xl mb-8">
      <CardContent className="p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          🎯 Матрица Судьбы — Универсальный Инструмент для Профессионалов
        </h2>
        <p className="text-lg text-center mb-8 text-purple-100">
          Узнайте о человеке ВСЁ за 5 минут: характер, таланты, здоровье, отношения, деньги, предназначение
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-all">
            <div className="text-5xl mb-4 text-center">👨‍💼</div>
            <h3 className="font-bold text-xl mb-3 text-center">HR и Рекрутеры</h3>
            <p className="text-sm text-purple-100">
              Подбирайте идеальных кандидатов, оценивайте совместимость команды, предсказывайте успешность в должности. Снижайте текучесть кадров на 40%.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-all">
            <div className="text-5xl mb-4 text-center">🧠</div>
            <h3 className="font-bold text-xl mb-3 text-center">Психологи и Коучи</h3>
            <p className="text-sm text-purple-100">
              Мгновенно определяйте блоки клиента, кармические задачи, сильные стороны и точки роста для терапии. Первая консультация становится прорывной.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-all">
            <div className="text-5xl mb-4 text-center">🥗</div>
            <h3 className="font-bold text-xl mb-3 text-center">Нутрициологи</h3>
            <p className="text-sm text-purple-100">
              Выявляйте слабые органы, склонности к болезням, психосоматические причины проблем со здоровьем. Составляйте персонализированные планы питания.
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl mb-8">
          <h3 className="font-bold text-2xl mb-4 text-center">✨ Что даёт Матрица Судьбы в вашей работе:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold mb-1">Глубинное понимание человека</p>
                <p className="text-purple-100">Его истинная природа, таланты, блоки, кармические задачи — всё на основе даты рождения</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold mb-1">Точная диагностика</p>
                <p className="text-purple-100">По 4 аспектам: личность, предназначение, социум, духовность. Полная картина за минуты</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold mb-1">Все расчёты сохраняются автоматически</p>
                <p className="text-purple-100">Открывайте во время сессии или приёма — все матрицы клиентов всегда под рукой</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold mb-1">Прогноз совместимости</p>
                <p className="text-purple-100">В команде, в паре, в бизнесе. Предотвращайте конфликты до их возникновения</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold mb-1">Карта здоровья</p>
                <p className="text-purple-100">Слабые органы, психосоматика, зоны риска. Превентивный подход к лечению</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold mb-1">Финансовый потенциал</p>
                <p className="text-purple-100">Как человеку лучше зарабатывать и в какой сфере. Раскрывайте денежный код</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold mb-1">Сильные и слабые стороны</p>
                <p className="text-purple-100">Что развивать, что компенсировать. Персональная стратегия роста</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-white/20 to-white/10 p-6 rounded-xl border-2 border-white/30">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Icon name="Sparkles" size={28} />
              <p className="text-xl md:text-2xl font-bold">
                Матрица Судьбы — это не гадание, а точный инструмент анализа личности
              </p>
              <Icon name="Sparkles" size={28} />
            </div>
            <p className="text-purple-100 text-lg">
              Используется ведущими HR-специалистами, психологами, коучами и консультантами по всему миру
            </p>
            <div className="pt-4">
              <p className="text-2xl font-bold mb-2">🚀 Преимущества для вашей практики:</p>
              <div className="grid md:grid-cols-3 gap-4 mt-4 text-sm">
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="font-bold mb-1">⚡ Экономия времени</p>
                  <p className="text-purple-100">Анализ за 5 минут vs 3-5 сессий</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="font-bold mb-1">🎯 Точность 95%+</p>
                  <p className="text-purple-100">Проверено тысячами кейсов</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="font-bold mb-1">💎 Конкурентное преимущество</p>
                  <p className="text-purple-100">Уникальный подход в работе</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalPromo;