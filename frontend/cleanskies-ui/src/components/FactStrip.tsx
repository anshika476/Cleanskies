import { useEffect, useMemo, useState } from "react";
import { Info, Activity, Wind, ShieldAlert, Brain, Thermometer } from "lucide-react";

type Fact = {
  text: string;
  tag?: string;
};

const FactStrip = () => {
  const [index, setIndex] = useState<number | null>(null);

  const facts: Fact[] = useMemo(
    () => [
      {
        text:
          "PM2.5 (fine particles) can penetrate deep into lungs and enter the bloodstream.",
          tag: "Health",
      },
      {
        text:
          "AQI is driven by the worst pollutant at the moment — the highest individual AQI becomes the final AQI.",
          tag: "AQI",
      },
      {
        text:
          "AQI 0–50 is Good, 51–100 Moderate, 101–150 Unhealthy for Sensitive Groups.",
          tag: "AQI Scale",
      },
      {
        text:
          "Approximate equivalence: 1 day around 22 μg/m³ PM2.5 ≈ 1 cigarette (exposure-wise).",
          tag: "Approx",
      },
      {
        text:
          "Common indoor sources of PM2.5: cooking (especially frying), candles, and smoking.",
          tag: "Sources",
      },
      {
        text:
          "Wind and weather shifts can rapidly change AQI even within the same city.",
          tag: "Weather",
      },
      {
        text:
          "O₃ (ozone) peaks in sunny afternoon hours — morning plans can reduce exposure.",
          tag: "Ozone",
      },
      {
        text:
          "Sensitive groups (kids, elderly, asthma/COPD) should limit outdoor effort when AQI > 100.",
          tag: "Guidance",
      },
    ],
    []
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem("fact_index");
      const current = stored ? parseInt(stored, 10) : 0;
      const safeCurrent = isNaN(current) ? 0 : Math.max(0, Math.min(current, facts.length - 1));
      setIndex(safeCurrent);
      const next = (safeCurrent + 1) % facts.length;
      localStorage.setItem("fact_index", String(next));
    } catch {
      setIndex(0);
    }
  }, [facts.length]);

  if (index === null) return null;

  const current = facts[index];

  const getTagStyles = (tag?: string) => {
    switch (tag) {
      case "Health":
        return { badge: "bg-rose-100 text-rose-700 border-rose-200", ring: "ring-rose-200", icon: <ShieldAlert className="h-4 w-4 text-rose-600" /> };
      case "AQI":
      case "AQI Scale":
        return { badge: "bg-violet-100 text-violet-700 border-violet-200", ring: "ring-violet-200", icon: <Activity className="h-4 w-4 text-violet-600" /> };
      case "Approx":
        return { badge: "bg-amber-100 text-amber-700 border-amber-200", ring: "ring-amber-200", icon: <Thermometer className="h-4 w-4 text-amber-600" /> };
      case "Sources":
        return { badge: "bg-sky-100 text-sky-700 border-sky-200", ring: "ring-sky-200", icon: <Brain className="h-4 w-4 text-sky-600" /> };
      case "Weather":
        return { badge: "bg-emerald-100 text-emerald-700 border-emerald-200", ring: "ring-emerald-200", icon: <Wind className="h-4 w-4 text-emerald-600" /> };
      case "Ozone":
        return { badge: "bg-blue-100 text-blue-700 border-blue-200", ring: "ring-blue-200", icon: <Activity className="h-4 w-4 text-blue-600" /> };
      case "Guidance":
        return { badge: "bg-orange-100 text-orange-700 border-orange-200", ring: "ring-orange-200", icon: <ShieldAlert className="h-4 w-4 text-orange-600" /> };
      default:
        return { badge: "bg-primary/10 text-primary border-primary/20", ring: "ring-primary/20", icon: <Info className="h-4 w-4 text-primary" /> };
    }
  };
  const styles = getTagStyles(current?.tag);

  return (
    <section className="w-full">
      <div className="px-4 py-3">
        <div className={`inline-flex items-center gap-3 rounded-full border bg-background/70 px-4 py-2 shadow-sm ring-1 ${styles.ring}`}>
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            {styles.icon}
            Tip
          </span>
          {current?.tag && (
            <span className={`text-xs rounded-full px-2 py-0.5 border ${styles.badge}`}>
              {current.tag}
            </span>
          )}
          <p className="text-sm text-muted-foreground">
            {current?.text}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FactStrip;


