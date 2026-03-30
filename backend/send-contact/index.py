import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправка сообщения с формы контактов на почту автора"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    email = body.get('email', '').strip()
    message = body.get('message', '').strip()

    if not name or not email or not message:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Заполните все поля'})
        }

    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    sender = 'alex.shaman1313@gmail.com'
    recipient = 'alex.shaman1313@gmail.com'

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новое сообщение с сайта от {name}'
    msg['From'] = sender
    msg['To'] = recipient

    html = f"""
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f5efe6; border: 1px solid #c9b89a;">
      <h2 style="font-size: 24px; color: #3a2512; margin-bottom: 24px; font-weight: 400;">Новое сообщение с сайта</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #7a6040; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">Имя</td></tr>
        <tr><td style="padding: 4px 0 16px; color: #3a2512; font-size: 18px;">{name}</td></tr>
        <tr><td style="padding: 8px 0; color: #7a6040; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">Email</td></tr>
        <tr><td style="padding: 4px 0 16px;"><a href="mailto:{email}" style="color: #7a3e1a; font-size: 18px;">{email}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #7a6040; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">Сообщение</td></tr>
        <tr><td style="padding: 4px 0 16px; color: #3a2512; font-size: 18px; line-height: 1.6;">{message.replace(chr(10), '<br>')}</td></tr>
      </table>
      <p style="margin-top: 32px; color: #9a8060; font-size: 12px; border-top: 1px solid #c9b89a; padding-top: 16px;">
        Алексей Васильченко — официальный сайт
      </p>
    </div>
    """

    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(sender, smtp_password)
        server.sendmail(sender, recipient, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }
