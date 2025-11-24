import React from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSignIn = async (credentialResponse: any) => {
    try {
      const { data } = await axios.post(
        "/auth/google/login",
        {
          token: credentialResponse.credential,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      login(data.access_token);
      navigate("/workspace");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-2xl text-center space-y-8 flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          Amplify Your Unique Thinking.
        </h1>
        <p className="text-lg md:text-xl text-gray-300">
          Counter the quiet anxiety of AI reliance. Forge your conviction,
          hone your mind, and become irreplaceable.
        </p>
        <GoogleLogin
          onSuccess={handleGoogleSignIn}
          onError={() => {
            console.log("Login Failed");
          }}
        />
        <p className="text-sm text-gray-400 mt-4">
          No credit card required. Start your journey to intellectual independence.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;