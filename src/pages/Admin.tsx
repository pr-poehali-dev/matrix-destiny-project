import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Request {
  id: number;
  email: string;
  phone: string;
  screenshot_url: string;
  status: string;
  created_at: string;
  plan_type: string;
  amount: number;
}

const Admin = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('month');
  const { toast } = useToast();
  const API = 'https://functions.poehali.dev/3ce4bbfb-c04b-410f-977f-173caccdad84';

  useEffect(() => {
    if (sessionStorage.getItem('admin') === 'ok') {
      setIsAuth(true);
      load();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Romanio07Vivat') {
      sessionStorage.setItem('admin', 'ok');
      setIsAuth(true);
      load();
    } else {
      toast({ title: 'Неверный пароль', variant: 'destructive' });
    }
  };

  const load = async () => {
    try {
      const r = await fetch(`${API}?action=list`);
      const data = await r.json();
      console.log('Admin loaded requests:', data);
      console.log('Pending:', data.filter((req: Request) => req.status === 'pending'));
      setRequests(data);
    } catch (error) {
      console.error('Load error:', error);
      toast({ title: 'Ошибка загрузки', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const grant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API}?action=grant&email=${encodeURIComponent(email)}&plan_type=${plan}`);
      toast({ title: '✅ Доступ выдан' });
      setEmail('');
      load();
    } catch {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const approve = async (id: number, email: string) => {
    try {
      await fetch(`${API}?action=approve&id=${id}&email=${encodeURIComponent(email)}`);
      toast({ title: '✅ Одобрено' });
      load();
    } catch {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const reject = async (id: number) => {
    try {
      await fetch(`${API}?action=reject&id=${id}`);
      toast({ title: 'Отклонено' });
      load();
    } catch {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>Админ-панель</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label>Пароль</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">
                <Icon name="LogIn" size={16} className="mr-2" />Войти
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Админка</h1>
          <Button variant="outline" onClick={() => { sessionStorage.clear(); setIsAuth(false); }}>
            <Icon name="LogOut" size={16} className="mr-2" />Выйти
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader><CardTitle>Выдать доступ</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={grant} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <Label>Тариф</Label>
                  <select value={plan} onChange={(e) => setPlan(e.target.value)} className="flex h-10 w-full rounded-md border px-3">
                    <option value="single">Разовая</option>
                    <option value="month">1 месяц</option>
                    <option value="half_year">6 месяцев</option>
                    <option value="year">12 месяцев</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full">Выдать</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader><CardTitle>Новые заявки ({pending.length})</CardTitle></CardHeader>
          <CardContent>
            {pending.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Нет заявок</p>
            ) : (
              <div className="space-y-3">
                {pending.map((r) => (
                  <div key={r.id} className="border rounded p-3 bg-white">
                    <div className="flex flex-col gap-2">
                      <div>
                        <div className="font-medium">{r.email}</div>
                        {r.phone && <div className="text-sm text-gray-600">{r.phone}</div>}
                        <div className="text-xs text-gray-500">
                          {new Date(r.created_at).toLocaleString('ru')} • {r.plan_type} • {r.amount}₽
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {r.screenshot_url && (
                          <Button variant="outline" size="sm" onClick={() => window.open(r.screenshot_url, '_blank')}>
                            Скриншот
                          </Button>
                        )}
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => approve(r.id, r.email)}>
                          Одобрить
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1" onClick={() => reject(r.id)}>
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
          <CardHeader><CardTitle>Обработано ({processed.length})</CardTitle></CardHeader>
          <CardContent>
            {processed.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Нет</p>
            ) : (
              <div className="space-y-2">
                {processed.map((r) => (
                  <div key={r.id} className="flex justify-between items-center border rounded p-2 bg-gray-50">
                    <div>
                      <span className="font-medium">{r.email}</span>
                      <span className="text-xs text-gray-500 ml-2">{new Date(r.created_at).toLocaleDateString('ru')}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${r.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {r.status === 'approved' ? 'Одобрено' : 'Отклонено'}
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