from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Email Configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', os.getenv('MAIL_USERNAME'))
app.config['RECIPIENT_EMAIL'] = os.getenv('RECIPIENT_EMAIL', 'ramoslloydkenneth1@gmail.com')

mail = Mail(app)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/send-email", methods=['POST'])
def send_email():
    try:
        data = request.get_json()
        
        # Get form data
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        
        # Validate input
        if not name or not email or not subject or not message:
            return jsonify({'success': False, 'message': 'All fields are required'}), 400
        
        # Create email message
        msg = Message(
            subject=f'{subject} - from {name}',
            recipients=[app.config['RECIPIENT_EMAIL']],
            reply_to=email
        )
        
        # Email body
        msg.body = f"""
New message from your portfolio website:

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}
        """
        
        # Send email
        mail.send(msg)
        
        return jsonify({'success': True, 'message': 'Message sent successfully!'}), 200
        
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to send message. Please try again.'}), 500

# This is required for Vercel
app = app

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
