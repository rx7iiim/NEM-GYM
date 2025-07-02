import { createContext, useContext, useEffect, useState } from "react";
import { EmailContextType } from "../models/email";

const EmailContext = createContext<EmailContextType>({
  email1: null,
  setEmail1: () => {},
  loading: true,
});

export const EmailProvider = ({ children }: { children: React.ReactNode }) => {
  const [email1, setEmail1State] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem('user_email');
    if (storedEmail) {
      setEmail1State(storedEmail);
    }
    setLoading(false);
  }, []);

  const setEmail1 = (email: string | null) => {
    setEmail1State(email);
    if (email) {
      localStorage.setItem('user_email', email);
    } else {
      localStorage.removeItem('user_email');
    }
  };

  return (
    <EmailContext.Provider value={{ email1, setEmail1, loading }}>
      {children}
    </EmailContext.Provider>
  );
};

// ✅ Add this line to make `useEmail` available for import
export const useEmail = () => useContext(EmailContext);
