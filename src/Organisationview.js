import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import myimg from './img2.png';
import axios from 'axios';

function Organisationview() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        organizationName: '',
        address: '',
        startDate: '',
        endDate: '',
        status: 'active'
    });

    useEffect(() => {
        const fetchOrganisationData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/organisation/${id}`);
                const { organizationName, address, startDate, endDate, status } = response.data;
                setFormData({
                    organizationName,
                    address,
                    startDate: sliceDate(startDate),
                    endDate: sliceDate(endDate),
                    status

                });
            } catch (error) {
                console.error('Error fetching organization data:', error);
            }
        };

        fetchOrganisationData();
    }, [id]);

    const Logout = () => {
        window.localStorage.setItem("isLoggedIn", false);
        navigate('/');
    }
    const handleCancel = () => {
        navigate('/organisationdashboard');
    }
    const sliceDate = (dateString) => {
        return dateString ? dateString.slice(0, 10) : ''; // Slice the date string to get only the date part
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
                <form>
                    <label>
                        Organization Name:
                        <input className='input1'
                            type="text"
                            name="organizationName"
                            value={formData.organizationName}
                            disabled
                        />
                    </label>
                    <br />
                    <label>
                        Address:
                        <input className='input1'
                            type="text"
                            name="address"
                            value={formData.address}
                            disabled
                        />
                    </label>
                    <br />
                    <label>
                        Start Date:
                        <input className='input1'
                            type="text"
                            name="startDate"
                            value={formData.startDate}
                            disabled
                        />
                    </label>
                    <br />
                    <label>
                        End Date:
                        <input className='input1'
                            type="text"
                            name="endDate"
                            value={formData.endDate}
                            disabled
                        />
                    </label>
                    <br />
                    <label>
                        Status:
                        <input className='input1'
                            type="text"
                            name="status"
                            value={formData.status}
                            disabled
                        />
                    </label>
                    <button className="input1" type="button" onClick={handleCancel}>Back</button>
                </form>
            </div>
        </div>
    );
}

export default Organisationview;
