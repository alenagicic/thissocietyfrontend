import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";
import { apiCall } from "../../Utils/api";

export const useAuthModal = () => {
    const [signup, setSignup] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [showPasswordErrors, setShowPasswordErrors] = useState(false);

    const { user, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (password.length === 0 && passwordRepeat.length === 0) {
            setPasswordErrors([]);
            return;
        }

        const errors = [];
        if (password.length > 0) {
            if (password.length < 8) {
                errors.push("Password must be at least 8 characters long.");
            }
            if (!/[A-Z]/.test(password)) {
                errors.push("Password must contain at least one uppercase letter.");
            }
            if (!/[0-9]/.test(password)) {
                errors.push("Password must contain at least one number.");
            }
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
                errors.push("Password must contain at least one special character.");
            }
        }
        
        if (isSigningUp && password !== passwordRepeat) {
            errors.push("Passwords do not match.");
        }
        
        setPasswordErrors(errors);
        setShowPasswordErrors(true);
    }, [password, passwordRepeat, isSigningUp]);


    const handleOpenAuthModal = () => setSignup(true);

    const handleCloseAuthModal = () => {
        setSignup(false);
        setIsSigningUp(false);
        setEmail("");
        setPassword("");
        setPasswordRepeat("");
        setPasswordErrors([]);
        setShowPasswordErrors(false);
        navigate('/');
    };

    const handleSignIn = async () => {
        setIsLoading(true);
        setPasswordErrors([]);
        try {
            const response = await apiCall("/account/signin", "POST", { email, password });
            if (response?.user) {
                login(response.user);
                handleCloseAuthModal();
            } else {
                 throw new Error(response.error || "Sign in failed.");
            }
        } catch (error) {
            console.error("Error signing in:", error.message || error);
            alert(error.message || "Sign in failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (passwordErrors.length > 0 || password.length === 0 || email.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiCall("/account/signup", "POST", { email, password });
            if (response?.userId) {
                login(response);
                handleCloseAuthModal();
            } else {
                 throw new Error(response.error || "Signup failed.");
            }
        } catch (error) {
            console.error("Error signing up:", error.message || error);
            alert(error.message || "Signup failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignout = async () => {
        setIsLoading(true);
        try {
            await apiCall("/account/signout", "POST");
            logout();
        } catch (error) {
            console.error("Error signing out:", error.message || error);
            alert(error.message || "Sign out failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        signup,
        isSigningUp,
        setIsSigningUp,
        email,
        setEmail,
        password,
        setPassword,
        passwordRepeat,
        setPasswordRepeat,
        handleOpenAuthModal,
        handleCloseAuthModal,
        handleSignIn,
        handleSignUp,
        handleSignout,
        user,
        isLoading,
        passwordErrors,
        showPasswordErrors,
    };
};

export default useAuthModal;