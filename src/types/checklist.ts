
export type ComponentStatus = "bon" | "moyen" | "mauvais";

export interface ChecklistEntry {
  id: string;
  date: string;
  type: string;
  serialNumber: string;
  hourCounter: number;
  components: {
    admission: ComponentStatus;
    gazoil: ComponentStatus;
    exhaust: ComponentStatus;
    hoses: ComponentStatus;
    structure: ComponentStatus;
    chassis: ComponentStatus;
    safetyEquipment: ComponentStatus;
  };
  observations: string;
  photos: string[]; // Array of photo URLs/base64
}

export const STATUS_COLORS = {
  bon: "bg-green-100 text-green-800",
  moyen: "bg-yellow-100 text-yellow-800",
  mauvais: "bg-red-100 text-red-800",
} as const;

export const STATUS_ICONS = {
  bon: "✓",
  moyen: "⚠",
  mauvais: "✕",
} as const;

export const REVISION_TYPES = [
  "Préventive",
  "Corrective",
  "Complète",
  "Périodique",
  "Après panne"
];
