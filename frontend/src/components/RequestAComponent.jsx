
import React, { useEffect, useState } from 'react'
import Axios from 'axios';
function RequestAComponent() {
    Axios.defaults.withCredentials = true;
    const [category, setCategory] = useState('FOURNITURES DE BUREAU');
    const [products, setProducts] = useState(null);
    const [choosenProduct, setChoosenProduct] = useState(null);
    const [purchaseOrder, setPurchaseOrder] = useState([]);
    const [validatePurchaseOrder,setValidatePurchaseOrder]=useState(null);
    useEffect(() => {
        Axios.post(`${import.meta.env.VITE_URL}/displayProducts`, { category: category })
            .then((response) => {
                const data = response.data;
                setProducts(data);
                setChoosenProduct({ product: data[0].title_product, qtStock: data[0].quantity, qtReserved: '' });
            })
    }, [category]);
    const handleProduct = (e) => {
        setChoosenProduct({ product: e.target.value, qtStock: e.target.selectedOptions[0].getAttribute('quantity'), qtReserved: '' });
    }
    const addToPurchaseOrder = (e) => {
        e.preventDefault();
        setPurchaseOrder(prevPurchaseOrder => {
            let count = 0;
            let index = 0;
            for (const obj of prevPurchaseOrder) {
                if (obj.product === choosenProduct.product) {
                    console.log(obj, "obj");
                    prevPurchaseOrder[index].qtReserved = choosenProduct.qtReserved;
                    count++;
                    break;
                }
                index++;
            }
            if (count === 0) {
                const newPurchaseOrder = [...prevPurchaseOrder, { ...choosenProduct, category }];
                return newPurchaseOrder;
            }
            else
                return [...prevPurchaseOrder];
        });

    }
    const deleteFromPurchaseOrder = (obj) => {
        setPurchaseOrder(prevPurchaseOrder =>
            prevPurchaseOrder.filter(item => item !== obj)
        );
    };
    const sendPurchaseOrder = (e) => {
        e.preventDefault();
        Axios.post(`${import.meta.env.VITE_URL}/sendPurchaseOrder`, purchaseOrder)
            .then((response) => {
                const message = response.data.message; 
                setPurchaseOrder([]);
                setValidatePurchaseOrder('good');
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }
    return (
        <div className='px-5'>
            <div>
                <form action="" className='mt-5  full flex flex-col items-center ' onSubmit={addToPurchaseOrder}>
                    <div className='flex justify-between  w-full '>
                        <div className='w-[42%]'>
                            <label for="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">les catégories:</label>
                            <select name="department" className=" bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={category} onChange={(e) => { setCategory(e.target.value) }}>
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
                        <div className='w-[45%]'>
                            <label for="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">les articles:</label>
                            {/* do't forget to bind value to select option */}
                            <select id="countries" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                name="role" onChange={handleProduct}>
                                {
                                    products && products.map(product => {
                                        return <option
                                            quantity={product.quantity}
                                            value={product.title_product}
                                            className="text-[12px]"
                                        >
                                            {product.title_product}
                                        </option>
                                    })
                                }
                            </select>
                        </div>
                        <div className='w-[5%]'>
                            <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">qt stock:</label>
                            {
                                choosenProduct === null ? <input type="number" value="" readOnly name="quantity" id="email" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                                /> : <input type="number" value={choosenProduct.qtStock} readOnly name="quantity" id="email" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                                />
                            }

                        </div>
                        <div className='w-[5%]'>
                            <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">qt reservé</label>
                            {
                                choosenProduct === null ? <input type="number" min="1" name="quantity" id="email" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required /> : <input type="number" max={choosenProduct.qtStock} min="1" name="quantity" id="email" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={(e) => { setChoosenProduct({ ...choosenProduct, qtReserved: e.target.value }) }} value={choosenProduct.qtReserved} />
                            }

                        </div>
                    </div>
                    <div className='mt-5'>
                        <button className="bg-blue px-7 py-3  text-white  rounded-lg text-sm  text-center  hover:scale-105 transition-transform duration-300 font-bold" >ajouter au bon de commande</button>
                    </div>
                </form>
                <div className='flex justify-center items-center mt-10 pb-10'>
                    <div className='w-full bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] px-2 pb-5'>
                        {
                             validatePurchaseOrder ==="good" ?
                             <p className="mt-5 text-center p-2 bg-green text-white text-xl font-bold  w-full">le bon de commande a été envoyée avec succès</p>
                             : null
                        }
                        <h1 className='font-black text-blue text-2xl text-center mt-5'>
                            Bon de commande</h1>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-10">
                            <thead className="text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr className="font-black text-sm text-center">
                                    <th scope="col" className="px-6 py-3 b w-[33%] ">
                                        libellé d'article
                                    </th>
                                    <th scope="col" className="px-6 py-3 b w-[33%] ">
                                        catégorie
                                    </th>
                                    <th scope="col" className="px-6 py-3 b w-[33%]">
                                        quantité reservé
                                    </th>
                                    <th scope="col" className="px-6 py-3 bg w-[33%]">
                                        Operation
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    purchaseOrder.map(obj => {
                                        return <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800  dark:border-gray-700 text-center ">
                                            <th scope="row" className=" py-4 text-gray-900 whitespace-nowrap dark:text-white font-black max-w-[33%] ">
                                                {obj.product}
                                            </th>
                                            <td className="px-6 py-4  ">
                                                {obj.category}
                                            </td>
                                            <td className="px-6 py-4  ">
                                                {obj.qtReserved}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="bg-red px-10 py-2  text-white  hover:scale-105 transition-transform duration-300 font-bold" onClick={() => { deleteFromPurchaseOrder(obj) }}>supprimer</button>
                                            </td>
                                        </tr>
                                    })

                                }
                            </tbody>
                        </table>
                        <div className='flex justify-center w-full'>
                            {
                                purchaseOrder.length > 0 ? <button onClick={sendPurchaseOrder} className="bg-blue px-7 py-3 mt-10  text-white  rounded-lg text-sm  text-center  hover:scale-105 transition-transform duration-300 font-bold" >envoyer bon de commande</button> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RequestAComponent
