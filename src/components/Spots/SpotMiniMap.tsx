import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom marker SVG using the secondary color (#B85C37)
const customIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `
    <svg width="28" height="42" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));">
      <path d="M12 0C5.37258 0 0 5.37258 0 12C0 21 12 36 12 36C12 36 24 21 24 12C24 5.37258 18.6274 0 12 0ZM12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12C16.5 14.4853 14.4853 16.5 12 16.5Z" fill="var(--color-secondary, #B85C37)"/>
    </svg>
  `,
  iconSize: [28, 42],
  iconAnchor: [14, 42],
  popupAnchor: [0, -42],
})

export interface SpotMiniMapProps {
  latitude: number
  longitude: number
  spotName: string
}



/**
 * Renders an interactive Leaflet mini-map centred on the given coordinates.
 * Must be lazy-imported and wrapped in <ClientOnly> to avoid SSR crashes,
 * since Leaflet accesses `window` at import time.
 */
export default function SpotMiniMap({ latitude, longitude, spotName }: SpotMiniMapProps) {
  if (!latitude || !longitude) return null

  return (
    <div className="w-full h-full min-h-[400px] rounded-[6px] overflow-hidden border border-black/10 relative z-0">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full absolute inset-0 z-0"
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={customIcon}>
          <Tooltip direction="top" offset={[0, -42]} opacity={1}>
            <span className="font-sans text-sm font-medium">{spotName}</span>
          </Tooltip>
        </Marker>
      </MapContainer>
    </div>
  )
}
