import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Pencil, Trash2, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ChecklistEntry } from "@/types/checklist";
import { generatePDF } from "@/utils/pdfGenerator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const History = () => {
  const { toast } = useToast();
  const [checklists, setChecklists] = useState<ChecklistEntry[]>(() => {
    const saved = localStorage.getItem("checklists");
    return saved ? JSON.parse(saved) : [];
  });

  const handleDelete = (id: string) => {
    const newChecklists = checklists.filter((checklist) => checklist.id !== id);
    setChecklists(newChecklists);
    localStorage.setItem("checklists", JSON.stringify(newChecklists));
    toast({
      title: "Checklist supprimée",
      description: "La checklist a été supprimée avec succès.",
    });
  };

  const handleView = (checklist: ChecklistEntry) => {
    generatePDF(checklist);
  };

  const handleEdit = (id: string) => {
    window.location.href = `/checklist?edit=${id}`;
  };

  const handleDownload = (checklist: ChecklistEntry) => {
    const jsonString = JSON.stringify(checklist, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `checklist-${checklist.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Téléchargement réussi",
      description: "Les données de la checklist ont été téléchargées avec succès.",
    });
  };

  return (
    <div className="container mx-auto py-6 min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="backdrop-blur-lg bg-white/30 border border-white/20 shadow-xl transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Historique des Contrôles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {checklists.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Aucun historique disponible pour le moment.</p>
            </div>
          ) : (
            <div className="relative overflow-x-auto rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">Type</TableHead>
                    <TableHead className="font-semibold">Engin</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">Modèle</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checklists.map((checklist) => (
                    <TableRow 
                      key={checklist.id}
                      className="transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50"
                    >
                      <TableCell>
                        {format(new Date(checklist.date), "dd MMMM yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          checklist.checklistType === "reception" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        }`}>
                          {checklist.checklistType}
                        </span>
                      </TableCell>
                      <TableCell>{checklist.engineCategory}</TableCell>
                      <TableCell className="hidden md:table-cell">{checklist.engineModel}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(checklist)}
                            className="hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900 dark:hover:text-purple-300 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(checklist.id)}
                            className="hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-300 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(checklist.id)}
                            className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(checklist)}
                            className="hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900 dark:hover:text-green-300 transition-colors"
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
    </div>
  );
};

export default History;