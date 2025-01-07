import jsPDF from 'jspdf';

export const generatePDF = (data: any) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text("Checklist des moteurs thermiques aux ACX", 20, 20);
  
  // Add date and type
  doc.setFontSize(12);
  doc.text(`Date du contrôle: ${data.date}`, 20, 40);
  doc.text(`Type de checklist: ${data.checklistType === "reception" ? "Réception" : "Expédition"}`, 20, 50);
  
  // Add responsables
  doc.text("Responsables:", 20, 70);
  doc.text(`Électrique: ${data.responsables.electrical}`, 30, 80);
  doc.text(`Atelier: ${data.responsables.workshop}`, 30, 90);
  doc.text(`Inspecteur: ${data.responsables.inspector}`, 30, 100);
  
  // Add engine information
  doc.text("Information Engin:", 20, 120);
  doc.text(`Catégorie: ${data.engineCategory}`, 30, 130);
  doc.text(`Modèle: ${data.engineModel}`, 30, 140);
  doc.text(`Numéro de série: ${data.engineInfo.serialNumber}`, 30, 150);
  doc.text(`Numéro ECM: ${data.engineInfo.ecmNumber}`, 30, 160);
  doc.text(`HM actuel: ${data.engineInfo.hmCurrent}`, 30, 170);
  
  // Add revision information
  doc.text("Révision:", 20, 190);
  doc.text(`Type: ${data.revision.type}`, 30, 200);
  doc.text(`Numéro: ${data.revision.number}`, 30, 210);
  if (data.revision.fromEngine) {
    doc.text(`Provenance: ${data.revision.fromEngine}`, 30, 220);
  }
  
  // Add a new page for sensors
  doc.addPage();
  doc.text("Contrôle des capteurs:", 20, 20);
  let y = 40;
  Object.entries(data.sensors).forEach(([sensor, state]) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(`${sensor}: ${state}`, 30, y);
    y += 10;
  });
  
  // Add starting circuit information
  doc.addPage();
  doc.text("Circuit de démarrage:", 20, 20);
  y = 40;
  Object.entries(data.startingCircuit).forEach(([item, state]) => {
    doc.text(`${item}: ${state}`, 30, y);
    y += 10;
  });
  
  // Add wiring information
  doc.text("Contrôle branchement et câblage:", 20, y + 20);
  y += 40;
  Object.entries(data.wiring).forEach(([item, state]) => {
    doc.text(`${item}: ${state}`, 30, y);
    y += 10;
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, 20, 280);
    doc.text("Made with ❤️ By MEJJAT", doc.internal.pageSize.getWidth() / 2, 280, { align: "center" });
  }
  
  // Save the PDF
  doc.save("checklist.pdf");
};