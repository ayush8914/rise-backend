const { PDFDocument, rgb } = require('pdf-lib');

async function createPdf(res,req) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([300, 400]);
  const { width, height } = page.getSize();
  const helveticaFont = await pdfDoc.embedFont('Helvetica');

  const drawTextOptions = {
    x: 50,
    y: height - 50,
    size: 30,
    color: rgb(0, 0, 0),
  };

  page.drawText('Hello, PDF!', drawTextOptions);

  const pdfBytes = await pdfDoc.save();

  // Save the PDF to a file
  const fs = require('fs');
  fs.writeFileSync('generated-pdf.pdf', pdfBytes);
  
return  res.status(200).json({
    Status:1,
    Message:'Fetched successfully',
    info: pdfBytes
});

}

module.exports = {createPdf};