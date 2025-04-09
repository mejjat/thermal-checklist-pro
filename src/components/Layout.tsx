
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, Home, ClipboardCheck, History, FileText, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent className="flex flex-col gap-4 p-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Checklist Méthode Engins
            </h2>
            <nav className="flex flex-col gap-2">
              <Button 
                variant={isActive("/") ? "default" : "ghost"} 
                className={`justify-start ${isActive("/") ? "bg-gradient-to-r from-indigo-500 to-purple-500" : ""}`} 
                asChild
              >
                <a href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Accueil
                </a>
              </Button>
              <Button 
                variant={isActive("/checklist") ? "default" : "ghost"} 
                className={`justify-start ${isActive("/checklist") ? "bg-gradient-to-r from-indigo-500 to-purple-500" : ""}`} 
                asChild
              >
                <a href="/checklist">
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Nouvelle Inspection
                </a>
              </Button>
              <Button 
                variant={isActive("/history") ? "default" : "ghost"} 
                className={`justify-start ${isActive("/history") ? "bg-gradient-to-r from-indigo-500 to-purple-500" : ""}`} 
                asChild
              >
                <a href="/history">
                  <History className="h-4 w-4 mr-2" />
                  Historique
                </a>
              </Button>
              <Button 
                variant={isActive("/reports") ? "default" : "ghost"} 
                className={`justify-start ${isActive("/reports") ? "bg-gradient-to-r from-indigo-500 to-purple-500" : ""}`} 
                asChild
              >
                <a href="/reports">
                  <FileText className="h-4 w-4 mr-2" />
                  Rapports
                </a>
              </Button>
              <Button 
                variant={isActive("/settings") ? "default" : "ghost"} 
                className={`justify-start ${isActive("/settings") ? "bg-gradient-to-r from-indigo-500 to-purple-500" : ""}`} 
                asChild
              >
                <a href="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </a>
              </Button>
            </nav>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-8">
          <div className="mb-8">
            <SidebarTrigger>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SidebarTrigger>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};
