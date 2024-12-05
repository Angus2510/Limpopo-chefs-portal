// utils/downloadTestPDF.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generateTestPDF = (testDetails) => {
  console.log('Received test details:', testDetails);

  const doc = new jsPDF();
  const lineHeight = 10;
  const margin = 10;
  let currentY = 10;

  const addText = (text, x, y) => {
    if (typeof text !== 'string') text = String(text || '');
    x = typeof x === 'number' ? x : margin;
    y = typeof y === 'number' ? y : currentY;
    console.log('Adding text:', text, 'at position:', x, y);
    doc.text(text, x, y);
    return y + lineHeight;
  };

  const addTable = (config) => {
    console.log('Adding table at position:', config.startY);
    doc.autoTable(config);
    return doc.lastAutoTable.finalY + 10;
  };

  // Add test details
  currentY = addText(`Test Name: ${testDetails.title}`, margin, currentY);
  currentY = addText(`Test Date: ${new Date(testDetails.availableFrom).toLocaleString()}`, margin, currentY);
  currentY = addText(`Duration: ${testDetails.duration ? `${testDetails.duration} minutes` : 'N/A'}`, margin, currentY);
  currentY = addText(`Test Type: ${testDetails.type}`, margin, currentY);

  // Add students if available
  if (testDetails.individualStudents && testDetails.individualStudents.length > 0) {
    currentY = addText(`Students:`, margin, currentY);
    (testDetails.individualStudents || []).forEach((student, index) => {
      currentY = addText(`${index + 1}. ${student.profile.firstName}`, margin + 10, currentY);
    });
  }

  // Add campuses if available
  if (testDetails.campus && testDetails.campus.length > 0) {
    currentY = addText(`Campuses:`, margin, currentY);
    (testDetails.campus || []).forEach((campus, index) => {
      currentY = addText(`${index + 1}. ${campus.title}`, margin + 10, currentY);
    });
  }

  // Add intake groups if available
  if (testDetails.intakeGroups && testDetails.intakeGroups.length > 0) {
    currentY = addText(`Intake Groups:`, margin, currentY);
    (testDetails.intakeGroups || []).forEach((group, index) => {
      currentY = addText(`${index + 1}. ${group.title}`, margin + 10, currentY);
    });
  }

  // Add outcomes if available
  if (testDetails.outcome && testDetails.outcome.length > 0) {
    currentY = addText(`Outcomes:`, margin, currentY);
    (testDetails.outcome || []).forEach((outcome, index) => {
      currentY = addText(`${index + 1}. ${outcome.title}`, margin + 10, currentY);
    });
  }

  // Add a new page if necessary
  if (currentY > 270) {
    doc.addPage();
    currentY = margin;
  }

  // Add test questions with tables
  currentY = addText(`Test Questions:`, margin, currentY);

  (testDetails.questions || []).forEach((q, index) => {
    const tableHeight = calculateTableHeight(q);

    // Check if there's enough space on the current page
    if (currentY + tableHeight > doc.internal.pageSize.height - margin) {
      doc.addPage();
      currentY = margin;
    }

    currentY = addText(`Question ${index + 1}`, margin, currentY);

    // Add the table based on question type
    if (q.type === 'TrueFalse') {
      // First add the question and marks like other questions
      currentY = addTable({
        startY: currentY + 2,
        head: [['Question', 'Marks']],
        body: [
          [q.text, q.mark.toString()]
        ],
        theme: 'grid',
        styles: { cellPadding: 5, valign: 'top', textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1 },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 20 }
        },
        margin: { top: 10, bottom: 10 }
      });

      // Then add the True/False options
      currentY = addTable({
        startY: currentY + 2,
        body: [
          ['True', 'False']
        ],
        theme: 'grid',
        styles: { cellPadding: 5, valign: 'top', textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
        columnStyles: {
          0: { cellWidth: '50%' },
          1: { cellWidth: '50%' }
        },
        margin: { top: 10, bottom: 10 }
      });
    } else if (q.type === 'Long' || q.type === 'Short') {
      currentY = addTable({
        startY: currentY + 2,
        head: [['Question', 'Marks']],
        body: [
          [q.text, q.mark.toString()],
          [{ content: 'Answer:', colSpan: 2, styles: { minCellHeight: q.type === 'Long' ? 50 : 20 } }]
        ],
        theme: 'grid',
        styles: { cellPadding: 5, valign: 'top', textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1 },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 20 }
        },
        margin: { top: 10, bottom: 10 }
      });
    } else if (q.type === 'SingleWord') {
      currentY = addTable({
        startY: currentY + 2,
        head: [['Question', 'Marks']],
        body: [
          [q.text, q.mark.toString()],
          [{ content: 'Answer:', colSpan: 2, styles: { minCellHeight: 20 } }]
        ],
        theme: 'grid',
        styles: { cellPadding: 5, valign: 'top', textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1 },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 20 }
        },
        margin: { top: 10, bottom: 10 }
      });
    } else if (q.type === 'MultipleChoice') {
      // First add the question and marks like other questions
      currentY = addTable({
        startY: currentY + 2,
        head: [['Question', 'Marks']],
        body: [
          [q.text, q.mark.toString()]
        ],
        theme: 'grid',
        styles: { cellPadding: 5, valign: 'top', textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1 },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 20 }
        },
        margin: { top: 10, bottom: 10 }
      });

      // Then add the options with selection boxes
      const mcBody = q.options.map((option, idx) => [
        { content: ' ', styles: { minCellHeight: 10, cellWidth: 10, border: 1 } },
        option.value
      ]);
      currentY = addTable({
        startY: currentY + 2,
        body: mcBody,
        theme: 'grid',
        styles: { cellPadding: 5, valign: 'top', textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 'auto' }
        },
        margin: { top: 10, bottom: 10 }
      });
    } else if (q.type === 'Match') {

        // First add the question and marks like other questions
        currentY = addTable({
            startY: currentY + 2,
            head: [['Question', 'Marks']],
            body: [
              [q.text, q.mark.toString()]
            ],
            theme: 'grid',
            styles: { cellPadding: 5, valign: 'top', textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1 },
            columnStyles: {
              0: { cellWidth: 'auto' },
              1: { cellWidth: 20 }
            },
            margin: { top: 10, bottom: 10 }
          });


      const shuffledColumnB = q.options.map((option, idx) => ({
        value: option.columnB,
        number: idx + 1
      })).sort(() => Math.random() - 0.5);

      const matchBody = q.options.map((option, idx) => [
        option.columnA,
        idx+1,
        shuffledColumnB[idx].value,
        { content: ' ', styles: { minCellHeight: 10, cellWidth: 10, border: 1 } }
      ]);

      currentY = addTable({
        startY: currentY + 2,
        head: [['Column A', '', 'Column B', '']],
        body: matchBody,
        theme: 'grid',
        styles: { cellPadding: 5, valign: 'top', textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.1 },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1 },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 10 },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 10 }
        },
        margin: { top: 10, bottom: 10 }
      });
    }

    console.log('Current Y after table:', currentY);
  });

  // Save the PDF
  doc.save('test_details.pdf');
};

const calculateTableHeight = (question) => {
  if (question.type === 'Long') {
    return 2 * 10 + 50; // Example: 2 rows + extra space for long answer
  }
  if (question.type === 'MultipleChoice') {
    return (question.options.length + 1) * 10 + 20; // Example: rows for each option + header + answer row
  }
  if (question.type === 'Match') {
    return (question.options.length + 1) * 10 + 10; // Example: rows for each match option + header
  }
  return 2 * 10 + 10; // Default height for other question types
};

export default generateTestPDF;
