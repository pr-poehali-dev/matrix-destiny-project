import json
import os
from datetime import datetime
from typing import Dict, Any
from io import BytesIO
import base64

try:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import cm
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.lib.enums import TA_CENTER, TA_LEFT
except ImportError:
    pass

ENERGY_DESCRIPTIONS = {
    1: {
        'title': 'Маг',
        'description': 'Вы пришли в этот мир, чтобы создавать и трансформировать реальность. Ваше предназначение — быть проводником энергии созидания.',
        'health': 'Важно работать с горловой чакрой. Проблемы с щитовидной железой могут возникать при непроявленности.',
        'relationships': 'Вам нужен партнер, который принимает вашу силу и индивидуальность.',
        'finance': 'Деньги приходят через творчество и уникальные проекты.'
    },
    2: {
        'title': 'Жрица',
        'description': 'Ваше предназначение — быть мудрым наставником, хранителем знаний и духовным учителем.',
        'health': 'Проблемы с женской энергией, гормональные сбои при блокировках.',
        'relationships': 'Нужен глубокий эмоциональный контакт и духовная связь.',
        'finance': 'Деньги приходят через обучение, консультации, работу с людьми.'
    },
    3: {
        'title': 'Императрица',
        'description': 'Вы — источник изобилия, заботы и материнской энергии. Предназначение — создавать и взращивать.',
        'health': 'Репродуктивная система требует внимания. Проблемы с весом при дисбалансе.',
        'relationships': 'Вам важно проявлять заботу, но не растворяться в партнере.',
        'finance': 'Изобилие приходит через щедрость и создание красоты.'
    },
    4: {
        'title': 'Император',
        'description': 'Ваше предназначение — строить структуры, быть лидером и опорой для других.',
        'health': 'Проблемы с позвоночником и костями при непринятии ответственности.',
        'relationships': 'Вам нужен равный партнер, с которым можно строить империю.',
        'finance': 'Деньги приходят через системный подход и управление.'
    },
    5: {
        'title': 'Иерофант',
        'description': 'Вы — учитель и хранитель традиций. Предназначение — передавать мудрость.',
        'health': 'Проблемы со слухом и горлом при неумении слышать истину.',
        'relationships': 'Важны общие ценности и духовное развитие.',
        'finance': 'Доход через образование, консультации, наставничество.'
    },
    6: {
        'title': 'Влюбленные',
        'description': 'Ваше предназначение — учиться делать выбор и строить гармоничные отношения.',
        'health': 'Сердечно-сосудистая система требует внимания при блокировках.',
        'relationships': 'Необходимо проработать страх выбора и зависимости.',
        'finance': 'Деньги через партнерство и совместные проекты.'
    },
    7: {
        'title': 'Колесница',
        'description': 'Вы — воин и победитель. Предназначение — двигаться вперед, преодолевая препятствия.',
        'health': 'Проблемы с ногами и суставами при отсутствии движения вперед.',
        'relationships': 'Нужен партнер, который поддержит ваши амбиции.',
        'finance': 'Деньги приходят через активные действия и достижения.'
    },
    8: {
        'title': 'Справедливость',
        'description': 'Ваше предназначение — восстанавливать баланс и справедливость в мире.',
        'health': 'Проблемы с почками и мочевыделительной системой при дисбалансе.',
        'relationships': 'Важны честность и равноправие в отношениях.',
        'finance': 'Доход через юридическую сферу, консалтинг, восстановление справедливости.'
    },
    9: {
        'title': 'Отшельник',
        'description': 'Вы пришли обрести мудрость через одиночество и самопознание.',
        'health': 'Проблемы со зрением и нервной системой при избегании уединения.',
        'relationships': 'Вам нужно время наедине с собой, партнер должен это понимать.',
        'finance': 'Деньги через экспертность, консультации, индивидуальную работу.'
    },
    10: {
        'title': 'Колесо Фортуны',
        'description': 'Ваша жизнь полна циклов и изменений. Предназначение — принять изменчивость.',
        'health': 'Нестабильное здоровье, зависит от жизненных циклов.',
        'relationships': 'Отношения проходят через трансформации и обновления.',
        'finance': 'Финансовые циклы — взлеты и падения, важно создавать подушку безопасности.'
    },
    11: {
        'title': 'Сила',
        'description': 'Ваше предназначение — укрощать внутренних демонов и проявлять истинную силу.',
        'health': 'Проблемы с мышцами и физической силой при подавлении энергии.',
        'relationships': 'Важно не подавлять партнера своей силой.',
        'finance': 'Деньги через волевые усилия и преодоление страхов.'
    },
    12: {
        'title': 'Повешенный',
        'description': 'Вы пришли научиться жертвенности и смотреть на мир под другим углом.',
        'health': 'Проблемы с кровообращением и варикоз при застревании в ситуациях.',
        'relationships': 'Необходимо проработать жертвенность и созависимость.',
        'finance': 'Деньги могут приходить неожиданными путями, важно отпустить контроль.'
    },
    13: {
        'title': 'Смерть',
        'description': 'Ваше предназначение — трансформация и освобождение от старого.',
        'health': 'Глубокие кризисы здоровья как точки трансформации.',
        'relationships': 'Отношения проходят через кардинальные трансформации.',
        'finance': 'Финансовые перерождения, важно отпускать старые источники дохода.'
    },
    14: {
        'title': 'Умеренность',
        'description': 'Вы — алхимик, соединяющий противоположности. Предназначение — баланс.',
        'health': 'Проблемы с обменом веществ и печенью при дисбалансе.',
        'relationships': 'Важно найти баланс между отдаванием и принятием.',
        'finance': 'Деньги через умеренность и разумное распределение ресурсов.'
    },
    15: {
        'title': 'Дьявол',
        'description': 'Ваша задача — освободиться от зависимостей и материальных иллюзий.',
        'health': 'Склонность к зависимостям, важно работать с удовольствиями.',
        'relationships': 'Проработка созависимости и токсичных паттернов.',
        'finance': 'Деньги через трансформацию теневых сторон в силу.'
    },
    16: {
        'title': 'Башня',
        'description': 'Вы — разрушитель старых структур. Предназначение — создавать через разрушение.',
        'health': 'Внезапные острые заболевания как сигналы к изменениям.',
        'relationships': 'Отношения могут резко меняться, важна гибкость.',
        'finance': 'Финансовые потрясения ведут к новым возможностям.'
    },
    17: {
        'title': 'Звезда',
        'description': 'Вы — источник надежды и вдохновения. Предназначение — светить другим.',
        'health': 'Проблемы с лимфатической системой при блокировке вдохновения.',
        'relationships': 'Вам нужен партнер, который верит в ваши мечты.',
        'finance': 'Деньги через творчество, искусство, вдохновляющую деятельность.'
    },
    18: {
        'title': 'Луна',
        'description': 'Ваше предназначение — познать глубины подсознания и работать с интуицией.',
        'health': 'Психосоматические заболевания, важна работа с подсознанием.',
        'relationships': 'Глубокие эмоциональные связи, возможны иллюзии.',
        'finance': 'Деньги через интуитивную деятельность, творчество, психологию.'
    },
    19: {
        'title': 'Солнце',
        'description': 'Вы — источник света и радости. Предназначение — дарить тепло миру.',
        'health': 'Витальная энергия высокая, но может выгорать при чрезмерной отдаче.',
        'relationships': 'Открытые, радостные отношения, важна искренность.',
        'finance': 'Изобилие приходит естественно через самореализацию.'
    },
    20: {
        'title': 'Суд',
        'description': 'Ваша задача — пробуждать и трансформировать. Предназначение — возрождение.',
        'health': 'Кризисные состояния ведут к обновлению и исцелению.',
        'relationships': 'Кармические связи, важно проработать прошлое.',
        'finance': 'Деньги через работу с прошлым, исцеление, трансформацию.'
    },
    21: {
        'title': 'Мир',
        'description': 'Вы пришли достичь целостности и гармонии. Предназначение — завершение циклов.',
        'health': 'Гармоничное здоровье при проработанности всех аспектов.',
        'relationships': 'Целостные, зрелые отношения.',
        'finance': 'Финансовое изобилие через целостность и завершение проектов.'
    },
    22: {
        'title': 'Шут',
        'description': 'Ваше предназначение — начинать заново, быть свободным и спонтанным.',
        'health': 'Травмы и несчастные случаи при недостатке осознанности.',
        'relationships': 'Свободные отношения, важна независимость.',
        'finance': 'Деньги через риск, новые начинания, необычные проекты.'
    }
}

def create_pdf_report(name: str, birth_date: str, personal: int, destiny: int, social: int, spiritual: int) -> bytes:
    '''Создает PDF отчет с расшифровкой матрицы судьбы'''
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, leftMargin=2*cm, rightMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm)
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor='#2C5F7F',
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor='#2C5F7F',
        spaceAfter=12,
        spaceBefore=12
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=11,
        leading=16,
        spaceAfter=12
    )
    
    story = []
    
    story.append(Paragraph('Матрица Судьбы', title_style))
    story.append(Paragraph(f'Полная расшифровка для {name}', heading_style))
    story.append(Paragraph(f'Дата рождения: {birth_date}', body_style))
    story.append(Paragraph(f'Дата создания отчета: {datetime.now().strftime("%d.%m.%Y")}', body_style))
    story.append(Spacer(1, 1*cm))
    
    story.append(Paragraph('Основные энергии', heading_style))
    story.append(Paragraph(f'• Личное предназначение: {personal} - {ENERGY_DESCRIPTIONS.get(personal, {}).get("title", "Энергия")}', body_style))
    story.append(Paragraph(f'• Энергия судьбы: {destiny} - {ENERGY_DESCRIPTIONS.get(destiny, {}).get("title", "Энергия")}', body_style))
    story.append(Paragraph(f'• Социальная энергия: {social} - {ENERGY_DESCRIPTIONS.get(social, {}).get("title", "Энергия")}', body_style))
    story.append(Paragraph(f'• Духовная энергия: {spiritual} - {ENERGY_DESCRIPTIONS.get(spiritual, {}).get("title", "Энергия")}', body_style))
    story.append(Spacer(1, 1*cm))
    
    energy_data = ENERGY_DESCRIPTIONS.get(personal, {})
    
    story.append(Paragraph('1. Ваше предназначение', heading_style))
    story.append(Paragraph(energy_data.get('description', ''), body_style))
    story.append(Spacer(1, 0.5*cm))
    
    story.append(Paragraph('2. Здоровье и тело', heading_style))
    story.append(Paragraph(energy_data.get('health', ''), body_style))
    story.append(Spacer(1, 0.5*cm))
    
    story.append(Paragraph('3. Отношения и партнерство', heading_style))
    story.append(Paragraph(energy_data.get('relationships', ''), body_style))
    story.append(Spacer(1, 0.5*cm))
    
    story.append(Paragraph('4. Финансы и карьера', heading_style))
    story.append(Paragraph(energy_data.get('finance', ''), body_style))
    story.append(Spacer(1, 1*cm))
    
    story.append(Paragraph('Рекомендации', heading_style))
    story.append(Paragraph('Этот отчет создан на основе вашей даты рождения и содержит ключевые направления для работы над собой. Используйте эту информацию как ориентир в вашем развитии.', body_style))
    
    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Генерация PDF отчета с расшифровкой матрицы судьбы
    Args: event - содержит httpMethod, body с данными для отчета
          context - объект контекста с атрибутами request_id и др.
    Returns: HTTP response dict с PDF в base64
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        name = body_data.get('name', 'Пользователь')
        birth_date = body_data.get('birth_date', '')
        personal = body_data.get('personal', 1)
        destiny = body_data.get('destiny', 1)
        social = body_data.get('social', 1)
        spiritual = body_data.get('spiritual', 1)
        
        pdf_bytes = create_pdf_report(name, birth_date, personal, destiny, social, spiritual)
        pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'pdf': pdf_base64,
                'filename': f'matrix_destiny_{name}_{datetime.now().strftime("%Y%m%d")}.pdf'
            }),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
