
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { REVISION_TYPES } from "@/types/checklist";
import { Plus, Save, Trash2, Moon, Sun } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [revisionTypes, setRevisionTypes] = useState<string[]>([]);
  const [newRevisionType, setNewRevisionType] = useState("");
  const [engineSerials, setEngineSerials] = useState<string[]>([]);
  const [newEngineSerial, setNewEngineSerial] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load revision types
    const savedTypes = localStorage.getItem("revisionTypes");
    if (savedTypes) {
      setRevisionTypes(JSON.parse(savedTypes));
    } else {
      setRevisionTypes(REVISION_TYPES);
      localStorage.setItem("revisionTypes", JSON.stringify(REVISION_TYPES));
    }
    
    // Load engine serials
    const savedSerials = localStorage.getItem("engineSerials");
    if (savedSerials) {
      setEngineSerials(JSON.parse(savedSerials));
    }
    
    // Check theme preference
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleAddRevisionType = () => {
    if (!newRevisionType.trim()) return;
    
    const updatedTypes = [...revisionTypes, newRevisionType];
    setRevisionTypes(updatedTypes);
    localStorage.setItem("revisionTypes", JSON.stringify(updatedTypes));
    setNewRevisionType("");
    
    toast({
      title: "Type de révision ajouté",
      description: `Le type "${newRevisionType}" a été ajouté avec succès.`,
    });
  };

  const handleRemoveRevisionType = (index: number) => {
    const updatedTypes = revisionTypes.filter((_, i) => i !== index);
    setRevisionTypes(updatedTypes);
    localStorage.setItem("revisionTypes", JSON.stringify(updatedTypes));
    
    toast({
      title: "Type de révision supprimé",
      description: "Le type a été supprimé avec succès.",
    });
  };

  const handleAddEngineSerial = () => {
    if (!newEngineSerial.trim()) return;
    
    const updatedSerials = [...engineSerials, newEngineSerial];
    setEngineSerials(updatedSerials);
    localStorage.setItem("engineSerials", JSON.stringify(updatedSerials));
    setNewEngineSerial("");
    
    toast({
      title: "Numéro de série ajouté",
      description: `Le numéro "${newEngineSerial}" a été ajouté avec succès.`,
    });
  };

  const handleRemoveEngineSerial = (index: number) => {
    const updatedSerials = engineSerials.filter((_, i) => i !== index);
    setEngineSerials(updatedSerials);
    localStorage.setItem("engineSerials", JSON.stringify(updatedSerials));
    
    toast({
      title: "Numéro de série supprimé",
      description: "Le numéro a été supprimé avec succès.",
    });
  };

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    toast({
      title: newDarkMode ? "Mode sombre activé" : "Mode clair activé",
      description: "Le thème a été changé avec succès.",
    });
  };

  const handleExportData = () => {
    // Gather all data from localStorage
    const data = {
      checklists: JSON.parse(localStorage.getItem("checklists") || "[]"),
      revisionTypes: revisionTypes,
      engineSerials: engineSerials,
    };
    
    // Create download link
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "checklist-data-export.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Données exportées",
      description: "Toutes les données ont été exportées avec succès.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-100 via-indigo-50 to-white dark:from-purple-900 dark:via-indigo-900 dark:to-gray-900"></div>
      
      <Card className="bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl dark:bg-gray-800/30 dark:border-gray-700/30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Paramètres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revision">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="revision">Types de révision</TabsTrigger>
              <TabsTrigger value="engines">Engins</TabsTrigger>
              <TabsTrigger value="appearance">Apparence</TabsTrigger>
              <TabsTrigger value="data">Données</TabsTrigger>
            </TabsList>
            
            <TabsContent value="revision" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nouveau type de révision..."
                  value={newRevisionType}
                  onChange={(e) => setNewRevisionType(e.target.value)}
                />
                <Button onClick={handleAddRevisionType}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </div>
              
              <div className="space-y-2 mt-4">
                {revisionTypes.map((type, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm dark:bg-gray-700">
                    <span>{type}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveRevisionType(index)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="engines" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nouveau numéro de série..."
                  value={newEngineSerial}
                  onChange={(e) => setNewEngineSerial(e.target.value)}
                />
                <Button onClick={handleAddEngineSerial}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </div>
              
              <div className="space-y-2 mt-4">
                {engineSerials.map((serial, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm dark:bg-gray-700">
                    <span>{serial}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveEngineSerial(index)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                
                {engineSerials.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    Aucun numéro de série enregistré
                  </p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode">Thème sombre</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer/désactiver le thème sombre
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <Switch
                    id="darkMode"
                    checked={darkMode}
                    onCheckedChange={handleToggleDarkMode}
                  />
                  <Moon className="h-4 w-4" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="data" className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Exportation des données</h3>
                <p className="text-sm text-muted-foreground">
                  Exporter toutes les données (inspections, types de révision, engins) au format JSON.
                </p>
                <Button onClick={handleExportData}>
                  <Save className="mr-2 h-4 w-4" />
                  Exporter les données
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
