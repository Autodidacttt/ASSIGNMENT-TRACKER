import React,{useState} from "react";

function Login({setLoggedIn}){

const [username,setUsername] = useState("");
const [password,setPassword] = useState("");

const handleLogin = (e)=>{

e.preventDefault();

if(username==="student" && password==="1234"){
setLoggedIn(true);
}else{
alert("Invalid Login");
}

};

return(

<div className="container">

<h1 className="title">Student Login</h1>

<form onSubmit={handleLogin}>

<div className="inputBox">

<input
type="text"
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>

</div>

<div className="inputBox">

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

</div>

<button className="loginBtn">
Login
</button>

</form>

</div>

);

}

export default Login;