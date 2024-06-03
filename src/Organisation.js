import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import myimg from './img2.png';
import axios from 'axios';

function Organisation() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
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

    const Logout = () => {
        window.localStorage.setItem("isLoggedIn", false);
        navigate('/');
    };

    const handleCancel = () => {
        navigate('/organisationdashboard');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/organisation', formData);
            console.log(response.data);
            navigate('/organisationdashboard');
        } catch (error) {
            if (error.response) {
                setErrors(error.response.data);
                console.error('Error response:', error.response);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
        }
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
                <form onSubmit={handleSubmit} action="POST">
                    <label>
                        Organization Name:
                        <input className='input1'
                            type="text"
                            name="organizationName"
                            value={formData.organizationName}
                            onChange={handleChange}
                            required
                        />
                        {errors.organizationName && <span className="error">{errors.organizationName}</span>}
                    </label>
                    <br />
                    <label>
                        Address:
                        <input className='input1'
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                        {errors.address && <span className="error">{errors.address}</span>}
                    </label>
                    <br />
                    <label>
                        Start Date:
                        <input className='input1'
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                        {errors.startDate && <span className="error">{errors.startDate}</span>}
                    </label>
                    <br />
                    <label>
                        End Date:
                        <input className='input1'
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                        />
                        {errors.endDate && <span className="error">{errors.endDate}</span>}
                        {errors.dateRange && <span className="error">{errors.dateRange}</span>}
                    </label>
                    <br />
                    <label>
                        Status:
                        <select className='input1' name="status" value={formData.status} onChange={handleChange}>
                            <option value="active">Active</option>
                            <option value="non-active">Non-Active</option>
                        </select>
                        {errors.status && <span className="error">{errors.status}</span>}
                    </label>
                    <br />
                    <button className="input1" type="submit">Submit</button>
                    <button className="input1" type="button" onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default Organisation;
