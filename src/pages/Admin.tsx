import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface PaymentRequest {
  id: number;
  email: string;
  phone?: string;
  screenshot_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  notes?: string;
}

const Admin = () => {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchRequests();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Romanio07Vivat') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setLoading(true);
      fetchRequests();
    } else {
      toast({
        title: 'Неверный пароль',
        variant: 'destructive',
      });
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/admin/requests');
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить заявки',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number, email: string) => {
    try {
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, email, action: 'approve' }),
      });

      if (response.ok) {
        toast({
          title: 'Доступ активирован',
          description: `Пользователь ${email} получил доступ`,
        });
        fetchRequests();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось активировать доступ',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'reject' }),
      });

      if (response.ok) {
        toast({
          title: 'Заявка отклонена',
        });
        fetchRequests();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отклонить заявку',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center px-3 md:px-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl text-center">Вход в админ-панель</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm md:text-base">Пароль</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  autoFocus
                  required
                  className="w-full text-base"
                />
              </div>
              <Button type="submit" className="w-full text-base">
                <Icon name="LogIn" size={16} className="mr-2" />
                Войти
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-6 md:py-12 px-3 md:px-4">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="text-center flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Админ-панель</h1>
            <p className="text-sm md:text-base text-gray-600">Управление заявками на доступ</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              sessionStorage.removeItem('admin_auth');
              setIsAuthenticated(false);
            }}
            className="ml-2 flex-shrink-0"
          >
            <Icon name="LogOut" size={16} className="mr-1 md:mr-2" />
            <span className="hidden md:inline">Выйти</span>
          </Button>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6 w-full overflow-hidden">
          <div className="flex items-start gap-2 md:gap-3">
            <Icon name="Info" size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs md:text-sm text-blue-900">
              <strong>ℹ️ Рекомендация:</strong> Вы можете одобрять заявки прямо из Telegram — уведомления приходят автоматически с кнопками "Одобрить" / "Отклонить". 
              Это быстрее и удобнее, чем через эту панель!
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="w-full overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Icon name="Clock" size={20} className="text-orange-500 flex-shrink-0" />
                <span className="truncate">Ожидают проверки ({pendingRequests.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Нет новых заявок</p>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border rounded-lg p-3 md:p-4 bg-white shadow-sm w-full overflow-hidden"
                    >
                      <div className="flex flex-col gap-3 w-full">
                        <div className="flex-1 w-full">
                          <div className="flex items-center gap-2 mb-2 flex-wrap break-all">
                            <Icon name="Mail" size={16} className="text-gray-400 flex-shrink-0" />
                            <span className="font-medium text-sm md:text-base break-all">{request.email}</span>
                          </div>
                          {request.phone && (
                            <div className="flex items-center gap-2 mb-2">
                              <Icon name="Phone" size={16} className="text-gray-400 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{request.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                            <Icon name="Calendar" size={16} className="flex-shrink-0" />
                            <span>{new Date(request.created_at).toLocaleString('ru-RU')}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          {request.screenshot_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(request.screenshot_url, '_blank')}
                              className="w-full"
                            >
                              <Icon name="Image" size={16} className="mr-2" />
                              Скриншот
                            </Button>
                          )}
                          <div className="flex gap-2 w-full">
                            <Button
                              onClick={() => handleApprove(request.id, request.email)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-sm md:text-base"
                              size="sm"
                            >
                              <Icon name="Check" size={16} className="mr-1 md:mr-2" />
                              Одобрить
                            </Button>
                            <Button
                              onClick={() => handleReject(request.id)}
                              variant="destructive"
                              className="flex-1 text-sm md:text-base"
                              size="sm"
                            >
                              <Icon name="X" size={16} className="mr-1 md:mr-2" />
                              Отклонить
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="w-full overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Icon name="CheckCircle" size={20} className="text-green-500 flex-shrink-0" />
                <span className="truncate">Обработанные ({processedRequests.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {processedRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Нет обработанных заявок</p>
              ) : (
                <div className="space-y-2">
                  {processedRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border rounded-lg p-3 bg-gray-50 w-full overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm md:text-base break-all block">{request.email}</span>
                          <span className="text-xs md:text-sm text-gray-500 block mt-1">
                            {new Date(request.created_at).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium whitespace-nowrap self-start md:self-center ${
                            request.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {request.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;