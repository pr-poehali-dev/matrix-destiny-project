import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const TelegramSetup = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  
  const webhookUrl = 'https://functions.poehali.dev/3d30f6e7-5c58-48f9-99c6-94619ab3ae70';

  const setupWebhook = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      // Используем admin-requests для настройки (добавим эндпоинт)
      toast({
        title: 'Настройка webhook',
        description: 'Отправляю запрос к Telegram API...',
      });
      
      // Показываем инструкцию
      setResult({
        instruction: true,
        webhookUrl
      });
      
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: `${error}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Send" size={24} />
              Настройка Telegram бота
            </CardTitle>
            <CardDescription>
              Подключение webhook для работы интерактивных кнопок
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Что это даёт?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✅ Кнопки "Одобрить" и "Отклонить" прямо в Telegram</li>
                  <li>✅ Быстрая обработка заявок без входа в админку</li>
                  <li>✅ Автоматическое обновление статуса</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Инструкция по настройке:</h3>
                
                <div className="bg-gray-50 border rounded-lg p-4 space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">1. Откройте эту ссылку в браузере:</p>
                    <div className="bg-white border rounded p-3 font-mono text-xs break-all">
                      https://api.telegram.org/bot<span className="text-red-600">[ТОКЕН_БОТА]</span>/setWebhook?url={webhookUrl}
                    </div>
                    <p className="text-xs text-gray-600">
                      * Замените <span className="text-red-600">[ТОКЕН_БОТА]</span> на ваш токен из секретов проекта (TELEGRAM_BOT_TOKEN)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">2. Где взять токен бота?</p>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>Откройте настройки проекта → Секреты</li>
                      <li>Найдите <code className="bg-gray-100 px-1 rounded">TELEGRAM_BOT_TOKEN</code></li>
                      <li>Скопируйте его значение</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">3. Проверьте результат:</p>
                    <p className="text-sm text-gray-700">
                      После перехода по ссылке вы увидите:
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded p-2 font-mono text-xs">
                      {`{"ok":true,"result":true,"description":"Webhook was set"}`}
                    </div>
                  </div>
                </div>
              </div>

              {result?.instruction && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <Icon name="CheckCircle" size={20} />
                    Webhook URL готов
                  </h3>
                  <p className="text-sm text-green-800 mb-3">
                    Скопируйте URL ниже и следуйте инструкции выше:
                  </p>
                  <div className="bg-white border rounded p-3 font-mono text-xs break-all">
                    {webhookUrl}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={setupWebhook} disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Подготовка...
                    </>
                  ) : (
                    <>
                      <Icon name="Zap" size={16} className="mr-2" />
                      Показать инструкцию
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.open('https://t.me/BotFather', '_blank')}
                >
                  <Icon name="ExternalLink" size={16} className="mr-2" />
                  Открыть BotFather
                </Button>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2 text-sm">Нет бота?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Создайте нового бота через @BotFather:
                </p>
                <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                  <li>Напишите <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@BotFather</a> в Telegram</li>
                  <li>Отправьте команду <code className="bg-gray-100 px-1 rounded">/newbot</code></li>
                  <li>Следуйте инструкциям и получите токен</li>
                  <li>Добавьте токен в секреты проекта как TELEGRAM_BOT_TOKEN</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TelegramSetup;
