
import React, { useEffect, useState } from 'react'
import Axios from 'axios';
function AddNewStock() {
  Axios.defaults.withCredentials = true;
  const [category, setCategory] = useState('FOURNITURES DE BUREAU');
  const [products, setProducts] = useState(null);
  const [choosenProduct, setChoosenProduct] = useState(null);
  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [validatePurchaseOrder, setValidatePurchaseOrder] = useState(null);
  const [supplier, setSupplier] = useState({ company_name: '', adress: '', city: '', phone_number: '', fax: '' });

  useEffect(() => {
    Axios.post(`${import.meta.env.VITE_URL}/displayProducts`, { category: category })
      .then((response) => {
        const data = response.data;
        setProducts(data);
        setChoosenProduct({ product: data[0].title_product, qtStock: data[0].quantity, qtReserved: '' });
      })
  }, [category]);
  const handleSupplier = (e) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value });
  }
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
          if(choosenProduct.qtReserved === "" || choosenProduct.qtReserved<1)
            setValidatePurchaseOrder('new quantity is empty');
          else{
            setValidatePurchaseOrder(null); 
            prevPurchaseOrder[index].qtReserved = choosenProduct.qtReserved;
            count++;
            break;
          }
        }
        index++;
      }
      if (count === 0) {
        if (choosenProduct.qtReserved === "" || choosenProduct.qtReserved<1) {
          setValidatePurchaseOrder('new quantity is empty');
          return [...prevPurchaseOrder];
        }
        else {
          const newPurchaseOrder = [...prevPurchaseOrder, { ...choosenProduct, category }];
          setValidatePurchaseOrder(null);
          return newPurchaseOrder;
        }
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
    Axios.post(`${import.meta.env.VITE_URL}/purchaseOrderForStock`, { purchaseOrder, supplier })
      .then((response) => {
        setPurchaseOrder([]);
        setSupplier({ company_name: '', adress: '', city: '', phone_number: '', fax: '' });
        setValidatePurchaseOrder('good');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  return (
    <form className='px-5' onSubmit={sendPurchaseOrder}>
      <div>
        {
          validatePurchaseOrder === "new quantity is empty" ?
            <p className="mt-5 text-center p-2 bg-red text-white text-xl font-bold  w-full">vous devez remplir la nouvelle quantité correctement</p>
            : validatePurchaseOrder === "good" ? <p className="mt-5 text-center p-2 bg-green text-white text-xl font-bold  w-full">vous avez enregistrer le bon de commande avec succès</p> : null
        }
        <h1 className='font-black text-blue text-2xl mt-5 text-center'>
          Ajouter un nouveau stock</h1>
        <div action="" className='mt-5  full flex flex-col items-center ' >
          <div className='flex justify-between  w-full '>
            <div className='w-[15%] '>
              <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">raison sociale(fournisseur):</label>
              <input name="company_name" id="email" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={handleSupplier} value={supplier.company_name}/>
            </div>
            <div className='w-[15%] '>
              <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">adresse(fournisseur):</label>
              <input name="adress" id="email" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={handleSupplier} value={supplier.adress}/>
            </div>
            <div className='w-[15%] '>
              <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ville(fournisseur):</label>
              <input name="city" id="email" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={handleSupplier} value={supplier.city}/>
            </div>
            <div className='w-[15%] '>
              <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">télephone(fournisseur):</label>
              <input name="phone_number" id="email" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={handleSupplier} value={supplier.phone_number}/>
            </div>
            <div className='w-[15%] '>
              <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">fax(fournisseur):</label>
              <input name="fax" id="email" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={handleSupplier} value={supplier.fax}/>
            </div>
          </div>
          <div className='flex justify-between  w-full mt-5'>
            <div className='w-[42%]'>
              <label for="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">les catégories(fournisseur):</label>
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
            <div className='w-[4%]'>
              <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">qt stock:</label>
              {
                choosenProduct === null ? <input type="number" value="" readOnly name="quantity" id="email" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full  py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                /> : <input type="number" value={choosenProduct.qtStock} readOnly name="quantity" id="email" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-1 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                />
              }

            </div>
            <div className='w-[6%]'>
              <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">nouvelle qt</label>
              {
                choosenProduct === null ? <input type="number" min="1" name="quantity" id="email" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required /> : <input type="number" min="1" name="quantity" id="email" className=" bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={(e) => { setChoosenProduct({ ...choosenProduct, qtReserved: e.target.value }) }} value={choosenProduct.qtReserved} />
              }

            </div>
          </div>
          <div className='mt-5'>
            <button className="bg-blue px-7 py-3  text-white  rounded-lg text-sm  text-center  hover:scale-105 transition-transform duration-300 font-bold" onClick={addToPurchaseOrder}>ajouter au bon de commande</button>
          </div>
        </div>
        <div className='flex justify-center items-center mt-10 pb-10'>
          <div className='w-full bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] px-2 pb-5'>

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
                  nouvelle quantité
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
                purchaseOrder.length > 0 ? <button className="bg-blue px-7 py-3 mt-10  text-white  rounded-lg text-sm  text-center  hover:scale-105 transition-transform duration-300 font-bold" >envoyer bon de commande</button> : null
              }
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default AddNewStock
