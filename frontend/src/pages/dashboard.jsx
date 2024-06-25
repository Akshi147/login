import React from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/Button";

export const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <h1  className="mb-10">Welcome to the home page!</h1>
        <Button onClick={handleLogout} label={"Log Out"} />
      </div>
    </div>
  );
};
