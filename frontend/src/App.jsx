// import {data} from './assets/data'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home.jsx'
import Profile from './components/Profile.jsx'
import './index.css'
import ManageAccounts from './components/ManageAccounts.jsx';
import Content from './components/Content.jsx';
import AddProducts from './components/AddProducts.jsx'
import RequestAComponent from './components/RequestAComponent.jsx';

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
        </Route>
      </Routes>
    </Router>

  );
}

export default App
