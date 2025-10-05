import { LucideIcon } from "lucide-react";
import { Card } from "../components/ui/card";

interface AirQualityCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  status: "clean" | "moderate" | "unhealthy" | "hazardous";
  description?: string;
}

const AirQualityCard = ({ title, value, unit, icon: Icon, status, description }: AirQualityCardProps) => {
  const statusStyles: Record<AirQualityCardProps["status"], string> = {
    clean: "gradient-clean glow-clean",
    moderate: "gradient-moderate glow-warning",
    unhealthy: "gradient-unhealthy glow-danger",
    hazardous: "gradient-unhealthy glow-danger",
  };

  return (
    <Card className="glass-card p-6 hover:scale-105 transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${statusStyles[status]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{unit}</div>
        </div>
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </Card>
  );
};

export default AirQualityCard;
