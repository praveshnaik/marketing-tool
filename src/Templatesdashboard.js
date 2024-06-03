import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import myimg from './img2.png';

function Templatesdashboard() {
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', or 'non-active'
  const navigate = useNavigate();
  const { orgid } = useParams();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('http://localhost:8000/templates');
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  const handleEdit = (template) => {
    navigate(`/templateupdate/${template._id}`);
  };
  const handleView = (template) => {
    navigate(`/templateview/${template._id}`);
  };
  

  const Logout = () => {
    window.localStorage.setItem("isLoggedIn", false);
    navigate('/');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredTemplates = templates
    .filter(template => 
      template.tname.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(template => 
      filter === 'all' || template.status === filter
    );

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
            <Link to={`/templatesdashboard/${orgid}`}>Templatesdashboard</Link>
            <Link to={`/email/${orgid}`}>Email</Link>
            <Link to="/logs">Logs</Link>
          </div>
        </div>
        <div className="btn1">
          <button className="btn2" onClick={Logout}>Logout</button>
        </div>
      </div>
      <div>
        <button className="buttonw">
          <Link to={`/templates/${orgid}`}><button className="buttonw1"> + Create Templates</button></Link>
        </button>
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select  value={filter} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="non-active">Non-Active</option>
          </select>
        </div>
        <div className="template-grid">
          {filteredTemplates.map((template) => (
            <div key={template._id} className="template-card">
              <h6>{template.tname}</h6>
              <div className="template-content-container">
                <div className="template-content" dangerouslySetInnerHTML={{ __html: template.content }} />
              </div>
              <div className="template-actions">
                <button onClick={() => handleEdit(template)}>Edit</button>
                <button onClick={() => handleView(template)}>View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Templatesdashboard;
