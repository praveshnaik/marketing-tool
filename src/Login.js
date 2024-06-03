import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './App.css';
import myimg from './img.png';

function    Login() {
    const history = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
 

    async function submit(e) {
        e.preventDefault();
    
        // Reset any previous errors

    
        // Basic email validation
       
        // Assuming axios call is for authentication
        try {
        //     await axios.post("http://localhost:8000/", { email, password })
        //         .then(res => {
        //             console.log(res.data.user);
        //                 if (res.data.auth ) {
        //                 window.localStorage.setItem("user",JSON.stringify(res.data.user));
        //                 window.localStorage.setItem("token",JSON.stringify(res.data.auth));
        //                 history("/adminhome");
        //             } else if (res.data === "notexist") {
        //                 alert("Enter the correct details");
        //             }
        //         })
        //         .catch(e => {
        //             alert("Wrong details");
        //             console.log(e);
        //         });
            let result = await axios({
                url:"http://localhost:8000/",
                method:"POST",
                data: JSON.stringify({email,password}),
                headers : {
                    'Content-Type': 'application/json'
                }
            });

            const userRole = result.data.user.roleId.role;
            const userorgid = result.data.user.organisationId._id
            console.log(userorgid);
             if(result.data.auth){

               window.localStorage.setItem("isLoggedIn", true);
               window.location.href = `/adminhome/${userRole}/${userorgid}`;
            } 
            else
            {
                alert("please enter correct details")
            }

        } 
        catch (error)
         {
            console.log(error);
        }
    }

    return (
        <div className="App">
            <img className="img1" src={myimg} alt="my image"/>
            <h3>Embrace Marketing for <br />the Digital Era!!</h3>
            <div className="auth-form-container" >
                <h1>Login</h1>
                <form className="login-form" onSubmit={submit} >
                <input
  className={`input ${email.length > 0 && email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? "valid" : "invalid"}`}
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Email"
  required
/>
{email.length > 0 && !email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) && (
  <span className="error">Enter a valid email address</span>
)}

<input
  className={`input ${password.length > 0 && password.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) ? "valid" : "invalid"}`}
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Password"
  required
/>
{password.length > 0 && !password.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) && (
  <span className="error">Enter correct Password</span>
)}

                    <button className="button1" type="submit">Login</button>
                </form>
                <br />
            </div>
        </div>
    );
}

export default Login;
