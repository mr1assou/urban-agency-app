import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'
import Axios from 'axios'
import logo from '../assets/images/logo.png'
// Create 
function ReportForPurchaseOrder() {
  Axios.defaults.withCredentials = true;
  const [dates, setDates] = useState([]);
  const [year, setYear] = useState();
  const [report, setReport] = useState([]);
  const pdfRef = useRef();
  useEffect(() => {
    Axios.get(`${import.meta.env.VITE_URL}/catchPurchaseOrderDates`).then((response) => {
      setDates(response.data);
      setYear(response.data[0].year);
    })
  }, [])
  useEffect(() => {
    console.log(year, 'use Effect');
    Axios.get(`${import.meta.env.VITE_URL}/generatePurchaseOrderReport`, {
      params: { year }
    }).then((response) => {
      let playData = [];
      let count = 0;
      response.data.forEach((obj) => {
        if (count === 0) {
          playData.push(obj);
          count++;
        }
        else {
          let time = playData[playData.length - 1].datePurchaseOrder;
          if (time.slice(0,-7) === obj.datePurchaseOrder.slice(0,-7)) {
            playData[playData.length - 1][`title_product${count}`] = obj.title_product;
            playData[playData.length - 1][`title_category${count}`] = obj.title_category;
            playData[playData.length - 1][`datePurchaseOrder${count}`] = new Date(obj.datePurchaseOrder).toLocaleString('en-GB', {
              timeZone: 'UTC',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });
            playData[playData.length - 1][`newQuantity${count}`] = obj.newQuantity;
            count++;
          }
          else {
            playData.push(obj);
            count = 1;
          }
        }
      })
      setReport(playData);
    })
  }, [year]);
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
  const handleDate = (e) => {
    setYear(e.target.value);
  }
  console.log(report);
  return (
    <div className='flex flex-col items-center py-5 px-5'>
      <h1 className='font-black text-blue text-2xl mt-5 text-center'>
        générer un rapport pour les bons de commande</h1>
      <select name="department" className=" bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[30%] p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-10" onClick={handleDate}>
        {
          dates.map(date => {
            return <option value={date.year} className="text-[12px]">
              {date.year}
            </option>
          })
        }
      </select>
      <button className="bg-blue w-[30%] text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 hover:scale-105 transition-transform duration-300 mt-10" onClick={downloadPdf}>générer un pdf</button>
      <div ref={pdfRef} className='w-full  mt-10 px-7'>
        <div className='flex justify-between items-center px-10 '>
          <img src={logo} className="block w-[20%] h-[90%] " />
          <p className='  text-lg mt-5 text-center'>
            rapport sur les bons de commande: <span className='ml-1'>{year}</span></p>
        </div>
        {
          report.map(rep => {
            let iterations = ((Object.keys(rep).length - 9) / 4) + 1
            return <div className='px-20  mt-5 flex flex-col border py-3 '>
              <div className='flex justify-between flex-wrap'>
                <div className='flex justify-between flex-wrap'>
                  <div className='flex'>
                    <p>business name:</p>
                    <p>{rep.business_name}</p>
                  </div>
                </div>
                <div className='flex justify-between flex-wrap'>
                  <div className='flex gap-2'>
                    <p>adress:</p>
                    <p>{rep.adress}</p>
                  </div>
                </div>
                <div className='flex justify-between flex-wrap'>
                  <div className='flex gap-2'>
                    <p>city:</p>
                    <p>{rep.city}</p>
                  </div>
                </div>
                <div className='flex justify-between flex-wrap'>
                  <div className='flex gap-2'>
                    <p>phone number:</p>
                    <p>{rep.phone_number}</p>
                  </div>
                </div>
                <div className='flex justify-between flex-wrap'>
                  <div className='flex gap-2'>
                    <p>fax:</p>
                    <p>{rep.fax}</p>
                  </div>
                </div>
              </div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-10 ">
                <thead className="text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                  <tr className="font-black text-sm text-center">

                    <th scope="col" className="px-6 py-3 w-[20%]">
                      catégorie
                    </th>
                    <th scope="col" className="px-6 py-3 w-[30%]">
                      article
                    </th>
                    <th scope="col" className="px-6 py-3 w-[30%]">
                      la date
                    </th>
                    <th scope="col" className="px-6 py-3 w-[20%]">
                      nouvelle quantité
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    Object.keys(rep).map((item, index) => {
                      if (index === 0 && index <= iterations)
                        return <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800  dark:border-gray-700 text-center ">
                          <td className="px-6 py-4  ">
                            {rep.title_product}
                          </td>
                          <td className="px-6 py-4  ">
                            {rep.title_category}
                          </td>
                          <td className="px-6 py-4  ">
                            {new Date(rep.datePurchaseOrder).toLocaleString('en-GB', {
                              timeZone: 'UTC',
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4  ">
                            {rep.newQuantity}
                          </td>
                        </tr>
                      else if (index <= iterations)
                        return <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800  dark:border-gray-700 text-center ">
                          <td className="px-6 py-4  ">
                            {rep[`title_product${index}`]}
                          </td>
                          <td className="px-6 py-4  ">
                            {rep[`title_category${index}`]}
                          </td>
                          <td className="px-6 py-4  ">
                            {rep[`datePurchaseOrder${index}`]}
                          </td>
                          <td className="px-6 py-4  ">
                            {rep[`newQuantity${index}`]}
                          </td>
                        </tr>
                    })
                  }
                </tbody>
              </table>
            </div>
          })
        }
        <div>
        </div>
      </div>
    </div>
  )
}

export default ReportForPurchaseOrder

