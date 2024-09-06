import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PDFExport({ actions, scenario, metrics }) {
  const exportToPDF = async () => {
    const doc = new jsPDF();

    // Convert the HTML content to a canvas
    const input = document.getElementById('report-content');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');

    // Add the image of the content to the PDF
    doc.addImage(imgData, 'PNG', 10, 10, 190, 0); // Fit content to the page width

    // Save the PDF
    doc.save('incident_report.pdf');
  };

  return (
    <div className="mt-4">
      <button onClick={exportToPDF} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Export to PDF
      </button>
    </div>
  );
}
