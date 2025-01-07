import jsPDF from 'jspdf';
import { ChecklistEntry } from '@/types/checklist';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const generatePDF = (data: ChecklistEntry) => {
  const doc = new jsPDF();
  
  // Add custom font and styling
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(26, 31, 44); // Dark Purple
  
  // Header
  doc.text("Checklist des moteurs thermiques aux ACX", 20, 20, { align: "left" });
  
  // Subheader styling
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(142, 145, 150); // Neutral Gray
  
  // Basic Information
  doc.text(`Date du contrôle: ${format(new Date(data.date), "dd MMMM yyyy", { locale: fr })}`, 20, 40);
  doc.text(`Type de checklist: ${data.checklistType === "reception" ? "Réception" : "Expédition"}`, 20, 50);
  
  // Responsables section with box
  doc.setDrawColor(214, 188, 250); // Light Purple
  doc.setFillColor(250, 250, 255);
  doc.roundedRect(15, 60, 180, 40, 3, 3, 'FD');
  
  doc.setTextColor(26, 31, 44);
  doc.setFontSize(14);
  doc.text("Responsables:", 20, 70);
  doc.setFontSize(12);
  doc.text(`Électrique: ${data.responsables.electrical}`, 30, 80);
  doc.text(`Atelier: ${data.responsables.workshop}`, 30, 90);
  doc.text(`Inspecteur: ${data.responsables.inspector}`, 30, 100);
  
  // Engine Information
  doc.setFillColor(242, 252, 226); // Soft Green
  doc.roundedRect(15, 110, 180, 50, 3, 3, 'FD');
  
  doc.setFontSize(14);
  doc.text("Information Engin:", 20, 120);
  doc.setFontSize(12);
  doc.text(`Catégorie: ${data.engineCategory}`, 30, 130);
  doc.text(`Modèle: ${data.engineModel}`, 30, 140);
  doc.text(`Numéro de série: ${data.engineInfo.serialNumber}`, 30, 150);
  doc.text(`Numéro ECM: ${data.engineInfo.ecmNumber}`, 30, 160);
  
  // Add a new page for sensors
  doc.addPage();
  doc.setFontSize(16);
  doc.text("État des Capteurs", 20, 20);
  
  let y = 40;
  Object.entries(data.sensors).forEach(([sensor, state]) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    
    // Add colored status indicator
    const statusColor = getStatusColor(state);
    doc.setFillColor(...statusColor);
    doc.circle(25, y - 1, 2, 'F');
    
    doc.setFontSize(11);
    doc.text(`${sensor}: ${state}`, 30, y);
    y += 10;
  });
  
  // Add footer to all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(142, 145, 150);
    doc.text(`Page ${i} sur ${pageCount}`, 20, 280);
    doc.text("Made with ❤️ By MEJJAT", doc.internal.pageSize.getWidth() / 2, 280, { align: "center" });
  }
  
  // Save the PDF
  doc.save(`checklist_${data.engineModel}_${format(new Date(data.date), "dd-MM-yyyy")}.pdf`);
};

// Helper function to get RGB colors for status
const getStatusColor = (status: string): [number, number, number] => {
  switch (status.toLowerCase()) {
    case 'neuf':
      return [139, 92, 246]; // Purple
    case 'bon':
      return [15, 160, 206]; // Blue
    case 'mauvais':
      return [234, 56, 76]; // Red
    case 'manquant':
      return [217, 70, 239]; // Pink
    default:
      return [142, 145, 150]; // Gray
  }
};