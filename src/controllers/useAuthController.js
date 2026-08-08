import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export const useAuthController = () => {
  const { signIn, signUp } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('123456');
  const [name, setName] = useState('Nguyen Van Duc');
  const [phone, setPhone] = useState('0788551709');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      if (isRegisterMode) {
        if (!name || !phone || !email || !password) {
          Alert.alert("Error", "Please fill in all fields to create an account.");
          return;
        }
        await signUp(name, phone, email, password);
      } else {
        if (!email || !password) {
          Alert.alert("Error", "Please enter your email and password.");
          return;
        }
        await signIn(email, password);
      }
    } catch (error) {
      Alert.alert("Authentication Failed", error?.message || "Unable to sign in. Please try again.");
    }
  };

  return {
    isRegisterMode,
    setIsRegisterMode,
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    phone,
    setPhone,
    showPassword,
    setShowPassword,
    handleSubmit
  };
};
