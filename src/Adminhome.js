import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import myimg from './img2.png';
import { useParams } from "react-router-dom";

function Adminhome() {
    const navigate = useNavigate();
    const { role, orgid } = useParams();
    console.log(orgid);

    const Logout = () => {
        window.localStorage.setItem("isLoggedIn", false);
        navigate('/');
    }

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <img className="navbar-brand img2" src={myimg} alt="my image" />
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to="" className="nav-link">Dashboard</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Masters
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    {role === 'Superadmin' && (
                                        <>
                                            <li><Link to="/organisationdashboard" className="dropdown-item">Organisation</Link></li>
                                            <li><Link to="/userdashboard" className="dropdown-item">User</Link></li>
                                            {/* <li><Link to={`/templates/${orgid}`} className="dropdown-item">Templates</Link></li> */}
                                        </>
                                    )}
                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Transaction
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><Link to={`/templatesdashboard/${orgid}`} className="dropdown-item">Templatesdashboard</Link></li>
                                    {/* <li><Link to="/emailtransc" className="dropdown-item">Emailtransc</Link></li> */}
                                    <li><Link to={`/email/${orgid}`} className="dropdown-item">Email</Link></li>
                                    <li><Link to="/logs" className="dropdown-item">Logs</Link></li>
                                </ul>
                            </li>
                        </ul>
                        <div className="btn1 ms-auto">
                            <button className="btn btn-danger" onClick={Logout}>Logout</button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Adminhome;
