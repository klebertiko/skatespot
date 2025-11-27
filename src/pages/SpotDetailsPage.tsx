import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSkateStore } from "@/store/useSkateStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Users, Camera } from "lucide-react";
import { SkaterCheckInDialog } from "@/components/CheckIn/SkaterCheckInDialog";

export function SpotDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const spots = useSkateStore((state) => state.spots);
    const getActiveCheckIns = useSkateStore((state) => state.getActiveCheckIns);
    const removeCheckIn = useSkateStore((state) => state.removeCheckIn);

    const [isCheckInOpen, setIsCheckInOpen] = useState(false);

    const spot = spots.find((s) => s.id === id);
    const activeCheckIns = spot ? getActiveCheckIns(spot.id) : [];

    if (!spot) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">Spot not found</p>
                    <Button onClick={() => navigate("/")}>Go Home</Button>
                </div>
            </div>
        );
    }

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
        <div className="min-h-screen bg-background gradient-concrete">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 border-b border-border/50 shadow-lg">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="hover:bg-primary/20">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl md:text-3xl font-display tracking-wider uppercase">{spot.name}</h1>
                        <span className={`${getTypeStyle(spot.type)} text-xs font-bold px-3 py-1.5 rounded-md shadow-lg backdrop-blur-sm border border-white/10 uppercase tracking-wider`}>
                            {getTypeLabel(spot.type)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Spot Photo */}
                {spot.photoUrl && (
                    <div className="relative overflow-hidden rounded-xl">
                        <img src={spot.photoUrl} alt={spot.name} className="w-full h-64 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                    </div>
                )}

                {/* Spot Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Resenha do Pico</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-muted-foreground">{spot.description || "Sem descrição ainda."}</p>
                        {spot.address && (
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 mt-0.5" />
                                <span>{spot.address}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Active Skaters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Quem tá na Sessão ({activeCheckIns.length})
                        </CardTitle>
                        <CardDescription>
                            Galera que colou nas últimas 8h
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {activeCheckIns.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">Ninguém no pico agora. Chega junto!</p>
                        ) : (
                            <div className="space-y-3">
                                {activeCheckIns.map((checkIn) => (
                                    <div key={checkIn.id} className="flex flex-col gap-3 p-3 border rounded-lg bg-background/50">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                                    <Users className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold leading-none">{checkIn.skaterName}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Chegou às {new Date(checkIn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeCheckIn(checkIn.id)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                                            >
                                                Sair
                                            </Button>
                                        </div>

                                        {checkIn.photoUrl && (
                                            <div className="relative rounded-md overflow-hidden aspect-video w-full bg-black/50 border border-white/10 mt-1 group">
                                                <img
                                                    src={checkIn.photoUrl}
                                                    alt={`Foto do pico por ${checkIn.skaterName}`}
                                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                                    <p className="text-[10px] text-white/90 font-medium flex items-center gap-1">
                                                        <Camera className="w-3 h-3" />
                                                        Registro do local
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3 pb-6">
                    <Button className="flex-1 box-glow-primary font-bold tracking-wider" size="lg" onClick={() => setIsCheckInOpen(true)}>
                        TÔ NA ÁREA! 🛹
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => navigate("/map")} className="hover:bg-primary/10 font-medium">
                        <MapPin className="w-4 h-4 mr-2" />
                        VER NO MAPA
                    </Button>
                </div>
            </div>

            <SkaterCheckInDialog
                isOpen={isCheckInOpen}
                onClose={() => setIsCheckInOpen(false)}
                spotId={spot.id}
                spotName={spot.name}
            />
        </div>
    );
}
