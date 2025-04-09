
import jsPDF from 'jspdf';
import { ChecklistEntry, STATUS_ICONS } from '@/types/checklist';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const getStatusColor = (status: string): [number, number, number] => {
  switch (status) {
    case 'bon':
      return [39, 174, 96]; // Green
    case 'moyen':
      return [241, 196, 15]; // Yellow
    case 'mauvais':
      return [231, 76, 60]; // Red
    default:
      return [142, 145, 150]; // Gray
  }
};

export const generatePDF = (data: ChecklistEntry) => {
  const doc = new jsPDF();
  
  // Add custom fonts and styling
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  
  // Header styling with gradient-like effect
  doc.setFillColor(88, 86, 214); // Indigo
  doc.rect(0, 0, 210, 40, 'F');
  doc.setFillColor(126, 87, 194); // Purple
  doc.rect(105, 0, 105, 40, 'F');
  
  // Document title
  doc.setTextColor(255, 255, 255);
  doc.text("Rapport d'Inspection d'Engin", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text(format(new Date(data.date), "dd MMMM yyyy", { locale: fr }), 105, 30, { align: "center" });
  
  // Basic Information
  doc.setTextColor(88, 86, 214);
  doc.setFontSize(16);
  doc.text("Informations Générales", 20, 60);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  
  const infoStartY = 70;
  const infoItems = [
    {label: "Type de révision", value: data.type},
    {label: "Numéro de série", value: data.serialNumber},
    {label: "Compteur horaire", value: `${data.hourCounter} heures`}
  ];
  
  infoItems.forEach((item, index) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${item.label}:`, 20, infoStartY + (index * 10));
    doc.setFont("helvetica", "normal");
    doc.text(item.value, 80, infoStartY + (index * 10));
  });
  
  // Components section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(88, 86, 214);
  doc.text("État des Composants", 20, 110);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  
  // Draw components table
  const componentStartY = 120;
  const componentItems = [
    {label: "Circuit d'admission", status: data.components.admission},
    {label: "Circuit de gazoil", status: data.components.gazoil},
    {label: "Circuit d'échappement", status: data.components.exhaust},
    {label: "Flexibles", status: data.components.hoses},
    {label: "Structure", status: data.components.structure},
    {label: "Châssis", status: data.components.chassis},
    {label: "Équipements de sécurité", status: data.components.safetyEquipment}
  ];
  
  // Draw table header
  doc.setFillColor(246, 246, 246);
  doc.rect(20, componentStartY - 6, 170, 10, 'F');
  doc.setFont("helvetica", "bold");
  doc.text("Composant", 25, componentStartY);
  doc.text("État", 140, componentStartY);
  
  // Draw table rows
  componentItems.forEach((item, index) => {
    const y = componentStartY + 10 + (index * 12);
    
    // Alternate row background
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(20, y - 6, 170, 12, 'F');
    }
    
    doc.setFont("helvetica", "normal");
    doc.text(item.label, 25, y);
    
    // Draw status with color
    const statusColor = getStatusColor(item.status);
    const statusIcon = STATUS_ICONS[item.status as keyof typeof STATUS_ICONS];
    
    doc.setFillColor(...statusColor);
    doc.roundedRect(140, y - 5, 45, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(`${statusIcon} ${item.status}`, 143, y);
    doc.setTextColor(60, 60, 60);
  });
  
  // Observations section
  if (data.observations) {
    const observationsY = componentStartY + 10 + (componentItems.length * 12) + 20;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(88, 86, 214);
    doc.text("Observations", 20, observationsY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    
    // Draw text box for observations
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(20, observationsY + 5, 170, 40, 2, 2, 'FD');
    
    // Add observation text with word wrapping
    const textLines = doc.splitTextToSize(data.observations, 160);
    doc.text(textLines, 25, observationsY + 15);
  }
  
  // Photos section
  if (data.photos.length > 0) {
    let photosY = data.observations 
      ? componentStartY + 10 + (componentItems.length * 12) + 80
      : componentStartY + 10 + (componentItems.length * 12) + 20;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(88, 86, 214);
    doc.text("Photos", 20, photosY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`(${data.photos.length} photo${data.photos.length > 1 ? 's' : ''})`, 60, photosY);
    
    // In a real application, you would add the actual photos here
    // Since we're using placeholders, we'll just show icons
    
    doc.setFillColor(240, 240, 240);
    data.photos.forEach((_, index) => {
      const x = 20 + ((index % 3) * 60);
      const y = photosY + 10 + (Math.floor(index / 3) * 45);
      
      doc.roundedRect(x, y, 50, 35, 2, 2, 'F');
      doc.setTextColor(150, 150, 150);
      doc.text(`Photo ${index + 1}`, x + 25, y + 20, { align: "center" });
    });
  }
  
  // Save the PDF
  doc.save(`inspection_${data.serialNumber}_${format(new Date(data.date), "dd-MM-yyyy")}.pdf`);
};
