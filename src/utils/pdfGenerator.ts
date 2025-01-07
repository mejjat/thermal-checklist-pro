import jsPDF from 'jspdf';
import { ChecklistEntry } from '@/types/checklist';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

export const generatePDF = (data: ChecklistEntry) => {
  const doc = new jsPDF();
  
  // Header styling
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(26, 31, 44);
  doc.text("Checklist des moteurs thermiques aux ACX", 20, 20, { align: "left" });
  
  // Basic Information
  doc.setFontSize(14);
  doc.setTextColor(139, 92, 246);
  doc.text("Informations Générales", 20, 40);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(26, 31, 44);
  doc.text(`Date du contrôle: ${format(new Date(data.date), "dd MMMM yyyy", { locale: fr })}`, 20, 50);
  doc.text(`Type de checklist: ${data.checklistType === "reception" ? "Réception" : "Expédition"}`, 20, 60);
  
  // Responsables section
  doc.setFontSize(14);
  doc.setTextColor(139, 92, 246);
  doc.text("Responsables", 20, 80);
  
  doc.setFontSize(12);
  doc.setTextColor(26, 31, 44);
  doc.text(`Électrique: ${data.responsables.electrical}`, 30, 90);
  doc.text(`Atelier: ${data.responsables.workshop}`, 30, 100);
  doc.text(`Inspecteur: ${data.responsables.inspector}`, 30, 110);
  
  // Engine Information
  doc.setFontSize(14);
  doc.setTextColor(139, 92, 246);
  doc.text("Information Engin", 20, 130);
  
  doc.setFontSize(12);
  doc.setTextColor(26, 31, 44);
  doc.text(`Catégorie: ${data.engineCategory}`, 30, 140);
  doc.text(`Modèle: ${data.engineModel}`, 30, 150);
  doc.text(`Numéro de série: ${data.engineInfo.serialNumber}`, 30, 160);
  doc.text(`Numéro ECM: ${data.engineInfo.ecmNumber}`, 30, 170);
  doc.text(`HM actuel: ${data.engineInfo.hmCurrent}`, 30, 180);
  
  // Revision Information
  doc.setFontSize(14);
  doc.setTextColor(139, 92, 246);
  doc.text("Révision", 20, 200);
  
  doc.setFontSize(12);
  doc.setTextColor(26, 31, 44);
  doc.text(`Type: ${data.revision.type}`, 30, 210);
  doc.text(`Numéro: ${data.revision.number}`, 30, 220);
  if (data.revision.fromEngine) {
    doc.text(`Provenance: ${data.revision.fromEngine}`, 30, 230);
  }
  
  // Add new page for sensors
  doc.addPage();
  doc.setFontSize(14);
  doc.setTextColor(139, 92, 246);
  doc.text("État des Capteurs", 20, 20);
  
  let y = 40;
  Object.entries(data.sensors).forEach(([sensor, state]) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    
    const statusColor = getStatusColor(state);
    doc.setFillColor(...statusColor);
    doc.circle(25, y - 1, 2, 'F');
    
    doc.setFontSize(11);
    doc.setTextColor(26, 31, 44);
    doc.text(`${sensor}: ${state}`, 30, y);
    y += 10;
  });
  
  // Starting Circuit
  doc.addPage();
  doc.setFontSize(14);
  doc.setTextColor(139, 92, 246);
  doc.text("Circuit de Démarrage", 20, 20);
  
  y = 40;
  Object.entries(data.startingCircuit).forEach(([item, state]) => {
    const statusColor = getStatusColor(state);
    doc.setFillColor(...statusColor);
    doc.circle(25, y - 1, 2, 'F');
    
    doc.setFontSize(11);
    doc.setTextColor(26, 31, 44);
    doc.text(`${item}: ${state}`, 30, y);
    y += 10;
  });
  
  // Wiring
  doc.setFontSize(14);
  doc.setTextColor(139, 92, 246);
  doc.text("Branchement et Câblage", 20, y + 20);
  
  y += 40;
  Object.entries(data.wiring).forEach(([item, state]) => {
    const statusColor = getStatusColor(state);
    doc.setFillColor(...statusColor);
    doc.circle(25, y - 1, 2, 'F');
    
    doc.setFontSize(11);
    doc.setTextColor(26, 31, 44);
    doc.text(`${item}: ${state}`, 30, y);
    y += 10;
  });
  
  // Save the PDF
  doc.save(`checklist_${data.engineModel}_${format(new Date(data.date), "dd-MM-yyyy")}.pdf`);
};