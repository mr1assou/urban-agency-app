import React, { useState } from 'react'
import { useEffect } from 'react'
import Axios from 'axios'
function VeiwRequests() {
    Axios.defaults.withCredentials = true;
    const [requests, setRequests] = useState([]);
    const [reload,setReload]=useState(false);
    const [stateValidation,setStateValidation]=useState('');
    useEffect(() => {
        Axios.get(`${import.meta.env.VITE_URL}/viewRequestOfDepartment`)
            .then((response) => {
                const data = response.data;
                setRequests(data);
            })
    }, [reload]);
    const accepted=(userId,quantity_reserved,product)=>{
        Axios.post(`${import.meta.env.VITE_URL}/acceptRequest`,{user_id:userId,quantity_reserved:quantity_reserved,product:product})
            .then((response) => {
                if(response.data.message==="good"){
                    setStateValidation('validate');
                    setReload(!reload);
                }
                else{
                    setStateValidation('problem quantity');
                } 
            })
    }
    const rejected=(userId)=>{
        Axios.post(`${import.meta.env.VITE_URL}/rejectRequest`,{user_id:userId})
            .then((response) => {
                if(response.data.message==="good"){
                    setReload(!reload);
                    setStateValidation('refused succefully');
                }
                else
                    console.log("error");
            })
    }
    return (
        <div>
            <h1 className='font-black text-blue text-2xl mt-5 text-center'>
                les demandes de votre département</h1>
                {
                     stateValidation ==="validate" ?
                     <p className="text-center p-2 bg-green text-white text-xl font-bold  w-full mt-10">vous avez validez la demande avec succès</p>
                     : stateValidation ==="problem quantity" ? <p className="text-center p-2 bg-red text-white text-xl font-bold  w-full mt-10">la quantité réservée est supérieure à la quantité en stock</p> : stateValidation==="refused succefully" ? <p className="text-center p-2 bg-green text-white text-xl font-bold  w-full mt-10">vous avez supprimez la demande avec succès</p> : null
                }
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
                                        <button className="bg-green px-10 py-2.5  text-white  hover:scale-105 transition-transform duration-300 font-bold" onClick={()=>{accepted(req.user_id,req.quantity_reserved,req.title_product)}}>accepter</button>
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
