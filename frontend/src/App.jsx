// import {data} from './assets/data'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home.jsx'
import Profile from './components/Profile.jsx'
import './index.css'
import ManageAccounts from './components/ManageAccounts.jsx';
import Content from './components/Content.jsx';
import AddProducts from './components/AddProducts.jsx'
import RequestAComponent from './components/RequestAComponent.jsx';
import VeiwRequests from './components/VeiwRequests.jsx';
import ValidRequests from './components/ValidRequests.jsx';
import StateOfMyRequests from './components/StateOfMyRequests.jsx';
import Settings from './components/Settings.jsx';
import DepartmentRepport from './components/DepartmentRepport.jsx';
import AddNewStock from './components/addNewStock.jsx';
import GenerateReportForStock from './components/GenerateReportForStock.jsx';
import ReportForPurchaseOrder from './components/ReportForPurchaseOrder.jsx';
import ReportForStock from './components/ReportForStock.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />}>
          <Route path="content" element={<Content />} />
          <Route path="accounts" element={<ManageAccounts />} />
          <Route path="addProducts" element={<AddProducts />} />
          <Route path="requestComponent" element={<RequestAComponent />} />
          <Route path="veiwRequests" element={<VeiwRequests />} />
          <Route path="ValidRequests" element={<ValidRequests />} />
          <Route path="stateOfMyRequests" element={<StateOfMyRequests />} />
          <Route path="Settings" element={<Settings />} />
          <Route path="DepartmentRepport" element={<DepartmentRepport />} />
          <Route path="AddNewStock" element={<AddNewStock />} />
          <Route path="GenerateReportForStock" element={<GenerateReportForStock />} />
          <Route path="ReportForStock" element={<ReportForStock />} />
          <Route path="ReportForPurchaseOrder" element={<ReportForPurchaseOrder />} />
        </Route>
      </Routes>
    </Router >

  );
}

export default App
