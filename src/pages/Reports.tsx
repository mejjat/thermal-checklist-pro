
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChecklistEntry } from "@/types/checklist";
import { useToast } from "@/components/ui/use-toast";
import { generatePDF } from "@/utils/pdfGenerator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText, Download, Send } from "lucide-react";

const Reports = () => {
  const { toast } = useToast();
  const [checklists, setChecklists] = useState<ChecklistEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedChecklist, setSelectedChecklist] = useState<ChecklistEntry | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("checklists");
    const loadedChecklists = saved ? JSON.parse(saved) : [];
    setChecklists(loadedChecklists);
  }, []);

  useEffect(() => {
    if (selectedId) {
      const checklist = checklists.find(c => c.id === selectedId);
      setSelectedChecklist(checklist || null);
    } else {
      setSelectedChecklist(null);
    }
  }, [selectedId, checklists]);

  const handleGeneratePDF = () => {
    if (selectedChecklist) {
      generatePDF(selectedChecklist);
      toast({
        title: "PDF généré",
        description: "Le rapport PDF a été généré avec succès.",
      });
    }
  };

  const handleSendReport = () => {
    // In a real app this would send the report via email or other means
    toast({
      title: "Rapport envoyé",
      description: "Le rapport a été envoyé avec succès.",
    });
  };

  const renderComponentStatus = (status: string) => {
    const statusColors: Record<string, string> = {
      bon: "bg-green-100 text-green-800",
      moyen: "bg-yellow-100 text-yellow-800",
      mauvais: "bg-red-100 text-red-800"
    };
    
    const statusIcons: Record<string, string> = {
      bon: "✓",
      moyen: "⚠",
      mauvais: "✕"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}>
        {statusIcons[status]} {status}
      </span>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100 via-purple-50 to-white dark:from-indigo-900 dark:via-purple-900 dark:to-gray-900"></div>
      
      <Card className="bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl dark:bg-gray-800/30 dark:border-gray-700/30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Générer Rapport PDF
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label>Sélectionner une inspection</Label>
              <Select
                value={selectedId}
                onValueChange={setSelectedId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une inspection..." />
                </SelectTrigger>
                <SelectContent>
                  {checklists.map((checklist) => (
                    <SelectItem key={checklist.id} value={checklist.id}>
                      {format(new Date(checklist.date), "dd/MM/yyyy")} - {checklist.serialNumber} ({checklist.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedChecklist && (
              <div className="border rounded-lg p-4 bg-white/50 dark:bg-gray-800/50">
                <h3 className="text-lg font-semibold mb-4">Aperçu du rapport</h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-indigo-700 dark:text-indigo-300">Informations générales</h4>
                    <ul className="mt-2 space-y-1">
                      <li><span className="font-medium">Date:</span> {format(new Date(selectedChecklist.date), "dd MMMM yyyy", { locale: fr })}</li>
                      <li><span className="font-medium">Type:</span> {selectedChecklist.type}</li>
                      <li><span className="font-medium">N° Série:</span> {selectedChecklist.serialNumber}</li>
                      <li><span className="font-medium">Compteur:</span> {selectedChecklist.hourCounter} heures</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-indigo-700 dark:text-indigo-300">État des composants</h4>
                    <ul className="mt-2 space-y-2">
                      <li className="flex justify-between items-center">
                        <span>Circuit d'admission</span>
                        {renderComponentStatus(selectedChecklist.components.admission)}
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Circuit de gazoil</span>
                        {renderComponentStatus(selectedChecklist.components.gazoil)}
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Circuit d'échappement</span>
                        {renderComponentStatus(selectedChecklist.components.exhaust)}
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Flexibles</span>
                        {renderComponentStatus(selectedChecklist.components.hoses)}
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Structure</span>
                        {renderComponentStatus(selectedChecklist.components.structure)}
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Châssis</span>
                        {renderComponentStatus(selectedChecklist.components.chassis)}
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Équipements de sécurité</span>
                        {renderComponentStatus(selectedChecklist.components.safetyEquipment)}
                      </li>
                    </ul>
                  </div>
                </div>
                
                {selectedChecklist.observations && (
                  <div className="mb-4">
                    <h4 className="font-medium text-indigo-700 dark:text-indigo-300">Observations</h4>
                    <p className="mt-2 p-2 bg-gray-50 rounded dark:bg-gray-700/50">{selectedChecklist.observations}</p>
                  </div>
                )}
                
                {selectedChecklist.photos.length > 0 && (
                  <div>
                    <h4 className="font-medium text-indigo-700 dark:text-indigo-300">Photos</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedChecklist.photos.map((photo, index) => (
                        <img 
                          key={index}
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="h-16 w-16 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={handleSendReport}>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer rapport
                  </Button>
                  <Button onClick={handleGeneratePDF}>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger PDF
                  </Button>
                </div>
              </div>
            )}
            
            {!selectedChecklist && (
              <div className="text-center py-10">
                <FileText className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">Sélectionnez une inspection pour générer un rapport</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
