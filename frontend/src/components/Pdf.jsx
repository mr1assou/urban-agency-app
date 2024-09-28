import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'
import {userRef} from 'react'
// Create 
function Pdf() {
  const pdfRef=useRef();
  const downloadPdf=()=>{
    const input=pdfRef.current;
    html2canvas(input).then((canvas)=>{
      const imgData=canvas.toDataURL('image/png');
      const pdf=new jsPDF('p','mm','a4',true);
      const pdfWidth=pdf.internal.pageSize.getWidth();
      const pdfHeight=pdf.internal.pageSize.getHeight();
      const imgWidth=canvas.width;
      const imgHeight=canvas.height;
      const ratio=Math.min(pdfWidth/imgWidth,pdfHeight/imgHeight);
      const imgX=(pdfWidth-imgWidth*ratio)/2;
      const imgY=30;
      pdf.addImage(imgData,'PNG',imgX,imgY,imgWidth*ratio,imgHeight*ratio);
      pdf.save('invoice.pdf');
    })
  }
  return (
    <div ref={pdfRef} className='flex justify-center items-center h-screen '>
        <h1>Hello world </h1>
        <button onClick={downloadPdf} className='bg-blue mt-5'>click here</button>
    </div>
  )
}

export default Pdf

