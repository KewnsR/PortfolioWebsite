# Email Setup Instructions

## Step 1: Install Required Packages

```bash
pip install -r requirements.txt
```

## Step 2: Configure Email Settings

1. Copy `.env.example` to `.env`:

   ```bash
   copy .env.example .env
   ```

2. Edit `.env` file with your email credentials

### For Gmail Users:

1. **Enable 2-Factor Authentication**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Turn on 2-Step Verification

2. **Generate App Password**:
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer"
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env file**:
   ```
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-16-character-app-password
   RECIPIENT_EMAIL=your-email@gmail.com
   ```

### For Other Email Providers:

- **Outlook/Hotmail**:

  ```
  MAIL_SERVER=smtp-mail.outlook.com
  MAIL_PORT=587
  ```

- **Yahoo**:
  ```
  MAIL_SERVER=smtp.mail.yahoo.com
  MAIL_PORT=587
  ```

## Step 3: Test the Contact Form

1. Start the Flask application:

   ```bash
   python app.py
   ```

2. Open browser: `http://localhost:5000`

3. Fill out the contact form and submit

4. Check your email inbox for the message

## Security Notes:

- Never commit `.env` file to version control
- Use App Passwords instead of regular passwords
- Keep your credentials secure
