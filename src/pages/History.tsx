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
    // Navigate to edit page with the checklist data
    window.location.href = `/checklist?edit=${id}`;
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Historique des Contrôles</CardTitle>
        </CardHeader>
        <CardContent>
          {checklists.length === 0 ? (
            <p className="text-gray-600">Aucun historique disponible pour le moment.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Engin</TableHead>
                  <TableHead>Modèle</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checklists.map((checklist) => (
                  <TableRow key={checklist.id}>
                    <TableCell>
                      {format(new Date(checklist.date), "dd MMMM yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell>{checklist.checklistType}</TableCell>
                    <TableCell>{checklist.engineCategory}</TableCell>
                    <TableCell>{checklist.engineModel}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleView(checklist)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(checklist.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(checklist.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;