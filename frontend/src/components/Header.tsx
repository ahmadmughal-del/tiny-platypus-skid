import React from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-2xl font-bold">My App</h1>
      <div className="flex items-center">
        <Link to="/metrics" className="mr-4 text-white hover:underline">
          Metrics
        </Link>
        {isAuthenticated && (
          <Button onClick={handleLogout} variant="ghost">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;