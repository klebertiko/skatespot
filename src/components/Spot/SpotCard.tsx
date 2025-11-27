import { type Spot } from "@/store/useSkateStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";

interface SpotCardProps {
    spot: Spot;
    activeCount?: number;
}

export function SpotCard({ spot, activeCount = 0 }: SpotCardProps) {
    const getTypeStyle = (type: string) => {
        const styles = {
            Park: "bg-accent/90 text-accent-foreground glow-accent",
            Street: "bg-warning/90 text-warning-foreground",
            Plaza: "bg-primary/90 text-primary-foreground glow-primary",
            Downhill: "bg-destructive/90 text-destructive-foreground glow-destructive",
            Other: "bg-muted text-muted-foreground",
        };
        return styles[type as keyof typeof styles] || styles.Other;
    };

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

    return (
        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group animate-lift hover:box-glow-primary bg-card/95 backdrop-blur-sm texture-concrete border-border/50">
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-muted/50 to-background">
                {spot.photoUrl ? (
                    <>
                        <img
                            src={spot.photoUrl}
                            alt={spot.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Dark overlay for better contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/30 to-background relative">
                        <MapPin className="w-16 h-16 text-muted-foreground/20" />
                        {/* Concrete texture overlay */}
                        <div className="absolute inset-0 texture-concrete opacity-50" />
                    </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                    <span className={`${getTypeStyle(spot.type)} text-xs font-bold px-3 py-1.5 rounded-md shadow-lg backdrop-blur-sm border border-white/10 uppercase tracking-wider`}>
                        {getTypeLabel(spot.type)}
                    </span>
                    {activeCount > 0 && (
                        <span className="bg-primary/95 text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-md shadow-lg flex items-center gap-1.5 backdrop-blur-sm border border-primary/30 glow-primary animate-glow-pulse uppercase tracking-wider">
                            <Users className="w-3.5 h-3.5" />
                            {activeCount}
                        </span>
                    )}
                </div>
            </div>
            <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-xl line-clamp-1 font-display tracking-wide">
                    {spot.name}
                </CardTitle>
                {spot.address && (
                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground mt-1">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary/70" />
                        <span className="line-clamp-2">{spot.address}</span>
                    </div>
                )}
            </CardHeader>
            <CardContent className="pt-0 relative z-10">
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {spot.description || "No description available"}
                </p>
            </CardContent>
        </Card>
    );
}

