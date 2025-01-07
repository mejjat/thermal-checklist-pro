import jsPDF from 'jspdf';

export const generatePDF = (data: any) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text('Checklist des moteurs thermiques aux ACX', 20, 20);
  
  // Add date
  doc.setFontSize(12);
  doc.text(`Date du contrôle: ${data.date}`, 20, 40);
  
  // Add type
  doc.text(`Type de checklist: ${data.checklistType}`, 20, 50);
  
  // Add responsables
  doc.text('Responsables:', 20, 70);
  doc.text(`Électrique: ${data.responsables.electrical}`, 30, 80);
  doc.text(`Atelier: ${data.responsables.workshop}`, 30, 90);
  doc.text(`Inspecteur: ${data.responsables.inspector}`, 30, 100);
  
  // Save the PDF
  doc.save('checklist.pdf');
};