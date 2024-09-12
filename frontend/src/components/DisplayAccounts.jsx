import React, { useEffect } from 'react'
import Axios from 'axios'
import { useState } from 'react'
import { ImCross } from "react-icons/im";
import { perms } from '../assets/data';
function DisplayAccounts({ accounts }) {
    Axios.defaults.withCredentials = true;
    const [allAccounts, setAccounts] = useState([]);
    const [popUp, setPopUp] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [permissionsArray, setPermissionsArray] = useState([]);
    const [displayPermissions, setDisplayPermissions] = useState(false);
    useEffect(() => {
        Axios.get(`${import.meta.env.VITE_URL}/displayAccounts`).then((response => {
            setAccounts(response.data);
        }))
    }, []);
    const editAccount = (user_id) => {
        setPopUp(!popUp);
        Axios.get(`${import.meta.env.VITE_URL}/userInformation`, {
            params: { user: user_id },
        }).then((response => {
            let userObject;
            let perms = [];
            response.data.forEach((item, index) => {
                if (index === 0) {
                    userObject = { ...item };
                    perms.push(userObject.title);
                }
                else {
                    userObject[`title${index}`] = item.title;
                    perms.push(userObject[`title${index}`]);
                }
            })
            setEditUser(userObject);
            setPermissionsArray(perms);
        }))
    }
    console.log(editUser);
    console.log(permissionsArray);
    return (
        <div className='mt-5'>
            {
                popUp && <div className="w-full h-full top-0 left-0 absolute bg-[rgba(0,0,0,0.5)] z-10 flex justify-center items-center">
                    <div className='bg-white w-[50%] h-[60%] rounded-lg py-3 px-4'>
                        <div className='flex justify-between items-center cursor-pointer '>
                            {
                                editUser && <p className="font-black text-black">{editUser.firstName} {editUser.lastName}</p>
                            }
                            <ImCross className='text-blue' onClick={() => setPopUp(!popUp)} />
                        </div>
                        <div className='flex justify-between items-center cursor-pointer mt-5 '>
                            {
                                editUser && <div className='flex justify-between 
                                flex-wrap  w-full'>
                                    <div className="flex text-sm">
                                        <p className='font-black text-blue'>email:</p>
                                        <p className='ml-2 text-black'>{editUser.email}</p>
                                    </div>
                                    <div className="flex text-sm">
                                        <p className='font-black text-blue'>role:</p>
                                        <p className='ml-2 text-black'>{editUser.role}</p>
                                    </div>
                                    <div className="flex text-sm ">
                                        <p className='font-black text-blue'>département:</p>
                                        <p className='ml-2 text-black'>{editUser.dep_name}</p>
                                    </div>
                                </div>
                            }
                        </div>
                        {
                            <div className='flex justify-center'>
                                <div className="relative  w-[50%] bg-red mt-5">
                                    <button type="button" onClick={() => setDisplayPermissions(!displayPermissions)}
                                        className="bg-white  px-5 py-2.5 rounded  text-sm  border outline-none bg-blue-600 hover:bg-blue-700 active:bg-blue-600 w-full">
                                        les permissions
                                    </button>
                                    {
                                        displayPermissions &&
                                        <ul className='absolute  shadow-lg  py-2 px-2 z-10 min-w-full w-full rounded max-h-96 overflow-auto '>
                                            {
                                                permissionsArray.map((pr) => {
                                                    return <li className='py-2.5 px-4 hover:bg-blue-50 rounded text-black text-sm cursor-pointer text-[12px]'><div className="flex items-center">
                                                        <input name="checkbox" value={pr} type="checkbox" checked className="peer w-[10%]" />
                                                        <p className="ml-2  w-[95%]">{pr}</p>
                                                    </div>
                                                    </li>
                                                })

                                            }
                                        </ul>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
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
                                        <button className="bg-blue px-10 py-2.5  text-white rounded-lg hover:scale-105 transition-transform duration-300 font-bold" onClick={() => { editAccount(account.user_id) }}>modifier</button>
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
