import jsPDF from "jspdf";

interface AgreementData {
  pickupRequestId: string;
  userName: string;
  companyName: string;
  wasteType: string;
  wasteDescription: string;
  location: string;
  preferredDate: string;
  preferredTime: string;
  userSignature?: string;
  companySignature?: string;
  createdAt: string;
}

export function generateAgreementPdf(data: AgreementData): string {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Banner / Header
  doc.setFillColor(14, 28, 54); // dark bg
  doc.rect(0, 0, pageWidth, 45, "F");

  doc.setFillColor(0, 163, 82); // primary green
  doc.rect(0, 40, pageWidth, 5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("♻ Nexo Greencycle", 15, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Waste Collection Service Agreement", 15, 30);
  doc.text(`Ref: ${data.pickupRequestId.slice(0, 8).toUpperCase()}`, pageWidth - 60, 30);

  // Body
  let y = 58;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("WASTE COLLECTION AGREEMENT", pageWidth / 2, y, { align: "center" });

  y += 12;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${new Date(data.createdAt).toLocaleDateString("en-KE", { dateStyle: "long" })}`, 15, y);

  y += 12;
  doc.setFont("helvetica", "bold");
  doc.text("PARTIES:", 15, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.text(`1. Client (Waste Producer): ${data.userName}`, 20, y);
  y += 6;
  doc.text(`2. Service Provider: ${data.companyName}`, 20, y);

  y += 12;
  doc.setFont("helvetica", "bold");
  doc.text("SERVICE DETAILS:", 15, y);
  y += 7;
  doc.setFont("helvetica", "normal");

  const details = [
    ["Waste Type", data.wasteType],
    ["Description", data.wasteDescription || "N/A"],
    ["Pickup Location", data.location],
    ["Scheduled Date", data.preferredDate],
    ["Preferred Time", data.preferredTime],
  ];

  details.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, 65, y);
    y += 7;
  });

  // Terms
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.text("TERMS AND CONDITIONS:", 15, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const terms = [
    "1. The Service Provider agrees to collect the specified waste at the scheduled time and location.",
    "2. The Client agrees to have the waste properly prepared and accessible at the pickup location.",
    "3. Both parties agree to comply with all applicable waste management regulations.",
    "4. The Service Provider shall dispose of the waste in an environmentally responsible manner.",
    "5. Cancellation must be communicated at least 24 hours before the scheduled pickup.",
    "6. The Service Provider is not responsible for hazardous waste not disclosed by the Client.",
    "7. This agreement is valid for the specified pickup date only.",
    "8. Payment shall be processed through the Nexo Greencycle platform.",
  ];

  terms.forEach((term) => {
    const lines = doc.splitTextToSize(term, pageWidth - 40);
    lines.forEach((line: string) => {
      doc.text(line, 20, y);
      y += 5;
    });
    y += 2;
  });

  // Signatures
  y += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("SIGNATURES:", 15, y);

  y += 12;
  // Client signature
  doc.setDrawColor(200, 200, 200);
  doc.line(20, y + 10, 90, y + 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Client Signature", 20, y + 16);
  if (data.userSignature) {
    doc.setFont("helvetica", "italic");
    doc.setTextColor(0, 100, 50);
    doc.text(data.userSignature, 25, y + 7);
    doc.setTextColor(30, 30, 30);
  }

  // Company signature
  doc.line(120, y + 10, 190, y + 10);
  doc.setFont("helvetica", "normal");
  doc.text("Company Signature", 120, y + 16);
  if (data.companySignature) {
    doc.setFont("helvetica", "italic");
    doc.setTextColor(0, 100, 50);
    doc.text(data.companySignature, 125, y + 7);
    doc.setTextColor(30, 30, 30);
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFillColor(0, 163, 82);
  doc.rect(0, footerY - 5, pageWidth, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("Nexo Greencycle • Smart Waste Management Platform • www.nexogreencycle.co.ke", pageWidth / 2, footerY + 3, { align: "center" });

  return doc.output("datauristring");
}
