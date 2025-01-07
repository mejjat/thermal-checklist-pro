import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Checklist = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: "",
    checklistType: "",
    responsables: {
      electrical: "",
      workshop: "",
      inspector: "",
    },
    engineInfo: {
      serialNumber: "",
      ecmNumber: "",
      hmCurrent: "",
    },
  });

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle Checklist - Étape {step}/4</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
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
          )}

          {step === 2 && (
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
          )}

          <div className="mt-6 flex justify-between">
            {step > 1 && (
              <Button onClick={handlePrevious} variant="outline">
                Précédent
              </Button>
            )}
            <Button onClick={handleNext} className="ml-auto">
              {step === 4 ? "Terminer" : "Suivant"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checklist;