import Navigation from "../components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Satellite, Database, Wind, TrendingUp, Calculator, BarChart3, Shield, Users, Globe, Zap, Target } from "lucide-react";

const About = () => {
  const howItWorks = [
    {
      icon: Database,
      title: "Data Collection",
      description: "We gather real-time air quality data from multiple sources including ground stations, satellite observations, and weather APIs to ensure comprehensive coverage."
    },
    {
      icon: Calculator,
      title: "AQI Calculation",
      description: "Our advanced algorithms process pollutant concentrations using standardized formulas to calculate accurate Air Quality Index values for different pollutants."
    },
    {
      icon: BarChart3,
      title: "Data Analysis",
      description: "Machine learning models analyze historical patterns, weather conditions, and current pollutant levels to identify trends and predict future air quality."
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "The system continuously processes new data and updates air quality information, providing users with the most current and accurate readings available."
    }
  ];

  const aqiParameters = [
    {
      pollutant: "PM2.5",
      concentrationRange: "0-12.0 μg/m³ (Good: 0-12, Moderate: 12.1-35.4, Unhealthy: 35.5-55.4)",
      description: "Fine particulate matter smaller than 2.5 micrometers. Major health concern as it can penetrate deep into lungs.",
      healthImpact: "Can cause respiratory and cardiovascular problems, especially in sensitive groups."
    },
    {
      pollutant: "PM10",
      concentrationRange: "0-54 μg/m³ (Good: 0-54, Moderate: 55-154, Unhealthy: 155-254)",
      description: "Coarse particulate matter smaller than 10 micrometers. Includes dust, pollen, and mold spores.",
      healthImpact: "Can irritate eyes, nose, and throat; may cause respiratory issues."
    },
    {
      pollutant: "O₃ (Ozone)",
      concentrationRange: "0-54 ppb (Good: 0-54, Moderate: 55-70, Unhealthy: 71-85)",
      description: "Ground-level ozone formed by chemical reactions between nitrogen oxides and volatile organic compounds in sunlight.",
      healthImpact: "Can cause breathing problems, trigger asthma, and reduce lung function."
    },
    {
      pollutant: "NO₂",
      concentrationRange: "0-53 ppb (Good: 0-53, Moderate: 54-100, Unhealthy: 101-360)",
      description: "Nitrogen dioxide, primarily from vehicle emissions and industrial processes.",
      healthImpact: "Can cause respiratory irritation and increase susceptibility to respiratory infections."
    },
    {
      pollutant: "SO₂",
      concentrationRange: "0-35 ppb (Good: 0-35, Moderate: 36-75, Unhealthy: 76-185)",
      description: "Sulfur dioxide, mainly from burning fossil fuels containing sulfur.",
      healthImpact: "Can cause respiratory problems, especially in people with asthma."
    },
    {
      pollutant: "CO",
      concentrationRange: "0-4.4 ppm (Good: 0-4.4, Moderate: 4.5-9.4, Unhealthy: 9.5-12.4)",
      description: "Carbon monoxide, colorless and odorless gas from incomplete combustion.",
      healthImpact: "Reduces oxygen delivery to organs and can be fatal in high concentrations."
    }
  ];

  const aqiBreakpoints = [
    { range: "0-50", level: "Good", color: "bg-green-500", description: "Air quality is satisfactory, and air pollution poses little or no risk." },
    { range: "51-100", level: "Moderate", color: "bg-yellow-500", description: "Air quality is acceptable. However, there may be a risk for some people." },
    { range: "101-150", level: "Unhealthy for Sensitive Groups", color: "bg-orange-500", description: "Members of sensitive groups may experience health effects." },
    { range: "151-200", level: "Unhealthy", color: "bg-red-500", description: "Some members of the general public may experience health effects." },
    { range: "201-300", level: "Very Unhealthy", color: "bg-purple-500", description: "Health alert: The risk of health effects is increased for everyone." },
    { range: "301+", level: "Hazardous", color: "bg-red-800", description: "Health warning of emergency conditions. Everyone is more likely to be affected." }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              About CleanSkies
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your comprehensive air quality monitoring platform that combines real-time data, 
              advanced analytics, and personalized health insights to help you breathe cleaner air.
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="card-3d mb-16">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center mb-4">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                CleanSkies is dedicated to making air quality information accessible, understandable, and actionable 
                for everyone. We believe that clean air is a fundamental right, and by providing accurate, real-time 
                air quality data and personalized health recommendations, we empower individuals and communities to 
                make informed decisions about their health and outdoor activities.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="px-4 py-2">
                  <Shield className="h-4 w-4 mr-2" />
                  Health Protection
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  <Globe className="h-4 w-4 mr-2" />
                  Global Coverage
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  <Users className="h-4 w-4 mr-2" />
                  Community Focus
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-12">How CleanSkies Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, index) => (
                <Card key={step.title} className="card-3d p-6 text-center">
                  <div className="p-4 w-fit rounded-full gradient-clean mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="bg-primary/10 text-primary font-bold w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* AQI Calculation Section */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-12">Understanding Air Quality Index (AQI)</h2>
            
            <Card className="card-3d mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">What is AQI?</CardTitle>
                <CardDescription className="text-center text-lg">
                  The Air Quality Index is a standardized scale used to communicate how polluted the air currently is 
                  or how polluted it is forecast to become. It's calculated by measuring concentrations of major air pollutants 
                  and selecting the highest AQI value among all pollutants as the final AQI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aqiBreakpoints.map((breakpoint) => (
                    <div key={breakpoint.level} className="p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-4 h-4 rounded-full ${breakpoint.color}`}></div>
                        <span className="font-semibold">{breakpoint.level}</span>
                        <Badge variant="outline">{breakpoint.range}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{breakpoint.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AQI Calculation Process */}
            <Card className="card-3d mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center mb-4">How AQI is Calculated</CardTitle>
                <CardDescription className="text-center">
                  AQI calculation follows a specific process where the highest individual pollutant AQI becomes the overall AQI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold text-lg mb-3 text-blue-900">Step-by-Step Process:</h4>
                  <ol className="space-y-2 text-blue-800">
                    <li><strong>1. Measure Concentrations:</strong> Collect real-time concentrations of all 6 major pollutants</li>
                    <li><strong>2. Calculate Individual AQIs:</strong> Use the formula AQI = ((I_high - I_low) / (C_high - C_low)) × (C - C_low) + I_low for each pollutant</li>
                    <li><strong>3. Select Highest Value:</strong> The pollutant with the highest AQI becomes the overall AQI</li>
                    <li><strong>4. Identify Primary Pollutant:</strong> The pollutant that determined the final AQI is called the "Primary Pollutant"</li>
                  </ol>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-green-800 text-sm">
                    <strong>Example:</strong> If PM2.5 gives AQI 45, Ozone gives AQI 78, and NO₂ gives AQI 32, 
                    then the final AQI is 78 (from Ozone), and Ozone is the primary pollutant.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AQI Parameters */}
            <Card className="card-3d">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center mb-4">AQI Calculation Parameters</CardTitle>
                <CardDescription className="text-center">
                  Our system monitors six major air pollutants. Each has specific concentration ranges 
                  that correspond to different AQI levels.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {aqiParameters.map((param, index) => (
                    <div key={param.pollutant} className="p-6 rounded-lg border border-border">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 text-primary font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-semibold">{param.pollutant}</h3>
                            <Badge variant="outline">Primary Pollutant</Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{param.description}</p>
                          <div className="bg-muted p-3 rounded-md mb-3">
                            <p className="text-sm font-medium">Concentration Ranges:</p>
                            <code className="text-sm font-mono">{param.concentrationRange}</code>
                          </div>
                          <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                            <p className="text-sm text-red-800">
                              <strong>Health Impact:</strong> {param.healthImpact}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Sources */}
          <Card className="card-3d mb-16">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center mb-6">Our Data Sources</CardTitle>
              <CardDescription className="text-center text-lg">
                We aggregate data from multiple reliable sources to ensure accuracy and comprehensive coverage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
                    <div className="p-3 rounded-lg gradient-clean">
                      <Satellite className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Satellite Data</h3>
                      <p className="text-sm text-muted-foreground">NASA and ESA satellite observations for global coverage</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
                    <div className="p-3 rounded-lg gradient-clean">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Ground Stations</h3>
                      <p className="text-sm text-muted-foreground">Real-time measurements from monitoring stations worldwide</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
                    <div className="p-3 rounded-lg gradient-clean">
                      <Wind className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Weather Data</h3>
                      <p className="text-sm text-muted-foreground">Meteorological data for accurate forecasting</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-border">
                    <div className="p-3 rounded-lg gradient-clean">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">AI Models</h3>
                      <p className="text-sm text-muted-foreground">Machine learning algorithms for predictions</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Overview */}
          <Card className="card-3d">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center mb-6">Platform Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <div className="p-4 w-fit rounded-full gradient-clean mx-auto mb-4">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Real-time Monitoring</h3>
                  <p className="text-muted-foreground">Get instant updates on air quality conditions in your area</p>
                </div>
                <div className="text-center p-6">
                  <div className="p-4 w-fit rounded-full gradient-clean mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Historical Analysis</h3>
                  <p className="text-muted-foreground">View trends and patterns over time to understand air quality changes</p>
                </div>
                <div className="text-center p-6">
                  <div className="p-4 w-fit rounded-full gradient-clean mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Health Recommendations</h3>
                  <p className="text-muted-foreground">Personalized advice based on your health profile and current conditions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;
