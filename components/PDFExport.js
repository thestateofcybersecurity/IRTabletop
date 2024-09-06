import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PDFExport({ actions, scenario, metrics }) {
  const exportToPDF = async () => {
    const doc = new jsPDF();

    // Convert the HTML content to a canvas
    const input = document.getElementById('report-content');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');

    // Ensure metrics are initialized, defaulting to "Not Available" if not provided
    const metricsData = metrics || {
      containmentTime: "Not Available",
      recoveryTime: "Not Available"
    };

    // Add the image of the content to the PDF
    doc.addImage(imgData, 'PNG', 10, 10, 190, 0); // Fit content to the page width

    // Add metrics to the PDF
    doc.setFontSize(12);
    doc.text(`Containment Time: ${metricsData.containmentTime}`, 10, 250);
    doc.text(`Recovery Time: ${metricsData.recoveryTime}`, 10, 260);

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
