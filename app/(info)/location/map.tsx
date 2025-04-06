'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export default function MapComponent() {
  return (
    <MapContainer center={[8.330000, 77.410000]} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[8.330000, 77.410000]} icon={markerIcon}>
        <Popup>
          Vellambi Field Site – Near Nagercoil, Tamil Nadu
        </Popup>
      </Marker>
    </MapContainer>
  )
}
