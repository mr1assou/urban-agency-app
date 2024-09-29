import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'
import { userRef } from 'react'
// Create 
function Pdf() {
  const pdfRef = useRef();
  const downloadPdf = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('invoice.pdf');
    })
  }
  return (
    <div ref={pdfRef} >
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-10">
        <thead className="text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
          <tr className="font-black text-sm text-center">

            <th scope="col" className="px-6 py-3   ">
              catégorie
            </th>
            <th scope="col" className="px-6 py-3 w-[30%]">
              article
            </th>
            <th scope="col" className="px-6 py-3   ">
              quantité reservé
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800  dark:border-gray-700 text-center ">
            <th scope="row" className=" py-4 text-gray-900 whitespace-nowrap dark:text-white font-black  ">
            </th>
            <td className="px-6 py-4  ">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Pdf

