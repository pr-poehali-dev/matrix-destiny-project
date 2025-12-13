import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { checkAccess, generateReport, downloadPDF, shareReport } from '@/lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { LiveStats } from '@/components/LiveStats';
import { LiveNotifications } from '@/components/LiveNotifications';
import { Testimonials } from '@/components/Testimonials';
import { CTABlock } from '@/components/CTABlock';
import { energyDescriptions } from '@/data/arcana-descriptions';

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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [subscriptionExpires, setSubscriptionExpires] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const calculatorRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadPDF = async () => {
    if (!result || !hasAccess) {
      toast({
        title: 'Доступ ограничен',
        description: 'Оплатите подписку для скачивания отчета',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsGeneratingPDF(true);
      const reportData = await generateReport({
        name: result.name,
        birth_date: birthDate,
        personal: result.personal,
        destiny: result.destiny,
        social: result.social,
        spiritual: result.spiritual,
        email: email,
      });

      downloadPDF(reportData.pdf, reportData.filename);
      
      if (email) {
        const accessCheck = await checkAccess(email);
        setHasAccess(accessCheck.has_access);
      }
      
      toast({
        title: '✅ PDF готов!',
        description: 'Отчет успешно скачан',
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка генерации PDF',
        description: error?.message || 'Попробуйте позже',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShare = async () => {
    if (!result) return;

    try {
      const shareResult = await shareReport({
        name: result.name,
        birth_date: birthDate,
        personal: result.personal,
        destiny: result.destiny,
        social: result.social,
        spiritual: result.spiritual,
      });

      if (shareResult === 'shared') {
        toast({
          title: '✅ Поделились!',
          description: 'Отчет успешно отправлен',
        });
      } else {
        toast({
          title: '✅ Ссылка скопирована',
          description: 'Отправьте её через любой мессенджер',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось поделиться отчетом',
        variant: 'destructive',
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
    setIsSubscriber(false);
    setHasAccess(false);
    toast({
      title: 'Вы вышли из аккаунта',
      description: 'Сессия на этом устройстве завершена',
    });
  };

  const pricingPlans = [
    {
      name: 'Разовый доступ',
      price: '200₽',
      type: 'single',
      description: 'Одноразовая полная расшифровка',
      features: ['Полная расшифровка всех энергий', 'Анализ предназначения', 'Рекомендации по здоровью', 'Анализ отношений и финансов', 'PDF-отчет для печати'],
      icon: 'FileText'
    },
    {
      name: 'Месяц',
      price: '1000₽',
      type: 'month',
      description: 'Безлимитный доступ на 30 дней',
      features: ['Безлимитные расчеты и расшифровки', 'Безлимитное скачивание PDF', 'Полный анализ здоровья, отношений и финансов', 'Рекомендации по предназначению'],
      icon: 'Calendar'
    },
    {
      name: '6 месяцев',
      price: '5000₽',
      type: 'half_year',
      description: 'Выгода 17% — 833₽/месяц',
      features: ['Безлимитные расчеты и расшифровки', 'Безлимитное скачивание PDF', 'Все возможности месячного доступа', 'Расширенная аналитика', 'Приоритетная поддержка'],
      icon: 'TrendingUp'
    },
    {
      name: 'Год',
      price: '10000₽',
      type: 'year',
      description: 'Выгода 30% — 833₽/месяц',
      features: ['Безлимитные расчеты и расшифровки', 'Безлимитное скачивание PDF', 'Все возможности полугодового доступа', 'Индивидуальные консультации', 'Доступ к закрытому сообществу'],
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
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-4">
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

          {isSubscriber && (
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
            </div>
          )}
        </div>

        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-4">
            <Icon name="Sparkles" size={16} />
            <span className="font-medium">Профессиональная расшифровка Матрицы Судьбы</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Матрица Судьбы: Расшифровка онлайн
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Узнайте свое предназначение, таланты и жизненные задачи через расчет Матрицы Судьбы по дате рождения
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <Icon name="CheckCircle2" size={18} className="text-green-600" />
              <span>Полная расшифровка всех энергий</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Heart" size={18} className="text-red-600" />
              <span>Анализ отношений и совместимости</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="DollarSign" size={18} className="text-green-600" />
              <span>Финансовое предназначение</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Activity" size={18} className="text-blue-600" />
              <span>Рекомендации по здоровью</span>
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
                  <div className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-2 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="User" size={20} className="text-blue-600" />
                      <h3 className="font-bold text-blue-900 dark:text-blue-100">Личное</h3>
                    </div>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{result.personal}</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">Ваше истинное Я</p>
                  </div>

                  <div className="p-6 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-2 border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Target" size={20} className="text-purple-600" />
                      <h3 className="font-bold text-purple-900 dark:text-purple-100">Предназначение</h3>
                    </div>
                    <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{result.destiny}</p>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">Ваша миссия</p>
                  </div>

                  <div className="p-6 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-2 border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Users" size={20} className="text-green-600" />
                      <h3 className="font-bold text-green-900 dark:text-green-100">Социальное</h3>
                    </div>
                    <p className="text-4xl font-bold text-green-600 dark:text-green-400">{result.social}</p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-2">Как вас видят</p>
                  </div>

                  <div className="p-6 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-2 border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Sparkles" size={20} className="text-amber-600" />
                      <h3 className="font-bold text-amber-900 dark:text-amber-100">Духовное</h3>
                    </div>
                    <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">{result.spiritual}</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-2">Ваш духовный путь</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
                  <p className="text-sm text-muted-foreground text-center">
                    <Icon name="Info" size={16} className="inline mr-1" />
                    Для получения полной расшифровки всех энергий оформите доступ
                  </p>
                </div>
              </CardContent>
            </Card>

            {hasAccess ? (
              <Card className="shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Icon name="BookOpen" size={24} />
                        Детальная расшифровка
                      </CardTitle>
                      <CardDescription>
                        Полный анализ всех ваших энергий и рекомендации
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleShare}
                        variant="outline"
                        className="gap-2"
                      >
                        <Icon name="Share2" size={16} />
                        Поделиться
                      </Button>
                      <Button
                        onClick={handleDownloadPDF}
                        disabled={isGeneratingPDF}
                        className="gap-2 hover-scale"
                      >
                        {isGeneratingPDF ? (
                          <>
                            <Icon name="Loader2" size={16} className="animate-spin" />
                            Генерация...
                          </>
                        ) : (
                          <>
                            <Icon name="Download" size={16} />
                            Скачать PDF
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="personal">Личное</TabsTrigger>
                      <TabsTrigger value="destiny">Предназначение</TabsTrigger>
                      <TabsTrigger value="social">Социальное</TabsTrigger>
                      <TabsTrigger value="spiritual">Духовное</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal" className="space-y-6 mt-6">
                      <div className="space-y-6">
                        <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-primary">
                          <h4 className="font-bold text-xl mb-4 text-primary flex items-center gap-2">
                            <Icon name="User" size={24} />
                            Личное предназначение: {energyDescriptions[result.personal]?.title}
                          </h4>
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap">{energyDescriptions[result.personal]?.description}</div>
                          </div>
                        </div>

                        <div className="p-6 bg-green-50 rounded-lg shadow-sm border-l-4 border-green-600">
                          <h4 className="font-bold text-xl mb-4 text-green-900 flex items-center gap-2">
                            <Icon name="Activity" size={24} />
                            Здоровье и тело
                          </h4>
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap">{energyDescriptions[result.personal]?.health}</div>
                          </div>
                        </div>

                        <div className="p-6 bg-pink-50 rounded-lg shadow-sm border-l-4 border-pink-600">
                          <h4 className="font-bold text-xl mb-4 text-pink-900 flex items-center gap-2">
                            <Icon name="Heart" size={24} />
                            Отношения и любовь
                          </h4>
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap">{energyDescriptions[result.personal]?.relationships}</div>
                          </div>
                        </div>

                        <div className="p-6 bg-amber-50 rounded-lg shadow-sm border-l-4 border-amber-600">
                          <h4 className="font-bold text-xl mb-4 text-amber-900 flex items-center gap-2">
                            <Icon name="DollarSign" size={24} />
                            Деньги и финансы
                          </h4>
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap">{energyDescriptions[result.personal]?.finance}</div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="destiny" className="space-y-6 mt-6">
                      <div className="space-y-6">
                        <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-purple-600">
                          <h4 className="font-bold text-xl mb-4 text-purple-900 flex items-center gap-2">
                            <Icon name="Target" size={24} />
                            Предназначение: {energyDescriptions[result.destiny]?.title}
                          </h4>
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap">{energyDescriptions[result.destiny]?.description}</div>
                          </div>
                        </div>

                        <div className="p-6 bg-green-50 rounded-lg shadow-sm border-l-4 border-green-600">
                          <h4 className="font-bold text-xl mb-4 text-green-900 flex items-center gap-2">
                            <Icon name="Activity" size={24} />
                            Здоровье и тело
                          </h4>
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap">{energyDescriptions[result.destiny]?.health}</div>
                          </div>
                        </div>

                        <div className="p-6 bg-pink-50 rounded-lg shadow-sm border-l-4 border-pink-600">
                          <h4 className="font-bold text-xl mb-4 text-pink-900 flex items-center gap-2">
                            <Icon name="Heart" size={24} />
                            Отношения и любовь
                          </h4>
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap">{energyDescriptions[result.destiny]?.relationships}</div>
                          </div>
                        </div>

                        <div className="p-6 bg-amber-50 rounded-lg shadow-sm border-l-4 border-amber-600">
                          <h4 className="font-bold text-xl mb-4 text-amber-900 flex items-center gap-2">
                            <Icon name="DollarSign" size={24} />
                            Деньги и финансы
                          </h4>
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap">{energyDescriptions[result.destiny]?.finance}</div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="social" className="space-y-6 mt-6">
                      <div className="space-y-6">
                        <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-green-600">
                          <h4 className="font-bold text-xl mb-4 text-green-900 flex items-center gap-2">
                            <Icon name="Users" size={24} />
                            Социальное: {energyDescriptions[result.social]?.title}
                          </h4>
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap">{energyDescriptions[result.social]?.description}</div>
                          </div>
                        </div>

                        <div className="p-6 bg-green-50 rounded-lg shadow-sm border-l-4 border-green-600">
                          <h4 className="font-bold text-xl mb-4 text-green-900 flex items-center gap-2">
                            <Icon name="Activity" size={24} />
                            Здоровье и тело
                          </h4>
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap">{energyDescriptions[result.social]?.health}</div>
                          </div>
                        </div>

                        <div className="p-6 bg-pink-50 rounded-lg shadow-sm border-l-4 border-pink-600">
                          <h4 className="font-bold text-xl mb-4 text-pink-900 flex items-center gap-2">
                            <Icon name="Heart" size={24} />
                            Отношения и любовь
                          </h4>
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap">{energyDescriptions[result.social]?.relationships}</div>
                          </div>
                        </div>

                        <div className="p-6 bg-amber-50 rounded-lg shadow-sm border-l-4 border-amber-600">
                          <h4 className="font-bold text-xl mb-4 text-amber-900 flex items-center gap-2">
                            <Icon name="DollarSign" size={24} />
                            Деньги и финансы
                          </h4>
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap">{energyDescriptions[result.social]?.finance}</div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="spiritual" className="space-y-6 mt-6">
                      <div className="space-y-6">
                        <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-amber-600">
                          <h4 className="font-bold text-xl mb-4 text-amber-900 flex items-center gap-2">
                            <Icon name="Sparkles" size={24} />
                            Духовное: {energyDescriptions[result.spiritual]?.title}
                          </h4>
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap">{energyDescriptions[result.spiritual]?.description}</div>
                          </div>
                        </div>

                        <div className="p-6 bg-green-50 rounded-lg shadow-sm border-l-4 border-green-600">
                          <h4 className="font-bold text-xl mb-4 text-green-900 flex items-center gap-2">
                            <Icon name="Activity" size={24} />
                            Здоровье и тело
                          </h4>
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap">{energyDescriptions[result.spiritual]?.health}</div>
                          </div>
                        </div>

                        <div className="p-6 bg-pink-50 rounded-lg shadow-sm border-l-4 border-pink-600">
                          <h4 className="font-bold text-xl mb-4 text-pink-900 flex items-center gap-2">
                            <Icon name="Heart" size={24} />
                            Отношения и любовь
                          </h4>
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap">{energyDescriptions[result.spiritual]?.relationships}</div>
                          </div>
                        </div>

                        <div className="p-6 bg-amber-50 rounded-lg shadow-sm border-l-4 border-amber-600">
                          <h4 className="font-bold text-xl mb-4 text-amber-900 flex items-center gap-2">
                            <Icon name="DollarSign" size={24} />
                            Деньги и финансы
                          </h4>
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap">{energyDescriptions[result.spiritual]?.finance}</div>
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
                          <li>• PDF-отчет для печати и хранения</li>
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
      </div>
    </div>
  );
}
