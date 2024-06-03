import {React,useState,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import myimg from './img2.png';
import axios from 'axios'; 
// import { useHistory } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import Organisation from './Organisation';
// import { Redirect } from 'react-router-dom';



function Organisationdashboard() {
    const navigate = useNavigate();
    const [organisations, setOrganisations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        organizationName: '',
        address: '',
        startDate: '',
        endDate: '',
        status: 'active'
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };

    async function handleSubmit (e) {
        e.preventDefault();
        try{
           const response = await axios.post('http://localhost:8000/organisation', formData);
           alert("form submit successfully");
           console.log(response.data);
        }
        catch(error){
            console.error('Error submitting form',error);
        }
        
      };
 
      const handleUpdate = (id) => {
        window.location.href = `/organisationupdate/${id}`;
        console.log(id);
      };
    
      const handleView = (id) => {
        window.location.href = `/organisationview/${id}`;
      };
    
      const handleDelete = async (id) => {
        try {
            await axios.put(`http://localhost:8000/organisations/${id}`, { deleted: 1 });
            setOrganisations(organisations.filter(org => org._id !== id));
            alert("Organization deleted successfully!");
        } catch (error) {
            console.error('Error deleting organization:', error);
        }
    };
    
    useEffect(() => {
      const fetchOrganisations = async () => {
          try {
              const response = await axios.get('http://localhost:8000/organisations?deleted=0');
              setOrganisations(response.data);
          } catch (error) {
              console.error('Error fetching organisations:', error);
          }
      };

      fetchOrganisations();
  }, []);

      const indexOfLastRecord = currentPage * recordsPerPage;
      const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
      const currentOrganisations = organisations.slice(indexOfFirstRecord, indexOfLastRecord);

      // Calculate serial number offset
      const serialNumberOffset = (currentPage - 1) * recordsPerPage;
      
      const nextPage = () => {
        setCurrentPage(currentPage + 1);
      };
    
      const prevPage = () => {
        setCurrentPage(currentPage - 1);
      };

    const Logout = () => {
        window.localStorage.setItem("isLoggedIn", false);
        navigate('/');
    }
   
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
                <Link to="/userdashboard">User</Link>
            </div>
        </div>
        <div className="dropdown">
            <button className="dropbtn">Transaction
            <i className="fa fa-caret-down"></i>
            </button>
            <div className="dropdown-content">
                <Link to="/templates">Templatesdashboard</Link>
                <Link to="/email">Email</Link>
                <Link to="/logs">Logs</Link>
            </div>
        </div>
        <div className="btn1">
            <button className="btn2" onClick={Logout}>Logout</button>
        </div>
    </div>
    
   

            <div className='tabdiv'>
  
                {/* <Link to='/organisation'><button className="buttonw1"> + Add Organisation</button></Link> */}
                <Link to='/organisation'><button className="buttonw1"> + Add Organisation</button></Link>
    
    
      
      <div class="table-container">
      
  <table>
    <thead>
      <tr>
        <th><span className="cell">Sr.No</span></th>
        <th><span className="cell">Organisation Name</span></th>
        <th><span className="cell">Address</span></th>
        <th><span className="cell">Start Date</span></th>
        <th><span className="cell">End Date</span></th>
        <th><span className="cell">Status</span></th>
        <th><span className="cell">Actions</span></th>
      </tr>
    </thead>
    <tbody>
    {currentOrganisations.map((org, index) => (
      <tr key={org._id}>
        <td><span class="cell">{serialNumberOffset + index + 1}</span></td>
        <td><span class="cell">{org.organizationName}</span></td>
        <td><span class="cell">{org.address}</span></td>
        <td><span class="cell">{org.startDate?.substring(0, 10)}</span></td>
        <td><span class="cell">{org.endDate?.substring(0, 10)}</span></td>
        <td><span class="cell">{org.status}</span></td>
        <td>
                <div className="dropdown1">
                  <button className="dropbtn1">Actions</button>
                  <div className="dropdown-content1">
                    <button className="b1" onClick={() => handleUpdate(org._id)}>Update</button>
                    <button className="b1" onClick={() => handleView(org._id)}>View</button>
                    <button className="b1" onClick={() => handleDelete(org._id)}>Delete</button>
                  </div>
                </div>
              </td>
      </tr>
      ))}
    </tbody>
  </table>
</div>  
</div>
    
    <div className='pagebutton'>
        <p>Showing {Math.min(indexOfLastRecord, organisations.length)} out of {organisations.length} records</p>
        <button className="pg1" onClick={prevPage} disabled={currentPage === 1}><i class="fa fa-arrow-left" aria-hidden="true"></i>Previous</button>
        <button className="pg1" onClick={nextPage} disabled={indexOfLastRecord >= organisations.length}>Next<i class="fa fa-arrow-right" aria-hidden="true"></i></button>
    </div>
</div>

  )
}

export default Organisationdashboard
