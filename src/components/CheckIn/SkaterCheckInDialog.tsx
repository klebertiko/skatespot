import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSkateStore } from "@/store/useSkateStore";
import { Camera, X } from "lucide-react";

const formSchema = z.object({
    skaterName: z.string().optional(),
});

interface SkaterCheckInDialogProps {
    isOpen: boolean;
    onClose: () => void;
    spotId: string;
    spotName: string;
}

export function SkaterCheckInDialog({ isOpen, onClose, spotId, spotName }: SkaterCheckInDialogProps) {
    const addCheckIn = useSkateStore((state) => state.addCheckIn);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            skaterName: "",
        },
    });

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearPhoto = () => {
        setPhotoPreview(null);
        // Reset file input if needed, but for now just clearing preview is enough for logic
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        addCheckIn(spotId, {
            skaterName: values.skaterName || "Anônimo",
            photoUrl: photoPreview || undefined,
        });
        onClose();
        form.reset();
        setPhotoPreview(null);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Marcar Presença em {spotName}</DialogTitle>
                    <DialogDescription>
                        Avisa a galera que você tá na área!
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Photo Upload */}
                        <div className="space-y-2">
                            <Label>Foto do Pico (opcional)</Label>
                            <div className="flex items-center gap-4">
                                {photoPreview ? (
                                    <div className="relative w-24 h-24 rounded-md overflow-hidden border border-border">
                                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-1 right-1 w-6 h-6"
                                            onClick={clearPhoto}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-md border border-dashed border-border flex items-center justify-center bg-muted/50">
                                        <Camera className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        className="hidden"
                                        id="checkin-photo-upload"
                                        onChange={handlePhotoSelect}
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => document.getElementById('checkin-photo-upload')?.click()}
                                    >
                                        <Camera className="w-4 h-4 mr-2" />
                                        Tirar Foto do Local
                                    </Button>
                                    <p className="text-[10px] text-muted-foreground mt-2">
                                        Mostra pra galera como tá o pico agora (movimento, chão, etc).
                                    </p>
                                </div>
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="skaterName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Seu Nome / Vulgo (opcional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Anônimo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                            <Button type="submit">Confirmar Presença</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
