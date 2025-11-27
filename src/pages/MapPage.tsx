import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ArrowLeft, Search, Loader2 } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useSkateStore } from '@/store/useSkateStore';
import { AddSpotDialog } from '@/components/CheckIn/AddSpotDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

// ... (keep createCustomIcon as is) ...
const createCustomIcon = (type: string) => {
    // Graffiti-inspired colors matching the theme
    const colors = {
        Park: '#ccff00',      // Neon lime
        Street: '#ff6b35',    // Sunset orange
        Plaza: '#00f0ff',     // Electric cyan
        Downhill: '#ff006e',  // Hot magenta
        Other: '#8a8a8a'      // Concrete gray
    };
    const color = colors[type as keyof typeof colors] || colors.Other;

    const iconMarkup = renderToStaticMarkup(
        <div className="relative flex items-center justify-center w-8 h-8">
            <MapPin className="w-8 h-8 drop-shadow-md" fill={color} stroke="white" strokeWidth={1.5} />
        </div>
    );

    return L.divIcon({
        html: iconMarkup,
        className: 'custom-marker-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

// Component to programmatically move the map
function MapUpdater({ center }: { center: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 16, { duration: 1.5 });
        }
    }, [center, map]);
    return null;
}

export function MapPage() {
    const navigate = useNavigate();
    const spots = useSkateStore((state) => state.spots);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleLocationSelect = (lat: number, lng: number) => {
        setSelectedLocation({ lat, lng });
        setIsDialogOpen(true);
    };

    const defaultPosition: [number, number] = [-27.6683, -48.4781];

    const getTypeLabel = (type: string) => {
        const labels = {
            Park: "Pista",
            Street: "Rua",
            Plaza: "Praça",
            Downhill: "Ladeira",
            Other: "Outro",
        };
        return labels[type as keyof typeof labels] || type;
    };

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length > 2) {
                setIsSearching(true);
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`
                    );
                    const data = await response.json();
                    setSearchResults(data);
                    setShowResults(true);
                } catch (error) {
                    console.error("Search error:", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearchResultClick = (result: any) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        // Move map
        setMapCenter([lat, lng]);

        // Select location and open dialog
        handleLocationSelect(lat, lng);

        // Clear search
        setSearchQuery("");
        setShowResults(false);
    };

    return (
        <div className="h-screen flex flex-col bg-background gradient-concrete relative">
            {/* Header & Search Overlay */}
            <div className="absolute top-0 left-0 right-0 z-[500] p-4 flex flex-col gap-4 pointer-events-none">
                {/* Header Row */}
                <div className="flex items-center gap-4 pointer-events-auto bg-background/80 backdrop-blur-xl p-3 rounded-xl border border-border/50 shadow-lg">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="hover:bg-primary/20 shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-display tracking-wider uppercase leading-none">NOVO PICO</h1>
                        <p className="text-[10px] md:text-xs text-muted-foreground font-medium">Busque ou clique no mapa</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative pointer-events-auto w-full max-w-md mx-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar endereço (rua, praça, cidade)..."
                            className="pl-9 bg-background/90 backdrop-blur-md border-border/50 shadow-lg focus-visible:ring-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {isSearching && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />
                        )}
                    </div>

                    {/* Search Results */}
                    {showResults && searchResults.length > 0 && (
                        <Card className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden z-50">
                            <ul className="divide-y divide-border/30">
                                {searchResults.map((result) => (
                                    <li
                                        key={result.place_id}
                                        className="p-3 hover:bg-primary/10 cursor-pointer transition-colors text-sm"
                                        onClick={() => handleSearchResultClick(result)}
                                    >
                                        <p className="font-medium truncate">{result.display_name.split(',')[0]}</p>
                                        <p className="text-xs text-muted-foreground truncate">{result.display_name}</p>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}
                </div>
            </div>

            {/* Map */}
            <div className="flex-1 relative z-0">
                <MapContainer
                    center={defaultPosition}
                    zoom={13}
                    scrollWheelZoom={true}
                    className="w-full h-full"
                    zoomControl={false} // Move zoom control if needed, or keep default
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <LocationMarker onLocationSelect={handleLocationSelect} />
                    <MapUpdater center={mapCenter} />

                    {spots.map((spot) => (
                        <Marker
                            key={spot.id}
                            position={[spot.lat, spot.lng]}
                            icon={createCustomIcon(spot.type)}
                        >
                            <Popup>
                                <div className="p-2">
                                    <h3 className="font-bold">{spot.name}</h3>
                                    <p className="text-xs text-muted-foreground">{getTypeLabel(spot.type)}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            <AddSpotDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    // Only navigate if we actually saved? 
                    // The dialog calls onClose after save. 
                    // But if user cancels, we might want to stay on map?
                    // For now, let's keep behavior: close -> home.
                    // Actually, if user searched, maybe they want to try another search if they cancel?
                    // But the previous code navigated to home. Let's keep it for now.
                    navigate("/");
                }}
                position={selectedLocation}
            />
        </div>
    );
}
