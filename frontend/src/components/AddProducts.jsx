import React from 'react'
import { useState } from 'react'
import Axios from 'axios'
function AddProducts() {
    Axios.defaults.withCredentials = true;
    const [productInformation,setProductInformation]=useState({nameProduct:'',category:'FOURNITURES DE BUREAU'});
    const handleInformation=(e)=>{
        e.preventDefault();
        setProductInformation({...productInformation,[e.target.name]:e.target.value});
    }
    console.log(productInformation);
    return (
        <div className='flex flex-col items-center  justify-center'>
            <form action="" className='flex justify-evenly mt-5  w-[95%] items-end gap-3 ' >
                <div className='w-[30%]'>
                    <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">libellé d'article:</label>
                    <input name="nameProduct" id="email" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required 
                    onChange={handleInformation}
                    />
                </div>
                <div className='w-[40%]'>
                    <label for="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">catégorie:</label>
                    <select id="countries" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={productInformation.category} name="category" onChange={handleInformation}>
                        <option
                            value="FOURNITURES DE BUREAU"
                            className="text-[12px]"
                        >
                            FOURNITURES DE BUREAU
                        </option>
                        <option
                            value="FOURNITURES POUR MATERIEL TECHNIQUE ET INFORMATIQUE"
                            className="text-[12px]"
                        >
                            FOURNITURES POUR MATERIEL TECHNIQUE ET INFORMATIQUE
                        </option>
                        <option
                            value="FOURNITURES DE PRODUIT D'IMPRESSION DE REPRODUCTION ET DE PHOTOCOPIE"
                            className="text-[12px]"
                        >
                            FOURNITURES DE PRODUIT D'IMPRESSION DE REPRODUCTION ET DE PHOTOCOPIE
                        </option>
                    </select>
                </div>
                <button className="bg-blue px-7 py-3  text-white  rounded-lg text-sm  text-center  hover:scale-105 transition-transform duration-300 font-bold" >ajouter</button>
            </form>
            <div className='mt-10'>
                <h1 className='font-black text-blue text-2xl'>
                    Tous Les Produits Par Catégorie</h1>
            </div>

        </div>
    )
}

export default AddProducts
