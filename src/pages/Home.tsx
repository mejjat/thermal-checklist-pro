import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, History, Heart } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Checklist des Moteurs Thermiques</h1>
        <p className="text-gray-600">Système de gestion et de suivi des contrôles moteurs</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6" />
              Nouvelle Checklist
            </CardTitle>
            <CardDescription>Créer une nouvelle checklist de contrôle</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/checklist")} className="w-full">
              Commencer
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-6 w-6" />
              Historique
            </CardTitle>
            <CardDescription>Consulter l'historique des contrôles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/history")} variant="outline" className="w-full">
              Voir l'historique
            </Button>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-12 text-center text-gray-600">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="h-4 w-4 text-red-500" /> by MEJJAT
        </p>
      </footer>
    </div>
  );
};

export default Home;