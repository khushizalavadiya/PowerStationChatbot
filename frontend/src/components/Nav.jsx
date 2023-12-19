import React  from "react";
import { Link } from 'react-router-dom';
const Nav = () => {
  return (
    <div>
      <nav
        className="fade-in"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        {/* Left-aligned content
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div id='head' style={{ marginRight: '20px' }}><h2 style={{ fontSize: '30px', fontFamily: 'Kdam Thmor Pro, sans-serif', textAlign: 'center' }}>PowerAI</h2>
          
          </div>
        </div> */}
        {/* Right-aligned content */}
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0",
            listStyle: "none",
          }}
        >
          {/* ... (existing code) ... */}
          <li
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "10px",
            }}
          >
            <div id="head" style={{ marginRight: "20px" }}>
              <h2
                style={{
                  fontSize: "25px",
                  fontFamily: "Kdam Thmor Pro, sans-serif",
                  textAlign: "center",
                }}
              >
                PowerAI
              </h2>
            </div>
          </li>
          {/* ... (existing code) ... */}
        </ul>

        {/* Right-aligned content */}
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0",
            listStyle: "none",
          }}
        >
          {/* Profile image and username */}

          <li
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "10px",
            }}
          >
            <img
              src={profilePic || defaultProfileImage}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                marginRight: "5px",
                marginTop: "5px",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="profile-image"
            />
            <Link to="/settings" className="profileLink">
              {user}
            </Link>
          </li>

          {/* Required links based on user's access */}
          {loggedIn ? (
            <>
              
              {accesstype === "loc" && (
                <>
                  <li>
                    <Link to="/employees">Employees</Link>
                  </li>
                  <li>
                    <Link to="/addEmp">Configure</Link>
                  </li>
                  <li>
                    <Link to="/pdfUpload">Manual</Link>
                  </li>
                  <li>
                    <Link to="">Testing</Link>
                  </li>
                </>
              )}
              {accesstype === "gov" && (
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
                  <li>
                    <Link to="">Testing</Link>
                  </li>
                </>
              )}
              <li>
                <Link onClick={logoutfunction} to="/login">
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <></>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
