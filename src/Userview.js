import React, { useState, useEffect } from 'react';
import axios from 'axios';
import myimg from './img2.png';
import { Link, useNavigate, useParams } from 'react-router-dom';

function Userview() {
    const navigate = useNavigate();
    const { id } = useParams();
  // State variables to store form data
  const [formData, setFormData] = useState({
    name: '',
    contactno: '',
    email: '',
    password: '',
    roleId: '', // Assuming roleId is selected from a dropdown or fetched from the backend
    organisationId: '' // Assuming organisationId is selected from a dropdown or fetched from the backend
  });
 


  // State variables to store role and organisation data
  const [roles, setRoles] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [uroles, setURoles] = useState([]);
  const [uorganisations, setUOrganisations] = useState([]);
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:8000/roles');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    const fetchOrganisations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/organisations');
        setOrganisations(response.data);
      } catch (error) {
        console.error('Error fetching organisations:', error);
      }
    };

    fetchRoles();
    fetchOrganisations();
  }, []);
  
  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const Logout = () => {
    window.localStorage.setItem("isLoggedIn", false);
    navigate('/');
}
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Send POST request to backend API
    const response = await axios.put(`http://localhost:8000/users/${id}`, formData);
    alert('Form submitted successfully');
    navigate('/userdashboard');
    console.log(response.data); // Log the response from the server
    // Optionally, you can clear the form fields after successful submission
    // setFormData({
    //   name: '',
    //   contactno: '',
    //   email: '',
    //   password: '',
    //   roleId: '',
    //   organisationId: ''
    // });
  } catch (error) {
    console.error('Error submitting form:', error);
    // Optionally, handle error messages or display them to the user
  }
};
const handleCancel =() =>{
  navigate('/userdashboard');
}
 

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/user/${id}`);
            console.log(response);
            const { name, contactno, email, password, roleId,organisationId} = response.data;
            console.log(name);
            const extractedOrganisationId = organisationId._id;
            const extractedroleId = roleId._id;
            setFormData({
                name,
                contactno,
                email,
                password,
                roleId: extractedroleId,
                organisationId: extractedOrganisationId

            });
            console.log(extractedOrganisationId);
            // const orgResponse = await axios.get(`http://localhost:8000/organisation/${extractedOrganisationId}`);
            // const orgData = orgResponse.data; // Retrieved organisation data
            // setUOrganisations(orgData); 

            // const roleResponse = await axios.get(`http://localhost:8000/role/${extractedroleId}`);
            // const roleData = roleResponse.data; // Retrieved organisation data
            // setURoles(roleData); 
        } catch (error) {
            console.error('Error fetching organisation data:', error);
        }
    };

    fetchUserData();
}, [id]);

  // Function to handle form submission
 
  return (
    <div className="class1">
    <div className="navbar">
        <img className="img2" src={myimg} alt="my image" />
        <Link to="/adminhome" className="nav-link">DashBoard</Link>
        <div className="dropdown">
            <button className="dropbtn">Masters
            <i className="fa fa-caret-down"></i>
            </button>
            <div className="dropdown-content">
                <Link to="/organisationdashboard">Organisation</Link>
                <Link to="/userdashboard">User</Link>
            </div>
        </div>
        <div className="dropdown">
            <button className="dropbtn">Transaction
            <i className="fa fa-caret-down"></i>
            </button>
            <div className="dropdown-content">
                <Link to="/templates">Templates</Link>
                <Link to="/email">Email</Link>
                <Link to="/logs">Logs</Link>
            </div>
        </div>
        <div className="btn1">
            <button className="btn2" onClick={Logout}>Logout</button>
        </div>
    </div>
    <div className='divorg'>
    <form onSubmit={handleSubmit} action='POST'>
      <label>
        Name:
        {/* <input className={`input1 ${formData.name.length > 0 ? 'valid' : ''}`} */}
        <input className ="input1 "

         type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled
        />
         {/* {!formData.name.length > 0 && formData.name.length > 0  && (
            <span className="error">Enter a name</span>
          )} */}
      </label>
      <br />
      <label>
        Contact Number:
        {/* <input className={`input1 ${formData.contactno.match(/^\d{10}$/) ? 'valid' : ''}`} */}
        <input className ="input1 "
          type="number"
          name="contactno"
          value={formData.contactno}
          onChange={handleChange}
          disabled
        />
        {/* {formData.contactno.length > 0 && !formData.contactno.match(/^\d{10}$/)&& (
            <span className="error">Enter a valid contactno</span>
          )} */}
      </label>
      <br />
      <label>
        Email:
        {/* <input className={`input1 ${formData.email.length > 0 && formData.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? 'valid' : 'invalid'}`} */}
        <input className ="input1 "
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled
        />
        {/* {formData.email.length > 0 && !formData.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) && (
            <span className="error">Enter a valid email address</span>
          )} */}
      </label>
      <br />
      <label>
        Password:
        {/* <input className={`input1 ${formData.password.length > 0 && formData.password.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) ? 'valid' : 'invalid'}`} */}
        <input className ="input1 "
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled
        />
        {/* {formData.password.length > 0 && !formData.password.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) && (
            <span className="error">Enter Password(must have atleast Eight Characters, One capital letter, One number and One special character)</span>
          )} */}
      </label>
      <br />
      <label>
        Role:
        <select className='input1'
          name="roleId"
          value={formData.roleId}
          onChange={handleChange}
          disabled
        >
          <option value="">select role</option>
          {roles.map(r => (
            <option key={r._id} value={r._id} >
              {r.role} 
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Organisation:
        <select className='input1'
          name="organisationId"
          value={formData.organisationId}
          onChange={handleChange}
          disabled
        >
          <option value="">Select Organisation</option>
          {organisations.map(org => (
            <option key={org._id} value={org._id} >
              {org. organizationName}
            </option>
          ))}
        </select>
      </label>
      <br />
      {/* <button className='input1' type="submit">Back</button> */}
      <button className="input1" type="button" onClick={handleCancel}>Back</button>
    </form>
    </div>
    </div>
  );
}

export default Userview;
// selected={org._id === uorganisations._id}
// selected={r._id === uroles._id} 