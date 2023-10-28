import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import { loginService, logoutService, verifyTokenRequest } from "../services/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);


  // clear errors after 5 seconds
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);


  const signin = async (data) => {
    const res = await loginService(data);
    if (res.status === 200){
      let token = res.data.data.token;
      Cookies.set("token",token);
      setIsAuthenticated(true);
    }else{
      const errorList = [res.data.message]
      setErrors(errorList);
    }
  };

  const logout = async() => {
    const res = await logoutService();
    if (res.status === 200){
      Cookies.remove("token");
      setIsAuthenticated(false);
    }else{
      const errorList = [res.data.message]
      setErrors(errorList);
    }
    
  };
 
  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      try {
        const res = await verifyTokenRequest(cookies.token);
        console.log(res);
        if (res.status === 200){
          setIsAuthenticated(true);
          setLoading(false);
        }else{
          setIsAuthenticated(false)
        }
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
      }
      
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signin,
        logout,
        isAuthenticated,
        loading,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;