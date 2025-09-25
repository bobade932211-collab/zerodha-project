import React from "react";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import SellActionWindow from "./SellActionWindow";
import GeneralContext,{ GeneralContextProvider } from "./GeneralContext";


const Dashboard = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const generalContext = useContext(GeneralContext);
  const { isSellWindowOpen, selectedStockUID } = generalContext || {};
  useEffect(() => {
    const verifyCookie = async () => {
      // Check if a token exists before attempting to verify it
      if (cookies.token) {
        try {
          // Changed to GET for better practice with cookie verification
          const { data } = await axios.get(
            "http://localhost:3002/verify-user",
            { withCredentials: true }
          );
          const { status, user } = data;
          if (status) {
            setUsername(user);
            toast(`Hello ${user}`, { position: "top-right" });
          } else {
            // If backend says token is invalid, log out
            removeCookie("token");
            navigate("/login");
          }
        } catch (error) {
          console.error("Cookie verification failed:", error);
          // If network error, assume token is invalid and log out
          removeCookie("token");
          navigate("/login");
        }
      } else {
        toast(`Hello`, { position: "top-right" });
      }
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const Logout = () => {
    removeCookie("token");
    navigate("/signup");
  };

  
  return (
     <GeneralContextProvider>
    <div className="dashboard-container">
      
      <div className="content">
        <Routes>
          <Route exact path="/summary" element={<Summary />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/holdings" element={<Holdings />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/apps" element={<Apps />} />
        </Routes>
        
      </div>
     
        <WatchList />
      
      {isSellWindowOpen && <SellActionWindow uid={selectedStockUID} />}
      <ToastContainer/>
    </div>
    </GeneralContextProvider>
  );
};

export default Dashboard;
