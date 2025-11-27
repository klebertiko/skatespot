import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SpotType = 'Street' | 'Park' | 'Downhill' | 'Plaza' | 'Other';

export interface Spot {
    id: string;
    name: string;
    description: string;
    lat: number;
    lng: number;
    type: SpotType;
    photoUrl?: string;
    address?: string;
    createdAt: string;
}

export interface CheckIn {
    id: string;
    spotId: string;
    skaterName: string;
    photoUrl?: string;
    timestamp: string;
}

interface SkateStore {
    spots: Spot[];
    checkIns: CheckIn[];
    addSpot: (spot: Omit<Spot, 'id' | 'createdAt'>) => void;
    removeSpot: (id: string) => void;
    addCheckIn: (spotId: string, checkIn: Omit<CheckIn, 'id' | 'spotId' | 'timestamp'>) => void;
    removeCheckIn: (id: string) => void;
    getActiveCheckIns: (spotId: string) => CheckIn[];
}

const CHECKIN_EXPIRY_HOURS = 8;

// Fallback for environments where crypto.randomUUID is not available
const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const useSkateStore = create<SkateStore>()(
    persist(
        (set, get) => ({
            spots: [],
            checkIns: [],
            addSpot: (spot) =>
                set((state) => ({
                    spots: [
                        ...state.spots,
                        {
                            ...spot,
                            id: generateId(),
                            createdAt: new Date().toISOString(),
                        },
                    ],
                })),
            removeSpot: (id) =>
                set((state) => ({
                    spots: state.spots.filter((s) => s.id !== id),
                    checkIns: state.checkIns.filter((c) => c.spotId !== id),
                })),
            addCheckIn: (spotId, checkIn) =>
                set((state) => ({
                    checkIns: [
                        ...state.checkIns,
                        {
                            ...checkIn,
                            id: generateId(),
                            spotId,
                            timestamp: new Date().toISOString(),
                        },
                    ],
                })),
            removeCheckIn: (id) =>
                set((state) => ({
                    checkIns: state.checkIns.filter((c) => c.id !== id),
                })),
            getActiveCheckIns: (spotId) => {
                const now = new Date();
                const expiryTime = CHECKIN_EXPIRY_HOURS * 60 * 60 * 1000;

                return get().checkIns.filter((checkIn) => {
                    if (checkIn.spotId !== spotId) return false;
                    const checkInTime = new Date(checkIn.timestamp);
                    return now.getTime() - checkInTime.getTime() < expiryTime;
                });
            },
        }),
        {
            name: 'skatespot-storage',
        }
    )
);
