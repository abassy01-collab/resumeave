export async function exportToPDF(elementId: string, filename: string): Promise<void> {
  const { default: html2canvas } = await import("html2canvas");
  const { default: jsPDF } = await import("jspdf");

  const element = document.getElementById(elementId);
  if (!element) throw new Error("Resume element not found");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = pdfWidth / imgWidth;
  const scaledHeight = imgHeight * ratio;

  if (scaledHeight <= pdfHeight) {
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, scaledHeight);
  } else {
    // Multi-page support
    let position = 0;
    const pageHeight = imgHeight * (pdfHeight / scaledHeight);
    while (position < imgHeight) {
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = imgWidth;
      pageCanvas.height = Math.min(pageHeight, imgHeight - position);
      const ctx = pageCanvas.getContext("2d")!;
      ctx.drawImage(canvas, 0, position, imgWidth, pageCanvas.height, 0, 0, imgWidth, pageCanvas.height);
      if (position > 0) pdf.addPage();
      pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", 0, 0, pdfWidth, pageCanvas.height * ratio);
      position += pageHeight;
    }
  }

  pdf.save(`${filename}.pdf`);
}
