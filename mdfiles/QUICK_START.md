# Quick Start Guide

## 🚀 Manual Startup (Recommended)

### Step 1: Start Backend
```bash
cd backend
source venv/bin/activate
python main.py
```

### Step 2: Start Frontend (in new terminal)
```bash
cd new-frontend
npm start
```

## 🔧 Alternative: Automated Scripts

### Option 1: Simple Script
```bash
./start-simple.sh
```

### Option 2: Full System Script
```bash
./start-full-system.sh
```

## 📊 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://127.0.0.1:8000
- **API Docs**: http://127.0.0.1:8000/docs

## 🧪 Test Backend

```bash
python test_backend.py
```

## 🛑 Stop Servers

Press `Ctrl+C` in each terminal, or:
```bash
# Kill all processes on ports 8000 and 3000
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

## 🔍 Troubleshooting

### Backend Issues
- Check if port 8000 is free: `lsof -i:8000`
- Verify Python dependencies: `pip install -r backend/requirements.txt`
- Check database: `python backend/init_mock_data.py`

### Frontend Issues
- Check if port 3000 is free: `lsof -i:3000`
- Install dependencies: `cd new-frontend && npm install`
- Clear cache: `npm start -- --reset-cache`

### Common Solutions
1. **Port already in use**: Kill existing processes
2. **Module not found**: Install dependencies
3. **Database errors**: Reinitialize with mock data
4. **CORS issues**: Check backend CORS settings
