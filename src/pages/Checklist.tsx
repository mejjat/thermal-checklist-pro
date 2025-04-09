import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ChecklistEntry, ComponentStatus, REVISION_TYPES, EQUIPMENT_LIST } from "@/types/checklist";
import { ChevronLeft, Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generatePDF } from "@/utils/pdfGenerator";

const ComponentStatusSelection = ({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: ComponentStatus; 
  onChange: (value: ComponentStatus) => void;
}) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <RadioGroup 
        value={value} 
        onValueChange={(val) => onChange(val as ComponentStatus)}
        className="flex space-x-2"
      >
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="bon" id={`${label}-bon`} />
          <Label htmlFor={`${label}-bon`} className="text-green-600">✓ Bon</Label>
        </div>
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="moyen" id={`${label}-moyen`} />
          <Label htmlFor={`${label}-moyen`} className="text-yellow-600">⚠ Moyen</Label>
        </div>
        <div className="flex items-center space-x-1">
          <RadioGroupItem value="mauvais" id={`${label}-mauvais`} />
          <Label htmlFor={`${label}-mauvais`} className="text-red-600">✕ Mauvais</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

const Checklist = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  
  const [formData, setFormData] = useState<Omit<ChecklistEntry, "id">>({
    date: new Date().toISOString().split('T')[0],
    type: "",
    serialNumber: "",
    hourCounter: 0,
    components: {
      admission: "bon",
      gazoil: "bon",
      exhaust: "bon",
      hoses: "bon",
      structure: "bon",
      chassis: "bon",
      safetyEquipment: "bon",
    },
    observations: "",
    photos: []
  });

  const handleComponentChange = (component: keyof ChecklistEntry["components"], value: ComponentStatus) => {
    setFormData({
      ...formData,
      components: {
        ...formData.components,
        [component]: value
      }
    });
  };

  const handleSave = () => {
    if (!formData.type || !formData.serialNumber || formData.hourCounter <= 0) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    const checklistData: ChecklistEntry = {
      id: crypto.randomUUID(),
      ...formData,
    };
    
    const existingChecklists = JSON.parse(localStorage.getItem("checklists") || "[]");
    localStorage.setItem(
      "checklists",
      JSON.stringify([...existingChecklists, checklistData])
    );
    
    generatePDF(checklistData);
    
    toast({
      title: "Inspection enregistrée",
      description: "L'inspection a été enregistrée avec succès et le PDF a été généré.",
    });
    
    navigate("/history");
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <Card className="bg-white/50 backdrop-blur-sm border border-gray-200/50 shadow-lg dark:bg-gray-800/30 dark:border-gray-700/30">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Nouvelle Inspection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="general">Informations</TabsTrigger>
              <TabsTrigger value="components">Composants</TabsTrigger>
              <TabsTrigger value="observations">Observations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div>
                <Label>Date d'inspection</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Type de révision</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type de révision" />
                  </SelectTrigger>
                  <SelectContent>
                    {REVISION_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Numéro de série de l'engin</Label>
                <Select
                  value={formData.serialNumber}
                  onValueChange={(value) => setFormData({ ...formData, serialNumber: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un engin" />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT_LIST.map((equipment) => (
                      <SelectItem key={equipment} value={equipment}>
                        {equipment}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Compteur horaire (heures)</Label>
                <Input
                  type="number"
                  value={formData.hourCounter.toString()}
                  onChange={(e) => setFormData({ ...formData, hourCounter: parseInt(e.target.value) || 0 })}
                  placeholder="Ex: 1250"
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setActiveTab("components")}>Continuer</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="components">
              <div className="space-y-6">
                <ComponentStatusSelection 
                  label="État du circuit d'admission" 
                  value={formData.components.admission}
                  onChange={(value) => handleComponentChange("admission", value)}
                />
                
                <ComponentStatusSelection 
                  label="État du circuit de gazoil" 
                  value={formData.components.gazoil}
                  onChange={(value) => handleComponentChange("gazoil", value)}
                />
                
                <ComponentStatusSelection 
                  label="État du circuit d'échappement" 
                  value={formData.components.exhaust}
                  onChange={(value) => handleComponentChange("exhaust", value)}
                />
                
                <ComponentStatusSelection 
                  label="État des flexibles" 
                  value={formData.components.hoses}
                  onChange={(value) => handleComponentChange("hoses", value)}
                />
                
                <ComponentStatusSelection 
                  label="État de la structure" 
                  value={formData.components.structure}
                  onChange={(value) => handleComponentChange("structure", value)}
                />
                
                <ComponentStatusSelection 
                  label="État du châssis" 
                  value={formData.components.chassis}
                  onChange={(value) => handleComponentChange("chassis", value)}
                />
                
                <ComponentStatusSelection 
                  label="Équipements de sécurité" 
                  value={formData.components.safetyEquipment}
                  onChange={(value) => handleComponentChange("safetyEquipment", value)}
                />
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("general")}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Retour
                  </Button>
                  <Button onClick={() => setActiveTab("observations")}>Continuer</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="observations" className="space-y-4">
              <div>
                <Label>Observations complémentaires</Label>
                <Textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="Notez ici vos observations..."
                  className="min-h-[150px]"
                />
              </div>
              
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setActiveTab("components")}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
                <Button onClick={handleSave}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter l'inspection
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checklist;
