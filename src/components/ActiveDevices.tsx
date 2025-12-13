import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Device {
  ip_address: string;
  device_type: string;
  user_agent: string;
  last_activity: string;
  created_at: string;
  is_current: boolean;
}

interface DevicesData {
  devices: Device[];
  active_count: number;
  max_devices: number;
  expires_at: string | null;
}

interface ActiveDevicesProps {
  email: string;
}

export const ActiveDevices = ({ email }: ActiveDevicesProps) => {
  const [devicesData, setDevicesData] = useState<DevicesData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadDevices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/access/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setDevicesData(data);
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить список устройств',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      loadDevices();
    }
  }, [email]);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'Mobile':
        return 'Smartphone';
      case 'Tablet':
        return 'Tablet';
      case 'Desktop':
        return 'Monitor';
      default:
        return 'HelpCircle';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} дн назад`;
    return date.toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Icon name="Loader2" className="animate-spin mr-2" />
            <span>Загрузка...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!devicesData) {
    return null;
  }

  const daysLeft = devicesData.expires_at
    ? Math.ceil((new Date(devicesData.expires_at).getTime() - new Date().getTime()) / 86400000)
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Smartphone" size={24} />
          Активные устройства ({devicesData.active_count}/{devicesData.max_devices})
        </CardTitle>
        <CardDescription>
          {daysLeft !== null && daysLeft > 0 && (
            <span className="text-green-600">
              ✓ Подписка активна ещё {daysLeft} дн.
            </span>
          )}
          {daysLeft !== null && daysLeft <= 0 && (
            <span className="text-red-600">
              ⚠️ Срок подписки истёк
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {devicesData.devices.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              Нет активных устройств
            </p>
          ) : (
            devicesData.devices.map((device, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 rounded-lg border ${
                  device.is_current
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Icon
                  name={getDeviceIcon(device.device_type) as any}
                  size={24}
                  className={device.is_current ? 'text-green-600' : 'text-gray-600'}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{device.device_type}</span>
                    {device.is_current && (
                      <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                        Это устройство
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    IP: {device.ip_address}
                  </p>
                  <p className="text-xs text-gray-500">
                    Последняя активность: {formatDate(device.last_activity)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {devicesData.active_count >= devicesData.max_devices && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-900">
              <strong>⚠️ Достигнут лимит устройств</strong><br />
              Выйдите из аккаунта на другом устройстве, чтобы войти на новом.
            </p>
          </div>
        )}

        <Button
          onClick={loadDevices}
          variant="outline"
          size="sm"
          className="w-full mt-4"
        >
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Обновить список
        </Button>
      </CardContent>
    </Card>
  );
};
