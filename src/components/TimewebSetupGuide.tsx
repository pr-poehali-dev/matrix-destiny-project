import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function TimewebSetupGuide() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3">Настройка домена о-тебе.рф в Timeweb</h1>
        <p className="text-gray-600">Пошаговая инструкция с картинками</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <Icon name="Info" size={32} className="text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg mb-2">Что вы получите после настройки</h3>
            <ul className="space-y-1 text-gray-700">
              <li>✅ Сайт будет доступен по адресу <strong>о-тебе.рф</strong></li>
              <li>✅ Автоматический SSL-сертификат (зелёный замочек)</li>
              <li>✅ Ошибка "HSTS" исчезнет</li>
              <li>✅ Время настройки: 15-20 минут</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">Войдите в панель Timeweb</h2>
              <div className="space-y-3">
                <p className="text-gray-700">
                  Откройте сайт Timeweb и войдите в личный кабинет
                </p>
                <Button
                  onClick={() => window.open('https://timeweb.com/ru/login', '_blank')}
                  className="gap-2"
                  variant="outline"
                >
                  <Icon name="ExternalLink" size={16} />
                  Открыть Timeweb
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">Найдите ваш домен</h2>
              <div className="space-y-3">
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>В меню слева выберите <strong>"Домены и SSL"</strong></li>
                  <li>Найдите домен <strong>о-тебе.рф</strong> в списке</li>
                  <li>Нажмите на него для открытия настроек</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">Откройте DNS-записи</h2>
              <div className="space-y-3">
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Перейдите на вкладку <strong>"DNS-записи"</strong></li>
                  <li>Нажмите кнопку <strong>"Добавить запись"</strong></li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
              4
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">Добавьте CNAME-запись</h2>
              <div className="space-y-4">
                <p className="text-gray-700">Заполните поля следующим образом:</p>
                
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">Тип записи:</p>
                      <code className="bg-white px-3 py-2 rounded border block text-center">CNAME</code>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">Имя поддомена:</p>
                      <code className="bg-white px-3 py-2 rounded border block text-center">@</code>
                    </div>
                    <div className="col-span-3">
                      <p className="text-sm font-semibold text-gray-600 mb-1">Значение:</p>
                      <code className="bg-white px-3 py-2 rounded border block break-all">
                        matrix-destiny-project.poehali.dev
                      </code>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex gap-2">
                    <Icon name="Info" size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      <strong>Важно:</strong> В поле "Имя поддомена" используйте символ <code className="bg-white px-2 py-0.5 rounded">@</code> — это означает корневой домен
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
              5
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">Добавьте запись для www</h2>
              <div className="space-y-4">
                <p className="text-gray-700">Нажмите <strong>"Добавить запись"</strong> ещё раз и заполните:</p>
                
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">Тип записи:</p>
                      <code className="bg-white px-3 py-2 rounded border block text-center">CNAME</code>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">Имя поддомена:</p>
                      <code className="bg-white px-3 py-2 rounded border block text-center">www</code>
                    </div>
                    <div className="col-span-3">
                      <p className="text-sm font-semibold text-gray-600 mb-1">Значение:</p>
                      <code className="bg-white px-3 py-2 rounded border block break-all">
                        matrix-destiny-project.poehali.dev
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-indigo-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
              6
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">Привяжите домен в poehali.dev</h2>
              <div className="space-y-4">
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Откройте редактор poehali.dev с вашим проектом</li>
                  <li>Нажмите <strong>"Опубликовать → Привязать свой домен"</strong></li>
                  <li>Введите: <code className="bg-gray-100 px-2 py-1 rounded">о-тебе.рф</code></li>
                  <li>Нажмите "Подключить"</li>
                </ol>
                <Button
                  onClick={() => window.open('https://app.poehali.dev', '_blank')}
                  className="gap-2"
                >
                  <Icon name="ExternalLink" size={16} />
                  Открыть poehali.dev
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
              7
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">Дождитесь применения настроек</h2>
              <div className="space-y-3">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Icon name="Clock" size={24} className="text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-2">Время ожидания</p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• DNS-записи применяются: <strong>10-30 минут</strong></li>
                        <li>• SSL-сертификат выпускается: <strong>5-10 минут</strong></li>
                        <li>• Полное распространение: <strong>до 1 часа</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 mt-8">
        <div className="flex items-start gap-4">
          <Icon name="CheckCircle" size={32} className="text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg mb-2">Готово!</h3>
            <p className="text-gray-700 mb-3">
              После применения настроек ваш сайт будет доступен по адресу:
            </p>
            <div className="space-y-2">
              <a
                href="https://о-тебе.рф"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold block"
              >
                https://о-тебе.рф
              </a>
              <a
                href="https://www.о-тебе.рф"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold block"
              >
                https://www.о-тебе.рф
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Icon name="HelpCircle" size={20} />
          Что делать, если не работает?
        </h3>
        <div className="space-y-3 text-gray-700">
          <div>
            <p className="font-semibold mb-1">1. Проверьте DNS-записи</p>
            <p className="text-sm">Убедитесь, что обе CNAME-записи добавлены правильно в панели Timeweb</p>
          </div>
          <div>
            <p className="font-semibold mb-1">2. Очистите кэш браузера</p>
            <p className="text-sm">Нажмите Ctrl+Shift+Delete и очистите кэш и cookies</p>
          </div>
          <div>
            <p className="font-semibold mb-1">3. Подождите ещё</p>
            <p className="text-sm">Иногда DNS может обновляться до 24 часов</p>
          </div>
          <div>
            <p className="font-semibold mb-1">4. Проверьте привязку в poehali.dev</p>
            <p className="text-sm">Убедитесь, что домен добавлен в настройках проекта</p>
          </div>
        </div>
      </div>

      <div className="text-center pt-6">
        <Button
          onClick={() => window.history.back()}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <Icon name="ArrowLeft" size={18} />
          Вернуться на сайт
        </Button>
      </div>
    </div>
  );
}
