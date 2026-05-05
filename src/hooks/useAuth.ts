import { useState } from "react";
import supabase from "../lib/supabase";

export interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [claims, setClaims] = useState(null);
  const [authError, setAuthError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSignUp = async (event: React.SubmitEvent) => {
    event.preventDefault();
    setLoading(true);
   await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
        },
      },
    });
    
    setLoading(false);
    
    window.location.reload();
  };

  const handleLogin = async (event:React.SubmitEvent) => {
    event.preventDefault();
    setLoading(true);
    await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    window.location.reload();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setClaims(null);
    window.location.reload();
  };

  return {
    loading,
    claims,
    authError,
    setAuthError,
    formData,
    handleChange,
    handleLogin,
    handleLogout,
    handleSignUp,
  };
};
