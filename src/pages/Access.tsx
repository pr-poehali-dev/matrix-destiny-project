import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface AccessInfo {
  has_access: boolean;
  plan_type?: string;
  expires_at?: string;
  downloads_left?: number;
  message?: string;
}

const Access = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [accessInfo, setAccessInfo] = useState<AccessInfo | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCheckAccess = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: 'Ошибка',
        description: 'Укажите email',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/access/check?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (response.ok) {
        setAccessInfo(data);
        if (!data.has_access) {
          toast({
            title: 'Доступ не найден',
            description: 'Возможно, заявка ещё не одобрена или email указан неверно',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось проверить доступ',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при проверке',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlanLabel = (planType: string) => {
    const labels: Record<string, string> = {
      single: 'Разовая расшифровка',
      month: '1 месяц безлимит',
      half_year: '6 месяцев безлимит',
      year: '12 месяцев безлимит',
      admin: 'Администратор',
    };
    return labels[planType] || planType;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          На главную
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Key" size={24} />
              Проверка доступа
            </CardTitle>
            <CardDescription className="text-base pt-2">
              Введите email, который вы указали при оплате, чтобы проверить статус вашего доступа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheckAccess} className="space-y-4">
              <div>
                <Label htmlFor="email">Ваш Email</Label>
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
                  Укажите email, который вы использовали при оплате
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Проверка...
                  </>
                ) : (
                  <>
                    <Icon name="Search" size={20} className="mr-2" />
                    Проверить доступ
                  </>
                )}
              </Button>
            </form>

            {accessInfo && accessInfo.has_access && (
              <div className="mt-6 space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="CheckCircle" size={24} className="text-green-600" />
                    <h3 className="font-semibold text-green-900">Доступ активен!</h3>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Тариф:</span>
                      <span className="font-medium text-gray-900">
                        {getPlanLabel(accessInfo.plan_type || '')}
                      </span>
                    </div>

                    {accessInfo.expires_at && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Действует до:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(accessInfo.expires_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    )}

                    {accessInfo.downloads_left !== null && accessInfo.downloads_left !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Осталось скачиваний:</span>
                        <span className="font-medium text-gray-900">
                          {accessInfo.downloads_left}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => navigate('/')}
                  className="w-full"
                  size="lg"
                >
                  <Icon name="Download" size={20} className="mr-2" />
                  Перейти к расчёту матрицы
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Вы будете перенаправлены на главную страницу для создания расшифровки
                </p>
              </div>
            )}

            {accessInfo && !accessInfo.has_access && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="AlertCircle" size={20} className="text-yellow-600" />
                  <h3 className="font-semibold text-yellow-900">Доступ не найден</h3>
                </div>
                <p className="text-sm text-yellow-800 mb-3">
                  {accessInfo.message || 'Возможно, ваша заявка ещё не одобрена'}
                </p>
                <div className="bg-white border border-yellow-300 rounded p-3 mb-4">
                  <p className="text-xs text-yellow-900">
                    <strong>Что делать?</strong><br/>
                    • Если вы уже оплатили — подождите 1-3 часа, доступ активируется автоматически<br/>
                    • Если ещё не оплатили — нажмите кнопку ниже для выбора тарифа
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/payment')}
                  variant="outline"
                  className="w-full"
                >
                  <Icon name="CreditCard" size={16} className="mr-2" />
                  Перейти к оплате
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Возникли вопросы? Напишите нам
          </p>
        </div>
      </div>
    </div>
  );
};

export default Access;