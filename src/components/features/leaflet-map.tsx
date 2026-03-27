import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapCenter } from "@/data/mock-data";
import type { CaregiverProfile } from "@/types/domain";
import { cn } from "@/lib/utils";

interface LeafletMapProps {
  filteredCaregivers: CaregiverProfile[];
  activeCaregiverId: string;
  onSelectCaregiver: (id: string) => void;
  onMapClick?: () => void;
  fullscreen?: boolean;
}

export const LeafletMap = ({
  filteredCaregivers,
  activeCaregiverId,
  onSelectCaregiver,
  onMapClick,
  fullscreen = false,
}: LeafletMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [mapCenter.lat, mapCenter.lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: "bottomleft" }).addTo(map);

    // CartoDB Voyager — closest to Apple Maps MutedStandard
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      { maxZoom: 19, subdomains: "abcd" },
    ).addTo(map);

    // Senior "You are here" pulse marker
    const seniorIcon = L.divIcon({
      className: "",
      html: `<div class="cm-senior">
        <div class="cm-senior-pulse"></div>
        <div class="cm-senior-dot"></div>
      </div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    L.marker([mapCenter.lat, mapCenter.lng], {
      icon: seniorIcon,
      zIndexOffset: 500,
    }).addTo(map);

    map.on("click", () => onMapClick?.());

    mapRef.current = map;

    // Force a resize after mount so tiles render correctly
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync caregiver markers when filteredCaregivers or activeCaregiverId changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentIds = new Set(filteredCaregivers.map((c) => c.id));

    // Remove markers no longer in filtered list
    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        map.removeLayer(marker);
        markersRef.current.delete(id);
      }
    });

    // Add or update markers
    filteredCaregivers.forEach((c) => {
      const isActive = c.id === activeCaregiverId;
      const existing = markersRef.current.get(c.id);

      const icon = L.divIcon({
        className: "",
        html: `<div class="cm-marker ${isActive ? "selected" : ""}" id="cm-${c.id}">
          <div class="cm-marker-body">
            <img class="cm-marker-avatar" src="${c.avatarUrl}" alt="${c.name}" />
            ${c.verified ? `<div class="cm-marker-verified"><svg width="8" height="8" viewBox="0 0 24 24"><polyline points="6,12 10,16 18,8" fill="none" stroke="#FFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>` : ""}
            <div class="cm-marker-badge">${c.compatibility}%</div>
          </div>
          <svg class="cm-marker-tail" width="14" height="8" viewBox="0 0 14 8"><path d="M0 0L7 8L14 0" fill="white"/></svg>
        </div>`,
        iconSize: [48, 58],
        iconAnchor: [24, 58],
      });

      if (existing) {
        existing.setIcon(icon);
      } else {
        const marker = L.marker([c.lat, c.lng], {
          icon,
          zIndexOffset: c.compatibility * 10,
        }).addTo(map);

        marker.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          onSelectCaregiver(c.id);
        });

        markersRef.current.set(c.id, marker);
      }
    });
  }, [filteredCaregivers, activeCaregiverId, onSelectCaregiver]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "z-0",
        fullscreen
          ? "h-full w-full"
          : "h-44 rounded-2xl border border-black/[0.06]",
      )}
    />
  );
};
