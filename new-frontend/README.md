# AI Interview Coach - New Frontend

A modern, responsive React application for AI-powered interview practice with real-time emotion detection and feedback.

## 🚀 Features

### Core Functionality
- **Real-time Interview Practice** - Practice with AI-generated questions
- **Emotion Detection** - Real-time analysis of facial expressions and emotions
- **AI Feedback** - Intelligent analysis of interview responses
- **Session Management** - Track and analyze interview sessions
- **Progress Tracking** - Monitor improvement over time

### Modern UI/UX
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Theme** - Beautiful dark theme with gradient accents
- **Smooth Animations** - Framer Motion powered animations
- **Glass Morphism** - Modern glassmorphism design elements
- **Tailwind CSS** - Utility-first CSS framework

### Authentication
- **Email/Password Login** - Traditional authentication
- **Google OAuth** - One-click Google sign-in
- **Protected Routes** - Secure route protection
- **Context Management** - React Context for state management

### Pages & Components
- **Dashboard** - Overview of sessions and progress
- **Interview Page** - Real-time interview practice
- **Summary Page** - Detailed session analytics
- **Profile Page** - User profile and achievements
- **Settings Page** - Customizable preferences
- **Responsive Sidebar** - Collapsible navigation

## 🛠️ Technology Stack

- **React 19** - Latest React with hooks
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Context API** - State management
- **Google OAuth** - Authentication

## 📦 Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://127.0.0.1:8000
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

### API Integration
The frontend integrates with the FastAPI backend:
- Authentication endpoints
- Session management
- Emotion analysis
- LLM feedback
- Dashboard statistics

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#0ea5e9 to #3b82f6)
- **Accent**: Purple gradient (#d946ef to #8b5cf6)
- **Dark**: Dark theme with gray variations
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Primary Font**: Inter (sans-serif)
- **Display Font**: Orbitron (monospace)
- **Responsive**: Scales with screen size

### Components
- **Glass Cards** - Frosted glass effect
- **Gradient Buttons** - Animated gradients
- **Loading States** - Smooth loading animations
- **Form Elements** - Consistent styling
- **Navigation** - Collapsible sidebar

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Touch-friendly interactions
- Optimized layouts
- Swipe gestures
- Mobile navigation

## 🔐 Security

- **Protected Routes** - Authentication required
- **Token Management** - Secure token storage
- **Input Validation** - Client-side validation
- **Error Handling** - Graceful error states

## 🚀 Performance

- **Code Splitting** - Lazy loading of components
- **Optimized Images** - WebP format support
- **Caching** - Efficient data caching
- **Animations** - Hardware-accelerated animations

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Build & Deploy

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Docker
```bash
docker build -t ai-interview-frontend .
docker run -p 3000:3000 ai-interview-frontend
```

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable components
├── contexts/           # React contexts
├── pages/              # Page components
├── utils/              # Utility functions
├── styles/             # Global styles
└── assets/             # Static assets
```

### Code Style
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Conventional Commits** - Commit messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@ai-interview-coach.com or create an issue on GitHub.

---

**Built with ❤️ using React, Tailwind CSS, and Framer Motion**
