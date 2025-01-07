import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
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

  return (
    <div className="container mx-auto py-6">
      <Card className="bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Historique des Contrôles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {checklists.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Aucun historique disponible pour le moment.</p>
            </div>
          ) : (
            <div className="relative overflow-x-auto rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-purple-50 to-blue-50">
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Engin</TableHead>
                    <TableHead className="font-semibold">Modèle</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checklists.map((checklist) => (
                    <TableRow 
                      key={checklist.id}
                      className="transition-colors hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50"
                    >
                      <TableCell>
                        {format(new Date(checklist.date), "dd MMMM yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          checklist.checklistType === "reception" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {checklist.checklistType}
                        </span>
                      </TableCell>
                      <TableCell>{checklist.engineCategory}</TableCell>
                      <TableCell>{checklist.engineModel}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(checklist)}
                            className="hover:bg-purple-100 hover:text-purple-600 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(checklist.id)}
                            className="hover:bg-blue-100 hover:text-blue-600 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(checklist.id)}
                            className="hover:bg-red-100 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
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