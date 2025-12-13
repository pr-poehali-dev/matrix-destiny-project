import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

export default function DomainSetupGuide() {
  const [open, setOpen] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    const currentDomain = window.location.hostname;
    const isCustomDomain = !currentDomain.includes('poehali.dev');
    
    if (isCustomDomain) {
      setShouldShow(false);
    }
  }, []);

  if (!shouldShow) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="fixed bottom-6 right-6 shadow-lg gap-2 z-50"
        size="lg"
      >
        <Icon name="HelpCircle" size={20} />
        Домен не работает?
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Как настроить домен о-тебе.рф</DialogTitle>
            <DialogDescription>
              Простая инструкция из 3 шагов
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Откройте редактор poehali.dev</h3>
                  <p className="text-gray-700">
                    Перейдите в ваш проект в редакторе poehali.dev
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Нажмите "Привязать домен"</h3>
                  <p className="text-gray-700 mb-3">
                    Найдите кнопку <strong>"Опубликовать → Привязать свой домен"</strong>
                  </p>
                  <div className="bg-white rounded p-3 border">
                    <p className="text-sm text-gray-600 mb-2">Введите домен:</p>
                    <code className="bg-gray-100 px-3 py-2 rounded block">о-тебе.рф</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Следуйте инструкциям</h3>
                  <p className="text-gray-700 mb-3">
                    Платформа покажет что нужно настроить у регистратора домена
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Clock" size={16} className="text-gray-500" />
                      <span>Настройка займёт 10-30 минут</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Shield" size={16} className="text-gray-500" />
                      <span>SSL сертификат установится автоматически</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={24} className="text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Временное решение</h3>
                  <p className="text-sm text-gray-700">
                    Пока настраиваете домен, сайт доступен по адресу:
                  </p>
                  <a
                    href="https://matrix-destiny-project.poehali.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm block mt-2"
                  >
                    matrix-destiny-project.poehali.dev
                  </a>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => window.open('https://app.poehali.dev', '_blank')}
                className="flex-1 gap-2"
              >
                <Icon name="ExternalLink" size={16} />
                Открыть poehali.dev
              </Button>
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                className="flex-1"
              >
                Закрыть
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}