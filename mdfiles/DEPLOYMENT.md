# 🚀 AI Interview System - Deployment Guide

## 🎯 **Easiest Deployment Options**

### **Option 1: Docker Compose (Recommended - Easiest)**

**Single Command Deployment:**
```bash
./deploy.sh
```

This will:
- Build both backend and frontend containers
- Start all services
- Make your app available at:
  - **Frontend**: http://localhost:3000
  - **Backend API**: http://localhost:8000
  - **API Docs**: http://localhost:8000/docs

**Manual Docker Compose:**
```bash
# Build and start
docker-compose up --build -d

# Stop
docker-compose down

# View logs
docker-compose logs -f
```

---

### **Option 2: Cloud Deployment (Production)**

#### **A. Railway (Easiest Cloud Option)**
1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy:**
   ```bash
   railway login
   railway init
   railway up
   ```

#### **B. Heroku**
1. **Install Heroku CLI**
2. **Create Heroku apps:**
   ```bash
   # For backend
   heroku create your-app-backend
   
   # For frontend
   heroku create your-app-frontend
   ```

3. **Deploy:**
   ```bash
   # Backend
   cd backend
   git subtree push --prefix=backend heroku main
   
   # Frontend
   cd new-frontend
   git subtree push --prefix=new-frontend heroku main
   ```

#### **C. DigitalOcean App Platform**
1. Connect your GitHub repository
2. Set build commands:
   - **Backend**: `pip install -r requirements.txt && uvicorn main:app --host 0.0.0.0 --port 8000`
   - **Frontend**: `npm install && npm start`

#### **D. AWS/GCP/Azure**
- Use container services (ECS, Cloud Run, Container Instances)
- Upload your `docker-compose.yml`
- Set environment variables

---

### **Option 3: VPS Deployment**

#### **Using a VPS (DigitalOcean, Linode, etc.)**

1. **SSH into your server:**
   ```bash
   ssh root@your-server-ip
   ```

2. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

3. **Clone your repository:**
   ```bash
   git clone your-repo-url
   cd ai-interview-system
   ```

4. **Deploy:**
   ```bash
   ./deploy.sh
   ```

5. **Set up domain (optional):**
   - Point your domain to the server IP
   - Configure nginx for SSL

---

## 🔧 **Environment Variables**

Create a `.env` file in the backend directory:
```env
SECRET_KEY=your-super-secret-key-here
DATABASE_URL=sqlite:///./app.db
OPENAI_API_KEY=your-openai-api-key-here
```

## 📋 **Requirements**

- **Docker** (for local deployment)
- **Node.js 18+** (for development)
- **Python 3.10+** (for development)
- **OpenAI API Key** (for AI features)

## 🎯 **Quick Start Commands**

```bash
# Local development
./start.sh

# Docker deployment
./deploy.sh

# Stop everything
docker-compose down
```

## 🚨 **Production Checklist**

- [ ] Set strong SECRET_KEY
- [ ] Configure proper database (PostgreSQL for production)
- [ ] Set up SSL/HTTPS
- [ ] Configure environment variables
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Set up CI/CD pipeline

## 🆘 **Troubleshooting**

**Port already in use:**
```bash
# Kill processes on ports 3000 and 8000
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```

**Docker issues:**
```bash
# Clean up Docker
docker system prune -a
docker-compose down --volumes
```

**Database issues:**
```bash
# Reset database
rm backend/app.db
python backend/init_fresh_db.py
```
