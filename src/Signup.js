import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import './App.css'


function Signup() {
    const history=useNavigate();

    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [username, setUsername] = useState("");
    //const [userType, setuserType] = useState("");
    //const [secretKey, setSecretKey] = useState("");

    async function submit(e){
        /*if (userType == "Admin" && secretKey != "AdarshT"){
        e.preventDefault();
        alert("Invalid Admin");
        }
        else{*/
            e.preventDefault();

        try{

            await axios.post("http://localhost:8000/signup",{
                email,password,username
            })
            .then(res=>{
                if(res.data==="exist"){
                    alert("User already exists")
                }
                else if(res.data==="notexist"){
                    history("/")
                    alert("registered")
                }
            })
            .catch(e=>{
                alert("wrong details")
                console.log(e);
            })

        }
        catch(e){
            console.log(e);

        }

    // }
}


    return (
        <div className="auth-form-container">

            <h1>Signup</h1>

            {/* <form  className="register-form" action="POST">
                <label>Register as</label>
                <div className="radiobtn">
                <input style={{ margin:'10px' }} type="radio" name="UserType" value="User" onChange={(e) => setUserType(e.target.value)}/>User
                <input style={{ margin:'10px' }} type="radio" name="UserType" value="Admin" onChange={(e) => setUserType(e.target.value)} />Admin
                </div>
                {userType == "Admin" ? (
                    <>
                     <label>Secret Key</label>
                     <input type="text" className="form-control" placeholder="Secret Key" onChange={(e) => setSecretKey(e.target.value)}/>
                     </>
                    ) : null}
                    
                <label>Email</label>
                <input type="email" onChange={(e) => { setEmail(e.target.value) }} placeholder="Email" required />
                <label>Password</label>
                <input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" required />
                <button type="submit" onClick={submit}>submit</button>
            
            

            </form> */}
            <form  className="register-form" action="POST">
                <label>Register as</label>
                <label>Username</label>
                <input type="text" onChange={(e) => { setUsername(e.target.value) }} placeholder="username" required />
                    
                <label>Email</label>
                <input type="email" onChange={(e) => { setEmail(e.target.value) }} placeholder="Email" required />
                <label>Password</label>
                <input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" required />
                <button type="submit" onClick={submit}>submit</button>
            
            

            </form>

            <br />
            <p>OR</p>
            <br />

            {/* <Link to="/">Login Page</Link> */}

        </div>
    )
}

export default Signup