import Navigation from "../components/Navigation";
import AirQualityCard from "../components/AirQualityCard";
import ChatBot from "../components/ChatBot";
import EmbeddedAQIMap from "../components/EmbeddedAQIMap";
import NotificationBell from "../components/NotificationBell";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  AlertCircle,
  Wind,
  Droplets,
  Thermometer,
  Cloud,
  Activity,
  MapPin,
  Search,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useState, useEffect } from "react";
import {
  ProcessedAirQualityData,
  findDataByZipCode,
  findDataByCity,
  generateTrendData,
  getAirQualityStatus,
} from "../lib/csvUtils";
import { zipValues } from "../lib/zipCodes";
import { fetchWeatherForZips, useWeather } from "../hooks/useWeather";

// Function to generate AQI alert message based on AQI value
export const getAQIAlert = (aqi: number) => {
  if (aqi <= 50) {
    return `Air Quality is Good 🌿 (AQI: ${aqi}). Safe to go outside, enjoy your outdoor activities! Equivalent to 0 cigarettes.`;
  } else if (aqi <= 100) {
    return `Air Quality is Moderate 🌤 (AQI: ${aqi}). Sensitive individuals may experience minor effects. Limit prolonged outdoor exposure. Equivalent to 1–2 cigarettes.`;
  } else if (aqi <= 150) {
    return `Air Quality is Unhealthy for Sensitive Groups ⚠️ (AQI: ${aqi}). Children, elderly, and people with respiratory conditions should reduce outdoor activity. Equivalent to ~5 cigarettes.`;
  } else if (aqi <= 200) {
    return `Air Quality is Unhealthy 🚫 (AQI: ${aqi}). Everyone may experience health effects. Avoid outdoor exertion. Equivalent to ~10 cigarettes.`;
  } else if (aqi <= 300) {
    return `Air Quality is Very Unhealthy ☠️ (AQI: ${aqi}). Serious health effects possible. Stay indoors and use air purifiers. Equivalent to ~20 cigarettes.`;
  } else {
    return `Air Quality is Hazardous 💀 (AQI: ${aqi}). Dangerous for everyone. Do NOT go outside. Equivalent to 30+ cigarettes.`;
  }
};

// Function to get alert severity and styling based on AQI
export const getAlertSeverity = (aqi: number) => {
  if (aqi <= 50) {
    return {
      severity: "success" as const,
      title: "Good Air Quality",
      className: "border-green-200 bg-green-50",
      iconColor: "text-green-600",
      textColor: "text-green-800",
    };
  } else if (aqi <= 100) {
    return {
      severity: "warning" as const,
      title: "Moderate Air Quality",
      className: "border-yellow-200 bg-yellow-50",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-800",
    };
  } else if (aqi <= 150) {
    return {
      severity: "warning" as const,
      title: "Unhealthy for Sensitive Groups",
      className: "border-orange-200 bg-orange-50",
      iconColor: "text-orange-600",
      textColor: "text-orange-800",
    };
  } else if (aqi <= 200) {
    return {
      severity: "error" as const,
      title: "Unhealthy Air Quality",
      className: "border-red-200 bg-red-50",
      iconColor: "text-red-600",
      textColor: "text-red-800",
    };
  } else if (aqi <= 300) {
    return {
      severity: "error" as const,
      title: "Very Unhealthy Air Quality",
      className: "border-red-300 bg-red-100",
      iconColor: "text-red-700",
      textColor: "text-red-900",
    };
  } else {
    return {
      severity: "error" as const,
      title: "Hazardous Air Quality",
      className: "border-red-400 bg-red-200",
      iconColor: "text-red-800",
      textColor: "text-red-900",
    };
  }
};

const Dashboard = () => {
  const [zipCode, setZipCode] = useState("");
  const [selectedZipCode, setSelectedZipCode] = useState("");
  const [currentLocationData, setCurrentLocationData] =
    useState<ProcessedAirQualityData | null>(null);

  const [allWeather, setAllWeather] = useState<Record<string, any>>({});

  // Sample CSV data with AQI values from EmbeddedAQIMap.tsx
  const sampleCSVData = `city,zip_code,pm2.5,pm10,ozone,no2,aqi
Chicago,60601,12,25,18,30,61
Detroit,48201,15,28,20,25,54
Minneapolis,55401,25,40,25,35,107
Los Angeles,90001,35,60,40,50,68
New York,10001,20,35,30,40,55
San Francisco,94101,10,20,15,25,46
Toronto,M5H,18,30,22,35,61
Vancouver,V5K,8,15,10,20,26
Montreal,H1A,22,35,28,40,85
Houston,77001,28,45,30,38,110
Miami,33101,15,25,18,30,65
Dallas,75201,24,40,25,35,95
Atlanta,30301,26,42,28,37,100
Mexico City,01000,50,80,45,55,180
Monterrey,64000,40,65,35,50,130
Guadalajara,44100,45,70,38,52,140
Tijuana,22000,38,60,32,45,120
Boston,02101,14,25,20,28,50
Philadelphia,19101,18,30,25,32,72
Kansas City,64101,22,38,26,34,90
New Orleans,70112,20,35,23,30,85
San Diego,92101,12,22,15,28,60
Seattle,98101,10,18,12,25,45
Portland,97201,13,23,15,27,55
Denver,80201,25,45,28,35,80
Phoenix,85001,30,55,35,40,110
Salt Lake City,84101,28,48,32,38,95`;

  // Process the sample CSV data with AQI values from the map
  const airQualityData: ProcessedAirQualityData[] = sampleCSVData
    .split("\n")
    .slice(1)
    .map((line) => {
      const [city, zipCode, pm25, pm10, ozone, no2, aqi] = line.split(",");
      const aqiValue = parseInt(aqi);
      return {
        city,
        zipCode,
        pm25: parseFloat(pm25),
        pm10: parseFloat(pm10),
        ozone: parseFloat(ozone),
        no2: parseFloat(no2),
        aqi: aqiValue,
        status: getAirQualityStatus(aqiValue),
      };
    });

  // Default data when no location is selected
  const defaultPollutants = [
    {
      title: "PM2.5",
      value: "45",
      unit: "μg/m³",
      icon: Wind,
      status: "moderate" as const,
      description: "Fine particulate matter",
    },
    {
      title: "PM10",
      value: "62",
      unit: "μg/m³",
      icon: Cloud,
      status: "moderate" as const,
      description: "Inhalable particles",
    },
    {
      title: "Ozone (O₃)",
      value: "38",
      unit: "ppb",
      icon: Activity,
      status: "clean" as const,
      description: "Ground-level ozone",
    },
    {
      title: "NO₂",
      value: "78",
      unit: "ppb",
      icon: Wind,
      status: "unhealthy" as const,
      description: "Nitrogen dioxide",
    },
  ];

  const defaultWeatherData = [
    { label: "Temperature", value: "24°C", icon: Thermometer },
    { label: "Humidity", value: "65%", icon: Droplets },
    { label: "Wind Speed", value: "12 km/h", icon: Wind },
  ];

  // Generate pollutants data from current location or use defaults
  const pollutants = currentLocationData
    ? [
        {
          title: "PM2.5",
          value: currentLocationData.pm25.toString(),
          unit: "μg/m³",
          icon: Wind,
          status: currentLocationData.status,
          description: "Fine particulate matter",
        },
        {
          title: "PM10",
          value: currentLocationData.pm10.toString(),
          unit: "μg/m³",
          icon: Cloud,
          status: currentLocationData.status,
          description: "Inhalable particles",
        },
        {
          title: "Ozone (O₃)",
          value: currentLocationData.ozone.toString(),
          unit: "ppb",
          icon: Activity,
          status: currentLocationData.status,
          description: "Ground-level ozone",
        },
        {
          title: "NO₂",
          value: currentLocationData.no2.toString(),
          unit: "ppb",
          icon: Wind,
          status: currentLocationData.status,
          description: "Nitrogen dioxide",
        },
      ]
    : defaultPollutants;

  // Generate weather data from current location or use defaults
  const weatherData =
    selectedZipCode && allWeather[selectedZipCode]
      ? [
          { label: "Temperature", value: `${Math.round(allWeather[selectedZipCode].tempC)}°C`, icon: Thermometer },
          { label: "Humidity", value: `${allWeather[selectedZipCode].humidity}%`, icon: Droplets },
          { label: "Wind Speed", value: `${Math.round(allWeather[selectedZipCode].windKph)} km/h`, icon: Wind },
        ]
      : defaultWeatherData;

  // Generate AQI trend data
  const aqiTrendData = currentLocationData
    ? generateTrendData(currentLocationData)
    : [
        { time: "6h ago", aqi: 55 },
        { time: "5h ago", aqi: 58 },
        { time: "4h ago", aqi: 62 },
        { time: "3h ago", aqi: 67 },
        { time: "2h ago", aqi: 70 },
        { time: "1h ago", aqi: 73 },
        { time: "Now", aqi: 75 },
        { time: "+6h", predicted: 78 },
        { time: "+12h", predicted: 82 },
        { time: "+18h", predicted: 85 },
        { time: "+24h", predicted: 88 },
        { time: "+30h", predicted: 83 },
        { time: "+36h", predicted: 79 },
        { time: "+42h", predicted: 75 },
        { time: "+48h", predicted: 72 },
      ];

  const chartConfig = {
    aqi: { label: "Historical AQI", color: "hsl(var(--primary))" },
    predicted: { label: "Predicted AQI", color: "hsl(var(--warning))" },
  };

  const handleZipCodeSubmit = () => {
    if (zipCode.trim()) {
      setSelectedZipCode(zipCode.trim());

      // Try to find data by zip code
      const foundData = findDataByZipCode(airQualityData, zipCode.trim());
      if (foundData) {
        setCurrentLocationData(foundData);
      } else {
        // If not found by zip code, try by city name
        const foundByCity = findDataByCity(airQualityData, zipCode.trim());
        if (foundByCity) {
          setCurrentLocationData(foundByCity);
        } else {
          setCurrentLocationData(null);
        }
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleZipCodeSubmit();
    }
  };

  // Get current AQI for alert
  const currentAQI = currentLocationData ? currentLocationData.aqi : 75;
  const alertMessage = getAQIAlert(currentAQI);
  const alertSeverity = getAlertSeverity(currentAQI);

  // Prefetch weather for all zip codes shown on Trends (so Dashboard can read values)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const map = await fetchWeatherForZips(zipValues);
        if (!mounted) return;
        setAllWeather(map);
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* MAP SECTION */}
        <div className="mb-12 animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">Live Air Quality Map</h2>
          <EmbeddedAQIMap />
        </div>

        {/* ZIP CODE INPUT SECTION */}
        <div className="mb-8 animate-fade-in">
          <Card className="card-3d p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">
                Check Air Quality by Location
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Enter a US zip code or city name to get real-time air quality data
              for that specific location
            </p>
            <div className="flex gap-3 max-w-md">
              <Input
                type="text"
                placeholder="Enter zip code or city (e.g., 10001 or New York)"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleZipCodeSubmit}
                className="gradient-clean text-primary-foreground px-6"
                disabled={!zipCode.trim()}
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            {selectedZipCode && (
              <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-primary font-medium">
                  📍 Showing air quality data for:{" "}
                  <span className="font-bold">{selectedZipCode}</span>
                  {currentLocationData && (
                    <span className="ml-2 text-xs">
                      (AQI: {currentLocationData.aqi}, Status:{" "}
                      {currentLocationData.status})
                    </span>
                  )}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Only show alerts and dashboard sections after a zip code is selected */}
        {selectedZipCode && (
          <>
            {/* Dynamic Alert Banner */}
            <Alert className={`mb-8 ${alertSeverity.className} animate-fade-in`}>
              <AlertCircle className={`h-5 w-5 ${alertSeverity.iconColor}`} />
              <AlertTitle className={alertSeverity.textColor}>
                {alertSeverity.title}
                {selectedZipCode && ` - ${selectedZipCode}`}
              </AlertTitle>
              <AlertDescription className={alertSeverity.textColor}>
                {alertMessage}
              </AlertDescription>
            </Alert>

            {/* Rest of Dashboard */}
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold mb-2">Air Quality Dashboard</h1>
              <p className="text-muted-foreground mb-8">
                {selectedZipCode
                  ? `Live data from NASA TEMPO satellite for ${selectedZipCode}`
                  : "Live data from NASA TEMPO satellite"}
              </p>

              {/* Pollutant Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {pollutants.map((pollutant, index) => (
                  <div
                    key={pollutant.title}
                    className="floating"
                    style={{ animationDelay: `${index * 0.5}s` }}
                  >
                    <AirQualityCard {...pollutant} />
                  </div>
                ))}
              </div>

              {/* Weather & AQI Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="card-3d p-6">
                  <h3 className="text-lg font-semibold mb-4">Current Weather</h3>
                  <div className="space-y-4">
                    {weatherData.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">
                            {item.label}
                          </span>
                        </div>
                        <span className="font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="card-3d p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Air Quality Index</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-6xl font-bold text-warning">
                      {currentLocationData ? currentLocationData.aqi : 75}
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-warning">
                        {currentLocationData
                          ? currentLocationData.status.charAt(0).toUpperCase() +
                            currentLocationData.status.slice(1)
                          : "Moderate"}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Air quality is acceptable for most people
                      </p>
                    </div>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-3/4 gradient-moderate"></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>0 - Good</span>
                    <span>50 - Moderate</span>
                    <span>100 - Unhealthy</span>
                    <span>200+ - Hazardous</span>
                  </div>
                </Card>
              </div>

              {/* AQI Trend Chart */}
              <Card className="card-3d p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  AQI Trends & 48-Hour Forecast
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Historical data (past 6 hours) + AI-powered predictions for next
                  48 hours
                </p>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <AreaChart data={aqiTrendData}>
                    <defs>
                      <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorPredicted"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--warning))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--warning))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="time"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: "AQI", angle: -90, position: "insideLeft" }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="aqi"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorAqi)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="predicted"
                      stroke="hsl(var(--warning))"
                      fillOpacity={1}
                      fill="url(#colorPredicted)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ChartContainer>

                <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-primary"></div>
                    <span className="text-muted-foreground">Historical</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-warning border-dashed"></div>
                    <span className="text-muted-foreground">Predicted</span>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
      </main>

      {/* Floating ChatBot */}
      <ChatBot />
    </div>
  );
};

export default Dashboard;
