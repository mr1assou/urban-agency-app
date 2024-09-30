import React, { useState } from 'react'
import { useEffect } from 'react';
import Axios from 'axios'
function validRequests() {
    Axios.defaults.withCredentials = true;
    const [data, setData] = useState([]);
    const [reload,setReload]=useState(false);
    const [stateValidation,setStateValidation]=useState('');
    useEffect(() => {
        Axios.get(`${import.meta.env.VITE_URL}/displayValidateRequests`)
            .then((response) => {
                const data = response.data;
                setData(data);
            })
    }, [reload]);
    const validate=(reservationId,product,reservedQuantity)=>{
        Axios.post(`${import.meta.env.VITE_URL}/validateRequests`,{reservationId,product,reservedQuantity})
        .then((response) => {
            if(response.data.message==="good"){
                setReload(!reload);
                setStateValidation('validate');
            }
            else{
                setStateValidation('problem quantity');
            }
        })
    }
    const refuseRequest=(reservationId)=>{
        Axios.post(`${import.meta.env.VITE_URL}/refuseRequests`,{reservationId})
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
                Valider les demandes</h1>
            <div className='px-5'>
                {
                     stateValidation ==="validate" ?
                     <p className="text-center p-2 bg-green text-white text-xl font-bold  w-full mt-10">vous avez validez la demande avec succès</p>
                     : stateValidation ==="problem quantity" ? <p className="text-center p-2 bg-red text-white text-xl font-bold  w-full mt-10">la quantité réservée est supérieure à la quantité en stock</p> : stateValidation==="refused succefully" ? <p className="text-center p-2 bg-green text-white text-xl font-bold  w-full mt-10">vous avez supprimez la demande avec succès</p> : null
                }
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-10">
                    <thead className="text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
                        <tr className="font-black text-sm text-center">
                            <th scope="col" className="px-6 py-3  ">
                                utilisateur
                            </th>
                            <th scope="col" className="px-6 py-3   ">
                                département
                            </th>
                            <th scope="col" className="px-6 py-3   ">
                                catégorie
                            </th>
                            <th scope="col" className="px-6 py-3 ">
                                article
                            </th>
                            <th scope="col" className="px-6 py-3   ">
                                quantité reservé
                            </th>
                            <th scope="col" className="px-6 py-3   ">
                                quantité en stock
                            </th>
                            <th scope="col" className="px-6 py-3   ">
                                date de réservation
                            </th>
                            <th scope="col" className="px-6 py-3 bg  ">
                                Operation
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(obj => {
                                return <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800  dark:border-gray-700 text-center ">
                                    <th scope="row" className=" py-4 text-gray-900 whitespace-nowrap dark:text-white font-black  ">
                                    {obj.firstName.charAt(0).toUpperCase()+obj.firstName.slice(1).toLowerCase()} {obj.lastName.charAt(0).toUpperCase()+obj.lastName.slice(1).toLowerCase()}
                                    </th>
                                    <td className="px-6 py-4  ">
                                        {obj.dep_name}
                                    </td>
                                    <td className="px-6 py-4  ">
                                        {obj.title_category}
                                    </td>
                                    <td className="px-6 py-4  ">
                                        {obj.title_product}
                                    </td>
                                    <td className="px-6 py-4  ">
                                        {obj.quantity_reserved}
                                    </td>
                                    <td className="px-6 py-4  ">
                                        {obj.quantity}
                                    </td>
                                    <td className="px-6 py-4  ">
                                        {new Date(obj.reservation_date).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="px-6 py-4 gap-2 ">
                                        <div className='flex'>
                                            <button className="bg-green px-4 py-2  text-white  hover:scale-105 transition-transform duration-300 font-bold" onClick={()=>{validate(obj.reservation_id,obj.title_product,obj.quantity_reserved)}}>valider</button>
                                            <button className="bg-red px-4 py-2 ml-2 text-white  hover:scale-105 transition-transform duration-300 font-bold" onClick={()=>{refuseRequest(obj.reservation_id)}}>refuser</button>
                                        </div>
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

export default validRequests
