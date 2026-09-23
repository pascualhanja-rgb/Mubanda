'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Corrige o ícone do marcador (o Leaflet não resolve os ícones default com bundlers)
const pinIcon = L.divIcon({
  className: '',
  html: renderToStaticMarkup(
    <div className="flex items-center justify-center w-9 h-9 bg-[#0A192F] text-white rounded-full shadow-lg border-2 border-white">
      <MapPin size={18} />
    </div>
  ),
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -34],
});

interface MapaOSMProps {
  center: [number, number];
  popupText?: string;
}

export default function MapaOSM({ center, popupText }: MapaOSMProps) {
  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={false}
      className="w-full h-full z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap"
      />
      <Marker position={center} icon={pinIcon}>
        {popupText && <Popup>{popupText}</Popup>}
      </Marker>
    </MapContainer>
  );
}
