import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import MatrixCalculator from '@/components/MatrixCalculator';

const VIP = () => {
  const [birthDate, setBirthDate] = useState('');
  const [showMatrix, setShowMatrix] = useState(false);
  const { toast } = useToast();

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!birthDate) {
      toast({
        title: 'Ошибка',
        description: 'Укажите дату рождения',
        variant: 'destructive',
      });
      return;
    }

    const [year, month, day] = birthDate.split('-').map(Number);
    
    if (!year || !month || !day) {
      toast({
        title: 'Ошибка',
        description: 'Неверный формат даты',
        variant: 'destructive',
      });
      return;
    }

    setShowMatrix(true);
  };

  const handleReset = () => {
    setBirthDate('');
    setShowMatrix(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Crown" size={40} className="text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-900">VIP Доступ</h1>
            <Icon name="Crown" size={40} className="text-yellow-500" />
          </div>
          <p className="text-lg text-gray-600">
            Безлимитные расшифровки матрицы судьбы
          </p>
        </div>

        {!showMatrix ? (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Icon name="Calendar" size={28} />
                Введите дату рождения
              </CardTitle>
              <CardDescription className="text-base">
                Получите подробную расшифровку вашей матрицы судьбы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCalculate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-base">Дата рождения</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                    className="text-lg"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full text-lg">
                  <Icon name="Sparkles" size={20} className="mr-2" />
                  Рассчитать матрицу
                </Button>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-900">
                    <strong>✅ VIP-преимущества:</strong><br/>
                    • Безлимитные расчеты<br/>
                    • Копирование полных отчётов<br/>
                    • Без рекламы<br/>
                    • Полная конфиденциальность
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Button 
              onClick={handleReset} 
              variant="outline" 
              size="lg"
              className="w-full"
            >
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Рассчитать для другой даты
            </Button>
            
            <MatrixCalculator birthDate={birthDate} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VIP;