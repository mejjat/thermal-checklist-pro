
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, History, FileText, Settings, Heart } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Checklist Méthode Engins
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Système de gestion et de suivi des inspections d'engins
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/30 dark:border-gray-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
              <ClipboardCheck className="h-6 w-6" />
              Nouvelle Inspection
            </CardTitle>
            <CardDescription>Créer une nouvelle inspection d'engin</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate("/checklist")} 
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              Commencer
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/30 dark:border-gray-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
              <History className="h-6 w-6" />
              Historique
            </CardTitle>
            <CardDescription>Consulter l'historique des inspections</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate("/history")} 
              variant="outline" 
              className="w-full border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-indigo-800 dark:hover:bg-indigo-900/30"
            >
              Voir l'historique
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/30 dark:border-gray-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
              <FileText className="h-6 w-6" />
              Rapports PDF
            </CardTitle>
            <CardDescription>Générer et envoyer des rapports</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate("/reports")} 
              variant="outline" 
              className="w-full border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-indigo-800 dark:hover:bg-indigo-900/30"
            >
              Générer un rapport
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm border border-gray-200/50 dark:bg-gray-800/30 dark:border-gray-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
              <Settings className="h-6 w-6" />
              Paramètres
            </CardTitle>
            <CardDescription>Configurer l'application</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate("/settings")} 
              variant="outline" 
              className="w-full border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-indigo-800 dark:hover:bg-indigo-900/30"
            >
              Paramètres
            </Button>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-16 text-center text-gray-600 dark:text-gray-400">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="h-4 w-4 text-red-500" /> by MEJJAT
        </p>
      </footer>
    </div>
  );
};

export default Home;
