import React from 'react'
import { Outlet,Link } from 'react-router-dom';
import { CiBoxes } from "react-icons/ci";
import { FaNewspaper } from "react-icons/fa6";
function GenerateReportForStock() {
    return (
        <div className='w-full  flex justify-center h-[70%]'>
            <div className='w-full  mt-20 flex justify-center gap-3'>
                <Link to='/profile/ReportForStock' className="bg-red w-[25%] h-full rounded-lg  hover:scale-105 transition-transform duration-300 flex flex-col justify-evenly items-center">
                    <FaNewspaper className="text-center w-full text-[9rem] text-white hover:cursor-pointer rounded-lg" />
                    <p className=" text-center text-white font-bold ">génerer le rapport pour le stock</p>
                </Link>
                <Link to='/profile/ReportForPurchaseOrder' className="bg-purple w-[25%] h-full rounded-lg  hover:scale-105 transition-transform duration-300 flex flex-col justify-evenly items-center">
                    <CiBoxes className="text-center w-full text-[9rem] text-white hover:cursor-pointer rounded-lg" />
                    <p className=" text-center text-white font-bold ">génerer le rapport pour les bons de commande</p>
                </Link>
            </div>
        </div>
    )
}

export default GenerateReportForStock
