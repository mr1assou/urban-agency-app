import React, { useState } from 'react'
import { useEffect } from 'react'
import Axios from 'axios'
function VeiwRequests() {
    const [requests, setRequests] = useState([]);
    const [reload,setReload]=useState(false);
    useEffect(() => {
        Axios.get(`${import.meta.env.VITE_URL}/viewRequestOfDepartment`)
            .then((response) => {
                const data = response.data;
                setRequests(data);
            })
    }, [reload]);
    const accepted=(userId)=>{
        Axios.post(`${import.meta.env.VITE_URL}/acceptRequest`,{user_id:userId})
            .then((response) => {
                console.log(response.data);
                setReload(!reload);
            })
    }
    const rejected=(userId)=>{
        Axios.post(`${import.meta.env.VITE_URL}/rejectRequest`,{user_id:userId})
            .then((response) => {
                console.log(response.data);
                setReload(!reload);
            })
    }
    return (
        <div>
            <h1 className='font-black text-blue text-2xl mt-5 text-center'>
                les demandes de votre département</h1>
            <div className='px-5'>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-10">
                    <thead className="text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                        <tr className="font-black text-sm text-center">
                            <th scope="col" className="px-6 py-3  ">
                                utilisateur
                            </th>
                            <th scope="col" className="px-6 py-3   ">
                                catégorie
                            </th>
                            <th scope="col" className="px-6 py-3 w-[30%]">
                                article
                            </th>
                            <th scope="col" className="px-6 py-3   ">
                                quantité reservé
                            </th>
                            <th scope="col" className="px-6 py-3 bg  ">
                                Operation
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            requests.map(req => {
                                return <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800  dark:border-gray-700 text-center ">
                                    <th scope="row" className=" py-4 text-gray-900 whitespace-nowrap dark:text-white font-black  ">
                                        {req.firstName} {req.lastName}
                                    </th>
                                    <td className="px-6 py-4  ">
                                        {req.title_category}
                                    </td>
                                    <td className="px-6 py-4  ">
                                        {req.title_product}
                                    </td>
                                    <td className="px-6 py-4  ">
                                        {req.quantity_reserved}
                                    </td>
                                    <td className="px-6 py-4 gap-2">
                                        <button className="bg-green px-10 py-2.5  text-white  hover:scale-105 transition-transform duration-300 font-bold" onClick={()=>{accepted(req.user_id)}}>accepter</button>
                                        <button className="bg-red px-10 py-2.5 ml-2 text-white  hover:scale-105 transition-transform duration-300 font-bold" onClick={()=>{rejected(req.user_id)}}>refuser</button>
                                    </td>

                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>

        </div >
    )
}

export default VeiwRequests
