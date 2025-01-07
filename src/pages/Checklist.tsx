import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { generatePDF } from "@/utils/pdfGenerator";
import { useToast } from "@/components/ui/use-toast";
import { ChecklistEntry } from "@/types/checklist";

const engineCategories = {
  "Bulls D11": ["T1", "T2", "T3", "T4", "T5", "T6", "T7"],
  "Loaders": ["992K", "994F1", "994F2"],
  "Drill": ["SKF1", "SKF2", "DKS"],
  "Auxiliaires (AUX)": ["ARR CAT", "NIV5", "NIV6", "NIV7", "PAYKOM1", "PAYKOM2", "PAYKOM3"],
  "Bulls D9": ["R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9", "R10", "R11"]
};

const sensors = [
  "Capteur de régime moteur",
  "Capteur de température liquide refroidissement",
  "Switch température d'eau",
  "Palpeur débit liquide refroidissement",
  "Capteur de pression d'huile moteur",
  "Capteur de niveau d'huile moteur",
  "Capteur de pression collecteur d'admission",
  "Capteur de température d'air collecteur admission",
  "Capteur de température d'échappement droit",
  "Capteur de température d'échappement gauche",
  "Capteur de température d'air ambiant",
  "Capteur de pression de gasoil",
  "Switch de pression de gasoil",
  "Capteur de pression Carter (Crankcase)",
  "Switch de pression huile moteur",
  "Capteur de régime primaire (Timing)",
  "Capteur de régime secondaire (Calibration)",
  "Capteur de vitesse convertisseur",
  "Capteur de température convertisseur",
  "Capteur de pression atmosphérique"
];

const startingCircuitItems = [
  "Démarreur 1",
  "Démarreur 2",
  "Alternateur de charge",
  "Courroie d'alternateur de charge",
  "Tendeur de courroie",
  "État de tension courroie"
];

const wiringItems = [
  "Faisceau électrique du moteur thermique",
  "Branchement électrique des capteurs et switch",
  "Attachement et isolation du faisceau électrique"
];

const Checklist = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: "",
    checklistType: "",
    responsables: {
      electrical: "",
      workshop: "",
      inspector: "",
    },
    engineCategory: "",
    engineModel: "",
    engineInfo: {
      serialNumber: "",
      ecmNumber: "",
      hmCurrent: "",
    },
    revision: {
      type: "",
      number: "",
      fromEngine: "",
    },
    sensors: {} as Record<string, string>,
    startingCircuit: {} as Record<string, string>,
    wiring: {} as Record<string, string>,
  });

  const handleNext = () => {
    if (step === 7) {
      // Generate unique ID for the checklist
      const checklistData = {
        id: crypto.randomUUID(),
        ...formData,
      };
      
      // Save to localStorage
      const existingChecklists = JSON.parse(localStorage.getItem("checklists") || "[]");
      localStorage.setItem(
        "checklists",
        JSON.stringify([...existingChecklists, checklistData])
      );
      
      // Generate PDF
      generatePDF(checklistData);
      
      // Show success toast
      toast({
        title: "Checklist enregistrée",
        description: "La checklist a été enregistrée avec succès.",
      });
      
      // Redirect to history page
      window.location.href = "/history";
      return;
    }
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label>Date du contrôle</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Label>Type de checklist</Label>
              <RadioGroup
                value={formData.checklistType}
                onValueChange={(value) => setFormData({ ...formData, checklistType: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reception" id="reception" />
                  <Label htmlFor="reception">Réception</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expedition" id="expedition" />
                  <Label htmlFor="expedition">Expédition</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Responsable électrique Engin</Label>
              <Input
                value={formData.responsables.electrical}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    responsables: { ...formData.responsables, electrical: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label>Responsable Atelier Engin (S/E)</Label>
              <Input
                value={formData.responsables.workshop}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    responsables: { ...formData.responsables, workshop: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label>Inspecteur Bureau de Méthode</Label>
              <Input
                value={formData.responsables.inspector}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    responsables: { ...formData.responsables, inspector: e.target.value },
                  })
                }
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label>Catégorie d'engin</Label>
              <Select
                value={formData.engineCategory}
                onValueChange={(value) => 
                  setFormData({ ...formData, engineCategory: value, engineModel: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(engineCategories).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.engineCategory && (
              <div>
                <Label>Modèle</Label>
                <Select
                  value={formData.engineModel}
                  onValueChange={(value) => 
                    setFormData({ ...formData, engineModel: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    {engineCategories[formData.engineCategory as keyof typeof engineCategories].map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Numéro de série moteur</Label>
              <Input
                value={formData.engineInfo.serialNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    engineInfo: { ...formData.engineInfo, serialNumber: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label>Numéro de série ECM moteur</Label>
              <Input
                value={formData.engineInfo.ecmNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    engineInfo: { ...formData.engineInfo, ecmNumber: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label>HM actuel de l'engin</Label>
              <Input
                type="number"
                value={formData.engineInfo.hmCurrent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    engineInfo: { ...formData.engineInfo, hmCurrent: e.target.value },
                  })
                }
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label>Type de révision</Label>
              <Select
                value={formData.revision.type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    revision: { ...formData.revision, type: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de révision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="generale">Révision générale</SelectItem>
                  <SelectItem value="partielle">Révision partielle</SelectItem>
                  <SelectItem value="mutee">Mutée d'un autre engin</SelectItem>
                  <SelectItem value="exterieure">Révision extérieure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Numéro de révision</Label>
              <Select
                value={formData.revision.number}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    revision: { ...formData.revision, number: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le numéro de révision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1ère révision</SelectItem>
                  <SelectItem value="2">2ème révision</SelectItem>
                  <SelectItem value="3">3ème révision</SelectItem>
                  <SelectItem value="cumul">Cumul</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.revision.type === "mutee" && (
              <div>
                <Label>Provenance (numéro d'engin)</Label>
                <Input
                  value={formData.revision.fromEngine}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      revision: { ...formData.revision, fromEngine: e.target.value },
                    })
                  }
                />
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Contrôle des capteurs</h3>
            <div className="grid gap-4">
              {sensors.map((sensor) => (
                <div key={sensor} className="space-y-2">
                  <Label>{sensor}</Label>
                  <Select
                    value={formData.sensors[sensor] || ""}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        sensors: { ...formData.sensors, [sensor]: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez l'état" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neuf">Neuf</SelectItem>
                      <SelectItem value="bon">Bon</SelectItem>
                      <SelectItem value="mauvais">Mauvais</SelectItem>
                      <SelectItem value="manquant">Manquant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contrôle du circuit de démarrage</h3>
              {startingCircuitItems.map((item) => (
                <div key={item} className="space-y-2">
                  <Label>{item}</Label>
                  <Select
                    value={formData.startingCircuit[item] || ""}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        startingCircuit: { ...formData.startingCircuit, [item]: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez l'état" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neuf">Neuf</SelectItem>
                      <SelectItem value="bon">Bon</SelectItem>
                      <SelectItem value="mauvais">Mauvais</SelectItem>
                      <SelectItem value="manquant">Manquant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contrôle branchement et câblage</h3>
              {wiringItems.map((item) => (
                <div key={item} className="space-y-2">
                  <Label>{item}</Label>
                  <Select
                    value={formData.wiring[item] || ""}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        wiring: { ...formData.wiring, [item]: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez l'état" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neuf">Neuf</SelectItem>
                      <SelectItem value="bon">Bon</SelectItem>
                      <SelectItem value="mauvais">Mauvais</SelectItem>
                      <SelectItem value="manquant">Manquant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle Checklist - Étape {step}/7</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
          <div className="mt-6 flex justify-between">
            {step > 1 && (
              <Button onClick={handlePrevious} variant="outline">
                Précédent
              </Button>
            )}
            <Button onClick={handleNext} className="ml-auto">
              {step === 7 ? "Terminer" : "Suivant"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checklist;
