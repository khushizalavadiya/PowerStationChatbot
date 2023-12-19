// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import ChatPage from './ChatPage';
import EmployeeList from './EmployeeList';
import AdminList from './AdminList';
import UnauthorizedPage from './UnauthorizedPage';
import axios from 'axios';
// import  jwt  from 'jsonwebtoken';
import { useNavigate } from 'react-router-dom';
import AddEmployeeForm from './AddEmployeeForm';
import PDFupload from './PDFupload';
import PrivateRoute from './PrivateRoute';
import AddAdminForm from './AddAdminForm';
import ForgotPassword from './ForgotPassword';
import defaultProfileImage from './assets/defaultProfileImage.png';
import SettingsPage from './SettingsPage';
import TestGen from './TestGen';

import './styles.css';
import ShowTests from './ShowTests';
import TestPage from './TestPage';
import CryptoJS from 'crypto-js';

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous"></link>
//import VideoPreloader from './VideoPreloader';

const LogoutPage = ({ setLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Perform any logout logic here
    // For simplicity, we'll just navigate back to the login page
    setLoggedIn(false);
    navigate('/login');
  }, [setLoggedIn, navigate]);

  return null;
};


const App = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const[user, setUsername] = useState( ((localStorage.getItem('token')) ? JSON.parse(atob((localStorage.getItem('token')).split('.')[1])) : 'no user'))

  const [accesstype, setAccesstype] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showtestgen, setshowtestgen] = useState(false);
  const [inTestMode, setInTestMode] = useState((localStorage.getItem('selectedTest')) ? true : false );
  const [showchat, setshowchat] = useState(true);
  const [tests, setTests] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [testSelected, setTestSelected] = useState((localStorage.getItem('selectedTest')) ? (localStorage.getItem('selectedTest')) : 'no test selected')

  const [timer, setTimer] = useState();

  const handleImageHover = (isHovered) => {
    setShowImage(isHovered);
  };
  const handleStartTest = () => {
    // Check if the Socket.IO server is running
    if (!socketConnected) {
      // Start the Socket.IO server
      startSocketServer();
    }

    // Add logic to start the test
    setInTestMode(true);
  };

  const handleEndTest = () => {
    // Add logic to end the test
    setInTestMode(false);
  };    
  useEffect(() => {
    const checkSessionStatus = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          setUsername(decodedToken.username);
          setAccesstype(decodedToken.accesstype);

          const response = await axios.get(`http://localhost:3001/profilePic/${decodedToken.username}`, {
            responseType: 'arraybuffer'
          });

          if (response.data && response.data.byteLength > 0) {
            const base64 = btoa(
              new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            );
            setProfilePic(`data:image/jpeg;base64,${base64}`);
          } else {
            setProfilePic(defaultProfileImage);
          }

          setLoggedIn(true);
        } catch (error) {
          console.error('Error decoding token or fetching profile picture:', error.message);
        }
      }
      
      setLoading(false);
    };

    checkSessionStatus();
  }, [loggedIn]);
  
  const resetProfilePic = () => {
    setProfilePic(null);
  };

  const logoutfunction = () => {
    // const user = localStorage.getItem('userId')
    const res = axios.get(`http://localhost:3001/logout/${user}`)
    // localStorage.removeItem('loggedIn');
    // localStorage.removeItem('accesstype');
    // localStorage.removeItem('userId');
    // localStorage.removeItem('forgotPasswordUsername')
    localStorage.removeItem('token');
    setLoggedIn(false);
    setUsername('');
    setAccesstype('');
    resetProfilePic(); // Call the function to reset the profile picture state

  }
  function handleshowtest() {
    setshowtestgen(true);
  }

  const fetchProfilePic = () => {
    console.log('fetching profile of : '+user);
    // Make a GET request to retrieve the profile picture
    axios.get(`http://localhost:3001/profilePic/${user}`, { responseType: 'arraybuffer' })
      .then((response) => {
  
        // Check if the response contains valid image data
        if (response.data && response.data.byteLength > 0) {
          // Convert the received ArrayBuffer to a base64-encoded string
          const base64 = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          );
          // Set the base64 string as the source for the profile picture
          setProfilePic(`data:image/jpeg;base64,${base64}`);
          
        } else {
          // If no valid profile picture is available, set the default image
          setProfilePic(defaultProfileImage);
        }
        
      })
      .catch((error) => {
        console.error('Error retrieving profile picture:', error.message);
        // If there's an error, set the default image
        setProfilePic(defaultProfileImage);
      });
  };
  useEffect(() => {
    const fetchTests = async () => {
      try {
        if (user !== '') {
          const res = await axios.get(`http://localhost:3001/gettests/${user}`);
          const encryptedTests = encrypt(JSON.stringify(res.data));
  
          // Save the encrypted tests to local storage
          localStorage.setItem('encryptedTests', encryptedTests);
  
          // Decrypt and set the tests state
          setTests(JSON.parse(decrypt(encryptedTests)));
        } else {
          console.log('No user');
        }
      } catch (error) {
        console.error('Error fetching tests:', error.message);
      }
    };

    fetchTests();
  }, [user]);

  const encrypt = (data) => {
    return CryptoJS.AES.encrypt(data, 'SIH2023').toString();
  };

  // const decrypt = (data) => {
  //   const bytes = CryptoJS.AES.decrypt(data, 'SIH2023');
  //   return bytes.toString(CryptoJS.enc.Utf8);
  // };
  
  const decrypt = (data) => {
    if (data && typeof data === 'string') {
      const bytes = CryptoJS.AES.decrypt(data, 'SIH2023');
      return bytes.toString(CryptoJS.enc.Utf8);
    } else {
      // Handle the case where data is null or not a string
      return ''; // Or any other appropriate handling, like throwing an error
    }
  };
  
  

  if (loading) {
    // Loading state, show a spinner or a loading message
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
       <i style={{fontSize:"20px"}}>Loading...</i> 
      </div>
    );
  }
    const handleAbort = () => {
      // Add logic to end the test and perform cleanup
      setInTestMode(false);
      setTestSelected('');
      // setshowchat(true); // Set any other relevant state variables to their initial state
  
      // Clear relevant data from local storage
      localStorage.removeItem('selectedTest');
      localStorage.removeItem('token')
      window.location.href = 'http://localhost:5173/login';
      // Logout and navigate to the login page
      logoutfunction();
    };
  
 
    return (    
      <>
      {/* <button onClick={handleAbort}>ABORT</button> */}
      {inTestMode ? (
          // Render test component here
          <>
            <TestPage encrypt={encrypt} timer={timer} setTimer={setTimer} decrypt={decrypt} setTestSelected={setTestSelected} testSelected={testSelected} tests={tests} user={user}  inTestMode={inTestMode} setInTestMode={setInTestMode}/>
          </>
        ) : (
          // Render regular Router component here
          <Router className="app-container"style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#007bff' }}>
             {/* <div id='head'><h2 style={{ fontSize:'40px' ,fontFamily: 'Kdam Thmor Pro, sans-serif', textAlign:'center'}}>PowerAI</h2></div> */}
          <nav className="app-container">
          <h2 style={{ fontSize: '40px', fontFamily: 'Kdam Thmor Pro, sans-serif', margin: '0' }}>
      PowerAI
    </h2>
          <ul className='nav-links' style={{ display: 'flex', alignItems: 'center', padding: '0', listStyle: 'none', justifyContent: 'flex-end' }}>
              {/* User profile image */}
             
              <div id='head' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    
    <button onClick={handleAbort} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
      ABORT
    </button>
  </div>
              {loggedIn ? (
                <li style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                  <img
                    src={profilePic || defaultProfileImage}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      marginRight: '5px',
                      marginTop:'5px'
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="profile-image"
                  />
                  <Link to="/settings" className='profileLink'>
                    {user}
                  </Link>
                </li>) : <></>}
                    
              
              {loggedIn ? (
                <>
                  {(accesstype === 'loc' || accesstype === 'emp') && showchat && (
                  <li>
                   {/* <Link to="/chat">Chat</Link> */}
                  </li>
                  )}
                  {accesstype === 'loc' && (
                    <>
                   
                   <li style={{ marginLeft: '2px' }}>
                      <Link to="/employees">Employees</Link>
                    </li>
                    <li>
                      <Link to="/addEmp">Configure</Link>
                    </li>
                    <li>
                      <Link to="/pdfUpload">Manual</Link>
                    </li>
                    </>
                  )}
                  {accesstype === 'gov' && (
                    <>
                    <li>
                      <Link to="/admins">Admins</Link>
                    </li>
                    <li>
                      <Link to="/addAdm">Configure</Link>
                    </li>
                    <li>
                      <Link to="/pdfUpload">Manual</Link>
                    </li>
                  </>
                  )}
                  {
                    accesstype === 'loc' && (
                      <>
                        <li>
                          <Link to='/testgen'>Test</Link>
                        </li>
                      </>
                    )
                  }
                  {
                    accesstype === 'emp' && (
                      <>
                       <li>
                        <Link to="/chat">Chat</Link>
                        </li>
                        <li>
                          <Link to='/showtests'>Test</Link>
                        </li>
                       
                      </>
                    )
                  }
                  <li>
                    <Link onClick={logoutfunction} to="/login">Logout</Link>
                  </li>
                
                </>
              ) : (
              <></> 
              )}
            </ul>
          </nav>
          {/* <button onClick={()=>setInTestMode(true)}>OPEN TEST</button> */}
          <Routes>
            <Route
              path='/testpage'
              element={<TestPage encrypt={encrypt}
              decrypt={decrypt} user={user}/>}
            />
            <Route
              path='/testgen'
              element={<TestGen user={user} />}
            />
            <Route
              path="/showtests"
              element={
                <ShowTests
                  testSelected={testSelected}
                  setTestSelected={setTestSelected}
                  tests={tests}
                  setTimer={setTimer}
                  setTests={setTests}
                  inTestMode={inTestMode}
                  setInTestMode={setInTestMode}
                  setshowchat={setshowchat}
                  user={user}
                  encrypt={encrypt}
                  decrypt={decrypt}
                />
              }
            />
            <Route
              path="/login"
              element={<LoginForm setLoggedIn={setLoggedIn} setAccesstype={setAccesstype} />}
            />
            <Route
              path="/chat"
              element={loggedIn && (accesstype === 'emp' || accesstype === 'loc') && showchat ? <ChatPage user={user}/> : <Navigate to="/unauthorized" />}
            />
            <Route
              path="/employees"
              element={loggedIn && accesstype === 'loc' ? <EmployeeList loggedInAdmin={user} /> : <Navigate to="/unauthorized" />}
            />
            <Route
              path="/admins"
              element={loggedIn && accesstype === 'gov' ? <AdminList loggedInGov={user} /> : <Navigate to="/unauthorized" />}
            />
            <Route
              path="/unauthorized" 
              element={ <UnauthorizedPage />}
            />
            <Route
              path="/addAdm"
              element={loggedIn && accesstype === 'gov' ? <AddAdminForm loggedInGov={user} /> : <Navigate to="/unauthorized" />}
            />
            <Route
              path="/addEmp"
              element={loggedIn && accesstype === 'loc' ? <AddEmployeeForm loggedInAdmin={user} /> : <Navigate to="/unauthorized" />}
            />
            <Route
              path="/settings"
              element={<SettingsPage user={user}/>}
            />
            <Route
              path="/pdfUpload"
              element={loggedIn ? <PDFupload /> : <Navigate to="/unauthorized" />}
            />
            <Route
              path='/forgotpassword'
              element={<ForgotPassword />}
            />
            <Route
              path="/logout"
              element={<LogoutPage setLoggedIn={setLoggedIn} />}
            />
            <Route
              path='/'
              element={loggedIn ? (<></>) : (<LoginForm setAccesstype={setAccesstype} setLoggedIn={setLoggedIn}/>)}
            /> 
          </Routes>
          {isHovered && (
            <div
            style={{
              position: 'fixed',
              zIndex: 2,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: 0,
              width: 'fit-content',
              height: 'fit-content',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius:'10px',
              background: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity for the desired blur effect
              backdropFilter: 'blur(5px)', // Add a slight blur effect
            }}
          >
            <img
              src={profilePic || defaultProfileImage}
              className='larger'
              alt="larger-profile"
              style={{ borderRadius: '10px', width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          
          )}
          </Router>
        )}
      </>     
    )
  };
  
  export default App;
  