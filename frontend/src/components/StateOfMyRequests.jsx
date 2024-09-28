import React from 'react'
import { useState, useEffect } from 'react';
import Axios from 'axios'
function StateOfMyRequests() {
  const [data, setData] = useState([]);
  useEffect(() => {
    Axios.get(`${import.meta.env.VITE_URL}/stateOfMyRequests`)
      .then((response) => {
        const data = response.data;
        console.log(data);
        setData(data);
      })
  }, []);
  return (
    <div>
      <div>
        <h1 className='font-black text-blue text-2xl mt-5 text-center'>
          L'état de mes demandes</h1>
        <div className='px-5'>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-10">
            <thead className="text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
              <tr className="font-black text-sm text-center">
                <th scope="col" className="px-6 py-3 ">
                  article
                </th>
                <th scope="col" className="px-6 py-3   ">
                  catégorie
                </th>
                <th scope="col" className="px-6 py-3   ">
                  quantité reservé
                </th>

                <th scope="col" className="px-6 py-3   ">
                  date de réservation
                </th>
                <th scope="col" className="px-6 py-3 bg  ">
                  Etat
                </th>
              </tr>
            </thead>
            <tbody>
              {
                data.map(obj => {

                  return <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800  dark:border-gray-700 text-center ">
                    <td className="px-6 py-4  ">
                      {obj.title_product}
                    </td>
                    <td className="px-6 py-4  ">
                      {obj.title_category}
                    </td>
                    <td className="px-6 py-4  ">
                      {obj.quantity_reserved}
                    </td>
                    <td className="px-6 py-4  ">
                      {new Date(obj.reservation_date).toLocaleString('en-GB', {
                        timeZone: 'UTC',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 gap-2 ">
                      {obj.status}
                    </td>
                  </tr>
                })
              }
            </tbody>
          </table>
        </div>
      </div >
    </div>
  )
}

export default StateOfMyRequests
