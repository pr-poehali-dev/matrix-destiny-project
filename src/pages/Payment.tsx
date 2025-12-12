import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast({
            title: 'Заявка отправлена',
            description: 'Мы проверим оплату и активируем доступ в течение нескольких часов',
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
                  <h3 className="font-semibold text-purple-900 mb-2">Как оплатить:</h3>
                  <ol className="space-y-2 text-sm text-purple-800">
                    <li className="flex gap-2">
                      <span className="font-bold">1.</span>
                      <span>Откройте приложение вашего банка</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">2.</span>
                      <span>Отсканируйте QR-код для оплаты</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">3.</span>
                      <span>Подтвердите платеж</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">4.</span>
                      <span>Сделайте скриншот и заполните форму справа</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-green-800 text-sm font-medium">
                    ✓ Стоимость: 500 рублей
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    Доступ активируется в течение нескольких часов после проверки
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Send" size={24} />
                Подтверждение оплаты
              </CardTitle>
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
                    На этот email придёт уведомление об активации
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
