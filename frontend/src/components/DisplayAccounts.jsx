import React from 'react'
import Axios from 'axios'
import { useState } from 'react'
import { ImCross } from "react-icons/im";
import { perms } from '../assets/data';
function DisplayAccounts({ accounts, func }) {
    Axios.defaults.withCredentials = true;
    const [popUp, setPopUp] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [permissionsArray, setPermissionsArray] = useState([]);
    const [extensionsArray, setExtensionsArray] = useState([]);
    const [displayPermissions, setDisplayPermissions] = useState(false);
    const [validateOperation, setValidateOperation] = useState(null);
    const [blockAccount, setBlockAccount] = useState(false);
    const block = (e) => {
        e.preventDefault();
        Axios.post(`${import.meta.env.VITE_URL}/block`, { 'email': editUser.email })
            .then((response) => {
                if (response.data.message === "good") {
                    setValidateOperation('compte bloqué avec succès');
                    setBlockAccount(!blockAccount);
                    func(prevReload => !prevReload);
                }
            })
    }
    const editAccount = (user_id) => {
        setBlockAccount(false);
        setDisplayPermissions(false);
        setValidateOperation(null);
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
            if (userObject.role === 'utilisateur' && userObject.dep_name === 'département administratif et financier')
                setExtensionsArray(['valider les demandes', 'ajouter des articles', 'rapport département', 'regarder les demandes','ajouter un nouveau stock','génerer le rapport pour le stock']);
            else if(userObject.role === 'utilisateur'){
                setExtensionsArray(['rapport département','regarder les demandes de département']);
            }
            else
                setExtensionsArray([]);
            setEditUser(userObject);
            setPermissionsArray(perms);
        }))
    }
    const handlePermissions = (e) => {
        if (!e.target.checked) {
            setPermissionsArray(prevPermissionsArray => {
                const array = prevPermissionsArray.filter(item => item != e.target.value);
                return array;
            });
            setExtensionsArray(prevExtensionsArray => {
                if (prevExtensionsArray.includes(e.target.value))
                    prevExtensionsArray = prevExtensionsArray.filter(item => item != e.target.value);
                const newArray = [...prevExtensionsArray, e.target.value];
                return newArray;
            });
        }
        else {
            if (extensionsArray)
                setExtensionsArray(prevExtensionArray => {
                    const newExtensionArray = prevExtensionArray.filter(item => item != e.target.value);
                    return newExtensionArray;
                });
            setPermissionsArray(prevPermissionsArray => {
                const newArray = [...prevPermissionsArray, e.target.value];
                return newArray;
            });
        }
    }
    const updatePermissions = (e) => {
        e.preventDefault();
        let backupArray = [...permissionsArray];
        if (backupArray.includes('demander un composant'))
            backupArray = backupArray.filter(item => item !== 'demander un composant');
        if (backupArray.includes('état de mes demandes'))
            backupArray = backupArray.filter(item => item !== 'état de mes demandes');
        let count1 = 0;
        let count2=0;
        const chefDepartment = [...perms['chef département']];
        const responsableStock = [...perms['responsable de stock']];
        for (let item of backupArray) {
            if (responsableStock.includes(item)) {
                count1++;
            }
            if( chefDepartment.includes(item)){
                count2++;
            }
        }
        if (count1!==0 && count2!==0) {
            setValidateOperation(`impossible d'avoir les autorisations du  responsable de stock et chef département`);
        }
        else {
            Axios.post(`${import.meta.env.VITE_URL}/updatePermissions`, { 'email': editUser.email, permissions: permissionsArray })
                .then((response) => {
                    if (response.data.message === "good")
                        setValidateOperation('les autorisations sont mises à jour avec succès')
                    else
                        setValidateOperation('Choisissez les permissions')
                })
        }
    }
    const resetPassword = (e) => {
        e.preventDefault();
        Axios.post(`${import.meta.env.VITE_URL}/resetPassword`, { 'email': editUser.email })
            .then((response) => {
                if (response.data.message === "good")
                    setValidateOperation('vous avez réinitialisé votre mot de passe avec succès')
            })
    }
    const funcBlockAccount = (e) => {
        e.preventDefault();
        setBlockAccount(!blockAccount);
    }
    return (
        <div className='mt-5'>
            {
                popUp && <form className="w-full h-full top-0 left-0 fixed bg-[rgba(0,0,0,0.5)] z-10 flex justify-center items-center">
                    <div className='bg-white w-[60%] h-[80%] rounded-lg py-3 px-4 relative'>
                        {
                            validateOperation === 'les autorisations sont mises à jour avec succès'
                                ? <p className="text-center p-3 bg-green text-white text-xl font-bold">les permissions sont mises à jour avec succès</p> :
                                validateOperation === 'Choisissez les permissions'
                                    ? <p className="text-center p-3 bg-red text-white text-xl font-bold">Choisissez les permissions</p> : validateOperation === 'compte bloqué avec succès'
                                        ? <p className="text-center p-3 bg-green text-white text-xl font-bold">compte bloqué avec succès</p> : validateOperation === 'vous avez réinitialisé votre mot de passe avec succès' ? <p className="text-center p-3 bg-green text-white text-xl font-bold">vous avez réinitialisé votre mot de passe avec succès</p> : validateOperation === `impossible d'avoir les autorisations du  responsable de stock et chef département` ? <p className="text-center p-3 bg-red text-white text-xl font-bold">impossible d'avoir les autorisations du  responsable de stock et chef département</p> : null
                        }
                        <div className='flex justify-between items-center cursor-pointer mt-5'>
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
                            !blockAccount && <div className='flex justify-center'>
                                <div className="relative  w-[50%]  mt-10">
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
                                                        <input value={pr} type="checkbox" className="peer w-[10%]" onChange={handlePermissions}
                                                            checked={true}
                                                        />
                                                        <p className="ml-2  w-[95%]">{pr}</p>
                                                    </div>
                                                    </li>
                                                })
                                            }
                                            {
                                                perms[editUser.role].map((pr) => {
                                                    if (!permissionsArray.includes(pr) && !extensionsArray.includes(pr))
                                                        return <li className='py-2.5 px-4 hover:bg-blue-50 rounded text-black text-sm cursor-pointer text-[12px]'><div className="flex items-center">
                                                            <input value={pr} type="checkbox" className="peer w-[10%]" onChange={handlePermissions}
                                                            />
                                                            <p className="ml-2  w-[95%]">{pr}</p>
                                                        </div>
                                                        </li>
                                                })
                                            }
                                            {
                                                extensionsArray && extensionsArray.map(extension => {
                                                    if (!permissionsArray.includes(extension)) {
                                                        return <li className='py-2.5 px-4 hover:bg-blue-50 rounded text-black text-sm cursor-pointer text-[12px]'><div className="flex items-center">
                                                            <input value={extension}
                                                                checked={false}
                                                                type="checkbox" className="peer w-[10%]" onChange={handlePermissions} />
                                                            <p className="ml-2  w-[95%]">{extension}</p>
                                                        </div>
                                                        </li>
                                                    }
                                                })
                                            }
                                        </ul>
                                    }
                                </div>
                            </div>
                        }
                        {
                            blockAccount && <div className='mt-20'>
                                <p className='mt-10 flex justify-center items-center font-black text-red'>Êtes-vous sûr de bloquer  ce compte ?</p>
                                <div className='flex justify-center mt-10'>
                                    <button className='bg-red p-2 text-white font-bold' onClick={block}>bloquer</button>
                                    <button className='font-bold ml-2 bg-grey p-2' onClickCapture={() => { setBlockAccount(!blockAccount) }}>annuler</button>
                                </div>
                            </div>
                        }
                        {
                            !blockAccount && <div className='absolute bottom-4 right-4 flex gap-3'>
                                <button className='bg-red py-2 px-2 text-white'
                                    onClick={funcBlockAccount}>
                                    bloquer le compte</button>
                                <button className='bg-blue py-2 px-2 text-white' onClick={resetPassword}>réinitialiser le mot de passe</button>
                                <button className='bg-green py-2 px-2 text-white' onClick={updatePermissions}>enregistrer les permissions</button>
                            </div>
                        }
                    </div>

                </form>
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
                                        {account.firstName.charAt(0).toUpperCase() + account.firstName.slice(1).toLowerCase()} {account.lastName.charAt(0).toUpperCase() + account.lastName.slice(1).toLowerCase()}
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
