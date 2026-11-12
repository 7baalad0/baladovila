
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Generar un PDF reutilizable
export function generarPDF(titulo, cabeceras, filas, nombreArchivo, orientacion = "portrait") {
    const doc = new jsPDF(orientacion);

    // Título
    doc.setFontSize(18);
    doc.text(titulo, 14, 20);

    // Fecha de generación
    doc.setFontSize(10);
    doc.text(
        `Fecha: ${new Date().toLocaleDateString("es-ES")}`,
        14,
        28
    );

    // Tabla
    autoTable(doc, {
        startY: 35,
        head: [cabeceras],
        body: filas,
        styles: {
            fontSize: 9,
            cellPadding: 3
        },
        headStyles: {
            fillColor: [135, 228, 116]
        }
    });

    // Descargar documento
    doc.save(nombreArchivo);
}
