


// async function handleLogin(e){
//   e.preventDefault();

//   try {
//     const result = await axios.post("http://localhost:3001", {
//       username,
//       password
//     });

//     localStorage.setItem("token", result.data.token);

//     setMessage("Login Successful!");
//   }
//   catch (error){
//     setMessage(error.response?.data || "Login Failed");
//   }
// }

// function login() {
//   const [message, setMessage] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");


//   function handleSubmit () {
//     setMessage("Your username is: " + username + "your password is: " + password);
//   }

//   return (
//     <div>
//       <input type = "text" onChange = {(e) => setUsername(e.target.value)}/>
//       <br/>
//       <input type = "password" onChange = {(e) => setPassword(e.target.value)}/>
//       <br/>
//       <button disabled = {!username || !password} onClick = {handleSubmit}>Submit</button>
//     </div>
//   );
// }