import { useNavigate } from "react-router-dom";
import { useSkateStore } from "@/store/useSkateStore";
import { SpotCard } from "@/components/Spot/SpotCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function HomePage() {
    const navigate = useNavigate();
    const spots = useSkateStore((state) => state.spots);
    const getActiveCheckIns = useSkateStore((state) => state.getActiveCheckIns);

    return (
        <div className="min-h-screen bg-background gradient-concrete relative">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 border-b border-border/50 shadow-lg">
                <div className="container mx-auto px-4 py-2 md:py-3">
                    <div className="flex flex-col items-center gap-1 cursor-default">
                        {/* Badge Logo Only */}
                        <div className="relative overflow-hidden rounded-full w-48 h-48 md:w-56 md:h-56">
                            <img
                                src="/logo.png"
                                alt="SkateSpot"
                                className="w-full h-full object-cover scale-110"
                            />
                        </div>

                        {/* Tagline */}
                        <p className="text-primary text-xs md:text-sm font-medium tracking-wide -mt-2">
                            Desbrave o próximo pico
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8 relative z-10">
                {spots.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4 text-lg">Nenhum pico cadastrado ainda. Bora inaugurar?</p>
                        <Button onClick={() => navigate("/map")} className="box-glow-primary font-bold tracking-wider">
                            <Plus className="w-4 h-4 mr-2" />
                            ADICIONAR PICO
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {spots.map((spot) => {
                            const activeCheckIns = getActiveCheckIns(spot.id);
                            return (
                                <div key={spot.id} onClick={() => navigate(`/spot/${spot.id}`)} className="cursor-pointer transform transition-all duration-300 hover:scale-[1.02]">
                                    <SpotCard spot={spot} activeCount={activeCheckIns.length} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* FAB - Floating Action Button */}
            <Button
                size="lg"
                className="fixed bottom-8 right-8 rounded-full h-16 w-16 shadow-2xl box-glow-primary hover:box-glow-accent transition-all duration-300 hover:scale-110 z-30"
                onClick={() => navigate("/map")}
            >
                <Plus className="w-7 h-7" />
            </Button>
        </div>
    );
}

