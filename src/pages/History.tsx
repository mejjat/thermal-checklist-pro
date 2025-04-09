
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Pencil, Trash2, Download, Search, FileJson } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ChecklistEntry, STATUS_COLORS } from "@/types/checklist";
import { generatePDF } from "@/utils/pdfGenerator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const History = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [checklists, setChecklists] = useState<ChecklistEntry[]>([]);
  const [filteredChecklists, setFilteredChecklists] = useState<ChecklistEntry[]>([]);
  const [selectedChecklist, setSelectedChecklist] = useState<ChecklistEntry | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("checklists");
    const loadedChecklists = saved ? JSON.parse(saved) : [];
    setChecklists(loadedChecklists);
    setFilteredChecklists(loadedChecklists);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = checklists.filter(
        (checklist) =>
          checklist.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          checklist.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChecklists(filtered);
    } else {
      setFilteredChecklists(checklists);
    }
  }, [searchTerm, checklists]);

  const handleDelete = (id: string) => {
    const newChecklists = checklists.filter((checklist) => checklist.id !== id);
    setChecklists(newChecklists);
    localStorage.setItem("checklists", JSON.stringify(newChecklists));
    toast({
      title: "Inspection supprimée",
      description: "L'inspection a été supprimée avec succès.",
    });
  };

  const handleView = (checklist: ChecklistEntry) => {
    setSelectedChecklist(checklist);
    generatePDF(checklist);
  };

  const handleEdit = (id: string) => {
    window.location.href = `/checklist?edit=${id}`;
  };

  const handleDownload = () => {
    // Create a JSON blob and download it
    const dataStr = JSON.stringify(checklists, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inspections-export-${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Données exportées",
      description: "Les données ont été exportées avec succès au format JSON.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100 via-indigo-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
      
      <Card className="bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl dark:bg-gray-800/30 dark:border-gray-700/30">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Historique des Inspections
            </CardTitle>
            <Button onClick={handleDownload} variant="outline" size="sm" className="flex items-center gap-1">
              <FileJson className="h-4 w-4" />
              Exporter
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par n° série ou type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredChecklists.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Aucun historique disponible pour le moment.</p>
            </div>
          ) : (
            <div className="relative overflow-x-auto rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30">
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">N° Série</TableHead>
                    <TableHead className="font-semibold hidden lg:table-cell">Compteur (h)</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChecklists.map((checklist) => (
                    <TableRow 
                      key={checklist.id}
                      className="transition-all hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 dark:hover:from-indigo-900/10 dark:hover:to-purple-900/10"
                    >
                      <TableCell>
                        {format(new Date(checklist.date), "dd MMMM yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                          {checklist.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{checklist.serialNumber}</TableCell>
                      <TableCell className="hidden lg:table-cell">{checklist.hourCounter}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(checklist)}
                            className="hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/30 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(checklist.id)}
                            className="hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/30 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(checklist.id)}
                            className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => generatePDF(checklist)}
                            className="hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedChecklist && (
        <Dialog>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Détails de l'inspection</DialogTitle>
              <DialogDescription>
                Inspection du {format(new Date(selectedChecklist.date), "dd MMMM yyyy", { locale: fr })}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Informations générales</h3>
                <p>Type: {selectedChecklist.type}</p>
                <p>N° Série: {selectedChecklist.serialNumber}</p>
                <p>Compteur: {selectedChecklist.hourCounter} heures</p>
              </div>
              <div>
                <h3 className="font-medium">État des composants</h3>
                {Object.entries(selectedChecklist.components).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span>{key}:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[value]}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {selectedChecklist.observations && (
              <div>
                <h3 className="font-medium">Observations</h3>
                <p>{selectedChecklist.observations}</p>
              </div>
            )}
            {selectedChecklist.photos.length > 0 && (
              <div>
                <h3 className="font-medium">Photos</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedChecklist.photos.map((photo, index) => (
                    <img 
                      key={index}
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="h-20 w-20 object-cover rounded-md border"
                    />
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default History;
