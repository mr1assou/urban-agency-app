import React from 'react'
//add account
import { MdManageAccounts } from "react-icons/md";
import { LuMessageCircle } from "react-icons/lu";
import { FaHandHoldingMedical } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { FaRegBuilding } from "react-icons/fa";
import Axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { MdProductionQuantityLimits } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
function Content() {
    Axios.defaults.withCredentials = true;
    const [permissions, setPermissions] = useState([]);
    useEffect(() => {
        Axios.get(`${import.meta.env.VITE_URL}/permissions`).then((response) => {
            setPermissions(response.data);
        })
    }, [])
    return (
        <div className="flex justify-center items-center h-[90%]">
            <div className=" w-[60%] h-[60%] flex flex-wrap justify-center gap-3">
                {
                    permissions.map(permission => {
                        if (permission.title === "gérer les comptes")
                            return <Link to="/profile/accounts" className="bg-green w-[25%] h-[55%] rounded-lg  hover:scale-105 transition-transform duration-300 flex flex-col justify-evenly items-center" >
                    <MdManageAccounts className="text-center w-full text-[9rem] text-white hover:cursor-pointer rounded-lg" />
                                 <p className=" text-center text-white font-bold ">gérer les comptes</p>
                            </Link>
                        if (permission.title === "votre département")
                            return <Link className="bg-orange w-[25%] h-[55%] rounded-lg  hover:scale-105 transition-transform duration-300 flex flex-col justify-evenly items-center">
                                <FaRegBuilding className="text-center w-full text-[9rem] text-white hover:cursor-pointer rounded-lg" />
                                <p className=" text-center text-white font-bold ">votre département</p>
                            </Link>
                        if (permission.title === "demander un composant")
                            return <div className="bg-yellow w-[25%] h-[55%] rounded-lg  hover:scale-105 transition-transform duration-300 flex flex-col justify-evenly items-center">
                                <FaHandHoldingMedical className="text-center w-full text-[9rem] text-white hover:cursor-pointer rounded-lg" />
                                <p className=" text-center text-white font-bold ">demander un composant</p>
                            </div>
                        if (permission.title === "regarder les demandes")
                            return <div className="bg-blue w-[25%] h-[55%] rounded-lg  hover:scale-105 transition-transform duration-300 flex flex-col justify-evenly items-center">
                                <LuMessageCircle className="text-center w-full text-[9rem] text-white hover:cursor-pointer rounded-lg" />
                                <p className=" text-center text-white font-bold ">regarder les demandes</p>
                            </div>
                        if (permission.title === "ajouter des articles")
                            return <div className="bg-blue w-[25%] h-[55%] rounded-lg  hover:scale-105 transition-transform duration-300 flex flex-col justify-evenly items-center">
                                <MdProductionQuantityLimits className="text-center w-full text-[9rem] text-white hover:cursor-pointer rounded-lg" />
                                <p className=" text-center text-white font-bold ">ajouter des articles</p>
                            </div>
                        if (permission.title === "rapport département")
                            return <div className="bg-blue w-[25%] h-[55%] rounded-lg  hover:scale-105 transition-transform duration-300 flex flex-col justify-evenly items-center">
                                <TbReportAnalytics className="text-center w-full text-[9rem] text-white hover:cursor-pointer rounded-lg" />
                                <p className=" text-center text-white font-bold ">rapport de département</p>
                            </div>
                    })
                }
                <Link className="bg-red w-[25%] h-[55%] rounded-lg  hover:scale-105 transition-transform duration-300 flex flex-col justify-evenly items-center">
                    <CiLogout className="text-center w-full text-[9rem] text-white hover:cursor-pointer rounded-lg" />
                    <p className=" text-center text-white font-bold ">se déconnecter</p>
                </Link>
            </div>
        </div>
    )
}

export default Content
