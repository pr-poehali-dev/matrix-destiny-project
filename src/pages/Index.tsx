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

const energyDescriptions: Record<number, { title: string; description: string; health: string; relationships: string; finance: string }> = {
  1: {
    title: 'Маг',
    description: 'Вы пришли в этот мир, чтобы создавать и трансформировать реальность. Ваше предназначение — быть проводником энергии созидания.',
    health: 'Важно работать с горловой чакрой. Проблемы с щитовидной железой могут возникать при непроявленности.',
    relationships: 'Вам нужен партнер, который принимает вашу силу и индивидуальность.',
    finance: 'Деньги приходят через творчество и уникальные проекты.'
  },
  2: {
    title: 'Жрица',
    description: 'Ваше предназначение — быть мудрым наставником, хранителем знаний и духовным учителем.',
    health: 'Проблемы с женской энергией, гормональные сбои при блокировках.',
    relationships: 'Нужен глубокий эмоциональный контакт и духовная связь.',
    finance: 'Деньги приходят через обучение, консультации, работу с людьми.'
  },
  3: {
    title: 'Императрица',
    description: 'Вы — источник изобилия, заботы и материнской энергии. Предназначение — создавать и взращивать.',
    health: 'Репродуктивная система требует внимания. Проблемы с весом при дисбалансе.',
    relationships: 'Вам важно проявлять заботу, но не растворяться в партнере.',
    finance: 'Изобилие приходит через щедрость и создание красоты.'
  },
  4: {
    title: 'Император',
    description: 'Ваше предназначение — строить структуры, быть лидером и опорой для других.',
    health: 'Проблемы с позвоночником и костями при непринятии ответственности.',
    relationships: 'Вам нужен равный партнер, с которым можно строить империю.',
    finance: 'Деньги приходят через системный подход и управление.'
  },
  5: {
    title: 'Иерофант',
    description: 'Вы — учитель и хранитель традиций. Предназначение — передавать мудрость.',
    health: 'Проблемы со слухом и горлом при неумении слышать истину.',
    relationships: 'Важны общие ценности и духовное развитие.',
    finance: 'Доход через образование, консультации, наставничество.'
  },
  6: {
    title: 'Влюбленные',
    description: 'Ваше предназначение — учиться делать выбор и строить гармоничные отношения.',
    health: 'Сердечно-сосудистая система требует внимания при блокировках.',
    relationships: 'Необходимо проработать страх выбора и зависимости.',
    finance: 'Деньги через партнерство и совместные проекты.'
  },
  7: {
    title: 'Колесница',
    description: 'Вы — воин и победитель. Предназначение — двигаться вперед, преодолевая препятствия.',
    health: 'Проблемы с ногами и суставами при отсутствии движения вперед.',
    relationships: 'Нужен партнер, который поддержит ваши амбиции.',
    finance: 'Деньги приходят через активные действия и достижения.'
  },
  8: {
    title: 'Справедливость',
    description: 'Ваше предназначение — восстанавливать баланс и справедливость в мире.',
    health: 'Проблемы с почками и мочевыделительной системой при дисбалансе.',
    relationships: 'Важны честность и равноправие в отношениях.',
    finance: 'Доход через юридическую сферу, консалтинг, восстановление справедливости.'
  },
  9: {
    title: 'Отшельник',
    description: 'Вы пришли обрести мудрость через одиночество и самопознание.',
    health: 'Проблемы со зрением и нервной системой при избегании уединения.',
    relationships: 'Вам нужно время наедине с собой, партнер должен это понимать.',
    finance: 'Деньги через экспертность, консультации, индивидуальную работу.'
  },
  10: {
    title: 'Колесо Фортуны',
    description: 'Ваша жизнь полна циклов и изменений. Предназначение — принять изменчивость.',
    health: 'Нестабильное здоровье, зависит от жизненных циклов.',
    relationships: 'Отношения проходят через трансформации и обновления.',
    finance: 'Финансовые циклы — взлеты и падения, важно создавать подушку безопасности.'
  },
  11: {
    title: 'Сила',
    description: 'Ваше предназначение — укрощать внутренних демонов и проявлять истинную силу.',
    health: 'Проблемы с мышцами и физической силой при подавлении энергии.',
    relationships: 'Важно не подавлять партнера своей силой.',
    finance: 'Деньги через волевые усилия и преодоление страхов.'
  },
  12: {
    title: 'Повешенный',
    description: 'Вы пришли научиться жертвенности и смотреть на мир под другим углом.',
    health: 'Проблемы с кровообращением и варикоз при застревании в ситуациях.',
    relationships: 'Необходимо проработать жертвенность и созависимость.',
    finance: 'Деньги могут приходить неожиданными путями, важно отпустить контроль.'
  },
  13: {
    title: 'Смерть',
    description: 'Ваше предназначение — трансформация и освобождение от старого.',
    health: 'Глубокие кризисы здоровья как точки трансформации.',
    relationships: 'Отношения проходят через кардинальные трансформации.',
    finance: 'Финансовые перерождения, важно отпускать старые источники дохода.'
  },
  14: {
    title: 'Умеренность',
    description: 'Вы — алхимик, соединяющий противоположности. Предназначение — баланс.',
    health: 'Проблемы с обменом веществ и печенью при дисбалансе.',
    relationships: 'Важно найти баланс между отдаванием и принятием.',
    finance: 'Деньги через умеренность и разумное распределение ресурсов.'
  },
  15: {
    title: 'Дьявол',
    description: 'Ваша задача — освободиться от зависимостей и материальных иллюзий.',
    health: 'Склонность к зависимостям, важно работать с удовольствиями.',
    relationships: 'Проработка созависимости и токсичных паттернов.',
    finance: 'Деньги через трансформацию теневых сторон в силу.'
  },
  16: {
    title: 'Башня',
    description: 'Вы — разрушитель старых структур. Предназначение — создавать через разрушение.',
    health: 'Внезапные острые заболевания как сигналы к изменениям.',
    relationships: 'Отношения могут резко меняться, важна гибкость.',
    finance: 'Финансовые потрясения ведут к новым возможностям.'
  },
  17: {
    title: 'Звезда',
    description: 'Вы — источник надежды и вдохновения. Предназначение — светить другим.',
    health: 'Проблемы с лимфатической системой при блокировке вдохновения.',
    relationships: 'Вам нужен партнер, который верит в ваши мечты.',
    finance: 'Деньги через творчество, искусство, вдохновляющую деятельность.'
  },
  18: {
    title: 'Луна',
    description: 'Ваше предназначение — познать глубины подсознания и работать с интуицией.',
    health: 'Психосоматические заболевания, важна работа с подсознанием.',
    relationships: 'Глубокие эмоциональные связи, возможны иллюзии.',
    finance: 'Деньги через интуитивную деятельность, творчество, психологию.'
  },
  19: {
    title: 'Солнце',
    description: 'Вы — источник света и радости. Предназначение — дарить тепло миру.',
    health: 'Витальная энергия высокая, но может выгорать при чрезмерной отдаче.',
    relationships: 'Открытые, радостные отношения, важна искренность.',
    finance: 'Изобилие приходит естественно через самореализацию.'
  },
  20: {
    title: 'Суд',
    description: 'Ваша задача — пробуждать и трансформировать. Предназначение — возрождение.',
    health: 'Кризисные состояния ведут к обновлению и исцелению.',
    relationships: 'Кармические связи, важно проработать прошлое.',
    finance: 'Деньги через работу с прошлым, исцеление, трансформацию.'
  },
  21: {
    title: 'Мир',
    description: 'Вы пришли достичь целостности и гармонии. Предназначение — завершение циклов.',
    health: 'Гармоничное здоровье при проработанности всех аспектов.',
    relationships: 'Целостные, зрелые отношения.',
    finance: 'Финансовое изобилие через целостность и завершение проектов.'
  },
  22: {
    title: 'Шут',
    description: 'Ваше предназначение — начинать заново, быть свободным и спонтанным.',
    health: 'Травмы и несчастные случаи при недостатке осознанности.',
    relationships: 'Свободные отношения, важна независимость.',
    finance: 'Деньги через риск, новые начинания, необычные проекты.'
  }
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
            onClick={() => navigate('/admin')}
            className="gap-2 text-gray-500 hover:text-gray-900"
          >
            <Icon name="Shield" size={16} />
            <span className="hidden md:inline">Админ</span>
          </Button>
          
          <div>
            {isSubscriber ? (
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600 hidden md:block">
                  <Icon name="CheckCircle" size={16} className="inline text-green-600 mr-1" />
                  Вы авторизованы как подписчик
                  {subscriptionExpires && (() => {
                    const daysLeft = Math.ceil((new Date(subscriptionExpires).getTime() - new Date().getTime()) / 86400000);
                    return daysLeft > 0 ? ` (ещё ${daysLeft} дн.)` : ' (истекает сегодня)';
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
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
                className="gap-2"
              >
                <Icon name="LogIn" size={16} />
                Вход для подписчиков
              </Button>
            )}
          </div>
        </div>

        <header className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <LiveStats baseCount={25000} />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4 tracking-tight">
            Узнай О Себе Всё
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Рассчитай матрицу судьбы за 30 секунд — узнай своё предназначение, здоровье и финансовые возможности
          </p>
          
          <div className="flex justify-center gap-4">
            <Link to="/about" className="text-primary hover:underline text-sm font-medium">
              Узнать больше о методе →
            </Link>
            <Link to="/blog" className="text-primary hover:underline text-sm font-medium">
              База знаний для специалистов →
            </Link>
          </div>
          
          <div className="flex justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Icon name="Star" size={16} />
              4.9 рейтинг
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Shield" size={16} />
              Конфиденциально
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Zap" size={16} />
              30 секунд
            </span>
          </div>
        </header>

        <div ref={calculatorRef} className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Icon name="Sparkles" className="text-primary" />
                Бесплатный расчёт
              </CardTitle>
              <CardDescription className="text-base">
                Получите краткую расшифровку прямо сейчас — за 30 секунд
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Имя</label>
                <Input
                  placeholder="Введите имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Дата рождения</label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="text-lg"
                />
              </div>
              <Button
                onClick={handleCalculate}
                className="w-full text-lg py-6 hover-scale"
                size="lg"
              >
                <Icon name="Sparkles" className="mr-2" />
                Рассчитать матрицу
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Icon name="Target" className="text-accent" />
                Для кого эта система?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-card rounded-lg">
                <Icon name="Users" className="text-primary mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Для психологов</h3>
                  <p className="text-muted-foreground">
                    Ускорьте диагностику клиента в 3 раза, сразу увидите корневые проблемы
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-card rounded-lg">
                <Icon name="Heart" className="text-accent mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Для специалистов</h3>
                  <p className="text-muted-foreground">
                    Коучи, тарологи, нумерологи — получите глубинное понимание клиента
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-card rounded-lg">
                <Icon name="User" className="text-primary mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Для самопознания</h3>
                  <p className="text-muted-foreground">
                    Поймите причины проблем с деньгами, здоровьем, отношениями
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {result && (
          <div className="space-y-8 animate-fade-in">
            <Card className="shadow-xl border-2 border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl">
                      Матрица для {result.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      Базовый расчет основных энергий
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="hover-scale"
                    >
                      <Icon name="Share2" className="mr-2" size={16} />
                      Поделиться
                    </Button>
                    {hasAccess && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleDownloadPDF}
                        disabled={isGeneratingPDF}
                        className="hover-scale"
                      >
                        <Icon name="Download" className="mr-2" size={16} />
                        {isGeneratingPDF ? 'Генерация...' : 'Скачать PDF'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                        {result.personal}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Личное предназначение</h3>
                        <p className="text-sm text-muted-foreground">
                          {energyDescriptions[result.personal]?.title || 'Энергия'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-2xl font-bold">
                        {result.destiny}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Энергия судьбы</h3>
                        <p className="text-sm text-muted-foreground">
                          {energyDescriptions[result.destiny]?.title || 'Энергия'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-2xl font-bold">
                        {result.social}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Социальная энергия</h3>
                        <p className="text-sm text-muted-foreground">
                          {energyDescriptions[result.social]?.title || 'Энергия'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/70 text-primary-foreground flex items-center justify-center text-2xl font-bold">
                        {result.spiritual}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Духовная энергия</h3>
                        <p className="text-sm text-muted-foreground">
                          {energyDescriptions[result.spiritual]?.title || 'Энергия'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <Icon name="Share2" />
                    Поделиться результатом
                  </Button>
                </div>

                {hasAccess ? (
                  <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <div className="flex items-center gap-3 mb-6">
                      <Icon name="CheckCircle" className="text-green-600" size={32} />
                      <div>
                        <h3 className="text-xl font-semibold text-green-900">✅ Доступ активен!</h3>
                        <p className="text-green-700">
                          Полная расшифровка вашей матрицы судьбы по всем аспектам<br/>
                          <span className="text-sm">Прокрутите вниз для просмотра всех 4 энергий</span>
                        </p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-primary">
                        <h4 className="font-bold text-xl mb-4 text-primary flex items-center gap-2">
                          <Icon name="User" size={24} />
                          Личное предназначение: {energyDescriptions[result.personal]?.title}
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-semibold text-md mb-2 flex items-center gap-2">
                              <Icon name="Sparkles" size={18} />
                              Описание
                            </h5>
                            <p className="text-foreground leading-relaxed pl-6">
                              {energyDescriptions[result.personal]?.description}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-md mb-2 flex items-center gap-2">
                              <Icon name="Heart" size={18} />
                              Здоровье
                            </h5>
                            <p className="text-foreground leading-relaxed pl-6">
                              {energyDescriptions[result.personal]?.health}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-md mb-2 flex items-center gap-2">
                              <Icon name="Users" size={18} />
                              Отношения
                            </h5>
                            <p className="text-foreground leading-relaxed pl-6">
                              {energyDescriptions[result.personal]?.relationships}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-md mb-2 flex items-center gap-2">
                              <Icon name="DollarSign" size={18} />
                              Финансы
                            </h5>
                            <p className="text-foreground leading-relaxed pl-6">
                              {energyDescriptions[result.personal]?.finance}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-accent">
                        <h4 className="font-bold text-xl mb-4 text-accent flex items-center gap-2">
                          <Icon name="Target" size={24} />
                          Энергия судьбы: {energyDescriptions[result.destiny]?.title}
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-semibold text-md mb-2 flex items-center gap-2">
                              <Icon name="Sparkles" size={18} />
                              Описание
                            </h5>
                            <p className="text-foreground leading-relaxed pl-6">
                              {energyDescriptions[result.destiny]?.description}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-md mb-2 flex items-center gap-2">
                              <Icon name="Heart" size={18} />
                              Здоровье
                            </h5>
                            <p className="text-foreground leading-relaxed pl-6">
                              {energyDescriptions[result.destiny]?.health}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-md mb-2 flex items-center gap-2">
                              <Icon name="Users" size={18} />
                              Отношения
                            </h5>
                            <p className="text-foreground leading-relaxed pl-6">
                              {energyDescriptions[result.destiny]?.relationships}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-md mb-2 flex items-center gap-2">
                              <Icon name="DollarSign" size={18} />
                              Финансы
                            </h5>
                            <p className="text-foreground leading-relaxed pl-6">
                              {energyDescriptions[result.destiny]?.finance}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-secondary">
                        <h4 className="font-bold text-xl mb-4 text-secondary-foreground flex items-center gap-2">
                          <Icon name="Users" size={24} />
                          Социальная энергия: {energyDescriptions[result.social]?.title}
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-semibold text-md mb-2 flex items-center gap-2">
                              <Icon name="Sparkles" size={18} />
                              Описание
                            </h5>
                            <p className="text-foreground leading-relaxed pl-6">
                              {energyDescriptions[result.social]?.description}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-md mb-2 flex items-center gap-2">
                              <Icon name="Heart" size={18} />
                              Здоровье
                            </h5>
                            <p className="text-foreground leading-relaxed pl-6">
                              {energyDescriptions[result.social]?.health}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-md mb-2 flex items-center gap-2">
                              <Icon name="Users" size={18} />
                              Отношения
                            </h5>
                            <p className="text-foreground leading-relaxed pl-6">
                              {energyDescriptions[result.social]?.relationships}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-md mb-2 flex items-center gap-2">
                              <Icon name="DollarSign" size={18} />
                              Финансы
                            </h5>
                            <p className="text-foreground leading-relaxed pl-6">
                              {energyDescriptions[result.social]?.finance}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-purple-500">
                        <h4 className="font-bold text-xl mb-4 text-purple-700 flex items-center gap-2">
                          <Icon name="Sparkles" size={24} />
                          Духовная энергия: {energyDescriptions[result.spiritual]?.title}
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-semibold text-md mb-2 flex items-center gap-2">
                              <Icon name="Sparkles" size={18} />
                              Описание
                            </h5>
                            <p className="text-foreground leading-relaxed pl-6">
                              {energyDescriptions[result.spiritual]?.description}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-md mb-2 flex items-center gap-2">
                              <Icon name="Heart" size={18} />
                              Здоровье
                            </h5>
                            <p className="text-foreground leading-relaxed pl-6">
                              {energyDescriptions[result.spiritual]?.health}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-md mb-2 flex items-center gap-2">
                              <Icon name="Users" size={18} />
                              Отношения
                            </h5>
                            <p className="text-foreground leading-relaxed pl-6">
                              {energyDescriptions[result.spiritual]?.relationships}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-md mb-2 flex items-center gap-2">
                              <Icon name="DollarSign" size={18} />
                              Финансы
                            </h5>
                            <p className="text-foreground leading-relaxed pl-6">
                              {energyDescriptions[result.spiritual]?.finance}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex gap-3">
                      <Button
                        onClick={handleDownloadPDF}
                        disabled={isGeneratingPDF}
                        className="flex-1"
                        size="lg"
                      >
                        <Icon name={isGeneratingPDF ? "Loader2" : "Download"} className={`mr-2 ${isGeneratingPDF ? 'animate-spin' : ''}`} />
                        {isGeneratingPDF ? 'Создаём PDF...' : 'Скачать PDF'}
                      </Button>
                      <Button
                        onClick={handleShare}
                        variant="outline"
                        size="lg"
                      >
                        <Icon name="Share2" className="mr-2" />
                        Поделиться
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 p-6 bg-muted/50 rounded-xl border-2 border-dashed border-primary/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon name="Lock" className="text-primary" size={32} />
                      <div>
                        <h3 className="text-xl font-semibold">🔒 Полная расшифровка</h3>
                        <p className="text-muted-foreground">
                          Детальный анализ здоровья, отношений, финансов и предназначения
                        </p>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-yellow-900">
                        💡 <strong>Как получить доступ:</strong><br/>
                        1️⃣ Нажмите кнопку "Получить доступ" ниже<br/>
                        2️⃣ Выберите тариф и оплатите через СБП<br/>
                        3️⃣ Через 1-3 часа доступ активируется автоматически<br/>
                        4️⃣ Вернитесь сюда и увидите полную расшифровку
                      </p>
                    </div>
                    <Tabs defaultValue="preview" className="mt-6">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="preview">Предназначение</TabsTrigger>
                        <TabsTrigger value="health">Здоровье</TabsTrigger>
                        <TabsTrigger value="relationships">Отношения</TabsTrigger>
                        <TabsTrigger value="finance">Финансы</TabsTrigger>
                      </TabsList>
                      <TabsContent value="preview" className="mt-4 p-4 bg-card rounded-lg">
                        <p className="text-muted-foreground italic">
                          {energyDescriptions[result.personal]?.description.substring(0, 100)}...
                        </p>
                        <p className="text-sm text-primary mt-2">🔒 Полный текст доступен после оплаты</p>
                      </TabsContent>
                      <TabsContent value="health" className="mt-4 p-4 bg-card rounded-lg">
                        <p className="text-muted-foreground italic">
                          {energyDescriptions[result.personal]?.health.substring(0, 80)}...
                        </p>
                        <p className="text-sm text-primary mt-2">🔒 Полный анализ здоровья доступен после оплаты</p>
                      </TabsContent>
                      <TabsContent value="relationships" className="mt-4 p-4 bg-card rounded-lg">
                        <p className="text-muted-foreground italic">
                          {energyDescriptions[result.personal]?.relationships.substring(0, 80)}...
                        </p>
                        <p className="text-sm text-primary mt-2">🔒 Полный анализ отношений доступен после оплаты</p>
                      </TabsContent>
                      <TabsContent value="finance" className="mt-4 p-4 bg-card rounded-lg">
                        <p className="text-muted-foreground italic">
                          {energyDescriptions[result.personal]?.finance.substring(0, 80)}...
                        </p>
                        <p className="text-sm text-primary mt-2">🔒 Полный финансовый анализ доступен после оплаты</p>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </CardContent>
            </Card>

            {showPricing && (
              <div className="animate-fade-in">
                {!hasAccess && (
                  <>
                    <h2 className="text-4xl font-bold text-center mb-4 text-primary">
                      Получить полный доступ
                    </h2>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-3xl mx-auto mb-8">
                      <p className="text-center text-sm text-blue-900">
                        ℹ️ <strong>Уже оплатили?</strong> Проверьте статус доступа → <Link to="/access" className="underline font-semibold hover:text-blue-700">Страница проверки доступа</Link>
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                      {pricingPlans.map((plan, index) => (
                        <Card
                          key={index}
                          className={`shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                            plan.type === 'half_year' ? 'border-2 border-primary ring-2 ring-primary/20' : ''
                          }`}
                        >
                          {plan.type === 'half_year' && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                              Популярный
                            </div>
                          )}
                          <CardHeader className="text-center">
                            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                              <Icon name={plan.icon as any} className="text-primary" size={32} />
                            </div>
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <div className="text-4xl font-bold text-primary my-2">{plan.price}</div>
                            <CardDescription>{plan.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-3 mb-6">
                              {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <Icon name="Check" className="text-primary mt-0.5 flex-shrink-0" size={20} />
                                  <span className="text-sm">{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <Button 
                              className="w-full hover-scale" 
                              size="lg"
                              onClick={() => handlePayment(plan.type)}
                            >
                              Выбрать тариф
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <Card className="mt-12 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              Что вы получите в полной версии?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <Icon name="Brain" className="mx-auto mb-4 text-primary" size={48} />
                <h3 className="font-semibold text-xl mb-2">Глубокий анализ личности</h3>
                <p className="text-muted-foreground">
                  Кто вы по характеру, ваши сильные стороны и зоны роста
                </p>
              </div>
              <div className="text-center p-6">
                <Icon name="Heart" className="mx-auto mb-4 text-accent" size={48} />
                <h3 className="font-semibold text-xl mb-2">Здоровье и тело</h3>
                <p className="text-muted-foreground">
                  Какие системы требуют внимания и почему возникают болезни
                </p>
              </div>
              <div className="text-center p-6">
                <Icon name="DollarSign" className="mx-auto mb-4 text-primary" size={48} />
                <h3 className="font-semibold text-xl mb-2">Финансы и карьера</h3>
                <p className="text-muted-foreground">
                  Почему нет денег и через что они могут прийти
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
      
      <Testimonials />
      <CTABlock onCalculate={scrollToCalculator} />
    </div>
  );
}