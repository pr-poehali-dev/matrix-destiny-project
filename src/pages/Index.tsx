import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { checkAccess } from '@/lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { LiveStats } from '@/components/LiveStats';
import { LiveNotifications } from '@/components/LiveNotifications';
import { Testimonials } from '@/components/Testimonials';
import { CTABlock } from '@/components/CTABlock';
import { energyDescriptions } from '@/data/arcana-descriptions';
import { UnifiedMatrixResult } from '@/components/UnifiedMatrixResult';
import { ProfessionalPromo } from '@/components/ProfessionalPromo';

const calculateDestinyMatrix = (birthDate: string, name: string) => {
  const date = new Date(birthDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  const sumDigits = (num: number): number => {
    while (num > 22) {
      num = num.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return num;
  };

  const personalNumber = sumDigits(day + month + year);
  const destinyNumber = sumDigits(day + month);
  const socialNumber = sumDigits(month + year);
  const spiritualNumber = sumDigits(day + year);
  
  return {
    personal: personalNumber,
    destiny: destinyNumber,
    social: socialNumber,
    spiritual: spiritualNumber,
    name: name
  };
};

export default function Index() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calculateDestinyMatrix> | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [subscriptionExpires, setSubscriptionExpires] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const { toast } = useToast();
  const navigate = useNavigate();
  const calculatorRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedAdminEmail = localStorage.getItem('adminEmail');
    const subscriberAuth = localStorage.getItem('subscriberAuth');
    
    if (storedEmail) {
      setEmail(storedEmail);
      
      // Автоматически проверяем доступ для подписчиков
      if (subscriberAuth === 'true') {
        setIsSubscriber(true);
        checkAccess(storedEmail).then((accessCheck) => {
          if (accessCheck.has_access) {
            setHasAccess(true);
            if (accessCheck.expires_at) {
              setSubscriptionExpires(accessCheck.expires_at);
            }
          } else {
            // Если доступ истёк, очищаем авторизацию
            localStorage.removeItem('subscriberAuth');
            setIsSubscriber(false);
            toast({
              title: 'Срок подписки истёк',
              description: accessCheck.message || 'Продлите подписку для доступа',
              variant: 'destructive',
            });
          }
        }).catch(() => {
          localStorage.removeItem('subscriberAuth');
          setIsSubscriber(false);
        });
      }
    }
    
    if (storedAdminEmail) {
      setAdminEmail(storedAdminEmail);
      setHasAccess(true);
    }
  }, []);

  const handleCalculate = async () => {
    if (name && birthDate) {
      const matrix = calculateDestinyMatrix(birthDate, name);
      setResult(matrix);
      setShowPricing(true);

      if (email) {
        localStorage.setItem('userEmail', email);
        try {
          const accessCheck = await checkAccess(email);
          setHasAccess(accessCheck.has_access);
        } catch (error) {
          console.error('Failed to check access:', error);
        }
      }
    }
  };

  const handlePayment = (planType?: string) => {
    if (!email) {
      toast({
        title: 'Требуется email',
        description: 'Пожалуйста, укажите email для получения доступа',
        variant: 'destructive',
      });
      return;
    }
    if (planType) {
      navigate(`/payment?plan=${planType}`);
    } else {
      navigate('/payment');
    }
  };



  const handleShare = async () => {
    if (!result || !hasAccess) {
      toast({
        title: 'Доступ ограничен',
        description: 'Оплатите подписку для доступа к полной расшифровке',
        variant: 'destructive',
      });
      return;
    }

    // ПОЛНЫЙ текст со ВСЕМИ расшифровками (предназначение, здоровье, отношения, финансы)
    const shareText = `🔮 МАТРИЦА СУДЬБЫ - ${result.name}\n\n` +
      `📅 Дата рождения: ${new Date(birthDate).toLocaleDateString('ru-RU')}\n\n` +
      `═══════════════════════════\n\n` +
      
      `👤 ЛИЧНАЯ ЭНЕРГИЯ: ${energyDescriptions[result.personal]?.title || result.personal}\n\n` +
      `${energyDescriptions[result.personal]?.description || ''}\n\n` +
      `💊 ЗДОРОВЬЕ:\n${energyDescriptions[result.personal]?.health || ''}\n\n` +
      `💕 ОТНОШЕНИЯ:\n${energyDescriptions[result.personal]?.relationships || ''}\n\n` +
      `💰 ФИНАНСЫ:\n${energyDescriptions[result.personal]?.finance || ''}\n\n` +
      
      `═══════════════════════════\n\n` +
      
      `🎯 ПРЕДНАЗНАЧЕНИЕ: ${energyDescriptions[result.destiny]?.title || result.destiny}\n\n` +
      `${energyDescriptions[result.destiny]?.description || ''}\n\n` +
      `💊 ЗДОРОВЬЕ:\n${energyDescriptions[result.destiny]?.health || ''}\n\n` +
      `💕 ОТНОШЕНИЯ:\n${energyDescriptions[result.destiny]?.relationships || ''}\n\n` +
      `💰 ФИНАНСЫ:\n${energyDescriptions[result.destiny]?.finance || ''}\n\n` +
      
      `═══════════════════════════\n\n` +
      
      `👥 СОЦИАЛЬНАЯ ЭНЕРГИЯ: ${energyDescriptions[result.social]?.title || result.social}\n\n` +
      `${energyDescriptions[result.social]?.description || ''}\n\n` +
      `💊 ЗДОРОВЬЕ:\n${energyDescriptions[result.social]?.health || ''}\n\n` +
      `💕 ОТНОШЕНИЯ:\n${energyDescriptions[result.social]?.relationships || ''}\n\n` +
      `💰 ФИНАНСЫ:\n${energyDescriptions[result.social]?.finance || ''}\n\n` +
      
      `═══════════════════════════\n\n` +
      
      `✨ ДУХОВНАЯ ЭНЕРГИЯ: ${energyDescriptions[result.spiritual]?.title || result.spiritual}\n\n` +
      `${energyDescriptions[result.spiritual]?.description || ''}\n\n` +
      `💊 ЗДОРОВЬЕ:\n${energyDescriptions[result.spiritual]?.health || ''}\n\n` +
      `💕 ОТНОШЕНИЯ:\n${energyDescriptions[result.spiritual]?.relationships || ''}\n\n` +
      `💰 ФИНАНСЫ:\n${energyDescriptions[result.spiritual]?.finance || ''}\n\n` +
      
      `═══════════════════════════\n\n` +
      `🌐 Рассчитай свою матрицу: ${window.location.origin}`;

    try {
      // Проверяем Web Share API
      if (navigator.share) {
        await navigator.share({
          title: 'Моя Матрица Судьбы',
          text: shareText,
        });
        
        toast({
          title: '✅ Поделились!',
          description: 'Весь контент отправлен — все 4 энергии со всеми разделами',
        });
      } else {
        // Fallback: копируем в буфер обмена
        await navigator.clipboard.writeText(shareText);
        
        toast({
          title: '✅ Скопировано в буфер!',
          description: 'Весь контент скопирован — все 4 энергии, здоровье, отношения, финансы. Вставьте в любой мессенджер',
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      
      // Если и clipboard API недоступен, показываем текст
      toast({
        title: 'Скопируйте текст вручную',
        description: shareText.substring(0, 100) + '...',
      });
    }
  };

  const handleAdminAccess = () => {
    if (adminEmail) {
      localStorage.setItem('adminEmail', adminEmail);
      setHasAccess(true);
      toast({
        title: '✅ Админ доступ активирован',
        description: 'Теперь у вас есть полный доступ',
      });
    }
  };

  const handleLogout = async () => {
    const storedEmail = localStorage.getItem('userEmail');
    
    if (storedEmail) {
      try {
        // Удаляем сессию на сервере
        await fetch('/api/access/check', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: storedEmail }),
        });
      } catch (error) {
        console.error('Failed to logout on server:', error);
      }
    }
    
    localStorage.removeItem('subscriberAuth');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('adminEmail');
    setIsSubscriber(false);
    setHasAccess(false);
    setEmail('');
    setAdminEmail('');
    toast({
      title: 'Вы вышли из аккаунта',
      description: 'Сессия на этом устройстве завершена',
    });
  };

  const handleLogin = async () => {
    if (!loginEmail) {
      toast({
        title: 'Требуется email',
        description: 'Пожалуйста, введите email',
        variant: 'destructive',
      });
      return;
    }

    try {
      const accessCheck = await checkAccess(loginEmail);
      
      if (accessCheck.has_access) {
        localStorage.setItem('userEmail', loginEmail);
        localStorage.setItem('subscriberAuth', 'true');
        setEmail(loginEmail);
        setIsSubscriber(true);
        setHasAccess(true);
        
        if (accessCheck.expires_at) {
          setSubscriptionExpires(accessCheck.expires_at);
        }
        
        setShowLoginModal(false);
        setLoginEmail('');
        
        toast({
          title: '✅ Вход выполнен',
          description: 'Добро пожаловать! У вас есть активная подписка',
        });
      } else {
        toast({
          title: 'Доступ не найден',
          description: 'У этого email нет активной подписки',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Ошибка входа',
        description: 'Попробуйте позже',
        variant: 'destructive',
      });
    }
  };

  const pricingPlans = [
    {
      name: 'Разовый доступ',
      price: '200₽',
      type: 'single',
      description: 'Одноразовая полная расшифровка',
      features: ['Полная расшифровка всех энергий', 'Анализ предназначения', 'Рекомендации по здоровью', 'Анализ отношений и финансов', 'Копирование полного отчёта'],
      icon: 'FileText'
    },
    {
      name: 'Месяц',
      price: '1000₽',
      type: 'month',
      description: 'Безлимитный доступ на 30 дней',
      features: ['Безлимитные расчеты и расшифровки', 'Копирование полного отчёта', 'Полный анализ здоровья, отношений и финансов', 'Рекомендации по предназначению'],
      icon: 'Calendar'
    },
    {
      name: '6 месяцев',
      price: '5000₽',
      type: 'half_year',
      description: 'Выгода 17% — 833₽/месяц',
      features: ['Безлимитные расчеты и расшифровки', 'Копирование полного отчёта', 'Все возможности месячного доступа', 'Расширенная аналитика', 'Приоритетная поддержка'],
      icon: 'TrendingUp'
    },
    {
      name: 'Год',
      price: '10000₽',
      type: 'year',
      description: 'Выгода 30% — 833₽/месяц',
      features: ['Безлимитные расчеты и расшифровки', 'Копирование полного отчёта', 'Все возможности полугодового доступа', 'Индивидуальные консультации', 'Доступ к закрытому сообществу'],
      icon: 'Award'
    }
  ];

  const oldPricingPlans = [
    {
      name: 'Полгода',
      price: '5000₽',
      type: 'half_year',
      description: 'Экономия 17%',
      features: ['Все из месячной подписки', 'Расширенная аналитика', 'Приоритетная поддержка', 'Обновления методики'],
      icon: 'TrendingUp'
    },
    {
      name: 'Год',
      price: '10000₽',
      type: 'year',
      description: 'Экономия 30%',
      features: ['Все из полугодовой подписки', 'Индивидуальные консультации', 'Доступ к закрытому сообществу', 'Сертификат специалиста'],
      icon: 'Award'
    }
  ];

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <LiveNotifications />
      
      {/* Hero Section с космической картинкой */}
      <div className="relative w-full h-[60vh] min-h-[500px] overflow-hidden">
        <img 
          src="https://cdn.poehali.dev/files/1000038242.jpg" 
          alt="Космос и судьба"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background"></div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm mb-6 border border-white/20">
            <Icon name="Sparkles" size={16} />
            <span className="font-medium">Профессиональная расшифровка Матрицы Судьбы</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            Матрица Судьбы
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 drop-shadow-lg">
            Узнайте своё предназначение, таланты и жизненные задачи через расчёт по дате рождения
          </p>

          <Button 
            onClick={scrollToCalculator}
            size="lg"
            className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90 shadow-2xl hover:scale-105 transition-all"
          >
            <Icon name="Calculator" size={20} className="mr-2" />
            Рассчитать свою матрицу
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-4">
          <Link to="/admin">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              <Icon name="Lock" size={14} className="mr-1" />
              Админка
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link to="/blog">
              <Icon name="BookOpen" size={16} className="mr-2" />
              Блог
            </Link>
          </Button>

          {!isSubscriber ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowLoginModal(true)}
              className="gap-2"
            >
              <Icon name="LogIn" size={16} />
              Войти
            </Button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm">
                <Icon name="CheckCircle2" size={16} />
                <span className="font-medium">
                  {(() => {
                    if (!subscriptionExpires) return 'Подписка активна';
                    
                    const now = new Date();
                    const expires = new Date(subscriptionExpires);
                    const diffTime = expires.getTime() - now.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays > 30) {
                      const months = Math.floor(diffDays / 30);
                      return `Подписка на ${months} ${months === 1 ? 'месяц' : 'месяца'}`;
                    } else if (diffDays > 0) {
                      return `Подписка на ${diffDays} ${diffDays === 1 ? 'день' : diffDays < 5 ? 'дня' : 'дней'}`;
                    } else {
                      return 'Подписка истекает';
                    }
                  })()}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <Icon name="LogOut" size={16} />
                Выйти
              </Button>
            </div>
          )}
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Что вы получите
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-green-100 dark:border-green-900">
              <Icon name="CheckCircle2" size={32} className="text-green-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Полная расшифровка</h3>
              <p className="text-sm text-muted-foreground">Анализ всех 4 энергий вашей матрицы</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-red-100 dark:border-red-900">
              <Icon name="Heart" size={32} className="text-red-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Отношения</h3>
              <p className="text-sm text-muted-foreground">Совместимость и рекомендации</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-green-100 dark:border-green-900">
              <Icon name="DollarSign" size={32} className="text-green-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Финансы</h3>
              <p className="text-sm text-muted-foreground">Денежное предназначение</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-100 dark:border-blue-900">
              <Icon name="Activity" size={32} className="text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Здоровье</h3>
              <p className="text-sm text-muted-foreground">Зоны внимания и рекомендации</p>
            </div>
          </div>
        </div>

        <LiveStats />

        <Card className="mb-8 shadow-xl border-2" ref={calculatorRef}>
          <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-600/10 to-pink-600/10">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Icon name="Calculator" size={24} />
              Рассчитать вашу Матрицу Судьбы
            </CardTitle>
            <CardDescription className="text-base">
              Введите данные для расчета вашей уникальной матрицы
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <label className="block text-sm font-medium mb-2">Имя</label>
              <Input
                placeholder="Введите ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email (для получения результатов)</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Дата рождения</label>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="text-lg"
              />
            </div>
            <Button 
              onClick={handleCalculate}
              disabled={!name || !birthDate || !email}
              className="w-full hover-scale text-lg py-6"
              size="lg"
            >
              <Icon name="Sparkles" size={20} className="mr-2" />
              Рассчитать матрицу
            </Button>

            {/* Админ доступ (скрытая секция) */}
            {!hasAccess && (
              <details className="mt-4">
                <summary className="cursor-pointer text-xs text-muted-foreground hover:text-primary">
                  Админ доступ
                </summary>
                <div className="mt-2 space-y-2">
                  <Input
                    type="password"
                    placeholder="Админ email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="text-sm"
                  />
                  <Button
                    onClick={handleAdminAccess}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Активировать админ доступ
                  </Button>
                </div>
              </details>
            )}
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-8">
            <Card className="shadow-xl border-2 border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-600/10 to-pink-600/10">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="User" size={24} />
                  Ваша Матрица Судьбы, {result.name}
                </CardTitle>
                <CardDescription>
                  Базовый расчет ваших энергий по дате рождения
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => {
                      if (hasAccess) {
                        setActiveTab('personal');
                        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className={`p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-2 border-blue-200 dark:border-blue-800 text-left transition-all ${hasAccess ? 'hover:shadow-xl hover:scale-105 cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="User" size={20} className="text-blue-600" />
                      <h3 className="font-bold text-blue-900 dark:text-blue-100">Личное</h3>
                    </div>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{result.personal}</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">Ваше истинное Я</p>
                    {hasAccess && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1">
                        <Icon name="ChevronDown" size={14} />
                        Нажмите для подробностей
                      </p>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (hasAccess) {
                        setActiveTab('destiny');
                        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className={`p-6 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-2 border-purple-200 dark:border-purple-800 text-left transition-all ${hasAccess ? 'hover:shadow-xl hover:scale-105 cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Target" size={20} className="text-purple-600" />
                      <h3 className="font-bold text-purple-900 dark:text-purple-100">Предназначение</h3>
                    </div>
                    <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{result.destiny}</p>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">Ваша миссия</p>
                    {hasAccess && (
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 flex items-center gap-1">
                        <Icon name="ChevronDown" size={14} />
                        Нажмите для подробностей
                      </p>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (hasAccess) {
                        setActiveTab('social');
                        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className={`p-6 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-2 border-green-200 dark:border-green-800 text-left transition-all ${hasAccess ? 'hover:shadow-xl hover:scale-105 cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Users" size={20} className="text-green-600" />
                      <h3 className="font-bold text-green-900 dark:text-green-100">Социальное</h3>
                    </div>
                    <p className="text-4xl font-bold text-green-600 dark:text-green-400">{result.social}</p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-2">Как вас видят</p>
                    {hasAccess && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                        <Icon name="ChevronDown" size={14} />
                        Нажмите для подробностей
                      </p>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (hasAccess) {
                        setActiveTab('spiritual');
                        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className={`p-6 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-2 border-amber-200 dark:border-amber-800 text-left transition-all ${hasAccess ? 'hover:shadow-xl hover:scale-105 cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Sparkles" size={20} className="text-amber-600" />
                      <h3 className="font-bold text-amber-900 dark:text-amber-100">Духовное</h3>
                    </div>
                    <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">{result.spiritual}</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-2">Ваш духовный путь</p>
                    {hasAccess && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
                        <Icon name="ChevronDown" size={14} />
                        Нажмите для подробностей
                      </p>
                    )}
                  </button>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
                  <p className="text-sm text-muted-foreground text-center">
                    <Icon name="Info" size={16} className="inline mr-1" />
                    Для получения полной расшифровки всех энергий оформите доступ
                  </p>
                </div>
              </CardContent>
            </Card>

            <div ref={detailsRef}>
              <UnifiedMatrixResult result={result} hasAccess={hasAccess} />
              <ProfessionalPromo />
            </div>

            {hasAccess ? (
              <Card className="shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Icon name="BookOpen" size={24} />
                        Детальная расшифровка по каждой энергии
                      </CardTitle>
                      <CardDescription>
                        Подробный анализ каждого аспекта отдельно
                      </CardDescription>
                    </div>
                    <Button
                      onClick={handleShare}
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Icon name="Share2" size={18} />
                      <span className="hidden sm:inline">Скопировать весь отчёт</span>
                      <span className="sm:hidden">Копировать всё</span>
                    </Button>
                  </div>
                  {hasAccess && (
                    <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-t">
                      <div className="flex items-start gap-3 text-sm">
                        <Icon name="Share2" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-primary mb-1">📋 Скопировать весь отчёт:</p>
                          <p className="text-muted-foreground">
                            Нажмите кнопку выше — скопируется ВСЯ информация с экрана: все 4 энергии, здоровье, отношения, финансы, профессии (~40-50 страниц текста). Затем вставьте в WhatsApp, Telegram или другой мессенджер
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
                      <TabsTrigger value="personal" className="text-xs sm:text-sm">Личное</TabsTrigger>
                      <TabsTrigger value="destiny" className="text-xs sm:text-sm">Предназначение</TabsTrigger>
                      <TabsTrigger value="social" className="text-xs sm:text-sm">Социальное</TabsTrigger>
                      <TabsTrigger value="spiritual" className="text-xs sm:text-sm">Духовное</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="space-y-6 mt-6">
                      <div className="space-y-6">
                        <div className="p-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 rounded-lg shadow-md border-l-4 border-primary">
                          <h4 className="font-bold text-2xl mb-4 text-primary flex items-center gap-2">
                            <Icon name="User" size={24} />
                            Личное предназначение: {energyDescriptions[result.personal]?.title}
                          </h4>
                          <div className="prose prose-base max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                              {energyDescriptions[result.personal]?.description}
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg shadow-md border-l-4 border-green-600">
                          <h4 className="font-bold text-2xl mb-4 text-green-900 dark:text-green-100 flex items-center gap-2">
                            <Icon name="Activity" size={24} />
                            Здоровье и тело
                          </h4>
                          <div className="prose prose-base max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                              {energyDescriptions[result.personal]?.health}
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 rounded-lg shadow-md border-l-4 border-pink-600">
                          <h4 className="font-bold text-2xl mb-4 text-pink-900 dark:text-pink-100 flex items-center gap-2">
                            <Icon name="Heart" size={24} />
                            Отношения и любовь
                          </h4>
                          <div className="prose prose-base max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                              {energyDescriptions[result.personal]?.relationships}
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 rounded-lg shadow-md border-l-4 border-amber-600">
                          <h4 className="font-bold text-2xl mb-4 text-amber-900 dark:text-amber-100 flex items-center gap-2">
                            <Icon name="DollarSign" size={24} />
                            Деньги и финансы
                          </h4>
                          <div className="prose prose-base max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                              {energyDescriptions[result.personal]?.finance}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="destiny" className="space-y-6 mt-6">
                      <div className="space-y-6">
                        <div className="p-6 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 rounded-lg shadow-md border-l-4 border-purple-600">
                          <h4 className="font-bold text-2xl mb-4 text-purple-900 dark:text-purple-100 flex items-center gap-2">
                            <Icon name="Target" size={24} />
                            Предназначение: {energyDescriptions[result.destiny]?.title}
                          </h4>
                          <div className="prose prose-base max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                              {energyDescriptions[result.destiny]?.description}
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg shadow-md border-l-4 border-green-600">
                          <h4 className="font-bold text-2xl mb-4 text-green-900 dark:text-green-100 flex items-center gap-2">
                            <Icon name="Activity" size={24} />
                            Здоровье и тело
                          </h4>
                          <div className="prose prose-base max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                              {energyDescriptions[result.destiny]?.health}
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 rounded-lg shadow-md border-l-4 border-pink-600">
                          <h4 className="font-bold text-2xl mb-4 text-pink-900 dark:text-pink-100 flex items-center gap-2">
                            <Icon name="Heart" size={24} />
                            Отношения и любовь
                          </h4>
                          <div className="prose prose-base max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                              {energyDescriptions[result.destiny]?.relationships}
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 rounded-lg shadow-md border-l-4 border-amber-600">
                          <h4 className="font-bold text-2xl mb-4 text-amber-900 dark:text-amber-100 flex items-center gap-2">
                            <Icon name="DollarSign" size={24} />
                            Деньги и финансы
                          </h4>
                          <div className="prose prose-base max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                              {energyDescriptions[result.destiny]?.finance}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="social" className="space-y-6 mt-6">
                      <div className="space-y-6">
                        <div className="p-6 bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950 rounded-lg shadow-md border-l-4 border-green-600">
                          <h4 className="font-bold text-2xl mb-4 text-green-900 dark:text-green-100 flex items-center gap-2">
                            <Icon name="Users" size={24} />
                            Социальное: {energyDescriptions[result.social]?.title}
                          </h4>
                          <div className="prose prose-base max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                              {energyDescriptions[result.social]?.description}
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg shadow-md border-l-4 border-green-600">
                          <h4 className="font-bold text-2xl mb-4 text-green-900 dark:text-green-100 flex items-center gap-2">
                            <Icon name="Activity" size={24} />
                            Здоровье и тело
                          </h4>
                          <div className="prose prose-base max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                              {energyDescriptions[result.social]?.health}
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 rounded-lg shadow-md border-l-4 border-pink-600">
                          <h4 className="font-bold text-2xl mb-4 text-pink-900 dark:text-pink-100 flex items-center gap-2">
                            <Icon name="Heart" size={24} />
                            Отношения и любовь
                          </h4>
                          <div className="prose prose-base max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                              {energyDescriptions[result.social]?.relationships}
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 rounded-lg shadow-md border-l-4 border-amber-600">
                          <h4 className="font-bold text-2xl mb-4 text-amber-900 dark:text-amber-100 flex items-center gap-2">
                            <Icon name="DollarSign" size={24} />
                            Деньги и финансы
                          </h4>
                          <div className="prose prose-base max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                              {energyDescriptions[result.social]?.finance}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="spiritual" className="space-y-6 mt-6">
                      <div className="space-y-6">
                        <div className="p-6 bg-gradient-to-br from-white to-amber-50 dark:from-gray-900 dark:to-amber-950 rounded-lg shadow-md border-l-4 border-amber-600">
                          <h4 className="font-bold text-2xl mb-4 text-amber-900 dark:text-amber-100 flex items-center gap-2">
                            <Icon name="Sparkles" size={24} />
                            Духовное: {energyDescriptions[result.spiritual]?.title}
                          </h4>
                          <div className="prose prose-base max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                              {energyDescriptions[result.spiritual]?.description}
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg shadow-md border-l-4 border-green-600">
                          <h4 className="font-bold text-2xl mb-4 text-green-900 dark:text-green-100 flex items-center gap-2">
                            <Icon name="Activity" size={24} />
                            Здоровье и тело
                          </h4>
                          <div className="prose prose-base max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                              {energyDescriptions[result.spiritual]?.health}
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 rounded-lg shadow-md border-l-4 border-pink-600">
                          <h4 className="font-bold text-2xl mb-4 text-pink-900 dark:text-pink-100 flex items-center gap-2">
                            <Icon name="Heart" size={24} />
                            Отношения и любовь
                          </h4>
                          <div className="prose prose-base max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                              {energyDescriptions[result.spiritual]?.relationships}
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 rounded-lg shadow-md border-l-4 border-amber-600">
                          <h4 className="font-bold text-2xl mb-4 text-amber-900 dark:text-amber-100 flex items-center gap-2">
                            <Icon name="DollarSign" size={24} />
                            Деньги и финансы
                          </h4>
                          <div className="prose prose-base max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
                              {energyDescriptions[result.spiritual]?.finance}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : showPricing ? (
              <Card className="shadow-xl border-2 border-primary">
                <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-600/10 to-pink-600/10">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Icon name="Sparkles" size={24} />
                    Получить полную расшифровку
                  </CardTitle>
                  <CardDescription className="text-base">
                    Выберите подходящий тариф для доступа к детальному анализу
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {pricingPlans.map((plan, index) => (
                      <Card 
                        key={index} 
                        className={`relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 ${
                          index === 1 ? 'border-2 border-primary shadow-xl scale-105' : ''
                        }`}
                      >
                        {index === 1 && (
                          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                            Популярный
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <Icon name={plan.icon as any} size={24} className="text-primary" />
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                          </div>
                          <div className="text-3xl font-bold text-primary">{plan.price}</div>
                          <CardDescription className="text-sm">{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 mb-4">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <Icon name="Check" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <Button 
                            className="w-full hover-scale" 
                            size="lg"
                            onClick={() => handlePayment(plan.type)}
                            variant={index === 1 ? 'default' : 'outline'}
                          >
                            <Icon name="CreditCard" size={16} className="mr-2" />
                            Выбрать
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900 dark:text-blue-100">
                        <p className="font-medium mb-1">Что входит в полную расшифровку:</p>
                        <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                          <li>• Детальный анализ всех 4 энергий (личной, предназначения, социальной, духовной)</li>
                          <li>• Рекомендации по здоровью с указанием слабых зон</li>
                          <li>• Анализ отношений и совместимости</li>
                          <li>• Финансовое предназначение и профессии</li>
                          <li>• Копирование полного отчёта (~40-50 страниц текста)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        )}

        <CTABlock onCalculate={scrollToCalculator} />
        
        <Testimonials />
        
        {/* Футер с ссылкой на админ-панель */}
        <footer className="mt-16 py-8 border-t">
          <div className="text-center">
            <Link 
              to="/admin" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              <Icon name="Shield" size={16} />
              Админ-панель
            </Link>
          </div>
        </footer>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowLoginModal(false)}>
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="LogIn" size={24} />
                Вход в аккаунт
              </CardTitle>
              <CardDescription>
                Введите email, который вы использовали при оплате подписки
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLogin();
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleLogin}
                  className="flex-1"
                >
                  <Icon name="LogIn" size={16} className="mr-2" />
                  Войти
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowLoginModal(false)}
                >
                  Отмена
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Нет подписки? <button onClick={() => { setShowLoginModal(false); scrollToCalculator(); }} className="text-primary hover:underline">Оформить подписку</button>
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}