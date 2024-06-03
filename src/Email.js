import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import myimg from './img2.png';
import { CSVLink } from "react-csv";

function Email() {
    const navigate = useNavigate();
    const { orgid } = useParams();
    const [templates, setTemplates] = useState([]);
    const [formData, setFormData] = useState({
        sender: '',
        cc: '',
        sub: '',
        attachments: '',
        organisationId: orgid,
        templateId: ''
    });
    const [uploadedData, setUploadedData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        // Fetch the templates from the server
        axios.get('http://localhost:8000/templates')
            .then(response => {
                setTemplates(response.data);
            })
            .catch(error => {
                console.error('Error fetching templates:', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileUpload = async (files) => {
        const formData = new FormData();
        for (const file of files) {
            formData.append('file', file);
        }

        try {
            const response = await axios.post('http://localhost:8000/upload-csv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data.filepath);
            setUploadedData(response.data.data);
            setFormData(prevFormData => ({
                ...prevFormData,
                attachments: response.data.filepath
            }));
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleRowSelect = (index) => {
        setSelectedRows(prevSelectedRows => {
            if (prevSelectedRows.includes(index)) {
                return prevSelectedRows.filter(rowIndex => rowIndex !== index);
            } else {
                return [...prevSelectedRows, index];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedEmails = selectedRows.map(rowIndex => uploadedData[rowIndex].email);
        const dataToSend = {
            ...formData,
            recipient: selectedEmails
        };
        try {
            const response = await axios.post('http://localhost:8000/send-emails', dataToSend, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            alert("email sent successfully");
            setUploadedData(response.data.jsonData);
            setSelectedRows([]);

        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const handleCancel = () => {
        navigate('/organisationdashboard');
    };

    const sampleData = [
        { Name: 'Pravesh Naik', email: 'recipient@example.com', contactno: 7894561230, status: '', message: '' }
    ];

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
                        <Link to="/templates">Templates</Link>
                        <Link to="/email">Email</Link>
                        <Link to="/logs">Logs</Link>
                    </div>
                </div>
                <div className="btn1">
                    <button className="btn2" onClick={() => { window.localStorage.setItem("isLoggedIn", false); navigate('/'); }}>Logout</button>
                </div>
            </div>
            <div className='divorg'>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-inline">
                        <label>&nbsp;&nbsp;Sender:
                            <input className='input1' type="email" name="sender" value={formData.sender} onChange={handleChange} />
                        </label>
                    </div>
                    <div className="form-group-inline">
                        <label>&nbsp;&nbsp;CC:
                            <input className='input1' type="email" name="cc" value={formData.cc} onChange={handleChange} />
                        </label>
                        <label>&nbsp;&nbsp;sub:
                            <input className='input1' type="text" name="sub" value={formData.sub} onChange={handleChange} />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>&nbsp;&nbsp;Template:
                            <select className='input1' name="templateId" value={formData.templateId} onChange={handleChange}>
                                <option value="">Select Template</option>
                                {templates.map((template) => (
                                    <option key={template._id} value={template._id}>{template.tname}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="form-group-inline">
                        <input className='input1' type="file" name="import-csv" onChange={(e) => handleFileUpload(e.target.files)} />
                        <CSVLink data={sampleData} filename={"sample.csv"} className="csv-button">
                            <button className='buttons' type="button">Download Sample CSV</button>
                        </CSVLink>
                        {/* <button type="submit" className='buttons'>Submit</button> */}
                    </div>
                
            
            <div className='tabdiv1'>
                <div className="table-container1">
                    <table>
                        <thead>
                            <tr>
                                <th><span className="cell"></span></th>
                                <th><span className="cell">Sr.No</span></th>
                                <th><span className="cell">Name</span></th>
                                <th><span className="cell">Email</span></th>
                                <th><span className="cell">Contactno</span></th>
                                <th><span className="cell">Status</span></th>
                                <th><span className="cell">Message</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {uploadedData.map((row, index) => (
                                <tr key={index}>
                                    <td>
                                        <span className="cell">
                                            <input
                                                type="checkbox"
                                                className="row-checkbox"
                                                checked={selectedRows.includes(index)}
                                                onChange={() => handleRowSelect(index)}
                                            />
                                        </span>
                                    </td>
                                    <td><span className="cell">{index + 1}</span></td>
                                    <td><span className="cell">{row.Name}</span></td>
                                    <td><span className="cell">{row.email}</span></td>
                                    <td><span className="cell">{row.contactno}</span></td>
                                    <td><span className="cell">{row.status}</span></td>
                                    <td><span className="cell">{row.message}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button type="submit" className="send-button">Send</button>
            </div>
            </form>
            </div>
        </div>
    );
}

export default Email;
