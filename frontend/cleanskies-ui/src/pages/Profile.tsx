import { useEffect, useState } from "react";
import { User, Building2, Heart, Save, Bell, Settings, Shield, MapPin, Calendar, Phone, Mail, Camera, AlertTriangle, CheckCircle } from "lucide-react";
import Navigation from "../components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { Checkbox } from "../components/ui/checkbox";
import { Slider } from "../components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();

  // Personal Information
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [location, setLocation] = useState("");
  const [accountType, setAccountType] = useState<"individual" | "institution">("individual");
  
  // Health Information
  const [healthConditions, setHealthConditions] = useState("");
  const [isSmoker, setIsSmoker] = useState(false);
  const [hasAllergies, setHasAllergies] = useState(false);
  const [respiratoryIssues, setRespiratoryIssues] = useState(false);
  const [heartConditions, setHeartConditions] = useState(false);
  
  // Notification Preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  // Air Quality Thresholds
  const [pm25Threshold, setPm25Threshold] = useState(35);
  const [pm10Threshold, setPm10Threshold] = useState(50);
  const [o3Threshold, setO3Threshold] = useState(100);
  const [no2Threshold, setNo2Threshold] = useState(40);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.username || "");
      setAge(typeof user.age === 'number' ? user.age : "");
      setLocation(user.location || "");
      setAccountType(user.accountType || "individual");
      setHealthConditions(user.healthConditions || "");
      setIsSmoker(user.isSmoker || false);
      setHasAllergies(user.hasAllergies || false);
      setRespiratoryIssues(user.respiratoryIssues || false);
      setHeartConditions(user.heartConditions || false);
      
      setEmailNotifications(user.notificationPreferences?.email ?? true);
      setPushNotifications(user.notificationPreferences?.push ?? true);
      setSmsNotifications(user.notificationPreferences?.sms ?? false);
      
      setPm25Threshold(user.airQualityThresholds?.pm25 ?? 35);
      setPm10Threshold(user.airQualityThresholds?.pm10 ?? 50);
      setO3Threshold(user.airQualityThresholds?.o3 ?? 100);
      setNo2Threshold(user.airQualityThresholds?.no2 ?? 40);
    }
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        username: name,
        age: typeof age === 'number' ? age : undefined,
        location,
        accountType,
        healthConditions: accountType === 'individual' ? healthConditions : undefined,
        isSmoker: accountType === 'individual' ? isSmoker : undefined,
        hasAllergies: accountType === 'individual' ? hasAllergies : undefined,
        respiratoryIssues: accountType === 'individual' ? respiratoryIssues : undefined,
        heartConditions: accountType === 'individual' ? heartConditions : undefined,
        notificationPreferences: {
          email: emailNotifications,
          push: pushNotifications,
          sms: smsNotifications,
        },
        airQualityThresholds: {
          pm25: pm25Threshold,
          pm10: pm10Threshold,
          o3: o3Threshold,
          no2: no2Threshold,
        },
      });

      toast({
        title: "Profile Updated Successfully",
        description: "Your profile settings have been saved and will take effect immediately.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-6 mb-6">
              <Avatar className="h-20 w-20 border-4 border-primary/20">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-white">
                  {getInitials(name || "U")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {name || "Your Profile"}
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage your account settings and preferences
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant={accountType === "individual" ? "default" : "secondary"} className="flex items-center gap-1">
                    {accountType === "individual" ? <User className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                    {accountType === "individual" ? "Individual Account" : "Institution Account"}
                  </Badge>
                  {location && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {location}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="health" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Health
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="air-quality" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Air Quality
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card className="card-3d">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and account type
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-input border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-muted text-muted-foreground"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        min={0}
                        max={120}
                        placeholder="Enter your age"
                        value={age}
                        onChange={(e) => {
                          const v = e.target.value;
                          setAge(v === "" ? "" : Number(v));
                        }}
                        className="bg-input border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="City, Country"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-input border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Account Type</Label>
                    <Tabs value={accountType} onValueChange={(v) => setAccountType(v as "individual" | "institution")}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="individual" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Individual
                        </TabsTrigger>
                        <TabsTrigger value="institution" className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Institution
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <p className="text-xs text-muted-foreground">
                      Individual accounts have access to health features and personalized alerts
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Health Information Tab */}
            <TabsContent value="health" className="space-y-6">
              {accountType === "individual" ? (
                <Card className="card-3d">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-destructive" />
                      Health Information
                    </CardTitle>
                    <CardDescription>
                      Help us provide better air quality alerts based on your health needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="health">Health Conditions (Optional)</Label>
                      <textarea
                        id="health"
                        placeholder="E.g., Asthma, COPD, Heart disease, Respiratory issues..."
                        value={healthConditions}
                        onChange={(e) => setHealthConditions(e.target.value)}
                        className="flex min-h-[120px] w-full rounded-md border border-border bg-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        This information helps us provide personalized air quality alerts for vulnerable groups
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Health Risk Factors</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="smoker"
                            checked={isSmoker}
                            onCheckedChange={(checked) => setIsSmoker(checked as boolean)}
                          />
                          <Label htmlFor="smoker" className="text-sm font-medium">
                            Smoker
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="allergies"
                            checked={hasAllergies}
                            onCheckedChange={(checked) => setHasAllergies(checked as boolean)}
                          />
                          <Label htmlFor="allergies" className="text-sm font-medium">
                            Has Allergies
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="respiratory"
                            checked={respiratoryIssues}
                            onCheckedChange={(checked) => setRespiratoryIssues(checked as boolean)}
                          />
                          <Label htmlFor="respiratory" className="text-sm font-medium">
                            Respiratory Issues
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="heart"
                            checked={heartConditions}
                            onCheckedChange={(checked) => setHeartConditions(checked as boolean)}
                          />
                          <Label htmlFor="heart" className="text-sm font-medium">
                            Heart Conditions
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="card-3d">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Health Features Not Available</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      Health information and personalized alerts are only available for individual accounts. 
                      Switch to an individual account to access these features.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="card-3d">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to receive air quality alerts and updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive air quality alerts via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive browser push notifications
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts via text message
                        </p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Air Quality Settings Tab */}
            <TabsContent value="air-quality" className="space-y-6">
              <Card className="card-3d">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Air Quality Thresholds
                  </CardTitle>
                  <CardDescription>
                    Set custom thresholds for air quality alerts based on your sensitivity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label htmlFor="pm25">PM2.5 Threshold</Label>
                        <span className="text-sm text-muted-foreground">{pm25Threshold} μg/m³</span>
                      </div>
                      <Slider
                        id="pm25"
                        min={10}
                        max={100}
                        step={5}
                        value={[pm25Threshold]}
                        onValueChange={(value) => setPm25Threshold(value[0])}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Fine particulate matter - particles smaller than 2.5 micrometers
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label htmlFor="pm10">PM10 Threshold</Label>
                        <span className="text-sm text-muted-foreground">{pm10Threshold} μg/m³</span>
                      </div>
                      <Slider
                        id="pm10"
                        min={20}
                        max={150}
                        step={10}
                        value={[pm10Threshold]}
                        onValueChange={(value) => setPm10Threshold(value[0])}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Coarse particulate matter - particles smaller than 10 micrometers
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label htmlFor="o3">Ozone (O₃) Threshold</Label>
                        <span className="text-sm text-muted-foreground">{o3Threshold} μg/m³</span>
                      </div>
                      <Slider
                        id="o3"
                        min={50}
                        max={200}
                        step={10}
                        value={[o3Threshold]}
                        onValueChange={(value) => setO3Threshold(value[0])}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Ground-level ozone - can cause respiratory problems
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label htmlFor="no2">Nitrogen Dioxide (NO₂) Threshold</Label>
                        <span className="text-sm text-muted-foreground">{no2Threshold} μg/m³</span>
                      </div>
                      <Slider
                        id="no2"
                        min={20}
                        max={100}
                        step={5}
                        value={[no2Threshold]}
                        onValueChange={(value) => setNo2Threshold(value[0])}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Nitrogen dioxide - can cause respiratory irritation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="gradient-clean hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
