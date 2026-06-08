# Portfolio Website

![Portfolio Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![Flask](https://img.shields.io/badge/Flask-3.1.0-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Latest-38B2AC) ![Python](https://img.shields.io/badge/Python-3.x-yellow)

## 🛠️ Tech Stack

### Backend
- **Flask 3.1.0** - Python web framework
- **Python 3.x** - Server-side programming

### Frontend
- **HTML5** - Semantic markup structure
- **Tailwind CSS (CDN)** - Utility-first CSS framework
- **Vanilla JavaScript** - Intersection Observer API, smooth scrolling, mobile menu

## Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KewnsR/MyPortfolioWebsite.git
   cd MyPortfolioWebsite
   ```

2. **Set up Python virtual environment**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # or
   source .venv/bin/activate  # macOS/Linux
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000` to view the website

## Deployment

### Vercel (Recommended)
The project includes `vercel.json` configuration:
```bash
vercel --prod
```

### Local Development
```bash
python app.py
```

### Traditional Hosting
1. Use WSGI server like Gunicorn
2. Configure web server (Nginx/Apache)
3. Set up SSL certificate

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

*Last updated: February 2026*
