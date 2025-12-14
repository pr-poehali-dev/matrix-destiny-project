import jsPDF from 'jspdf';
import { energyDescriptions } from '@/data/arcana-descriptions';

interface MatrixResult {
  name: string;
  personal: number;
  destiny: number;
  social: number;
  spiritual: number;
  birthDate: string;
}

export const generatePDF = async (result: MatrixResult): Promise<Blob> => {
  // Создаем PDF в формате A4
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Добавляем поддержку русского языка (используем встроенный шрифт)
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let currentY = margin;

  // Функция для добавления водяного знака
  const addWatermark = () => {
    pdf.setTextColor(200, 200, 200);
    pdf.setFontSize(10);
    pdf.text('о-тебе.рф', pageWidth / 2, pageHeight - 10, { align: 'center' });
    pdf.setTextColor(0, 0, 0);
  };

  // Функция для добавления новой страницы
  const addNewPage = () => {
    addWatermark();
    pdf.addPage();
    currentY = margin;
  };

  // Функция для добавления текста с автоматическим переносом и учетом страниц
  const addText = (text: string, fontSize: number, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
    pdf.setFontSize(fontSize);
    pdf.setTextColor(color[0], color[1], color[2]);
    
    const lines = pdf.splitTextToSize(text, maxWidth);
    
    for (const line of lines) {
      if (currentY + fontSize / 2.5 > pageHeight - margin) {
        addNewPage();
      }
      pdf.text(line, margin, currentY);
      currentY += fontSize / 2.5;
    }
  };

  // Функция для добавления заголовка
  const addHeading = (text: string, level: number = 1) => {
    const sizes = { 1: 18, 2: 14, 3: 12 };
    const spacing = { 1: 10, 2: 7, 3: 5 };
    
    currentY += spacing[level as keyof typeof spacing] || 5;
    addText(text, sizes[level as keyof typeof sizes] || 12, true, [41, 128, 185]);
    currentY += 3;
  };

  // Функция для добавления параграфа
  const addParagraph = (text: string) => {
    addText(text, 10);
    currentY += 3;
  };

  // Функция для обработки markdown-like текста
  const processSection = (text: string) => {
    const lines = text.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Заголовки с эмодзи
      if (trimmed.match(/^[🎯✨⚠️💊🔴⚡🌿🚨💕🎭✅❌🔑💑💰💸💡🎓]/)) {
        addHeading(trimmed, 2);
      }
      // Списки с буллетами
      else if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        addText('  ' + trimmed, 10);
        currentY += 1;
      }
      // Обычный текст
      else {
        addParagraph(trimmed);
      }
    }
  };

  // === ЗАГОЛОВОК ОТЧЕТА ===
  pdf.setFillColor(41, 128, 185);
  pdf.rect(0, 0, pageWidth, 50, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.text('МАТРИЦА СУДЬБЫ', pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.text(`Персональный отчет для ${result.name}`, pageWidth / 2, 32, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.text(`Дата рождения: ${new Date(result.birthDate).toLocaleDateString('ru-RU')}`, pageWidth / 2, 42, { align: 'center' });

  // Водяной знак на первой странице
  addWatermark();

  currentY = 60;

  // === ОСНОВНЫЕ ЭНЕРГИИ ===
  pdf.setTextColor(0, 0, 0);
  addHeading('ВАШИ КЛЮЧЕВЫЕ ЭНЕРГИИ', 1);
  
  const energies = [
    { name: 'Личная энергия (Я)', value: result.personal, desc: 'Ваша суть, таланты, предназначение' },
    { name: 'Энергия судьбы (Путь)', value: result.destiny, desc: 'Ваш жизненный путь и миссия' },
    { name: 'Социальная энергия (Люди)', value: result.social, desc: 'Как вы взаимодействуете с миром' },
    { name: 'Духовная энергия (Дух)', value: result.spiritual, desc: 'Ваш внутренний мир и духовность' }
  ];

  for (const energy of energies) {
    const arcana = energyDescriptions[energy.value];
    if (!arcana) continue;

    addHeading(`${energy.name}: ${arcana.title}`, 2);
    addParagraph(energy.desc);
    currentY += 3;
  }

  // === ДЕТАЛЬНЫЕ ОПИСАНИЯ ===
  addNewPage();
  addHeading('ДЕТАЛЬНАЯ РАСШИФРОВКА', 1);
  addParagraph('Ниже представлен глубокий анализ каждой из ваших энергий с рекомендациями по всем сферам жизни.');
  currentY += 5;

  for (const energy of energies) {
    const arcana = energyDescriptions[energy.value];
    if (!arcana) continue;

    // Заголовок аркана
    addNewPage();
    pdf.setFillColor(41, 128, 185);
    pdf.rect(margin - 5, currentY - 5, maxWidth + 10, 12, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.text(`${energy.name.toUpperCase()}: ${arcana.title.toUpperCase()}`, margin, currentY + 3);
    pdf.setTextColor(0, 0, 0);
    currentY += 15;

    // Описание предназначения
    addHeading('ПРЕДНАЗНАЧЕНИЕ И ТАЛАНТЫ', 2);
    processSection(arcana.description);
    currentY += 5;

    // Здоровье
    addHeading('ЗДОРОВЬЕ', 2);
    processSection(arcana.health);
    currentY += 5;

    // Отношения
    addNewPage();
    addHeading('ОТНОШЕНИЯ', 2);
    processSection(arcana.relationships);
    currentY += 5;

    // Финансы
    addHeading('ФИНАНСЫ И КАРЬЕРА', 2);
    processSection(arcana.finance);
    currentY += 10;
  }

  // === ЗАКЛЮЧЕНИЕ ===
  addNewPage();
  pdf.setFillColor(46, 204, 113);
  pdf.rect(0, currentY - 5, pageWidth, 40, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.text('ВАША МАТРИЦА — ЭТО КАРТА ВОЗМОЖНОСТЕЙ', pageWidth / 2, currentY + 8, { align: 'center' });
  pdf.setFontSize(10);
  pdf.text('Используйте эти знания для осознанной жизни и реализации своего потенциала', pageWidth / 2, currentY + 18, { align: 'center' });
  pdf.text('Сайт: о-тебе.рф | Дата создания: ' + new Date().toLocaleDateString('ru-RU'), pageWidth / 2, currentY + 28, { align: 'center' });

  // Добавляем водяной знак на последнюю страницу
  addWatermark();

  // Возвращаем PDF как Blob
  return pdf.output('blob');
};

export const downloadPDF = (blob: Blob, filename: string = 'matrix-report.pdf') => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};