import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'
import Axios from 'axios'
import logo from '../assets/images/logo.png'
// Create 
function ReportForStock() {
    Axios.defaults.withCredentials = true;
    const [report, setReport] = useState([]);
    const pdfRef = useRef();
    useEffect(() => {
        Axios.get(`${import.meta.env.VITE_URL}/reportForStock`).then((response) => {
            setReport(response.data);
        })
    }, [])
    // const downloadPdf = () => {
    //     const input = pdfRef.current;
    //     html2canvas(input).then((canvas) => {
    //         const imgData = canvas.toDataURL('image/png');
    //         const pdf = new jsPDF('p', 'mm', 'a4', true);
    //         const pdfWidth = pdf.internal.pageSize.getWidth();
    //         const pdfHeight = pdf.internal.pageSize.getHeight();
    //         const imgWidth = canvas.width;
    //         const imgHeight = canvas.height;
    //         const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    //         const imgX = 0;
    //         const imgY = 0;
    //         const scaledWidth = imgWidth * ratio;
    //         const scaledHeight = imgHeight * ratio;
    //         pdf.addImage(imgData, 'PNG', imgX, imgY, scaledWidth, scaledHeight);
    //         pdf.save('invoice.pdf');
    //     })
    // }
    const downloadPdf = () => {
        const input = pdfRef.current; // Assuming you have a reference to the content you want to print
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            
            // PDF dimensions in millimeters
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // Canvas dimensions in pixels
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            
            // Scale the image to fit the PDF width
            const scale = pdfWidth / imgWidth;
            const scaledHeight = imgHeight * scale;
            
            let currentHeight = 0;
            const pageBreakThreshold = pdfHeight * 0.98; // Set the threshold to 80% of the page height
            const topPadding = 10; // Define your top padding (in mm)
    
            // Loop to handle page overflow by splitting the image into chunks that fit each page
            while (currentHeight < scaledHeight) {
                if (currentHeight > 0) {
                    pdf.addPage(); // Add a new page if we're on the second or subsequent pages
                }
    
                const pageCanvas = document.createElement('canvas');
                pageCanvas.width = imgWidth;
                pageCanvas.height = pdfHeight * 0.98 / scale; // Height for a single page, only 80% of the PDF height
                const pageCtx = pageCanvas.getContext('2d');
                pageCtx.drawImage(
                    canvas,
                    0, currentHeight / scale, // Source X, Y (start drawing from this height)
                    imgWidth, pageCanvas.height, // Source Width, Height
                    0, 0, // Destination X, Y on the page
                    imgWidth, pageCanvas.height // Destination Width, Height on the page
                );
    
                const pageImgData = pageCanvas.toDataURL('image/png');
                pdf.addImage(
                    pageImgData,
                    'PNG',
                    0,
                    topPadding, // Set the Y position to the top padding
                    pdfWidth,
                    pdfHeight * 0.98 - topPadding // Adjust height to account for the top padding
                );
    
                // Update the current height based on the 80% height used, adjusting for padding
                currentHeight += pageBreakThreshold;
            }
            
            // Save the PDF
            pdf.save('products.pdf');
        });
    }
    
    return (
        <div className='flex flex-col items-center py-5 px-5'>
            <h1 className='font-black text-blue text-2xl mt-5 text-center'>
                générer un rapport de stock</h1>
            <button className="bg-blue w-[30%] text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 hover:scale-105 transition-transform duration-300 mt-10" onClick={downloadPdf}>générer un pdf</button>
            <div ref={pdfRef} className='w-full  mt-10 px-10'>
                <div className='flex justify-between items-center px-10'>
                    <img src={logo} className="block w-[20%] h-[90%] " />
                    <p className='  text-lg mt-5 text-center'>
                        rapport du stock</p>
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-10 ">
                    <thead className="text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                        <tr className="font-black text-sm text-center">
                            <th scope="col" className="px-6 py-3 w-[45%]">
                                catégorie
                            </th>
                            <th scope="col" className="px-6 py-3 w-[55%]">
                                article
                            </th>
                            <th scope="col" className="px-6 py-3 w-[5%]">
                                quantité en stock
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            report.map(rep => {
                                return <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800  dark:border-gray-700 text-center ">
                                    <td className="px-6 py-4 ">
                                        {rep.title_category}
                                    </td>
                                    <td className="px-6 py-4  ">
                                        {rep.title_product}
                                    </td>
                                    <td className="px-6 py-4  ">
                                        {rep.quantity}
                                    </td>
                                </tr>
                            })
                        }

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ReportForStock


