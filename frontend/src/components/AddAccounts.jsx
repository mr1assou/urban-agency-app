import React from 'react'
import { useState } from 'react'
import { departments, perms } from '../assets/data';
import Axios from 'axios'
function AddAccounts({ func }) {
    Axios.defaults.withCredentials = true;
    const [newAccount, setNewAccount] = useState({ firstName: '', lastName: '', email: '', department: 'service informatique', role: 'admin', permissions: [] });
    const [roles, setRoles] = useState(departments['service informatique']);
    const [displayPermissions, setDisplayPermissions] = useState(false);
    const [permissionsSet, setPermissions] = useState(new Set());
    const [validateEmail, setValidateEmail] = useState('');
    // submit information of user
    const addAccount = (e) => {
        e.preventDefault();
        Axios.post(`${import.meta.env.VITE_URL}/addAccount`, newAccount)
            .then((response) => {
                const message = response.data.message
                if (message === "good") {
                    setValidateEmail('not exist');
                    setNewAccount({ ...newAccount, firstName: '', lastName: '', email: '', permissions: [] });
                    setDisplayPermissions(false);
                    func(prevReload => !prevReload);
                }
                else if (message === "error")
                    setValidateEmail('exist');
                else if (message === "permissions empty") {
                    setValidateEmail('problem permissions');
                }
                else if (message === "manager obligatory") {
                    setValidateEmail('manager obligatory');
                }
                else if (message === "department manager already exist") {
                    setValidateEmail('department manager already exist');
                }
            })
    }
    // information of new Account
    const newAccountInformation = (e) => {
        const key = e.target.name;
        if (key === "department") {
            setNewAccount({ ...newAccount, [key]: e.target.value, role: departments[e.target.value][0], permissions: [] });
            setPermissions(new Set());
            setRoles(departments[e.target.value]);
        }
        else if (key === "checkbox") {
            const { value, checked } = e.target;
            setPermissions(prevPermissions => {
                const newPermissions = new Set(prevPermissions);
                if (checked) {
                    newPermissions.add(value);
                } else {
                    newPermissions.delete(value);
                }
                setNewAccount({ ...newAccount, permissions: [...newPermissions] });
                return newPermissions;
            });
        }
        else if (key === "role") {
            setNewAccount({ ...newAccount, [key]: e.target.value, permissions: [] });
            setPermissions(new Set());
        }
        else {
            setNewAccount({ ...newAccount, [key]: e.target.value });
        }
    }
    return (
        <div className='p-3'>
            {
                validateEmail === 'not exist'
                    ? <p className="text-center p-3 bg-green text-white text-xl font-bold">Compte ajouté avec succès</p>
                    : validateEmail === 'exist'
                        ? <p className="text-center p-3 bg-red text-white text-xl font-bold">Le client existe déjà</p>
                        : validateEmail === "problem permissions"
                            ? <p className="text-center p-3 bg-red text-white text-xl font-bold">Choisissez les permissions</p>
                            : validateEmail === "manager obligatory"
                                ? <p className="text-center p-3 bg-red text-white text-xl font-bold">vous devez choisir un responsable pour le département</p>:validateEmail === "department manager already exist"
                                ? <p className="text-center p-3 bg-red text-white text-xl font-bold">le responsable du département existe déjà, vous devez bloquer le responsable existant et créer un nouveau responsable pour le département</p>:null
            }
            <div className='flex justify-center'>
                <form action="" className='flex justify-between mt-5  w-[95%] items-end gap-3' onSubmit={addAccount}>
                    <div className='w-[10%]'>
                        <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">prénom:</label>
                        <input name="firstName" pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$" id="email" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={newAccountInformation} value={newAccount.firstName} />
                    </div>
                    <div className='w-[10%]'>
                        <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">nom:</label>
                        <input name="lastName" pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$" id="email" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={newAccountInformation} value={newAccount.lastName} />
                    </div>
                    <div className='w-[20%]'>
                        <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">email:</label>
                        <input type="email" name="email" pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$" id="email" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required onChange={newAccountInformation} value={newAccount.email} />
                    </div>
                    <div className='w-[25%]'>
                        <label for="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">département:</label>
                        <select name="department" className=" bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={newAccountInformation}>
                            {
                                Object.keys(departments).map(key => (
                                    <option value={key} className="text-[12px]" key={key}>
                                        {key}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div className='w-[20%]'>
                        <label for="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">le role:</label>
                        {/* do't forget to bind value to select option */}
                        <select id="countries" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={newAccount.role} name="role" onChange={newAccountInformation}>
                            {roles.map((role, index) => {
                                return (
                                    <option
                                        key={index}
                                        value={role}
                                        className="text-[12px]"
                                    >
                                        {role}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="relative  w-[15%]">
                        <button type="button" onClick={() => setDisplayPermissions(!displayPermissions)}
                            className="bg-white px-5 py-2.5 rounded  text-sm  border outline-none bg-blue-600 hover:bg-blue-700 active:bg-blue-600 w-full">
                            les permissions
                        </button>
                        {
                            displayPermissions &&
                            <ul className='absolute  shadow-lg  py-2 px-2 z-10 min-w-full w-full rounded max-h-96 overflow-auto bg-white'>
                                {
                                    perms[newAccount.role].map((pr) => {
                                        if (newAccount.permissions.includes(pr))
                                            return <li className='py-2.5 px-4 hover:bg-blue-50 rounded text-black text-sm cursor-pointer text-[12px]'><div className="flex items-center">
                                                <input name="checkbox" value={pr} type="checkbox" className="peer w-[10%]" onChange={newAccountInformation} checked />
                                                <p className="ml-2  w-[95%]">{pr}</p>
                                            </div>
                                            </li>
                                        return <li className='py-2.5 px-4 hover:bg-blue-50 rounded text-black text-sm cursor-pointer text-[12px]'><div className="flex items-center">
                                            <input name="checkbox" value={pr} type="checkbox" className="peer w-[10%]" onChange={newAccountInformation} />
                                            <p className="ml-2  w-[95%]">{pr}</p>
                                        </div>
                                        </li>
                                    })
                                }
                            </ul>
                        }
                    </div>
                    <button className="bg-blue px-7 py-3  text-white  rounded-lg text-sm  text-center  hover:scale-105 transition-transform duration-300 font-bold" >ajouter</button>
                </form>
            </div>
        </div>
    )
}

export default AddAccounts
