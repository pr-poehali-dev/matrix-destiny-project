import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface LiveStatsProps {
  baseCount?: number;
}

export function LiveStats({ baseCount = 25000 }: LiveStatsProps) {
  const [count, setCount] = useState(baseCount);

  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.random() > 0.5 ? 1 : 0;
      if (increment) {
        setCount((prev) => prev + 1);
      }
    }, Math.random() * 15000 + 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <Icon name="Users" size={16} className="text-primary" />
      <span className="text-sm font-medium text-primary">
        {count.toLocaleString('ru-RU')}+ расчётов выполнено
      </span>
    </div>
  );
}
