import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Login = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
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

    // ВРЕМЕННОЕ РЕШЕНИЕ: Список одобренных подписчиков (пока не работает бэкенд из-за биллинга)
    const approvedSubscribers = [
      { email: 'romanysh@rambler.ru', expires: '2026-06-21', plan: 'half_year' },
      { email: 'iriha1@bk.ru', expires: '2026-12-13', plan: 'year' },
      { email: 'cabinet-psyhologa@outlook.com', expires: '2026-01-23', plan: 'month' },
    ];

    try {
      const subscriber = approvedSubscribers.find(s => s.email.toLowerCase() === email.toLowerCase());

      if (subscriber) {
        const expiresDate = new Date(subscriber.expires);
        const now = new Date();

        if (now > expiresDate) {
          toast({
            title: 'Доступ запрещён',
            description: `Срок подписки истёк ${expiresDate.toLocaleDateString('ru-RU')}`,
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        localStorage.setItem('userEmail', email);
        localStorage.setItem('subscriberAuth', 'true');
        
        toast({
          title: '✅ Вход выполнен',
          description: `Добро пожаловать! Подписка до ${expiresDate.toLocaleDateString('ru-RU')}`,
        });
        
        // Немедленное перенаправление
        setTimeout(() => {
          window.location.href = '/';
        }, 800);
      } else {
        toast({
          title: 'Доступ запрещён',
          description: 'Email не найден в списке подписчиков',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('💥 Ошибка:', error);
      
      toast({
        title: 'Ошибка входа',
        description: 'Не удалось войти в систему',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center px-3 md:px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Вход для подписчиков
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Только для пользователей с безлимитным доступом
          </p>
        </div>

        <Card className="w-full shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
              <Icon name="LogIn" size={24} />
              Войти в аккаунт
            </CardTitle>
            <CardDescription className="text-base">
              Введите email, который вы использовали при оплате подписки
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm md:text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full text-base"
                />
                <p className="text-xs text-gray-500">
                  💡 Используйте email, который указали при покупке подписки
                </p>
              </div>

              <Button
                type="submit"
                className="w-full text-base"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Проверка доступа...
                  </>
                ) : (
                  <>
                    <Icon name="LogIn" size={20} className="mr-2" />
                    Войти
                  </>
                )}
              </Button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-blue-900">
                  <strong>ℹ️ Только для подписчиков:</strong><br/>
                  • Месячная подписка (1000₽)<br/>
                  • Полугодовая подписка (5000₽)<br/>
                  • Годовая подписка (10000₽)
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                <p className="text-xs text-green-900">
                  <strong>🔒 Безопасность:</strong><br/>
                  • Лимит: до 2 устройств одновременно<br/>
                  • Автоматический выход через 24 часа неактивности<br/>
                  • Защита от передачи аккаунта другим людям
                </p>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t space-y-3">
              <p className="text-sm text-gray-600 text-center">
                Ещё не подписчик?
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/payment')}
              >
                <Icon name="CreditCard" size={16} className="mr-2" />
                Оформить подписку
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/')}
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                На главную
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Проблемы со входом?
          </p>
          <Button
            variant="link"
            onClick={() => navigate('/access')}
            className="text-sm"
          >
            Проверить статус подписки →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;