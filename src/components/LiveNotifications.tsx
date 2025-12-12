import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';

interface Notification {
  id: number;
  name: string;
  city: string;
}

const names = [
  'Анна', 'Мария', 'Екатерина', 'Ольга', 'Светлана', 'Татьяна', 'Елена', 'Наталья',
  'Дмитрий', 'Александр', 'Сергей', 'Андрей', 'Алексей', 'Михаил', 'Иван', 'Максим'
];

const cities = [
  'Москвы', 'Санкт-Петербурга', 'Новосибирска', 'Екатеринбурга', 'Казани', 
  'Нижнего Новгорода', 'Челябинска', 'Самары', 'Омска', 'Ростова-на-Дону',
  'Уфы', 'Красноярска', 'Воронежа', 'Перми', 'Волгограда'
];

export function LiveNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const addNotification = () => {
      const notification: Notification = {
        id: Date.now(),
        name: names[Math.floor(Math.random() * names.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
      };

      setNotifications((prev) => [...prev.slice(-2), notification]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }, 5000);
    };

    const interval = setInterval(addNotification, Math.random() * 8000 + 7000);
    addNotification();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 space-y-3">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-800 min-w-[280px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="UserCheck" size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  <span className="font-semibold">{notification.name}</span> из {notification.city}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  только что рассчитал матрицу
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
