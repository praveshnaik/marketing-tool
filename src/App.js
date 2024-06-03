import './App.css';
import Adminhome from './Adminhome';
import Login from './Login';
import Signup from './Signup';
import Organisation from './Organisation';
import Organisationdashboard from './Organisationdashboard';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Organisationupdate from './Organisationupdate';
import  ProtectedRoute  from './Protectedroutes';
import Organisationview from './Organisationview';
import User from './User';
import Userdashboard from './Userdashboard';
import Userupdate from './Userupdate';
import Userview from './Userview';
import Templates from './Templates';
import Templatesdashboard from './Templatesdashboard';
import Templateupdate from './Templateupdate';
import Templateview from './Templateview';
import Email from './Email';
import Emailtransc from './Emailtransc';
// import './../node_modules/bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/adminhome" element={<Adminhome/>}/>
          <Route path="/adminhome/:role/:orgid" element={<Adminhome/>}/>
          <Route path="/organisationdashboard" element={<Organisationdashboard/>}/>
          <Route path="/organisation" element={<Organisation/>}/>
          <Route path="/organisationupdate/:id" element={<Organisationupdate/>}/>
          <Route path="/organisationview/:id" element={<Organisationview/>}/>
          <Route path="/user" element={<User/>}/>
          <Route path="/userdashboard" element={<Userdashboard/>}/>
          <Route path="/userupdate/:id" element={<Userupdate/>}/>
          <Route path="/userview/:id" element={<Userview/>}/>
          <Route path="/templates/:orgid" element={<Templates/>}/>
          <Route path="/templatesdashboard/:orgid" element={<Templatesdashboard/>}/>
          <Route path="/templateupdate/:id" element={<Templateupdate/>}/>
          <Route path="/templateview/:id" element={<Templateview/>}/>
          <Route path="/email/:orgid" element={<Email/>}/>
          <Route path="/emailtransc" element={<Emailtransc/>}/>
        </Routes>
      </Router>
     </div>
  );
}

export default App;
