// import logo from "./logo.svg";
// import "./sass/App.scss";
// import React, { useState, Suspense, lazy } from "react";
// import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import React, { useState } from "react";
import { Routes, Route, BrowserRouter, Router } from "react-router-dom";
import { Navigation, Footer, Login, Signup, Home, UserProfile } from "./webpages";

// import ProtectedRoutes from "./routes/ProtectedRoutes"; //Authenticated routes

function App() {
    // const [user, setUser] = useState("");

    const user = sessionStorage.getItem("isAuthenticate");

    const [isAuthenticated, setIsAuthenticated] = useState(user ? true : false);

    // if (user) {
    //     setIsAuthenticated(true);

    // }

    if (!isAuthenticated) {
        return (
            <BrowserRouter>
                <div className="App">
                    <div className="App__bgColor"></div>
                    {/* <Login /> */}
                    <Routes>
                        <Route path="/" element={<Login />} />
                        {/* <Route path="/" element={<Login />} /> */}
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </div>
            </BrowserRouter>
        );
    }

    return (
        <BrowserRouter>
            <div className="App">
                <div className="App__bgColor"></div>
                <header className="App-header">
                    <Navigation />
                </header>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<UserProfile />} />
                </Routes>
                <Footer />
            </div>
        </BrowserRouter>

        // ===================> NOT WORKING

        // const [isAuthenticated, setIsAuthenticated] = useState(false);
        // <BrowserRouter>
        //     <div className="App">
        //         <div className="App__bgColor"></div>
        //         {/* {isLoggedIn ? <button onClick={logOut}>Logout</button> : <button onClick={logIn}>Login</button>} */}
        //         <Routes>
        //             <Navigation />
        //             {/* <Route path="/" element={<Login />} /> */}
        //             {/* <Route
        //                 path="/Navigation"
        //                 element={
        //                     <ProtectedRoutes isAuthenticated={isAuthenticated}>
        //                         <Navigation />
        //                     </ProtectedRoutes>
        //                 }
        //             /> */}
        //             <Route
        //                 path="/Home"
        //                 element={
        //                     <ProtectedRoutes isAuthenticated={isAuthenticated}>
        //                         <Home />
        //                     </ProtectedRoutes>
        //                 }
        //             />
        //             <Route
        //                 path="/UserProfile"
        //                 element={
        //                     <ProtectedRoutes isAuthenticated={isAuthenticated}>
        //                         <UserProfile />
        //                     </ProtectedRoutes>
        //                 }
        //             />
        //             {/* <Route path="/" isAuthenticated={isAuthenticated} element={Login} />
        //         <Route path="/home" isAuthenticated={isAuthenticated} element={Home} /> */}
        //             {/* <PublicRoute path="/signup" isAuthenticated={isAuthenticated} component={Signup} exact={true} /> */}
        //             <Footer />
        //         </Routes>
        //     </div>
        // </BrowserRouter>
    );
}

export default App;
