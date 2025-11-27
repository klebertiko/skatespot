import { useEffect, useRef, useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSkateStore, type SpotType } from "@/store/useSkateStore";
import { Camera, X } from "lucide-react";
import { compressImage, validateImageFile } from "@/utils/imageUpload";

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    description: z.string().optional(),
    type: z.enum(["Street", "Park", "Downhill", "Plaza", "Other"] as [string, ...string[]]),
});

interface AddSpotDialogProps {
    isOpen: boolean;
    onClose: () => void;
    position: { lat: number; lng: number } | null;
}

export function AddSpotDialog({ isOpen, onClose, position }: AddSpotDialogProps) {
    const addSpot = useSkateStore((state) => state.addSpot);
    const [photoUrl, setPhotoUrl] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            type: "Street",
        },
    });

    useEffect(() => {
        if (isOpen) {
            form.reset();
            setPhotoUrl("");
        }
    }, [isOpen, form]);

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!validateImageFile(file)) {
            alert("Arquivo inválido. Por favor envie uma imagem JPEG, PNG ou WebP com menos de 5MB.");
            return;
        }

        setIsUploading(true);
        try {
            const compressed = await compressImage(file);
            setPhotoUrl(compressed);
        } catch (error) {
            console.error("Error compressing image:", error);
            alert("Erro ao processar imagem");
        } finally {
            setIsUploading(false);
        }
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!position) return;

        addSpot({
            name: values.name,
            description: values.description || "",
            type: values.type as SpotType,
            photoUrl: photoUrl || undefined,
            lat: position.lat,
            lng: position.lng,
        });

        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Novo Pico</DialogTitle>
                    <DialogDescription>
                        Marca o local exato do pico no mapa.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Photo Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Foto (opcional)</label>
                            {photoUrl ? (
                                <div className="relative">
                                    <img src={photoUrl} alt="Spot" className="w-full h-48 object-cover rounded-md" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={() => setPhotoUrl("")}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                >
                                    <Camera className="w-4 h-4 mr-2" />
                                    {isUploading ? "Processando..." : "Tirar Foto"}
                                </Button>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                                onChange={handlePhotoUpload}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Pico</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ex: Escadaria da Matriz" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Pico</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Escolha o tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Street">Rua</SelectItem>
                                            <SelectItem value="Park">Pista</SelectItem>
                                            <SelectItem value="Plaza">Praça</SelectItem>
                                            <SelectItem value="Downhill">Ladeira</SelectItem>
                                            <SelectItem value="Other">Outro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Resenha</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Melhor horário, obstáculos, segurança..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                            <Button type="submit">Salvar Pico</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
