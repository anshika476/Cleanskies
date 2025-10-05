# CleanSkies UI 🌬️

A modern, comprehensive air quality monitoring platform that provides real-time data, personalized health insights, and advanced analytics to help you breathe cleaner air.

![CleanSkies UI](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue) ![Vite](https://img.shields.io/badge/Vite-5.0.0-purple) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0.0-cyan)

## ✨ Features

### 🔐 Authentication System
- **User Registration & Login** with username/email and password
- **Protected Routes** for authenticated pages
- **Persistent Sessions** with localStorage
- **Profile Management** with comprehensive user data

### 📊 Air Quality Monitoring
- **Real-time AQI Data** from multiple sources
- **Historical Trends** with interactive charts
- **Custom Thresholds** for personalized alerts
- **Multi-pollutant Tracking** (PM2.5, PM10, O₃, NO₂, SO₂, CO)

### 👤 Advanced Profile System
- **Personal Information** (age, location, account type)
- **Health Profile** (conditions, risk factors) - Individual accounts only
- **Notification Preferences** (email, push, SMS)
- **Air Quality Thresholds** with sliders for customization

### 🎨 Modern UI/UX
- **Responsive Design** for all devices
- **Dark/Light Theme** support
- **Interactive Components** with smooth animations
- **Professional Layout** with shadcn/ui components

### 📈 Data Visualization
- **Interactive Charts** using Recharts
- **Trend Analysis** over time periods
- **Location-based Data** for multiple cities
- **Real-time Updates** with live data

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cleanskies-ui.git
   cd cleanskies-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
cleanskies-ui/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Navigation.tsx  # Main navigation
│   │   ├── Hero.tsx        # Landing page hero
│   │   ├── FactStrip.tsx   # Rotating facts
│   │   └── ProtectedRoute.tsx
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication state
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Home page
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Trends.tsx      # Historical data
│   │   ├── Profile.tsx     # User profile
│   │   ├── About.tsx       # About page
│   │   └── auth.tsx        # Authentication
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── main.tsx            # App entry point
├── public/                 # Static assets
└── package.json
```

## 🔧 Technologies Used

- **Frontend Framework:** React 18.2.0
- **Language:** TypeScript 5.0.0
- **Build Tool:** Vite 5.0.0
- **Styling:** Tailwind CSS 3.0.0
- **UI Components:** shadcn/ui + Radix UI
- **Charts:** Recharts
- **Routing:** React Router DOM
- **Forms:** React Hook Form + Zod validation
- **State Management:** React Context API
- **Icons:** Lucide React

## 📱 Pages Overview

### 🏠 Home Page
- Hero section with call-to-action
- Rotating educational facts
- Clean, modern design

### 🔐 Authentication
- Registration form (username, email, password)
- Login form (username/email, password)
- Form validation with error handling
- Auto-redirect after successful auth

### 📊 Dashboard
- Real-time air quality data
- Interactive charts and graphs
- Location-based information
- Health recommendations

### 📈 Trends
- Historical data visualization
- Multiple time ranges (7 days, 30 days)
- City selection dropdown
- Interactive line charts

### 👤 Profile
- **Personal Tab:** Basic info, age, location, account type
- **Health Tab:** Health conditions, risk factors (individuals only)
- **Notifications Tab:** Email, push, SMS preferences
- **Air Quality Tab:** Custom thresholds for pollutants

### ℹ️ About
- Mission statement
- How the platform works
- AQI calculation methodology
- Data sources information

## 🎯 Key Features Explained

### AQI Calculation
The platform calculates Air Quality Index using the standard formula:
1. Measure concentrations of 6 major pollutants
2. Calculate individual AQI for each pollutant
3. Select the highest AQI value as the final AQI
4. Identify the primary pollutant

### Health Integration
- Individual accounts get access to health features
- Institution accounts have limited health options
- Personalized recommendations based on health profile
- Custom air quality thresholds

### Data Sources
- Satellite observations (NASA, ESA)
- Ground monitoring stations
- Weather data integration
- AI-powered predictions

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy automatically on push to main branch

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Manual Deployment
1. Run `npm run build`
2. Upload `dist` folder to your hosting provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NASA for satellite data
- OpenAQ for ground station data
- shadcn/ui for beautiful components
- React community for excellent tools

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact us at support@cleanskies.com

---

**Made with ❤️ for cleaner air and healthier communities**