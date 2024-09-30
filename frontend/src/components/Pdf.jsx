import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'
import Axios from 'axios'
import logo from '../assets/images/logo.png'
// Create 
function Pdf() {
  Axios.defaults.withCredentials = true;
  const [dates, setDates] = useState([]);
  const [year, setYear] = useState();
  const [report, setReport] = useState([]);
  const pdfRef = useRef();
  useEffect(() => {
    Axios.get(`${import.meta.env.VITE_URL}/catchReservationDates`).then((response) => {
      console.log(response.data);
      setDates(response.data);
      setYear(response.data[0].year);
    })
  }, [])
  useEffect(() => {
    Axios.get(`${import.meta.env.VITE_URL}/departmentReport`, { year }).then((response) => {
      setReport(response.data);
    })
  }, [year])
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
  const handleDate = (e) => {
    setYear(e.target.value);
  }
  return (
    <div className='flex flex-col items-center py-5 px-5'>
      <h1 className='font-black text-blue text-2xl mt-5 text-center'>
        générer un rapport</h1>
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
      <div ref={pdfRef} className='w-full  mt-10 '>
        <div className='flex justify-between items-center px-10'>
          <img src={logo} className="block w-[20%] h-[90%] " />
          <p className='  text-lg mt-5 text-center'>
          rapport sur la consommation des stocks: <span className='ml-1'>{year}</span></p>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-10 ">
          <thead className="text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
            <tr className="font-black text-sm text-center">

              <th scope="col" className="px-6 py-3 w-[35%]">
                catégorie
              </th>
              <th scope="col" className="px-6 py-3 ">
                article
              </th>
              <th scope="col" className="px-6 py-3 ">
                quantité reservé
              </th>
            </tr>
          </thead>
          <tbody>
            {
              report.map(rep => {
                return <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800  dark:border-gray-700 text-center ">
                  <td className="px-6 py-4  ">
                    {rep.title_category}
                  </td>
                  <td className="px-6 py-4  ">
                    {rep.title_product}
                  </td>
                  <td className="px-6 py-4  ">
                    {rep.sum_quantity}
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

export default Pdf

