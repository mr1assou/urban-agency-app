import React from 'react'
//add account
import { MdManageAccounts } from "react-icons/md";
import { LuMessageCircle } from "react-icons/lu";
import { FaHandHoldingMedical } from "react-icons/fa6";
import { FaRegBuilding } from "react-icons/fa";
import Axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { MdProductionQuantityLimits } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { GrValidate } from "react-icons/gr";
import { FcNeutralTrading } from "react-icons/fc";
import { CiSettings } from "react-icons/ci";
import { FaChartBar } from "react-icons/fa";
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
                            return <Link to='/profile/requestComponent' className="bg-yellow w-[25%] h-[55%] rounded-lg  hover:scale-105 transition-transform duration-300 flex flex-col justify-evenly items-center">
                                <FaHandHoldingMedical className="text-center w-full text-[9rem] text-white hover:cursor-pointer rounded-lg" />
                                <p className=" text-center text-white font-bold ">demander un composant</p>
                            </Link>
                        if (permission.title === "regarder les demandes")
                            return <Link to='/profile/VeiwRequests' className="bg-blue w-[25%] h-[55%] rounded-lg  hover:scale-105 transition-transform duration-300 flex flex-col justify-evenly items-center">
                                <LuMessageCircle className="text-center w-full text-[9rem] text-white hover:cursor-pointer rounded-lg" />
                                <p className=" text-center text-white font-bold ">regarder les demandes de département</p>
                            </Link>
                        if (permission.title === "ajouter des articles")
                            return <Link to="/profile/addProducts" className="bg-blue w-[25%] h-[55%] rounded-lg  hover:scale-105 transition-transform duration-300 flex flex-col justify-evenly items-center">
                                <MdProductionQuantityLimits className="text-center w-full text-[9rem] text-white hover:cursor-pointer rounded-lg" />
                                <p className=" text-center text-white font-bold ">ajouter des articles</p>
                            </Link>
                        if (permission.title === "rapport département")
                            return <div className="bg-blue w-[25%] h-[55%] rounded-lg  hover:scale-105 transition-transform duration-300 flex flex-col justify-evenly items-center">
                                <TbReportAnalytics className="text-center w-full text-[9rem] text-white hover:cursor-pointer rounded-lg" />
                                <p className=" text-center text-white font-bold ">rapport de département</p>
                            </div>
                        if (permission.title === "valider les demandes")
                            return <Link to='/profile/ValidRequests' className="bg-grey w-[25%] h-[55%] rounded-lg  hover:scale-105 transition-transform duration-300 flex flex-col justify-evenly items-center">
                                <GrValidate className="text-center w-full text-[9rem] text-white hover:cursor-pointer rounded-lg" />
                                <p className=" text-center text-white font-bold ">valider les demandes</p>
                            </Link>
                        if (permission.title === "état de mes demandes")
                            return <Link to='/profile/stateOfMyRequests' className="bg-black w-[25%] h-[55%] rounded-lg  hover:scale-105 transition-transform duration-300 flex flex-col justify-evenly items-center">
                                <FaChartBar className="text-center w-full text-[9rem] text-white hover:cursor-pointer rounded-lg" />
                                <p className=" text-center text-white font-bold ">état de mes demandes</p>
                            </Link>

                    })
                }
                <Link to='/profile/Settings' className="bg-orange w-[25%] h-[55%] rounded-lg  hover:scale-105 transition-transform duration-300 flex flex-col justify-evenly items-center">
                    <CiSettings className="text-center w-full text-[9rem] text-white hover:cursor-pointer rounded-lg" />
                    <p className=" text-center text-white font-bold ">les paramètres</p>
                </Link>
                {/* <Link className="bg-red w-[25%] h-[55%] rounded-lg  hover:scale-105 transition-transform duration-300 flex flex-col justify-evenly items-center">
                    <CiLogout />
                    <p className=" text-center text-white font-bold ">se déconnecter</p>
                </Link> */}
            </div>
        </div>
    )
}

export default Content
