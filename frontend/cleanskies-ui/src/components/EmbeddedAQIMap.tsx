import React from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import L from "leaflet";

interface AQIPoint {
  city: string;
  lat: number;
  lon: number;
  aqi: number;
}

// 🌎 Realistic demo data
const citiesNA: AQIPoint[] = [
  { city: "Chicago", lat: 41.8781, lon: -87.6298, aqi: 61 },
  { city: "Detroit", lat: 42.3314, lon: -83.0458, aqi: 54 },
  { city: "Minneapolis", lat: 44.9778, lon: -93.265, aqi: 107 },
  { city: "Los Angeles", lat: 34.0522, lon: -118.2437, aqi: 68 },
  { city: "New York", lat: 40.7128, lon: -74.006, aqi: 55 },
  { city: "San Francisco", lat: 37.7749, lon: -122.4194, aqi: 46 },
  { city: "Toronto", lat: 43.65107, lon: -79.347015, aqi: 61 },
  { city: "Vancouver", lat: 49.2827, lon: -123.1207, aqi: 26 },
  { city: "Montreal", lat: 45.5017, lon: -73.5673, aqi: 85 },
  { city: "Houston", lat: 29.7604, lon: -95.3698, aqi: 110 },
  { city: "Miami", lat: 25.7617, lon: -80.1918, aqi: 65 },
  { city: "Dallas", lat: 32.7767, lon: -96.797, aqi: 95 },
  { city: "Atlanta", lat: 33.749, lon: -84.388, aqi: 100 },
  { city: "Mexico City", lat: 19.4326, lon: -99.1332, aqi: 180 },
  { city: "Monterrey", lat: 25.6866, lon: -100.3161, aqi: 130 },
  { city: "Guadalajara", lat: 20.6597, lon: -103.3496, aqi: 140 },
  { city: "Tijuana", lat: 32.5149, lon: -117.0382, aqi: 120 },
  { city: "Boston", lat: 42.3601, lon: -71.0589, aqi: 50 },
  { city: "Philadelphia", lat: 39.9526, lon: -75.1652, aqi: 72 },
  { city: "Kansas City", lat: 39.0997, lon: -94.5786, aqi: 90 },
  { city: "New Orleans", lat: 29.9511, lon: -90.0715, aqi: 85 },
  { city: "San Diego", lat: 32.7157, lon: -117.1611, aqi: 60 },
  { city: "Seattle", lat: 47.6062, lon: -122.3321, aqi: 45 },
  { city: "Portland", lat: 45.5051, lon: -122.675, aqi: 55 },
  { city: "Denver", lat: 39.7392, lon: -104.9903, aqi: 80 },
  { city: "Phoenix", lat: 33.4484, lon: -112.074, aqi: 110 },
  { city: "Salt Lake City", lat: 40.7608, lon: -111.891, aqi: 95 },
];

const DEFAULT_CENTER: [number, number] = [39.8283, -98.5795];
const DEFAULT_ZOOM = 4;

// 🌈 AQI color mapping
const aqiColor = (aqi: number) => {
  if (aqi <= 50) return "#4CAF50"; // Good - soft green
  if (aqi <= 100) return "#FFEB3B"; // Moderate - yellow
  if (aqi <= 150) return "#FF9800"; // Sensitive - orange
  if (aqi <= 200) return "#F44336"; // Unhealthy - red
  if (aqi <= 300) return "#9C27B0"; // Very unhealthy - purple
  return "#6A1B9A"; // Hazardous - dark purple
};

// 🔥 Heatmap Layer
const HeatmapLayer: React.FC<{ points: AQIPoint[] }> = ({ points }) => {
  const map = useMap();

  React.useEffect(() => {
    const heatPoints = points.map((p) => [
      p.lat,
      p.lon,
      Math.min(p.aqi / 300, 1),
    ]);
    const heatLayer = (L as any)
      .heatLayer(heatPoints, {
        radius: 35,
        blur: 25,
        maxZoom: 6,
        gradient: {
          0.2: "green",
          0.4: "yellow",
          0.6: "orange",
          0.8: "red",
          1.0: "purple",
        },
      })
      .addTo(map);

    return () => {
      try {
        map.removeLayer(heatLayer as any);
      } catch (e) {
        // ignore
      }
    };
  }, [map, points]);

  return null;
};

// 🌟 Styled Legend Component
const Legend: React.FC = () => {
  const legendItems = [
    { color: "#4CAF50", label: "Good (0–50)" },
    { color: "#FFEB3B", label: "Moderate (51–100)" },
    { color: "#FF9800", label: "Sensitive Groups (101–150)" },
    { color: "#F44336", label: "Unhealthy (151–200)" },
    { color: "#9C27B0", label: "Very Unhealthy (201–300)" },
    { color: "#6A1B9A", label: "Hazardous (301+)" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 25,
        left: 25,
        background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
        padding: "12px 18px",
        borderRadius: "14px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
        zIndex: 999,
        width: "230px",
      }}
    >
      <strong style={{ fontSize: "16px", color: "#333" }}>🌎 AQI Legend</strong>
      <div style={{ marginTop: "10px" }}>
        {legendItems.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "6px",
              transition: "transform 0.2s ease",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: item.color,
                marginRight: "10px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            ></div>
            <span style={{ color: "#555" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🌍 Main Component
const LiveAQIMap: React.FC = () => {
  return (
    <div style={{ height: "60vh", width: "100%", position: "relative" }}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
        // Limit view to North America
        minZoom={3}
        maxZoom={9}
        maxBounds={[[5, -170], [85, -30]]}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
      >
        {/* Esri World Imagery for satellite-like view */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
          noWrap={true}
        />

        {/* Optional reference labels overlay to show place names/roads/rivers */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
          attribution='Labels © Esri'
          opacity={0.85}
          noWrap={true}
        />

        {/* Heatmap */}
        <HeatmapLayer points={citiesNA} />

        {/* Circle Markers */}
        {citiesNA.map((p, i) => (
          <CircleMarker
            key={i}
            center={[p.lat, p.lon]}
            radius={14}
            pathOptions={{
              color: aqiColor(p.aqi),
              fillOpacity: 0.8,
              weight: 1.5,
            }}
          >
            <Popup>
              <div
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "14px",
                  padding: "5px",
                  color: "#333",
                }}
              >
                <strong style={{ fontSize: "16px" }}>{p.city}</strong>
                <br />
                <span>
                  AQI: <strong>{p.aqi}</strong>
                </span>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Mask outside North America so the continent area visually stands out */}
        <MaskOutsideNA />
      </MapContainer>

      {/* Legend */}
      <Legend />
    </div>
  );
};

// Mask component: draws a large polygon covering the world with a hole for NA bounds
const MaskOutsideNA: React.FC = () => {
  const map = useMap();

  React.useEffect(() => {
    // Outer world polygon (clockwise)
    const outer = [
      [90, -180],
      [90, 180],
      [-90, 180],
      [-90, -180],
    ];

    // Inner hole - North America approx bounds (counter-clockwise)
    const inner = [
      [5, -170],
      [5, -30],
      [85, -30],
      [85, -170],
    ];

    const mask = (L as any).polygon([outer, inner], {
      stroke: false,
      fillColor: '#000',
      fillOpacity: 0.45,
      interactive: false,
      pane: 'overlayPane',
    }).addTo(map);

    return () => {
      try {
        map.removeLayer(mask as any);
      } catch (e) {
        // ignore
      }
    };
  }, [map]);

  return null;
};

export default LiveAQIMap;
