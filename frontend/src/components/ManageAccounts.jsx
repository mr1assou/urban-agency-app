import React, { useEffect, useState } from 'react'
import AddAccounts from './addAccounts'
import DisplayAccounts from './DisplayAccounts'
import Axios from 'axios'
function ManageAccounts() {
  Axios.defaults.withCredentials = true;
  const [allAccounts,setAllAccounts]=useState([]);
  const [reload,setReload]=useState(true);
  useEffect(()=>{
    Axios.get(`${import.meta.env.VITE_URL}/displayAccounts`).then(response=>{
      setAllAccounts(response.data);
    });
  },[reload]);
  return (
    <div>
        <AddAccounts func={setReload}/>
        <DisplayAccounts accounts={allAccounts}/>
    </div>
  )
}

export default ManageAccounts

