import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import myimg from './img2.png';

function Templateview() {
  const [template, setTemplate] = useState(null);
  const { id } = useParams(); // Extracting the template ID from the URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/templates/${id}`);
        setTemplate(response.data);
      } catch (error) {
        console.error('Error fetching template:', error);
      }
    };

    fetchTemplate();
  }, [id]);

  const Logout = () => {
    window.localStorage.setItem("isLoggedIn", false);
    navigate('/');
  };
  const handleBack = () => {
    navigate(-1); // Navigates back one step in the history stack
  };

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
            <Link to="/organisation">Organisation</Link>
            <Link to="/user">User</Link>
          </div>
        </div>
        <div className="dropdown">
          <button className="dropbtn">Transaction
            <i className="fa fa-caret-down"></i>
          </button>
          <div className="dropdown-content">
            <Link to={`/templatesdashboard/${id}`}>Templatesdashboard</Link>
            <Link to="/email">Email</Link>
            <Link to="/logs">Logs</Link>
          </div>
        </div>
        <div className="btn1">
          <button className="btn2" onClick={Logout}>Logout</button>
        </div>
      </div>
      <div className="template-view-containers">
        {template ? (
        <div>
            <div className="template-header">
               <h2>{template.tname}</h2>
            </div>
          <div className="template-contents" dangerouslySetInnerHTML={{ __html: template.content }} />
        </div>
        ) : (
          <p>Loading...</p>
        )}
        
      </div>
      <div className="back-button-container">
        <button className="back-button" onClick={handleBack}>Back</button>
      </div>
    </div>
  );
}

export default Templateview;
