// World map component for admin geography page
// Uses react-simple-maps (lightweight, admin-only bundle)
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface WorldMapProps {
  data: Array<{ countryCode: string; visits: number; percentage: number }>;
  onCountryClick?: (countryCode: string) => void;
}

export function WorldMap({ data, onCountryClick }: WorldMapProps) {
  // Create a map of country codes to visit data
  const dataMap = new Map(data.map((d) => [d.countryCode, d]));

  // Find max visits for color scaling
  const maxVisits = Math.max(...data.map((d) => d.visits), 1);

  const getCountryColor = (geo: any) => {
    const countryData = dataMap.get(geo.properties.ISO_A2);
    if (!countryData) return '#1e293b'; // slate-800

    const intensity = countryData.visits / maxVisits;
    // Color scale from slate-700 to blue-500
    const r = Math.round(51 + (59 - 51) * intensity);
    const g = Math.round(65 + (130 - 65) * intensity);
    const b = Math.round(99 + (246 - 99) * intensity);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <ZoomableGroup center={[0, 20]} zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryData = dataMap.get(geo.properties.ISO_A2);
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCountryColor(geo)}
                    stroke="#334155"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: {
                        fill: countryData ? '#3b82f6' : '#334155',
                        outline: 'none',
                        cursor: countryData ? 'pointer' : 'default',
                      },
                      pressed: { outline: 'none' },
                    }}
                    onClick={() => {
                      if (countryData && onCountryClick) {
                        onCountryClick(countryData.countryCode);
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
