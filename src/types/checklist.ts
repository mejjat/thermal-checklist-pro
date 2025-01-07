export interface ChecklistEntry {
  id: string;
  date: string;
  checklistType: string;
  responsables: {
    electrical: string;
    workshop: string;
    inspector: string;
  };
  engineCategory: string;
  engineModel: string;
  engineInfo: {
    serialNumber: string;
    ecmNumber: string;
    hmCurrent: string;
  };
  revision: {
    type: string;
    number: string;
    fromEngine?: string;
  };
  sensors: Record<string, string>;
  startingCircuit: Record<string, string>;
  wiring: Record<string, string>;
}

export const STATUS_COLORS = {
  neuf: "bg-purple-100 text-purple-800",
  bon: "bg-green-100 text-green-800",
  mauvais: "bg-red-100 text-red-800",
  manquant: "bg-pink-100 text-pink-800",
} as const;