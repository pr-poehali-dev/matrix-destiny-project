import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useNavigate, useSearchParams } from 'react-router-dom';

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

        const response = await fetch('/api/payment/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            phone,
            screenshot: base64,
            filename: screenshot.name,
            plan_type: selectedPlan,
            amount: plans[selectedPlan].price,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast({
            title: '✅ Заявка отправлена',
            description: 'Доступ активируется автоматически в течение 1-3 часов после проверки',
          });
          setTimeout(() => navigate('/'), 2000);
        } else {
          toast({
            title: 'Ошибка',
            description: data.error || 'Не удалось отправить заявку',
            variant: 'destructive',
          });
        }
      };

      reader.readAsDataURL(screenshot);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при отправке',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="CreditCard" size={24} />
                Оплата через СБП
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border-2 border-purple-200 text-center">
                  <img
                    src="https://cdn.poehali.dev/files/1000038229.jpg"
                    alt="QR-код для оплаты"
                    className="w-full max-w-xs mx-auto"
                  />
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">📋 Инструкция:</h3>
                  <ol className="space-y-2 text-sm text-purple-800">
                    <li className="flex gap-2">
                      <span className="font-bold">1.</span>
                      <span>Выберите тариф ниже</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">2.</span>
                      <span>Откройте банк → Отсканируйте QR-код</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">3.</span>
                      <span>Введите сумму согласно тарифу и оплатите</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">4.</span>
                      <span>Сделайте скриншот оплаты</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">5.</span>
                      <span>Заполните форму справа и прикрепите скриншот</span>
                    </li>
                  </ol>
                </div>

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
                          ? 'border-purple-600 bg-gradient-to-r from-purple-100 to-purple-50 shadow-lg ring-2 ring-purple-300 scale-105'
                          : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md hover:scale-102'
                      }`}
                    >
                      {selectedPlan === plan && (
                        <div className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full p-1">
                          <Icon name="Check" size={16} />
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-semibold ${selectedPlan === plan ? 'text-purple-900' : 'text-gray-900'}`}>
                            {plans[plan].label}
                          </p>
                          {plans[plan].duration && (
                            <p className={`text-sm ${selectedPlan === plan ? 'text-purple-700' : 'text-gray-600'}`}>
                              Безлимитные расчёты
                            </p>
                          )}
                        </div>
                        <p className={`text-lg font-bold ${selectedPlan === plan ? 'text-purple-700' : 'text-purple-600'}`}>
                          {plans[plan].price} ₽
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-lg border-2 border-green-300 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="CheckCircle2" size={20} className="text-green-600" />
                    <p className="text-green-800 text-sm font-bold">
                      Выбрано: {plans[selectedPlan].label}
                    </p>
                  </div>
                  <div className="bg-white rounded-md p-3 mb-2 border border-green-200">
                    <p className="text-green-700 text-xs mb-1">Итоговая сумма к оплате:</p>
                    <p className="text-green-900 text-2xl font-bold">
                      {plans[selectedPlan].price} ₽
                    </p>
                  </div>
                  <p className="text-green-700 text-xs flex items-center gap-2">
                    <Icon name="QrCode" size={14} />
                    Отсканируйте QR-код выше и оплатите эту сумму
                  </p>
                  {selectedPlan !== 'single' && (
                    <div className="mt-3 pt-3 border-t border-green-300">
                      <p className="text-green-800 text-xs">
                        <strong>🔑 Безлимитная подписка:</strong><br/>
                        После активации используйте кнопку "Вход для подписчиков" на главной странице для доступа с любого устройства
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Send" size={24} />
                Шаг 2: Подтверждение оплаты
              </CardTitle>
              <CardDescription>
                После оплаты заполните форму ниже и прикрепите скриншот
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Укажите тот же email, что вы видели при расчёте матрицы
                  </p>
                </div>

                <div>
                  <Label htmlFor="phone">Телефон (необязательно)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="screenshot">Скриншот оплаты *</Label>
                  <div className="mt-1">
                    <Input
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                      className="cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    📸 Скриншот из банка с подтверждением перевода на сумму {plans[selectedPlan].price} ₽
                  </p>
                  {screenshot && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                      <Icon name="CheckCircle" size={16} />
                      <span>{screenshot.name}</span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
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

                <p className="text-xs text-gray-500 text-center">
                  Нажимая кнопку, вы подтверждаете, что совершили оплату
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;