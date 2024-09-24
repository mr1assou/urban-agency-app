import React from 'react'
import { useState, useEffect } from 'react'
import Axios from 'axios'
import { ImCross } from "react-icons/im";
function AddProducts() {
    Axios.defaults.withCredentials = true;
    const [productInformation, setProductInformation] = useState({ nameProduct: '', category: 'FOURNITURES DE BUREAU', quantity: 1 });
    const [validateProduct, setValidateProduct] = useState('');
    const [displayProducts, setDisplayProducts] = useState('FOURNITURES DE BUREAU');
    const [reload, setReload] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [popUp, setPopUp] = useState(false);
    const [updatingProduct, setUpdatingProduct] = useState({ product_id: '', productTitle: '', newQuantity: '' });
    const [newQuantity,setNewQuantity]=useState(0);
    const [validateNewQuantity,setValidateNewQuantity]=useState(null);
    useEffect(() => {
        Axios.post(`${import.meta.env.VITE_URL}/displayProducts`, { category: displayProducts })
            .then((response) => {
                const data = response.data;
                setAllProducts(data);
            })
    }, [reload]);
    const handleInformation = (e) => {
        e.preventDefault();
        setProductInformation({ ...productInformation, [e.target.name]: e.target.value });
    }
    const submitInformation = (e) => {
        e.preventDefault();
        Axios.post(`${import.meta.env.VITE_URL}/addProducts`, productInformation)
            .then((response) => {
                const message = response.data.message
                if (message === 'good') {
                    setValidateProduct('product added');
                    setReload(!reload);
                }
                else
                    setValidateProduct('error');
            })
    }
    const handleCategory = (e) => {
        e.preventDefault();
        setDisplayProducts(e.target.value);
        setReload(!reload);
    }
    const updateQuantity = (productId, productTitle, quantity) => {
        setPopUp(true);
        setNewQuantity(0);
        setValidateNewQuantity(null);
        setUpdatingProduct({ product_id: productId, productTitle: productTitle, newQuantity: quantity });
    }
    const submitNewQuantity=(e)=>{
        e.preventDefault();
        Axios.post(`${import.meta.env.VITE_URL}/modifyQuantity`,{productTitle:updatingProduct.productTitle,newQuantity:newQuantity})
            .then((response) => {
                const message = response.data.message
                if(message==="good"){
                    setReload(!reload);
                    setPopUp(false);
                }
                else{
                    setValidateNewQuantity('validate quantity');
                }
            })
    }
    return (
        <div className='flex flex-col items-center  justify-center'>
            {
                popUp && <div className="w-full h-full top-0 left-0 fixed bg-[rgba(0,0,0,0.5)] z-10 flex justify-center items-center">
                     
                    <div className='bg-white w-[60%] min-h-[40%] rounded-lg py-3 px-4 relative'>
                        {
                            validateNewQuantity ==="validate quantity" ?
                            <p className="text-center p-2 bg-red text-white text-xl font-bold  w-full">vous devez choisir une quantité égale ou supérieure à zéro</p>
                            : null
                        }
                        <div className='flex justify-between items-center cursor-pointer mt-5'>
                            {
                                <p className="font-black text-blue">{updatingProduct.productTitle}</p>
                            }
                            <ImCross className='text-blue' onClick={() => setPopUp(false)} />
                        </div>
                        <form className='flex flex-col justify-start items-center cursor-pointer mt-5 ' >
                            <div className='w-[30%] '>
                                <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    quantité:</label>
                                <input id="email" type="number" min="0" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required value={newQuantity}
                                onChange={(e)=>{setNewQuantity(e.target.value)}}/>
                            </div>
                            <button onClick={submitNewQuantity} className="bg-blue px-10 py-2.5  text-white rounded-lg hover:scale-105 transition-transform duration-300 font-bold mt-10" >modifier </button>
                        </form>
                    </div>

                </div>
            }
            <h1 className='font-black text-blue text-2xl mt-5'>
                Ajouter Un Article</h1>
            {
                validateProduct === 'product added'
                    ? <p className="text-center p-3 bg-green text-white text-xl font-bold mt-10 w-full">produit ajouté avec succès</p> : validateProduct === 'error' ? <p className="text-center p-3 bg-red text-white text-xl font-bold mt-5 w-full">produit existe déjà</p> : null
            }
            <form action="" className='flex justify-evenly mt-10  w-[95%] items-end gap-3 ' onSubmit={submitInformation}>
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
                <div className='w-[10%]'>
                    <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">quantité:</label>
                    <input type="number" min="1" name="quantity" id="email" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                        onChange={handleInformation} value={productInformation.quantity}
                    />
                </div>
                <button className="bg-blue px-7 py-3  text-white  rounded-lg text-sm  text-center  hover:scale-105 transition-transform duration-300 font-bold" >ajouter</button>
            </form>
            <div className='mt-10 flex flex-col  items-center w-[95%] '>
                <h1 className='font-black text-blue text-2xl mt-10'>
                    Voir Tous Les Articles Par Catégorie</h1>
                <div className='w-[40%] mt-10'>
                    <label for="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">catégorie:</label>
                    <select id="countries" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={displayProducts} name="category" onChange={handleCategory}>
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
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-10">
                    <thead className="text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr className="font-black text-sm text-center">
                            <th scope="col" className="px-6 py-3 b w-[33%] ">
                                libellé de produit
                            </th>
                            <th scope="col" className="px-6 py-3 b w-[33%]">
                                quantité
                            </th>
                            <th scope="col" className="px-6 py-3 bg w-[33%]">
                                Operation
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allProducts.map(prod => {
                                return <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800  dark:border-gray-700 text-center ">
                                    <th scope="row" className=" py-4 text-gray-900 whitespace-nowrap dark:text-white font-black max-w-[33%]">
                                        {prod.title_product}
                                    </th>
                                    <td className="px-6 py-4  ">
                                        {prod.quantity}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="bg-blue px-10 py-2.5  text-white rounded-lg hover:scale-105 transition-transform duration-300 font-bold" onClick={() => { updateQuantity(prod.product_id, prod.title_product, prod.quantity) }}>modifier la quantité</button>
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

export default AddProducts
