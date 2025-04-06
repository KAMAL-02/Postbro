"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Eye, EyeOff, LogOut } from "lucide-react";

const AuthDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleMode = () => setIsLogin((prev) => !prev);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const checkLogin = async () => {
      try {
        await axios.get(`${BASE_URL}/me`, { withCredentials: true });
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  const handleAuth = async () => {
    const endpoint = isLogin ? `${BASE_URL}/login` : `${BASE_URL}/signup`;

    try {
      const { data } = await axios.post(
        endpoint,
        {
          ...(isLogin ? {} : { name }),
          email,
          password,
        },
        { withCredentials: true }
      );

      console.log("Success:", data);
      toast.success(data.message || "Success!");
      if (!isLogin) {
        toast.success("Account created! Please log in.");
        toggleMode();
        setPassword("");
      } else {
        setIsLoggedIn(true);
        setOpen(false);
      }
    } catch (error: any) {
      console.error("Error:", error.response?.data?.error || error.error);
      toast.error(error.response?.data?.error || "An error occurred");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      toast.success("Logged out successfully");
      setIsLoggedIn(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to logout");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isLoggedIn ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="p-2 rounded hover:bg-[#333] transition-colors cursor-pointer">
              <LogOut className="text-[#df894c]" size={20} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#1e1e1e] border border-[#333] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to logout?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#2a2a2a] text-white border border-[#444] hover:bg-[#2a2a2a] hover:text-white cursor-pointer">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-[#df894c] text-black hover:bg-[#e79d68] font-semibold cursor-pointer"
              >
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <DialogTrigger asChild>
          <Button className="text-sm bg-[#df894c] text-black hover:bg-[#df894c] cursor-pointer font-semibold">
            Login
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="bg-[#1e1e1e] border border-[#333] text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-center">
            {isLogin ? "Login to POSTBRO" : "Create a POSTBRO account"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {!isLogin && (
            <Input
              type="text"
              placeholder="Name"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#2a2a2a] text-white border border-[#444] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#2a2a2a] text-white border border-[#444] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#2a2a2a] text-white border border-[#444] pr-10 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute cursor-pointer inset-y-0 right-2 flex items-center text-gray-400 hover:text-white"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Button
            onClick={handleAuth}
            className="w-full text-sm bg-[#df894c] text-black hover:bg-[#df894c] cursor-pointer font-semibold"
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </div>

        <p className="text-sm text-gray-400 text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-[#df894c] hover:underline ml-1 cursor-pointer"
            onClick={toggleMode}
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
