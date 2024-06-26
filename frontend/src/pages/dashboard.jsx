import React from "react";
import { Button } from "../components/Button";

export const Dashboard = () => {

  const handleLogout = () => {
    window.open(`https://login-seven-pink.vercel.app/auth/logout`, "_self");
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
