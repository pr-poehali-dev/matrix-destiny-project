import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { submitPayment } from '@/lib/api';

type PlanType = 'single' | 'month' | 'half_year' | 'year';

const plans = {
  single: { price: 300, label: 'Разовая расшифровка', duration: null },
  month: { price: 1000, label: '1 месяц безлимит', duration: '1 месяц' },
  half_year: { price: 5000, label: '6 месяцев безлимит', duration: '6 месяцев' },
  year: { price: 8000, label: '12 месяцев безлимит', duration: '12 месяцев' },
};

const Payment = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('single');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const planFromUrl = searchParams.get('plan') as PlanType | null;
    if (planFromUrl && plans[planFromUrl]) {
      setSelectedPlan(planFromUrl);
    }
    
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [searchParams]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: 'Ошибка',
        description: 'Укажите email',
        variant: 'destructive',
      });
      return;
    }

    if (!screenshot) {
      toast({
        title: 'Ошибка',
        description: 'Прикрепите скриншот или квитанцию об оплате',
        variant: 'destructive',
      });
      return;
    }

    const subject = `Заявка на оплату - ${plans[selectedPlan].label}`;
    const body = `
Здравствуйте!

Прошу активировать доступ к Матрице Судьбы.

Email: ${email}
${phone ? `Телефон: ${phone}` : ''}
Тариф: ${plans[selectedPlan].label}
Сумма: ${plans[selectedPlan].price} ₽

Скриншот оплаты прикреплён к письму.
`;

    const mailtoLink = `mailto:cabinet-psyhologa@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    toast({
      title: '✉️ Откроется почтовый клиент',
      description: 'Отправьте письмо с прикрепленным скриншотом оплаты. Доступ активируется в течение 1-3 часов',
      duration: 7000,
    });
    
    localStorage.setItem('userEmail', email);
  };

  const openPaymentLink = () => {
    const amount = plans[selectedPlan].price;
    const phone = '79217653401';
    const comment = `Матрица Судьбы ${plans[selectedPlan].label}`;
    
    const tinkoffUrl = `https://www.tinkoff.ru/rm/koryakovskiy.roman1/${phone}?amount=${amount}&comment=${encodeURIComponent(comment)}`;
    
    window.open(tinkoffUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>

        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
            💳 Оплата доступа к Матрице Судьбы
          </h1>
          <p className="text-lg text-gray-700">
            Переводите с любого банка России через СБП • QR-код для Т-Банка • Мгновенный перевод
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="border-2 border-amber-300 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="text-4xl">📱</div>
                Способ 1: По номеру телефона
              </CardTitle>
              <CardDescription className="text-base font-semibold text-amber-900">
                ✅ С ЛЮБОГО банка (Сбер, Альфа, ВТБ и тд.) через СБП
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="bg-white/80 backdrop-blur p-5 rounded-lg border-2 border-amber-200">
                <p className="text-sm text-gray-600 mb-2">Получатель (Т-Банк):</p>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-2xl text-amber-900">+7 921 765-34-01</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText('+79217653401');
                      toast({ title: '✅ Номер скопирован' });
                    }}
                  >
                    <Icon name="Copy" size={16} />
                  </Button>
                </div>
                <p className="text-xs text-green-700 font-semibold bg-green-50 p-2 rounded border border-green-300">
                  💡 СБП работает между всеми российскими банками мгновенно!
                </p>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 p-5 rounded-lg">
                <p className="text-sm text-amber-900 font-bold mb-3 flex items-center gap-2">
                  <Icon name="Smartphone" size={16} />
                  📲 Как оплатить:
                </p>
                <ol className="text-sm text-amber-900 space-y-2 list-decimal ml-4">
                  <li>Откройте ваше банковское приложение</li>
                  <li>Выберите <strong>"Переводы"</strong> → <strong>"По номеру телефона"</strong></li>
                  <li>Введите номер: <strong>+7 921 765-34-01</strong></li>
                  <li>Укажите сумму: <strong className="text-amber-700">{plans[selectedPlan].price} ₽</strong></li>
                  <li>Подтвердите перевод через СБП</li>
                  <li className="font-bold text-green-700">Сделайте скриншот подтверждения!</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-300 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="text-4xl">📷</div>
                Способ 2: QR-код
              </CardTitle>
              <CardDescription className="text-base font-semibold text-yellow-900">
                ✅ Только для Т-Банка (быстрая оплата)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="bg-white/80 backdrop-blur p-5 rounded-lg border-2 border-yellow-200 text-center">
                <p className="text-sm text-gray-700 mb-3 font-semibold">Отсканируйте QR-код в приложении Т-Банка:</p>
                <div className="flex justify-center mb-3">
                  <img 
                    src="https://cdn.poehali.dev/files/1000038229.jpg"
                    alt="QR-код для оплаты Т-Банк СБП"
                    className="w-72 h-72 object-contain border-4 border-yellow-400 rounded-xl shadow-2xl bg-white p-4"
                  />
                </div>
                <p className="text-sm text-gray-700 font-semibold">
                  📱 Получатель: <strong className="text-yellow-800">+7 921 765-34-01</strong>
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Укажите сумму: <strong className="text-yellow-700">{plans[selectedPlan].price} ₽</strong>
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 p-5 rounded-lg">
                <p className="text-sm text-yellow-900 font-bold mb-3 flex items-center gap-2">
                  <Icon name="Camera" size={16} />
                  📸 Как оплатить QR-кодом:
                </p>
                <ol className="text-sm text-yellow-900 space-y-2 list-decimal ml-4">
                  <li>Откройте приложение <strong>Т-Банк</strong></li>
                  <li>Нажмите на значок <strong>"QR-код"</strong> сверху</li>
                  <li>Наведите камеру на QR-код выше</li>
                  <li>Подтвердите сумму: <strong className="text-yellow-700">{plans[selectedPlan].price} ₽</strong></li>
                  <li>Оплатите перевод</li>
                  <li className="font-bold text-green-700">Сделайте скриншот подтверждения!</li>
                </ol>
                <p className="text-xs text-yellow-800 mt-3 bg-white/60 p-2 rounded">
                  💡 QR-код работает только в Т-Банке. Если у вас другой банк — используйте "По номеру телефона"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-purple-300 shadow-2xl mb-6">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="text-4xl">📦</div>
              Шаг 1: Выберите тариф
            </CardTitle>
            <CardDescription className="text-base">
              Выберите подходящий план подписки
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {searchParams.get('plan') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-900">
                  ℹ️ <strong>Тариф выбран автоматически.</strong> Вы можете изменить его ниже.
                </p>
              </div>
            )}
            <div className="grid md:grid-cols-4 gap-4">
              {(Object.keys(plans) as PlanType[]).map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 text-center relative ${
                    selectedPlan === plan
                      ? 'border-purple-600 bg-gradient-to-br from-purple-100 to-indigo-100 shadow-xl ring-2 ring-purple-300 scale-105'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  {selectedPlan === plan && (
                    <div className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full p-1">
                      <Icon name="Check" size={16} />
                    </div>
                  )}
                  <p className={`font-bold text-lg mb-1 ${selectedPlan === plan ? 'text-purple-900' : 'text-gray-900'}`}>
                    {plans[plan].label}
                  </p>
                  {plans[plan].duration && (
                    <p className={`text-xs mb-2 ${selectedPlan === plan ? 'text-purple-700' : 'text-gray-600'}`}>
                      Безлимит
                    </p>
                  )}
                  <p className={`text-2xl font-bold ${selectedPlan === plan ? 'text-purple-700' : 'text-purple-600'}`}>
                    {plans[plan].price} ₽
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl border-2 border-green-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="text-4xl">📤</div>
              Шаг 2: Подтверждение оплаты
            </CardTitle>
            <CardDescription className="text-base">
              Загрузите скриншот или квитанцию о переводе
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold">Email для доступа *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-lg"
                />
                <p className="text-xs text-gray-600">
                  На этот email активируется доступ
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-semibold">Телефон (необязательно)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 900 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="screenshot" className="text-base font-semibold">
                  Скриншот или квитанция об оплате *
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors bg-gradient-to-br from-green-50 to-emerald-50">
                  <input
                    id="screenshot"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                  <label htmlFor="screenshot" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <Icon name="Upload" size={40} className="text-green-600" />
                      {screenshot ? (
                        <div className="space-y-2">
                          <p className="font-semibold text-green-700 flex items-center gap-2">
                            <Icon name="CheckCircle2" size={20} />
                            Файл выбран: {screenshot.name}
                          </p>
                          <p className="text-xs text-gray-600">Нажмите, чтобы выбрать другой файл</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="font-semibold text-gray-700">
                            📸 Нажмите, чтобы выбрать файл
                          </p>
                          <p className="text-sm text-gray-600">
                            Скриншот перевода или квитанция из банка
                          </p>
                          <p className="text-xs text-gray-500">
                            Форматы: JPG, PNG, PDF
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-semibold mb-2 flex items-center gap-2">
                  <Icon name="Info" size={16} />
                  💡 Что загружать:
                </p>
                <ul className="text-sm text-blue-900 space-y-1 list-disc ml-5">
                  <li><strong>Скриншот</strong> экрана с подтверждением перевода из вашего банка</li>
                  <li><strong>Квитанцию</strong> об оплате (если банк создаёт документ)</li>
                  <li>На скриншоте должна быть видна <strong>сумма {plans[selectedPlan].price} ₽</strong> и номер <strong>+7 921 765-34-01</strong></li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all text-lg py-6"
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={20} className="mr-2" />
                    Отправить подтверждение
                  </>
                )}
              </Button>

              <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                <p className="text-sm text-green-900 font-semibold mb-2 flex items-center gap-2">
                  <Icon name="CheckCircle2" size={16} />
                  ⏱️ Активация доступа:
                </p>
                <ul className="text-sm text-green-900 space-y-1 list-disc ml-5">
                  <li>Проверка платежа: до 1-3 часов</li>
                  <li>В рабочее время (9:00-21:00 МСК): обычно 15-30 минут</li>
                  <li>Доступ активируется автоматически на ваш email</li>
                </ul>
                <p className="text-xs text-green-800 mt-3 bg-white/60 p-2 rounded">
                  💡 Переводы через СБП проходят мгновенно между всеми банками России
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;