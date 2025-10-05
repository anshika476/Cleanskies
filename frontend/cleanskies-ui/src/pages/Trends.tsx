import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { zipCodeOptions } from "../lib/zipCodes";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { api } from "@/lib/api";

// Define the structure of a single data point in the chart
type TrendDataPoint = {
  date: string;
  pm25: number;
  no2: number;
  o3: number;
};

const Trends = () => {
  // State management with TypeScript types
  const [selectedZip, setSelectedZip] = useState<string>("10001");
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");
  const [trendData, setTrendData] = useState<TrendDataPoint[] | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // inside useEffect in Trends.tsx
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setTrendData(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view trends.");
          return;
        }

        const res = await api.trends(selectedZip, token);
        const dataKey = timeRange === "week" ? "weeklyTrends" : "monthlyTrends";
        setTrendData(res[dataKey]);
        setLocationName(res.locationName);
      } catch (err: any) {
        // Handle 401 -> tell user to log in again
        if (typeof err.message === "string" && err.message.includes("401")) {
          setError("Session expired or invalid. Please log in again.");
        } else {
          setError(err?.message ?? "Failed to fetch");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedZip, timeRange]);

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans">
      <Navigation />
      <main className="p-4 sm:p-8 pt-24">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 text-white">
            Historical Trends
          </h1>
          <p className="text-lg text-gray-400">
            Analyze pollutant levels over time using historical data.
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 max-w-5xl mx-auto shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
            {/* Zip Code Selector */}
            <div className="flex flex-col w-full sm:w-auto">
              <label
                htmlFor="zipcode-select"
                className="mb-2 text-sm font-medium text-gray-400"
              >
                Select a Location
              </label>
              <select
                id="zipcode-select"
                value={selectedZip}
                onChange={(e) => setSelectedZip(e.target.value)}
                className="bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
              >
                {zipCodeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.value})
                  </option>
                ))}
              </select>
            </div>

            {/* Time Range Selector */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-400">
                Select Time Range
              </label>
              <div className="flex rounded-lg border border-gray-600">
                <button
                  onClick={() => setTimeRange("week")}
                  className={`px-4 py-2 rounded-l-lg transition-colors ${
                    timeRange === "week"
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setTimeRange("month")}
                  className={`px-4 py-2 rounded-r-lg transition-colors border-l border-gray-600 ${
                    timeRange === "month"
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Last 30 Days
                </button>
              </div>
            </div>
          </div>

          <div className="w-full min-h-[400px] flex flex-col justify-center items-center">
            {isLoading && (
              <p className="text-gray-400">Loading chart data...</p>
            )}
            {error && <p className="text-red-400">{error}</p>}
            {!isLoading && !error && trendData && (
              <>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Trends for {locationName}
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={trendData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis
                      label={{
                        value: "µg/m³",
                        angle: -90,
                        position: "insideLeft",
                        fill: "#9CA3AF",
                      }}
                      stroke="#9CA3AF"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #4B5563",
                        borderRadius: "0.5rem",
                      }}
                      labelStyle={{ color: "#F3F4F6" }}
                      cursor={{ fill: "rgba(75, 85, 99, 0.2)" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="pm25"
                      name="PM2.5"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="no2"
                      name="NO₂"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="o3"
                      name="O₃"
                      stroke="#ffc658"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Trends;
