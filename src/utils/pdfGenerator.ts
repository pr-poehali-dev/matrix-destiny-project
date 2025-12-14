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
  // Динамический импорт pdfmake для избежания ошибок при загрузке страницы
  const pdfMake = await import('pdfmake/build/pdfmake');
  const pdfFonts = await import('pdfmake/build/vfs_fonts');
  
  pdfMake.default.vfs = pdfFonts.default.pdfMake.vfs;

  return new Promise((resolve, reject) => {
    try {
      const energies = [
        { name: 'Личная энергия (Я)', value: result.personal, desc: 'Ваша суть, таланты, предназначение' },
        { name: 'Энергия судьбы (Путь)', value: result.destiny, desc: 'Ваш жизненный путь и миссия' },
        { name: 'Социальная энергия (Люди)', value: result.social, desc: 'Как вы взаимодействуете с миром' },
        { name: 'Духовная энергия (Дух)', value: result.spiritual, desc: 'Ваш внутренний мир и духовность' }
      ];

      const content: any[] = [
        // Заголовок
        {
          text: 'МАТРИЦА СУДЬБЫ',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          text: `Персональный отчет для ${result.name}`,
          style: 'subheader',
          alignment: 'center',
          margin: [0, 0, 0, 5]
        },
        {
          text: `Дата рождения: ${new Date(result.birthDate).toLocaleDateString('ru-RU')}`,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        
        // Основные энергии
        {
          text: 'ВАШИ КЛЮЧЕВЫЕ ЭНЕРГИИ',
          style: 'heading1',
          margin: [0, 20, 0, 10]
        }
      ];

      // Краткие энергии
      energies.forEach(energy => {
        const arcana = energyDescriptions[energy.value];
        if (arcana) {
          content.push(
            {
              text: `${energy.name}: ${arcana.title}`,
              style: 'heading2',
              margin: [0, 10, 0, 5]
            },
            {
              text: energy.desc,
              margin: [0, 0, 0, 10]
            }
          );
        }
      });

      // Детальные описания
      content.push(
        { text: '', pageBreak: 'after' },
        {
          text: 'ДЕТАЛЬНАЯ РАСШИФРОВКА',
          style: 'heading1',
          margin: [0, 0, 0, 10]
        },
        {
          text: 'Ниже представлен глубокий анализ каждой из ваших энергий с рекомендациями по всем сферам жизни.',
          margin: [0, 0, 0, 20]
        }
      );

      energies.forEach((energy, index) => {
        const arcana = energyDescriptions[energy.value];
        if (!arcana) return;

        if (index > 0) {
          content.push({ text: '', pageBreak: 'after' });
        }

        content.push(
          {
            text: `${energy.name.toUpperCase()}: ${arcana.title.toUpperCase()}`,
            style: 'energyHeader',
            margin: [0, 0, 0, 15]
          },
          {
            text: 'ПРЕДНАЗНАЧЕНИЕ И ТАЛАНТЫ',
            style: 'heading2',
            margin: [0, 10, 0, 5]
          },
          {
            text: arcana.description,
            margin: [0, 0, 0, 15]
          },
          {
            text: 'ЗДОРОВЬЕ',
            style: 'heading2',
            margin: [0, 10, 0, 5]
          },
          {
            text: arcana.health,
            margin: [0, 0, 0, 15]
          },
          {
            text: 'ОТНОШЕНИЯ',
            style: 'heading2',
            margin: [0, 10, 0, 5]
          },
          {
            text: arcana.relationships,
            margin: [0, 0, 0, 15]
          },
          {
            text: 'ФИНАНСЫ И КАРЬЕРА',
            style: 'heading2',
            margin: [0, 10, 0, 5]
          },
          {
            text: arcana.finance,
            margin: [0, 0, 0, 15]
          }
        );
      });

      // Заключение
      content.push(
        { text: '', pageBreak: 'after' },
        {
          text: 'ВАША МАТРИЦА — ЭТО КАРТА ВОЗМОЖНОСТЕЙ',
          style: 'conclusion',
          alignment: 'center',
          margin: [0, 50, 0, 10]
        },
        {
          text: 'Используйте эти знания для осознанной жизни и реализации своего потенциала',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          text: `Сайт: о-тебе.рф | Дата создания: ${new Date().toLocaleDateString('ru-RU')}`,
          alignment: 'center',
          fontSize: 10,
          color: '#666666'
        }
      );

      const docDefinition: any = {
        content,
        styles: {
          header: {
            fontSize: 28,
            bold: true,
            color: '#2980b9'
          },
          subheader: {
            fontSize: 16,
            color: '#2980b9'
          },
          heading1: {
            fontSize: 20,
            bold: true,
            color: '#2980b9'
          },
          heading2: {
            fontSize: 14,
            bold: true,
            color: '#34495e'
          },
          energyHeader: {
            fontSize: 18,
            bold: true,
            color: '#ffffff',
            background: '#2980b9',
            padding: 10
          },
          conclusion: {
            fontSize: 18,
            bold: true,
            color: '#27ae60'
          }
        },
        defaultStyle: {
          font: 'Roboto',
          fontSize: 11,
          lineHeight: 1.5
        },
        footer: function(currentPage: number, pageCount: number) {
          return {
            text: `о-тебе.рф | Страница ${currentPage} из ${pageCount}`,
            alignment: 'center',
            fontSize: 9,
            color: '#999999',
            margin: [0, 10, 0, 0]
          };
        }
      };

      const pdfDocGenerator = pdfMake.default.createPdf(docDefinition);
      
      pdfDocGenerator.getBlob((blob: Blob) => {
        resolve(blob);
      });
    } catch (error) {
      reject(error);
    }
  });
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
