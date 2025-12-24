import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ProfessionalPromoMain } from '@/components/ProfessionalPromoMain';
import { ProfessionalCases } from '@/components/ProfessionalCases';
import { SEOContent } from '@/components/SEOContent';
import { RealCasesPreview } from '@/components/RealCasesPreview';

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
  const [calculationHistory, setCalculationHistory] = useState<Array<any>>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'destiny' | 'social' | 'spiritual'>('personal');
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
      
      // Загружаем историю расчётов пользователя
      const savedHistory = localStorage.getItem(`calculations_history_${storedEmail}`);
      if (savedHistory) {
        try {
          const history = JSON.parse(savedHistory);
          setCalculationHistory(history);
          
          // Загружаем последний расчёт
          if (history.length > 0) {
            const lastCalc = history[history.length - 1];
            setName(lastCalc.name);
            setBirthDate(lastCalc.birthDate);
            setResult({
              personal: lastCalc.personal,
              destiny: lastCalc.destiny,
              social: lastCalc.social,
              spiritual: lastCalc.spiritual,
              name: lastCalc.name
            });
            setShowPricing(true);
          }
        } catch (error) {
          console.error('Failed to load calculation history:', error);
        }
      }
      
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
        
        // Сохраняем расчёт в историю
        const calculationData = {
          id: Date.now().toString(),
          name,
          birthDate,
          personal: matrix.personal,
          destiny: matrix.destiny,
          social: matrix.social,
          spiritual: matrix.spiritual,
          calculatedAt: new Date().toISOString()
        };
        
        // Загружаем существующую историю
        const savedHistory = localStorage.getItem(`calculations_history_${email}`);
        let history = [];
        if (savedHistory) {
          try {
            history = JSON.parse(savedHistory);
          } catch (e) {
            history = [];
          }
        }
        
        // Добавляем новый расчёт в историю
        history.push(calculationData);
        localStorage.setItem(`calculations_history_${email}`, JSON.stringify(history));
        setCalculationHistory(history);
        
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

    const personal = energyDescriptions[result.personal];
    const destiny = energyDescriptions[result.destiny];
    const social = energyDescriptions[result.social];
    const spiritual = energyDescriptions[result.spiritual];

    // ПОЛНЫЙ портрет со ВСЕМИ рекомендациями для специалистов
    const shareText = `🔮 МАТРИЦА СУДЬБЫ - ПОЛНЫЙ ПОРТРЕТ\n${result.name}\n\n` +
      `📅 Дата рождения: ${new Date(birthDate).toLocaleDateString('ru-RU')}\n\n` +
      `═══════════════════════════\n\n` +
      
      `👤 ЕДИНЫЙ ПОРТРЕТ ЛИЧНОСТИ\n\n` +
      `${result.name} — это человек, который сочетает в себе:\n\n` +
      `• ХАРАКТЕР (Аркан ${result.personal} - ${personal?.title}):\n${personal?.description}\n\n` +
      `• ПРЕДНАЗНАЧЕНИЕ (Аркан ${result.destiny} - ${destiny?.title}):\n${destiny?.description}\n\n` +
      `• СОЦИАЛЬНАЯ РОЛЬ (Аркан ${result.social} - ${social?.title}):\n${social?.description}\n\n` +
      `• ДУХОВНАЯ СУТЬ (Аркан ${result.spiritual} - ${spiritual?.title}):\n${spiritual?.description}\n\n` +
      
      `═══════════════════════════\n\n` +
      
      `📖 ПОСОБИЕ ДЛЯ СПЕЦИАЛИСТОВ\n\n` +
      
      `🧠 ДЛЯ ПСИХОЛОГОВ И КОУЧЕЙ — ПОЛНОЕ ПОСОБИЕ:\n\n` +
      `🎯 ГЛАВНАЯ ПРОБЛЕМА:\n` +
      `Внутренний конфликт 4-х энергий:\n` +
      `• Аркан ${result.personal} (${personal?.title}) — как он себя ощущает, его эго\n` +
      `• Аркан ${result.destiny} (${destiny?.title}) — чего от него ждёт жизнь\n` +
      `• Аркан ${result.social} (${social?.title}) — маска для общества\n` +
      `• Аркан ${result.spiritual} (${spiritual?.title}) — его глубинная суть\n` +
      `Человек живёт через ${personal?.title}, общество видит ${social?.title}, но жизнь требует ${destiny?.title}, а душа тянется к ${spiritual?.title}. Отсюда внутренний разлад.\n\n` +
      
      `📿 КАРМИЧЕСКИЕ ЗАДАЧИ:\n` +
      `1. Принять Аркан ${result.destiny} (${destiny?.title}) как истинное предназначение\n` +
      `2. Интегрировать ${personal?.title} с ${destiny?.title} — использовать личные качества для предназначения\n` +
      `3. Разоблачить ${social?.title} как ложную идентичность — снять маску\n` +
      `4. Активировать ${spiritual?.title} — это связь с высшим и смысл жизни\n\n` +
      
      `⚔️ ЧТО НУЖНО ПОБОРОТЬ:\n` +
      `• Из ${personal?.title}: базовые страхи и блоки личности\n` +
      `• Из ${destiny?.title}: сопротивление своему предназначению\n` +
      `• Из ${social?.title}: зависимость от чужого мнения, жизнь "на публику"\n` +
      `• Из ${spiritual?.title}: духовная пустота, отрезанность от высшего\n\n` +
      
      `💬 КАК ГОВОРИТЬ С КЛИЕНТОМ:\n` +
      `✅ Используйте язык ${personal?.title} — это его родной язык\n` +
      `⚠️ НЕ давите на ${destiny?.title} напрямую — он убежит\n` +
      `🎭 Разоблачите ${social?.title} как маску: "Это не ты, это защита"\n` +
      `🙏 Активируйте ${spiritual?.title} через духовные практики\n\n` +
      
      `📋 ПЛАН ТЕРАПИИ (ПОШАГОВО):\n` +
      `ШАГ 1 (Сессии 1-3): Принятие ${personal?.title} — это его данность, не враг\n` +
      `ШАГ 2 (Сессии 4-6): Разоблачение ${social?.title} — когда и зачем появилась маска\n` +
      `ШАГ 3 (Сессии 7-10): Интеграция ${destiny?.title} — принять как истинный путь: ${destiny?.career}\n` +
      `ШАГ 4 (Сессии 11-15): Активация ${spiritual?.title} — духовные практики, очистка психосоматики\n` +
      `ШАГ 5 (Сессии 16+): Жизнь из Единства — все 4 аркана работают вместе\n\n` +
      
      `🔮 ПРОГНОЗ:\n` +
      `✅ ЕСЛИ ПРИМЕТ: через 6-12 месяцев выход на предназначение (${destiny?.career}), деньги потоком, гармония в отношениях\n` +
      `⚠️ ЕСЛИ НЕ ПРИМЕТ: кризисы, болезни (${personal?.health?.split('.')[0]}), потеря работы, разрывы — судьба будет ломать до принятия ${destiny?.title}\n\n` +
      
      `🔑 КЛЮЧ К ПРОРЫВУ:\n` +
      `"Твой ${personal?.title} — инструмент для ${destiny?.title}. То, что ты прятал за ${social?.title}, — твоя сила. ${spiritual?.title} — связь с высшим. Когда все 4 энергии работают вместе — ты становишься собой."\n\n` +
      
      `❌ ЧЕГО ИЗБЕГАТЬ:\n` +
      `• Критиковать ${personal?.title} — это его ядро\n` +
      `• Навязывать ${destiny?.title} силой — он уйдёт в сопротивление\n` +
      `• Разоблачать ${social?.title} публично — это травма\n` +
      `• Игнорировать ${spiritual?.title} — без духовности нет исцеления\n` +
      `• Спешить — интеграция требует минимум 6 месяцев\n\n` +
      
      `═══════════════════════════\n\n` +
      
      `👨‍💼 ДЛЯ HR И РЕКРУТЕРОВ — ПОЛНОЕ ПОСОБИЕ:\n\n` +
      `✅ ИДЕАЛЬНАЯ ДОЛЖНОСТЬ:\n` +
      `Аркан ${result.destiny} (${destiny?.title}) — это его ДНК\n` +
      `Лучшие роли: ${destiny?.career}\n` +
      `Будет успешен в: ${destiny?.finance}\n` +
      `Почему именно это: если должность не соответствует — уйдёт через 3-6 месяцев\n\n` +
      
      `🤝 АНАЛИЗ КОМАНДЫ:\n` +
      `Аркан ${result.social} (${social?.title}) — так его видят коллеги\n` +
      `${social?.relationships}\n` +
      `Риск конфликтов: если в команде давят на ${personal?.title} — он уйдёт\n\n` +
      
      `💰 МОТИВАЦИЯ И УДЕРЖАНИЕ:\n` +
      `Мотивирован: ${destiny?.finance}\n` +
      `НЕ мотивирован деньгами, если работа противоречит ${destiny?.title}\n` +
      `Как удержать:\n` +
      `1. Давать задачи по ${destiny?.title}\n` +
      `2. Признавать его ${personal?.title}\n` +
      `3. Позволять проявлять ${social?.title}\n` +
      `4. Дать смысл работы (${spiritual?.title})\n\n` +
      
      `🚀 ОНБОРДИНГ (90 ДНЕЙ):\n` +
      `День 1-7: Представить через ${social?.title}, показать смысл работы\n` +
      `День 8-30: Дать задачи на ${personal?.title}, вводить в ${destiny?.title}\n` +
      `День 31-60: Оценить соответствие ${destiny?.title}, если нет — расстаться\n` +
      `День 61-90: Стабилизация, работа через ${destiny?.title}\n\n` +
      
      `⚠️ РИСКИ И МИТИГАЦИЯ:\n` +
      `РИСК #1: Уход через 3-6 месяцев (роль не соответствует ${destiny?.title})\n` +
      `РИСК #2: Конфликты (давят на ${personal?.title})\n` +
      `РИСК #3: Выгорание (нет смысла, ${spiritual?.title} не активирован)\n\n` +
      
      `✅ ВЕРДИКТ:\n` +
      `НАНИМАТЬ, ЕСЛИ: должность соответствует ${destiny?.title} минимум 70%\n` +
      `НЕ НАНИМАТЬ, ЕСЛИ: роль противоречит ${destiny?.title} — уйдёт через 3-6 месяцев\n\n` +
      
      `═══════════════════════════\n\n` +
      
      `🍎 ДЛЯ НУТРИЦИОЛОГОВ — ПОЛНОЕ ПОСОБИЕ:\n\n` +
      `🔥 ДИАГНОСТИКА — ПОЧЕМУ НЕ ХУДЕЕТ:\n` +
      `🔴 УРОВЕНЬ 1: Аркан ${result.personal} (${personal?.title}) — ФИЗИОЛОГИЯ\n` +
      `Проблема: ${personal?.health}\n` +
      `Что делать: обследование, анализы, лечить физику первым делом\n\n` +
      
      `🟠 УРОВЕНЬ 2: Аркан ${result.destiny} (${destiny?.title}) — КАРМИЧЕСКИЙ БЛОК\n` +
      `Проблема: ${destiny?.health}\n` +
      `Что происходит: вес — защита от реализации ${destiny?.title}\n` +
      `Что делать: работа с психологом, разблокировать страх предназначения\n\n` +
      
      `🟡 УРОВЕНЬ 3: Аркан ${result.spiritual} (${spiritual?.title}) — ПСИХОСОМАТИКА\n` +
      `Проблема: ${spiritual?.health}\n` +
      `Что происходит: заедает эмоции, духовную пустоту\n` +
      `Что делать: духовные практики, медитации, поиск смысла\n\n` +
      
      `🟣 УРОВЕНЬ 4: Аркан ${result.social} (${social?.title}) — СОЦИАЛЬНОЕ ДАВЛЕНИЕ\n` +
      `Конфликт: общество видит ${social?.title}, но внутри ${personal?.title}\n` +
      `Что делать: снять маску, жить как ${personal?.title}\n\n` +
      
      `🥗 ПЛАН ПИТАНИЯ (90 ДНЕЙ):\n` +
      `ЧТО ИСКЛЮЧИТЬ:\n` +
      `• Для ${result.personal}: тяжёлая пища, жирное, мучное\n` +
      `• Для ${result.destiny}: сахар, быстрые углеводы\n` +
      `• Для ${result.spiritual}: алкоголь, кофеин\n` +
      `ЧТО ДОБАВИТЬ:\n` +
      `• Белок 1.5-2г/кг, клетчатка 500г+ овощей, вода 30-40мл/кг\n\n` +
      
      `📋 КОМПЛЕКСНЫЙ ПЛАН:\n` +
      `Неделя 1-2: Диагностика (анализы, УЗИ, замеры)\n` +
      `Неделя 3-4: Запуск (новый рацион, лечение, психолог, медитации)\n` +
      `Неделя 5-12: Основная работа (диета + движение + психолог + практики)\n` +
      `РЕЗУЛЬТАТ: -8-12 кг за 90 дней + улучшение здоровья\n\n` +
      
      `🔑 КЛЮЧ К УСПЕХУ:\n` +
      `"Вес — это защита от реализации ${destiny?.title}. Пока не примешь предназначение, тело будет держать вес. Когда станешь ${destiny?.title}, вес уйдёт сам."\n\n` +
      
      `═══════════════════════════\n\n` +
      
      `📈 ДЛЯ БИЗНЕС-КОУЧЕЙ — ПОЛНОЕ ПОСОБИЕ:\n\n` +
      `💸 ДИАГНОСТИКА — ПОЧЕМУ НЕТ ДЕНЕГ:\n` +
      `🔴 КОРЕНЬ ПРОБЛЕМЫ: работает через ${personal?.title}, но деньги приходят ТОЛЬКО через ${destiny?.title}\n` +
      `4 УРОВНЯ БЛОКИРОВКИ:\n` +
      `• Аркан ${result.personal}: работает через ${personal?.title}, но это даёт только ${personal?.finance} — НЕ денежный путь\n` +
      `• Аркан ${result.destiny}: истинное предназначение ${destiny?.career}, пока не принят — денег нет\n` +
      `• Аркан ${result.social}: продаёт через маску ${social?.title}, но это фасад, клиенты чувствуют фальшь\n` +
      `• Аркан ${result.spiritual}: денежные блоки ${spiritual?.health}, страх богатства, вина за деньги\n\n` +
      
      `🎯 ПРАВИЛЬНАЯ НИША — 100% ПОПАДАНИЕ:\n` +
      `Аркан ${result.destiny} (${destiny?.title})\n` +
      `Ниши: ${destiny?.career}\n` +
      `Монетизация: ${destiny?.finance}\n` +
      `Почему: это кармическое предназначение, вселенная помогает ТОЛЬКО здесь\n` +
      `Если сейчас НЕ это — сменить нишу за 30 дней!\n\n` +
      
      `🚀 ПЛАН ×10 ДОХОД (90 ДНЕЙ):\n` +
      `ШАГ 1 (Неделя 1-2): Признать, что ${personal?.title} — не путь денег\n` +
      `ШАГ 2 (Неделя 3-4): Принять ${destiny?.title} как денежное предназначение\n` +
      `ШАГ 3 (Неделя 5-6): Сменить нишу на ${destiny?.career}, запустить MVP\n` +
      `ШАГ 4 (Неделя 7-8): Использовать ${social?.title} для продаж\n` +
      `ШАГ 5 (Неделя 9-12): Очистить ${spiritual?.title} — убрать денежные блоки через медитации\n` +
      `РЕЗУЛЬТАТ: доход ×3-5 через 90 дней, ×10-15 через год\n\n` +
      
      `💎 ДЕНЕЖНЫЕ БЛОКИ:\n` +
      `Вопрос клиенту: "Что плохого случится, если станешь богатым через ${destiny?.title}?"\n` +
      `Типичные ответы: "Потеряю друзей", "Стану плохим", "Меня ограбят"\n` +
      `Как очистить: осознать блок через ${spiritual?.title}, простить, отпустить, заменить на новую установку\n\n` +
      
      `🔮 ПРОГНОЗ:\n` +
      `✅ ЕСЛИ СЛЕДУЕТ: месяц 1 — доход ×1.5, месяц 2-3 — ×3-5, месяц 4-6 — ×5-7, месяц 7-12 — ×10-15\n` +
      `⚠️ ЕСЛИ НЕ МЕНЯЕТ НИШУ: доход стоит/падает, выгорание, бизнес закроется, пока не работает через ${destiny?.title} — денег не будет\n\n` +
      
      `🔑 КЛЮЧ К БОГАТСТВУ:\n` +
      `"Деньги приходят, когда живёшь через ${destiny?.title}. Это твой денежный код. Вселенная даст деньги ТОЛЬКО за ${destiny?.career}. Прими ${destiny?.title}, очисти ${spiritual?.title}, используй ${social?.title} для продаж — это формула богатства."\n\n` +
      
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
      
      // Удаляем историю расчётов пользователя
      localStorage.removeItem(`calculations_history_${storedEmail}`);
    }
    
    localStorage.removeItem('subscriberAuth');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('adminEmail');
    setIsSubscriber(false);
    setHasAccess(false);
    setEmail('');
    setAdminEmail('');
    setResult(null);
    setName('');
    setBirthDate('');
    setShowPricing(false);
    setCalculationHistory([]);
    setShowHistory(false);
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
      name: 'Разовая расшифровка',
      price: '300₽',
      type: 'single',
      description: 'Одноразовая полная расшифровка',
      features: ['Кто вы на самом деле (4 "Я")', 'На чём зарабатывать деньги', 'Что вас тормозит', 'Здоровье — 3 зоны риска', 'Почему нет отношений/денег', 'План действий на 90 дней', 'Копирование полного отчёта'],
      icon: 'FileText'
    },
    {
      name: 'Месяц',
      price: '1000₽',
      type: 'month',
      description: 'одноразово',
      features: ['Безлимитные расчеты', 'Всё из разовой расшифровки', 'Можно считать для друзей/семьи', 'Копирование всех отчётов', 'Сохранение всех расчётов в личном кабинете'],
      icon: 'Calendar'
    },
    {
      name: '6 месяцев',
      price: '5000₽',
      type: 'half_year',
      description: 'Выгода 17% — 833₽/месяц',
      features: ['Безлимитные расчеты', 'Всё из месячного доступа', 'Сохранение всех расчётов в личном кабинете', 'Расширенная аналитика', 'Приоритетная поддержка'],
      icon: 'TrendingUp'
    },
    {
      name: 'Год',
      price: '8000₽',
      type: 'year',
      description: 'Выгода 30% — 667₽/месяц',
      features: ['Безлимитные расчеты', 'Всё из полугодового доступа', 'Сохранение всех расчётов в личном кабинете', 'Индивидуальные консультации', 'Доступ к закрытому сообществу'],
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
      
      {/* Профессиональный баннер */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 text-gray-900 py-3 shadow-lg">
        {/* Золотой блеск */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-center">
            <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-1.5 rounded-full">
              <Icon name="Briefcase" size={18} />
              <span className="font-bold text-sm">ДЛЯ ПРОФЕССИОНАЛОВ</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="font-semibold">👨‍💼 HR</span>
              <span className="text-gray-700">•</span>
              <span className="font-semibold">🧠 Психологи</span>
              <span className="text-gray-700">•</span>
              <span className="font-semibold">📈 Коучи</span>
              <span className="text-gray-700">•</span>
              <span className="font-semibold">🍎 Нутрициологи</span>
            </div>
            <div className="hidden md:block text-gray-700">•</div>
            <p className="text-sm font-semibold">
              🎯 Полный анализ клиента за 5 минут • От 300₽
            </p>
          </div>
        </div>
      </div>
      
      {/* Hero Section с космической картинкой */}
      <div className="relative w-full h-[60vh] min-h-[500px] overflow-hidden">
        <img 
          src="https://cdn.poehali.dev/files/1000038242.jpg" 
          alt="Космос и судьба"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background"></div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            Матрица Судьбы
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-4 drop-shadow-lg">
            Узнайте ВСЁ о человеке за 5 минут: предназначение, таланты, здоровье, деньги, отношения
          </p>
          
          <p className="text-lg md:text-xl text-yellow-300 font-bold mb-8 drop-shadow-lg">
            ⚡ Диагностика клиента • Подбор кандидатов • Работа с блоками • Персональное питание
          </p>

          <Button 
            onClick={scrollToCalculator}
            size="lg"
            className="text-lg px-8 py-6 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-gray-900 hover:from-yellow-400 hover:via-amber-400 hover:to-orange-400 shadow-2xl hover:scale-105 transition-all font-bold"
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
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-amber-100 dark:border-amber-900">
              <Icon name="Activity" size={32} className="text-amber-600 mx-auto mb-3" />
              <h3 className="font-bold mb-2">Здоровье</h3>
              <p className="text-sm text-muted-foreground">Зоны внимания и рекомендации</p>
            </div>
          </div>
        </div>

        <LiveStats />

        <RealCasesPreview />

        <ProfessionalPromoMain />

        <Card className="mb-8 shadow-xl border-2" ref={calculatorRef}>
          <CardHeader className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950 dark:via-amber-950 dark:to-orange-950">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="Calculator" size={24} />
                  Рассчитать вашу Матрицу Судьбы
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {result && hasAccess ? 'Рассчитайте матрицу для другого человека' : 'Введите данные для расчета вашей уникальной матрицы'}
                </CardDescription>
              </div>
              {result && hasAccess && (
                <div className="flex gap-2">
                  {calculationHistory.length > 1 && (
                    <Button
                      onClick={() => setShowHistory(!showHistory)}
                      variant="outline"
                      className="gap-2"
                    >
                      <Icon name="History" size={16} />
                      История ({calculationHistory.length})
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setName('');
                      setBirthDate('');
                      setResult(null);
                      setShowPricing(false);
                      calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    variant="outline"
                    className="gap-2"
                  >
                    <Icon name="Plus" size={16} />
                    Новый расчёт
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {showHistory && calculationHistory.length > 1 && hasAccess && (
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 rounded-lg border-2 border-amber-200 dark:border-amber-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Icon name="History" size={20} className="text-amber-600" />
                    История расчётов ({calculationHistory.length})
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHistory(false)}
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {calculationHistory.slice().reverse().map((calc) => (
                    <button
                      key={calc.id}
                      onClick={() => {
                        setName(calc.name);
                        setBirthDate(calc.birthDate);
                        setResult({
                          personal: calc.personal,
                          destiny: calc.destiny,
                          social: calc.social,
                          spiritual: calc.spiritual,
                          name: calc.name
                        });
                        setShowPricing(true);
                        setShowHistory(false);
                        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="p-3 text-left bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-700 hover:border-amber-400 hover:shadow-md transition-all"
                    >
                      <p className="font-semibold text-sm">{calc.name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(calc.birthDate).toLocaleDateString('ru-RU')}</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        {new Date(calc.calculatedAt).toLocaleDateString('ru-RU')} в {new Date(calc.calculatedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Имя</label>
              <Input
                placeholder="Введите ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (name && birthDate && email) handleCalculate();
                  }
                }}
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (name && birthDate && email) handleCalculate();
                  }
                }}
                className="text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Дата рождения</label>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (name && birthDate && email) handleCalculate();
                  }
                }}
                max={new Date().toISOString().split('T')[0]}
                className="text-lg"
              />
            </div>
            <Button 
              onClick={handleCalculate}
              type="button"
              disabled={!name || !birthDate || !email}
              className="w-full hover-scale text-lg py-6 relative overflow-hidden group"
              size="lg"
            >
              {/* Золотой блеск */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              <Icon name="Sparkles" size={20} className="mr-2 relative z-10" />
              <span className="relative z-10">Рассчитать матрицу</span>
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
              <CardHeader className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950 dark:via-amber-950 dark:to-orange-950">
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
                    className={`p-6 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-2 border-amber-200 dark:border-amber-800 text-left transition-all ${hasAccess ? 'hover:shadow-xl hover:scale-105 cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="User" size={20} className="text-amber-600" />
                      <h3 className="font-bold text-amber-900 dark:text-amber-100">Личное</h3>
                    </div>
                    <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">{result.personal}</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-2">Ваше истинное Я</p>
                    {hasAccess && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
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
                    className={`p-6 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-2 border-yellow-200 dark:border-yellow-800 text-left transition-all ${hasAccess ? 'hover:shadow-xl hover:scale-105 cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Target" size={20} className="text-yellow-600" />
                      <h3 className="font-bold text-yellow-900 dark:text-yellow-100">Предназначение</h3>
                    </div>
                    <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{result.destiny}</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">Ваша миссия</p>
                    {hasAccess && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 flex items-center gap-1">
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
              {hasAccess && <ProfessionalPromo />}
            </div>

            {hasAccess ? (
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-amber-300 shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4">
                      <Icon name="Share2" size={40} className="text-white" />
                    </div>
                    
                    <h3 className="text-3xl font-bold text-amber-900">
                      📋 Скопировать полный отчёт
                    </h3>
                    
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                      Нажмите кнопку ниже — скопируется <strong>ВСЯ информация</strong> выше: 
                      все 4 энергии, здоровье, отношения, финансы, профессии, конкретные рекомендации. 
                      Затем вставьте в WhatsApp, Telegram или другой мессенджер.
                    </p>

                    <Button
                      onClick={handleShare}
                      size="lg"
                      className="text-xl px-12 py-8 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
                    >
                      <Icon name="Copy" size={24} className="mr-3" />
                      Скопировать полный отчёт
                    </Button>

                    <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mt-6">
                      <p className="text-sm text-green-900 flex items-center justify-center gap-2">
                        <Icon name="CheckCircle2" size={18} />
                        ✅ Скопируется весь портрет личности: характер, предназначение, здоровье, отношения, деньги, профессии, рекомендации
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : showPricing ? (
              <Card className="shadow-xl border-2 border-primary">
                <CardHeader className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950 dark:via-amber-950 dark:to-orange-950">
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

                  <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-3">
                      <Icon name="Info" size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-900 dark:text-amber-100">
                        <p className="font-medium mb-1">Что входит в полную расшифровку:</p>
                        <ul className="space-y-1 text-amber-800 dark:text-amber-200">
                          <li>• Кто вы на самом деле — 4 разных "Я" внутри вас (характер, предназначение, маска, душа)</li>
                          <li>• На чём вы будете зарабатывать деньги — конкретные профессии и денежный код</li>
                          <li>• Что у вас получается легко — ваши таланты простыми словами</li>
                          <li>• Что вас тормозит в жизни — 4 проблемы, которые мешают быть счастливым</li>
                          <li>• Ваше здоровье — 3 зоны риска и что будет болеть, если живёте "не своей жизнью"</li>
                          <li>• Почему у вас нет отношений — как снять маску и найти правильных людей</li>
                          <li>• Почему у вас нет денег — реальный план ×10 доход за 90 дней</li>
                          <li>• Конкретный план действий — что делать прямо сейчас (неделя за неделей)</li>
                          <li>• Копирование полного отчёта для сохранения</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
            
            {hasAccess && <ProfessionalCases />}
          </div>
        )}

        <CTABlock onCalculate={scrollToCalculator} />
        
        <Testimonials />
        
        <SEOContent />
        
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