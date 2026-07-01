from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__, template_folder='../templates', static_folder='../static')

# Email Configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', os.getenv('MAIL_USERNAME'))
app.config['RECIPIENT_EMAIL'] = os.getenv('RECIPIENT_EMAIL')

mail = Mail(app)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/test-config", methods=['GET'])
def test_config():
    """Debug endpoint to check if environment variables are set"""
    config_status = {
        'MAIL_SERVER': 'SET' if os.getenv('MAIL_SERVER') else 'MISSING',
        'MAIL_PORT': 'SET' if os.getenv('MAIL_PORT') else 'MISSING',
        'MAIL_USERNAME': 'SET' if os.getenv('MAIL_USERNAME') else 'MISSING',
        'MAIL_PASSWORD': 'SET' if os.getenv('MAIL_PASSWORD') else 'MISSING',
        'RECIPIENT_EMAIL': 'SET' if os.getenv('RECIPIENT_EMAIL') else 'MISSING'
    }
    return jsonify(config_status), 200

@app.route("/send-email", methods=['POST'])
def send_email():
    try:
        if not app.config['MAIL_USERNAME'] or not app.config['MAIL_PASSWORD']:
            return jsonify({
                'success': False,
                'message': 'Email service is not configured. Please contact the administrator.'
            }), 503
        
        if not app.config['RECIPIENT_EMAIL']:
            return jsonify({
                'success': False,
                'message': 'Recipient email is not configured.'
            }), 503

        data = request.get_json(silent=True) or request.form.to_dict()
        
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
        error_message = str(e)
        print(f"Error sending email: {error_message}")
        
        # Provide more specific error messages
        if 'authentication' in error_message.lower():
            return jsonify({
                'success': False, 
                'message': 'Email authentication failed. Please try again later.'
            }), 500
        elif 'timeout' in error_message.lower():
            return jsonify({
                'success': False, 
                'message': 'Request timed out. Please try again.'
            }), 500
        else:
            return jsonify({
                'success': False, 
                'message': 'Failed to send message. Please try again.'
            }), 500

# For Vercel
if __name__ == "__main__":
    app.run(debug=True)
