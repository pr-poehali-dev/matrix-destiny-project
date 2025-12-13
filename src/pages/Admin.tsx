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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Вход в админ-панель</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  autoFocus
                  required
                />
              </div>
              <Button type="submit" className="w-full">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Админ-панель</h1>
          <p className="text-gray-600">Управление заявками на доступ</p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Clock" size={24} className="text-orange-500" />
                Ожидают проверки ({pendingRequests.length})
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
                      className="border rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon name="Mail" size={16} className="text-gray-400" />
                            <span className="font-medium">{request.email}</span>
                          </div>
                          {request.phone && (
                            <div className="flex items-center gap-2 mb-2">
                              <Icon name="Phone" size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-600">{request.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Icon name="Calendar" size={16} />
                            <span>{new Date(request.created_at).toLocaleString('ru-RU')}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {request.screenshot_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(request.screenshot_url, '_blank')}
                              className="w-full md:w-auto"
                            >
                              <Icon name="Image" size={16} className="mr-2" />
                              Скриншот
                            </Button>
                          )}
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApprove(request.id, request.email)}
                              className="flex-1 md:flex-none bg-green-600 hover:bg-green-700"
                            >
                              <Icon name="Check" size={16} className="mr-2" />
                              Одобрить
                            </Button>
                            <Button
                              onClick={() => handleReject(request.id)}
                              variant="destructive"
                              className="flex-1 md:flex-none"
                            >
                              <Icon name="X" size={16} className="mr-2" />
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="CheckCircle" size={24} className="text-green-500" />
                Обработанные ({processedRequests.length})
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
                      className="border rounded-lg p-3 bg-gray-50 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-medium">{request.email}</span>
                        <span className="text-sm text-gray-500 ml-4">
                          {new Date(request.created_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {request.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                      </span>
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