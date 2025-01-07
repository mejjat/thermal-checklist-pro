import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent className="flex flex-col gap-4 p-4">
            <h2 className="text-xl font-bold">Checklist Moteurs</h2>
            <nav className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start" asChild>
                <a href="/">Accueil</a>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <a href="/checklist">Nouvelle Checklist</a>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <a href="/history">Historique</a>
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