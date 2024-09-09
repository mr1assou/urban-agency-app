import React, { useEffect } from 'react'
import Axios from 'axios'
import { useState } from 'react'
function DisplayAccounts({ accounts }) {
    Axios.defaults.withCredentials = true;
    const [allAccounts, setAccounts] = useState([]);
    useEffect(() => {
        Axios.get(`${import.meta.env.VITE_URL}/displayAccounts`).then((response => {
            setAccounts(response.data);
        }))
    }, []);
    return (
        <div className='mt-5'>
            <p className="text-center font-bold text-2xl text-blue">Les comptes</p>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-7">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-5">
                    <thead className="text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr className="font-black text-sm text-center">
                            <th scope="col" className="px-6 py-3  w-[15%]">
                                Utilisateur
                            </th>
                            <th scope="col" className="px-6 py-3 w-[25%]">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 b w-[10%]">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3 b w-[15%]">
                                Départment
                            </th>
                            <th scope="col" className="px-6 py-3  w-[15%]">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 bg w-[10%]">
                                Operation
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            accounts.map((account) => {
                                return <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800  dark:border-gray-700 text-center">
                                    <th scope="row" className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-black">
                                        {account.firstName} {account.lastName}
                                    </th>
                                    <td className="px-6 py-4  ">
                                        {account.email}
                                    </td>
                                    <td className="px-6 py-4  ">
                                        {account.role}
                                    </td>
                                    <td className="px-6 py-4  ">
                                        {account.department}
                                    </td>
                                    <td className="px-6 py-4  ">
                                        {account.status}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="bg-blue px-10 py-2.5  text-white rounded-lg hover:scale-105 transition-transform duration-300 font-bold">edit</button>
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

export default DisplayAccounts
