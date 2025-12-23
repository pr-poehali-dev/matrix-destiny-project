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
  single: { price: 200, label: 'Разовая расшифровка', duration: null },
  month: { price: 1000, label: '1 месяц безлимит', duration: '1 месяц' },
  half_year: { price: 5000, label: '6 месяцев безлимит', duration: '6 месяцев' },
  year: { price: 10000, label: '12 месяцев безлимит', duration: '12 месяцев' },
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
        description: 'Прикрепите скриншот оплаты',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;

        try {
          await submitPayment({
            email,
            phone,
            screenshot: base64,
            filename: screenshot.name,
            plan_type: selectedPlan,
            amount: plans[selectedPlan].price,
          });

          toast({
            title: '✅ Заявка отправлена',
            description: 'Доступ активируется в течение 1-3 часов после проверки',
          });
          setTimeout(() => navigate('/'), 2000);
        } catch (error: any) {
          toast({
            title: 'Ошибка',
            description: error.message || 'Не удалось отправить заявку',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      };

      reader.readAsDataURL(screenshot);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при отправке',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const openPaymentLink = () => {
    const amount = plans[selectedPlan].price;
    const phone = '79217653401';
    const comment = `Матрица Судьбы ${plans[selectedPlan].label}`;
    
    const tinkoffUrl = `https://www.tinkoff.ru/rm/koryakovskiy.roman1/${phone}?amount=${amount}&comment=${encodeURIComponent(comment)}`;
    
    window.open(tinkoffUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-yellow-300 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="text-4xl">💳</div>
                Оплата через Т-Банк
              </CardTitle>
              <CardDescription className="text-base">
                Быстрый перевод в 1 клик через мобильное приложение
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Icon name="Package" size={20} />
                    Шаг 1: Выберите тариф
                  </h3>
                  {searchParams.get('plan') && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-blue-900">
                        ℹ️ <strong>Тариф выбран автоматически.</strong> Вы можете изменить его ниже.
                      </p>
                    </div>
                  )}
                  {(Object.keys(plans) as PlanType[]).map((plan) => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => setSelectedPlan(plan)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-300 ease-in-out text-left relative transform ${
                        selectedPlan === plan
                          ? 'border-yellow-600 bg-gradient-to-r from-yellow-100 to-yellow-50 shadow-lg ring-2 ring-yellow-300 scale-105'
                          : 'border-gray-200 bg-white hover:border-yellow-300 hover:shadow-md hover:scale-102'
                      }`}
                    >
                      {selectedPlan === plan && (
                        <div className="absolute -top-2 -right-2 bg-yellow-600 text-white rounded-full p-1">
                          <Icon name="Check" size={16} />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-semibold ${selectedPlan === plan ? 'text-yellow-900' : 'text-gray-900'}`}>
                            {plans[plan].label}
                          </p>
                          {plans[plan].duration && (
                            <p className={`text-sm ${selectedPlan === plan ? 'text-yellow-700' : 'text-gray-600'}`}>
                              Безлимитные расчёты
                            </p>
                          )}
                        </div>
                        <p className={`text-lg font-bold ${selectedPlan === plan ? 'text-yellow-700' : 'text-yellow-600'}`}>
                          {plans[plan].price} ₽
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl border-2 border-yellow-300 shadow-lg">
                  <h3 className="font-bold text-xl text-yellow-900 mb-4 flex items-center gap-2">
                    <div className="text-3xl">🚀</div>
                    Шаг 2: Оплатите перевод
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white/80 backdrop-blur p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Получатель:</p>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-lg text-gray-900">+7 921 765-34-01</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText('79217653401');
                            toast({ title: '✅ Номер скопирован' });
                          }}
                        >
                          <Icon name="Copy" size={16} />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Роман (Т-Банк)</p>
                    </div>

                    <Button
                      onClick={openPaymentLink}
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                    >
                      <Icon name="Smartphone" size={24} className="mr-2" />
                      Оплатить {plans[selectedPlan].price} ₽ через Т-Банк
                    </Button>

                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <Icon name="CheckCircle2" size={18} />
                        ✅ Автоматически откроется приложение Т-Банка
                      </h4>
                      <p className="text-sm text-green-800">
                        Нажмите кнопку выше → откроется приложение Т-Банка → проверьте сумму → подтвердите оплату → сделайте скриншот → загрузите справа
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Icon name="Info" size={18} />
                    💡 Альтернативный способ
                  </h3>
                  <p className="text-sm text-blue-800 mb-3">
                    Или переведите вручную через любой банк:
                  </p>
                  <ol className="space-y-2 text-sm text-blue-800">
                    <li className="flex gap-2">
                      <span className="font-bold">1.</span>
                      <span>Откройте приложение своего банка</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">2.</span>
                      <span>Выберите "Перевод по номеру телефона"</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">3.</span>
                      <span>Введите: <strong>+7 921 765-34-01</strong></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">4.</span>
                      <span>Сумма: <strong>{plans[selectedPlan].price} ₽</strong></span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">5.</span>
                      <span>Комментарий: ваш email</span>
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Upload" size={24} />
                Шаг 3: Подтверждение оплаты
              </CardTitle>
              <CardDescription>
                Загрузите скриншот после оплаты
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email для доступа *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    На этот email придёт доступ
                  </p>
                </div>

                <div>
                  <Label htmlFor="phone">Телефон (необязательно)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 900 123-45-67"
                  />
                </div>

                <div>
                  <Label htmlFor="screenshot">Скриншот оплаты *</Label>
                  <div className="mt-2">
                    <Input
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                      className="cursor-pointer"
                    />
                  </div>
                  {screenshot && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                      <Icon name="CheckCircle2" size={18} className="text-green-600" />
                      <p className="text-sm text-green-800">
                        Файл выбран: {screenshot.name}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Загрузите скриншот успешной оплаты из вашего банка
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <Icon name="Clock" size={18} />
                    ⏱️ Активация доступа
                  </h4>
                  <p className="text-sm text-amber-800">
                    После отправки заявка придёт админу в Telegram и в админ-панель. 
                    Доступ будет активирован в течение <strong>1-3 часов</strong> после проверки.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !screenshot || !email}
                  className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {loading ? (
                    <>
                      <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" size={20} className="mr-2" />
                      Отправить заявку
                    </>
                  )}
                </Button>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-lg border-2 border-green-300 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="CheckCircle2" size={20} className="text-green-600" />
                    <h3 className="font-semibold text-green-900">Что входит в подписку:</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="mt-0.5 flex-shrink-0" />
                      <span>Безлимитные расчёты Матрицы Судьбы</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="mt-0.5 flex-shrink-0" />
                      <span>Полные расшифровки всех 4 энергий</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="mt-0.5 flex-shrink-0" />
                      <span>Анализ здоровья, отношений, финансов</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="mt-0.5 flex-shrink-0" />
                      <span>Копирование полного отчёта</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="mt-0.5 flex-shrink-0" />
                      <span>Профессиональные рекомендации</span>
                    </li>
                  </ul>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Card className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <Icon name="Shield" size={32} className="text-purple-600" />
                <div className="text-left">
                  <h3 className="font-bold text-purple-900 mb-1">Безопасная оплата</h3>
                  <p className="text-sm text-purple-700">
                    Переводы через СБП (Система Быстрых Платежей) защищены Центробанком РФ
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
