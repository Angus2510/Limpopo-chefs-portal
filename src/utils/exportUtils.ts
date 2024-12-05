import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Column {
  Header: string;
  accessor: string;
}

export const exportToCSV = (headers: Column[], data: any[]) => {
  const filteredHeaders = headers.filter(header => header.accessor !== 'actions');
  const csvData = data.map((row) =>
    filteredHeaders.map((header) => {
      const keys = header.accessor.split('.');
      let value = row;
      keys.forEach(key => {
        value = value ? value[key] : '';
      });
      return typeof value === 'object' ? JSON.stringify(value) : value;
    })
  );

  let csvContent =
    'data:text/csv;charset=utf-8,' +
    filteredHeaders.map((e) => e.Header).join(',') +
    '\n' +
    csvData.map((e) => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  FileSaver.saveAs(blob, 'data.csv');
};

export const exportToExcel = async (columns: Column[], data: any[]) => {
  const filteredColumns = columns.filter(col => col.accessor !== 'actions');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');
  worksheet.columns = filteredColumns.map((col) => ({
    header: col.Header,
    key: col.accessor,
  }));
  data.forEach((row) => {
    const transformedRow: { [key: string]: any } = {};
    filteredColumns.forEach(col => {
      const keys = col.accessor.split('.');
      let value = row;
      keys.forEach(key => {
        value = value ? value[key] : '';
      });
      transformedRow[col.accessor] = value;
    });
    worksheet.addRow(transformedRow);
  });
  const buffer = await workbook.xlsx.writeBuffer();
  FileSaver.saveAs(new Blob([buffer]), 'data.xlsx');
};

export const exportToPDF = (columns: Column[], data: any[]) => {
  const filteredColumns = columns.filter(col => col.accessor !== 'actions');
  const pdf = new jsPDF('p', 'pt', 'a4');

  // Add logo
  const img = new Image();
  img.src = '/img/logo.png';
  img.onload = () => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = 100;
    const imgHeight = 50;
    const imgX = (pageWidth - imgWidth) / 2; // Center the image
    pdf.addImage(img, 'PNG', imgX, 20, imgWidth, imgHeight);

    const transformedData = data.map(row => {
      const transformedRow: { [key: string]: any } = {};
      filteredColumns.forEach(col => {
        const keys = col.accessor.split('.');
        let value = row;
        keys.forEach(key => {
          value = value ? value[key] : '';
        });
        transformedRow[col.Header] = value;
      });
      return Object.values(transformedRow);
    });

    autoTable(pdf, {
      head: [filteredColumns.map(col => col.Header)],
      body: transformedData,
      startY: 100,
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: { fillColor: '#3a6141', textColor: [255, 255, 255] },
    });

    pdf.save('data.pdf');
  };
};
