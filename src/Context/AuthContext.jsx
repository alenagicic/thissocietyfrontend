import React, { useEffect } from 'react';
import {fetchAuthUser} from '../Utils/api'

export const AuthContext = React.createContext();

const apiKey = import.meta.env.VITE_API_KEY;

export default function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {

    const checkUserStatus = async () => {
      try {
        const res = await fetchAuthUser()

        if (!res.ok) { 
          let errorData = {};
          try {
            errorData = await res.json();
            console.error("API error response (not OK):", errorData);
          } catch (jsonParseError) {
            console.error("Non-OK response, but failed to parse JSON:", res);
            const rawText = await res.text();
            console.error("Raw response text on parse failure:", rawText);
            errorData = { message: `Server error: ${res.status} ${res.statusText}`, rawResponse: rawText };
          }
          throw errorData;
        }

        const data = await res.json(); 
        
        setUser(data.user);       
        
      } catch (error) {
        console.error("Fetch or processing error:", error);
        setUser(null);
      }
    };

    checkUserStatus();
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}