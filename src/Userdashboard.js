import {React,useState,useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import myimg from './img2.png';
import axios from 'axios'; 
// import { useHistory } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import Organisation from './Organisation';
// import { Redirect } from 'react-router-dom';



function Userdashboard() {
    const navigate = useNavigate();
    // const history = useHistory();
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    // const [redirectToUpdate, setRedirectToUpdate] = useState(null);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        contactno: '',
        email: '',
        password: ''
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };

   
      const handleUpdate = (id) => {
        // Logic to handle update operation
        // history.push(`/organisationupdate?${id}`);
        // return <Link to={`/update/${id}`}>Update</Link>;
        // setRedirectToUpdate(id);
        window.location.href = `/userupdate/${id}`;
        console.log(id);
      };
    
      const handleView = (id) => {
        // Logic to handle view operation
        window.location.href = `/userview/${id}`;
      };
    
      const handleDelete = async (id) => {
        try {
            await axios.put(`http://localhost:8000/user/${id}`, { deleted: 1 });
            // Remove the deleted organization from the local state
            setUsers(users.filter(u => u._id !== id));
            alert("user deleted successfully!");
        } catch (error) {
            console.error('Error deleting organization:', error);
        }
    };
    
    useEffect(() => {
      const fetchUsers = async () => {
          try {
              const response = await axios.get('http://localhost:8000/users?deleted=0');
              setUsers(response.data);
          } catch (error) {
              console.error('Error fetching organisations:', error);
          }
      };

      fetchUsers();
  }, []);

      const indexOfLastRecord = currentPage * recordsPerPage;
      const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
      const currentusers = users.slice(indexOfFirstRecord, indexOfLastRecord);

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
                <Link to="/organisationdashboard">Organisation</Link>
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
    
   
    {/* <Button className="buttonw" variant="contained" color="primary"
                onClick={handleClickToOpen}>
                Add Organisation
            </Button> */}
            
            <div className='tabdiv'>
    <button className="buttonw">
                <Link to='/user'><button className="buttonw1"> + Add User</button></Link>
            </button>
    
      
      <div class="table-container">
      
  <table>
    <thead>
      <tr>
        <th><span className="cell">Sr.No</span></th>
        <th><span className="cell">Name</span></th>
        <th><span className="cell">Contact No</span></th>
        <th><span className="cell">Email</span></th>
        {/* <th><span className="cell">Password</span></th> */}
        <th><span className="cell">Actions</span></th>
      </tr>
    </thead>
    <tbody>
    {currentusers.map((u, index) => (
      <tr key={u._id}>
        <td><span class="cell">{serialNumberOffset + index + 1}</span></td>
        <td><span class="cell">{u.name}</span></td>
        <td><span class="cell">{u.contactno}</span></td>
        <td><span class="cell">{u.email}</span></td>
        {/* <td><span class="cell">{u.password}</span></td> */}
        <td>
                <div className="dropdown1">
                  <button className="dropbtn1">Actions</button>
                  <div className="dropdown-content1">
                    <button className="b1" onClick={() => handleUpdate(u._id)}>Update</button>
                    <button className="b1" onClick={() => handleView(u._id)}>View</button>
                    <button className="b1" onClick={() => handleDelete(u._id)}>Delete</button>
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
        <p>Showing {Math.min(indexOfLastRecord, users.length)} out of {users.length} records</p>
        <button className="pg1" onClick={prevPage} disabled={currentPage === 1}><i class="fa fa-arrow-left" aria-hidden="true"></i>Previous</button>
        <button className="pg1" onClick={nextPage} disabled={indexOfLastRecord >= users.length}>Next<i class="fa fa-arrow-right" aria-hidden="true"></i></button>
      </div>
      {/* <div stlye={{}}>
            
            <Dialog open={open} onClose={handleToClose}  PaperProps={{
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      minWidth: '40%',
      minHeight:'50%',  
      
    },
  }}>
                <DialogTitle>{"ADD ORGANISATION"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Organisation/>
                        <form onSubmit={handleSubmit} action="POST">
      <label>
        Organization Name:
        <input className="input1"
          type="text"
          name="organizationName"
          value={formData.organizationName}
          onChange={handleChange} required
        />
      </label>
      <br />
      <label>
        Address:
        <input className="input1"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange} required
        />
      </label>
      <br />
      <label>
        Phone Number:
        <input
          type="text"
          name="phoneNo"
          value={formData.phoneNo}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Start Date:
        <input className="input1"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange} required
        />
      </label>
      <br />
      <label>
        End Date:
        <input className="input1"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange} required
        />
      </label>
      <br />
      <label>
        Status:
        <select className="input1" name="status" value={formData.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="non-active">Non-Active</option>
        </select>
      </label>
      <br />
      
      <div className='bt1'>
      <DialogActions>
                    <Button className="" variant="contained" type="submit" onClick={handleToClose}
                        color="primary" autoFocus>
                        ADD
                    </Button>
                    <Button className=""  variant="contained" color="error" onClick={handleToClose}
                         autoFocus>
                        Cancel
                    </Button>
      </DialogActions>
      </div>
    </form>
                    </DialogContentText>
                </DialogContent>
                
            </Dialog>
        </div> */}
</div>

  )
}

export default Userdashboard
