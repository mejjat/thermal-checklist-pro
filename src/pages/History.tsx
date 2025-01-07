import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const History = () => {
  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Historique des Contrôles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Aucun historique disponible pour le moment.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;