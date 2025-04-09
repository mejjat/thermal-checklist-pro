
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

export const EQUIPMENT_LIST = [
  "D11T1", "D11T2", "D11T3", "D11T4", "D11T5", "D11T6", "D11T7",
  "D9RW1", "D9RW2", "D9RW3", "D9RW4", "D9RW5", "D9RW6", "D9RW7", 
  "D9RW8", "D9RW9", "D9RW10", "D9RW11", "CH994F1", "CH994F2", 
  "CH992K", "NIVKOM5", "NIVKOM6", "NIVCAT7", "NIVCAT8", "ARRCAT", 
  "CAMGAZCAT", "VOLVOSTSRV", "PAYKOM1", "PAYKOM2", "PAYKOM3", 
  "DAF", "DIVERS"
];
