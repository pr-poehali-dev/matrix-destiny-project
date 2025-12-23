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
  status: string;
  created_at: string;
  plan_type: string;
  amount: number;
}

const Admin = () => {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [manualPlan, setManualPlan] = useState<'single' | 'month' | 'half_year' | 'year'>('month');
  const { toast } = useToast();

  useEffect(() => {
    if (sessionStorage.getItem('admin') === 'true') {
      setIsAuth(true);
      loadRequests();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Romanio07Vivat') {
      sessionStorage.setItem('admin', 'true');
      setIsAuth(true);
      loadRequests();
    } else {
      toast({ title: 'Неверный пароль', variant: 'destructive' });
    }
  };

  const loadRequests = async () => {
    try {
      const func2url = await import('../../backend/func2url.json');
      const url = func2url['admin-requests'];
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const text = await res.text();
      const data = JSON.parse(text);
      setRequests(data.requests || []);
    } catch (err) {
      console.error('Load error:', err);
      toast({ title: 'Ошибка загрузки', description: String(err), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number, email: string) => {
    try {
      const func2url = await import('../../backend/func2url.json');
      await fetch(func2url['admin-requests'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', id, email }),
      });
      toast({ title: '✅ Доступ выдан' });
      loadRequests();
    } catch {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const handleReject = async (id: number) => {
    try {
      const func2url = await import('../../backend/func2url.json');
      await fetch(func2url['admin-requests'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', id }),
      });
      toast({ title: 'Заявка отклонена' });
      loadRequests();
    } catch {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail) return;

    try {
      const func2url = await import('../../backend/func2url.json');
      await fetch(func2url['admin-requests'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'grant', email: manualEmail, plan_type: manualPlan }),
      });
      toast({ title: '✅ Доступ выдан', description: `${manualEmail} получил ${manualPlan}` });
      setManualEmail('');
      loadRequests();
    } catch {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Админ-панель</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label>Пароль</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  const pending = requests.filter((r) => r.status === 'pending');
  const processed = requests.filter((r) => r.status !== 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Админ-панель</h1>
          <Button
            variant="outline"
            onClick={() => {
              sessionStorage.removeItem('admin');
              setIsAuth(false);
            }}
          >
            <Icon name="LogOut" size={16} className="mr-2" />
            Выйти
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Выдать доступ вручную</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGrant} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div>
                  <Label>Тариф</Label>
                  <select
                    value={manualPlan}
                    onChange={(e) => setManualPlan(e.target.value as any)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="single">Разовая расшифровка</option>
                    <option value="month">1 месяц</option>
                    <option value="half_year">6 месяцев</option>
                    <option value="year">12 месяцев</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full">
                <Icon name="Check" size={16} className="mr-2" />
                Выдать доступ
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ожидают проверки ({pending.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {pending.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Нет новых заявок</p>
            ) : (
              <div className="space-y-4">
                {pending.map((req) => (
                  <div key={req.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex flex-col gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Icon name="Mail" size={16} />
                          <span className="font-medium">{req.email}</span>
                        </div>
                        {req.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Icon name="Phone" size={14} />
                            {req.phone}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(req.created_at).toLocaleString('ru')} • {req.plan_type} • {req.amount}₽
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {req.screenshot_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(req.screenshot_url, '_blank')}
                          >
                            <Icon name="Image" size={14} className="mr-1" />
                            Скриншот
                          </Button>
                        )}
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(req.id, req.email)}
                        >
                          <Icon name="Check" size={14} className="mr-1" />
                          Одобрить
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleReject(req.id)}
                        >
                          <Icon name="X" size={14} className="mr-1" />
                          Отклонить
                        </Button>
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
            <CardTitle>Обработанные ({processed.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {processed.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Нет обработанных заявок</p>
            ) : (
              <div className="space-y-2">
                {processed.map((req) => (
                  <div key={req.id} className="flex justify-between items-center border rounded p-3 bg-gray-50">
                    <div>
                      <span className="font-medium">{req.email}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(req.created_at).toLocaleDateString('ru')}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        req.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {req.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;