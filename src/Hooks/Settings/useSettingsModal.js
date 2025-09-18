import { useState, useEffect, useContext, useRef } from "react";
import { apiCall, uploadImageToS3, fetchArticlesByAuthor, fetchSingleArticle } from "../../Utils/api";
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom'

export const useSettingsModal = () => {
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Use a ref to track the initial render and prevent double-fetching in development mode
    const initialRenderArticles = useRef(true);

    const [whattab, setwhattab] = useState("created");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [createdArticles, setCreatedArticles] = useState([]);
    const [isCreatedLoading, setIsCreatedLoading] = useState(false);
    const [lastKnownArticleKey, setLastKnownArticleKey] = useState(null);
    const [hasMoreArticles, setHasMoreArticles] = useState(true);

    const [isUsernameUpdating, setIsUsernameUpdating] = useState(false);
    const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [showPasswordErrors, setShowPasswordErrors] = useState(false);
    const [isUsernameUpdated, setIsUsernameUpdated] = useState(false);
    const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
    const [usernameUpdateError, setUsernameUpdateError] = useState(null);
    const [passwordUpdateError, setPasswordUpdateError] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [isProfileImageUpdated, setIsProfileImageUpdated] = useState(false);
    const [profileImageUpdateError, setProfileImageUpdateError] = useState(null);

    useEffect(() => {
        if (user?.username) {
            setUsername(user.username);
        }
        if (user?.image) {
            setProfileImage(user.image);
        }
    }, [user]);

    useEffect(() => {
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
        if (confirmPassword.length > 0 && password !== confirmPassword) {
            errors.push("Passwords do not match.");
        }
        setPasswordErrors(errors);
    }, [password, confirmPassword]);

    useEffect(() => {
        if (whattab === "settings") {
            setIsUsernameUpdated(false);
            setIsPasswordUpdated(false);
            setIsProfileImageUpdated(false);
            setUsernameUpdateError(null);
            setPasswordUpdateError(null);
            setProfileImageUpdateError(null);
        }
    }, [whattab]);

    // Fetch initial articles when the tab is active
    useEffect(() => {
        if (whattab === "created" && user?.userId) {
            if (initialRenderArticles.current) {
                initialRenderArticles.current = false;
                fetchUserArticles(null);
            }
        }
    }, [whattab, user]);

    const fetchUserArticles = async (startKey) => {
        if (!user?.userId || isCreatedLoading) return;
        setIsCreatedLoading(true);
        try {
            const response = await fetchArticlesByAuthor(user.userId, startKey);
            
            if (!response || !response.articles) {
                console.error("API response for articles is malformed or empty:", response);
                setHasMoreArticles(false);
                return;
            }

            const existingArticleIds = new Set(createdArticles.map(article => article.article_id));
            const uniqueNewArticles = response.articles.filter(
                article => !existingArticleIds.has(article.article_id)
            );
            
            setCreatedArticles(prevArticles => [...prevArticles, ...uniqueNewArticles]);
            setLastKnownArticleKey(response.last_evaluated_key);
            setHasMoreArticles(!!response.last_evaluated_key);
            
        } catch (error) {
            console.error("Failed to fetch created articles:", error);
            setHasMoreArticles(false);
        } finally {
            setIsCreatedLoading(false);
        }
    };
    
    const handleLoadMoreArticles = () => {
        fetchUserArticles(lastKnownArticleKey);
    };

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(null, args);
            }, delay);
        };
    };

    const checkUsernameAvailability = async (currentUsername) => {
        if (currentUsername === "") {
            return
        }

        try {
            const response = await apiCall(`/account/checkusername/${currentUsername}`, "GET");
            if (response.is_available) {
                console.log("Username is available! ✅");
                setUsernameUpdateError(null)
            } else {
                console.log("Username is not available. 🚫");
                setUsernameUpdateError("Username not available")
            }
        } catch (error) {
            console.error("An error occurred while checking username:", error);
            console.log("Could not check username. Please try again later.");
        }
    };

    const debounceUsernameUpdate = debounce(checkUsernameAvailability, 500);

    const handleUsernameChangeCheck = async (data) => {
        debounceUsernameUpdate(data);
    };

    const handleUsernameUpdate = async () => {
        if (!user?.userId) {
            setUsernameUpdateError("User not authenticated.");
            return;
        }

        if (username.trim() === "") {
            setUsernameUpdateError("Username cannot be empty.");
            return;
        }

        setIsUsernameUpdating(true);
        setUsernameUpdateError(null);
        setIsUsernameUpdated(false);

        try {
            const response = await apiCall("/account", "PUT", {
                userId: user.userId,
                username: username,
            });

            if (response.email !== "") {
                console.log("Username updated successfully.");
                setIsUsernameUpdated(true);
                setTimeout(() => setIsUsernameUpdated(false), 3000);

                const updatedUser = { ...user, username: username };

                login(updatedUser);

            } else {
                setUsernameUpdateError(response.error || response.message || "Failed to update username.");
                console.error(`Error updating username: ${response.error || response.message}`);
            }
        } catch (error) {
            setUsernameUpdateError("Failed to update username.");
            console.error("Failed to update username:", error);
        } finally {
            setIsUsernameUpdating(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (passwordErrors.length > 0 || password.length === 0 || password !== confirmPassword) {
            setPasswordUpdateError("Password validation failed. Please check the requirements.");
            console.error("Password validation failed.");
            return;
        }

        if (!user?.userId) {
            setPasswordUpdateError("User not authenticated.");
            return;
        }

        setIsPasswordUpdating(true);
        setPasswordUpdateError(null);
        setIsPasswordUpdated(false);

        try {
            const response = await apiCall("/account", "PUT", {
                userId: user.userId,
                password: password,
            });

            if (response.email !== "") {
                console.log("Password changed successfully.");
                setIsPasswordUpdated(true);
                setTimeout(() => {
                    setPassword("");
                    setConfirmPassword("");
                    setIsPasswordUpdated(false);
                    setShowPasswordErrors(false);
                }, 3000);
            } else {
                setPasswordUpdateError(response.error || response.message || "Failed to change password.");
                console.error(`Error changing password: ${response.error || response.message}`);
            }
        } catch (error) {
            setPasswordUpdateError("Failed to change password.");
            console.error("Failed to change password:", error);
        } finally {
            setIsPasswordUpdating(false);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsImageUploading(true);
        setProfileImageUpdateError(null);
        setIsProfileImageUpdated(false);

        try {
            const localImageUrl = URL.createObjectURL(file);
            setProfileImage(localImageUrl);

            const imageUrl = await uploadImageToS3(file);
            if (!imageUrl) {
                throw new Error("Image upload failed. Please try again.");
            }

            const response = await apiCall("/account", "PUT", {
                userId: user.userId,
                image: imageUrl
            });

            const updateduser = { ...user, image: response.data.image }
            login(updateduser)

            if (response.email !== "") {
                setIsProfileImageUpdated(true);
                setTimeout(() => setIsProfileImageUpdated(false), 3000);
            } else {
                setProfileImageUpdateError(response.error || response.message || "Failed to update profile image.");
            }
        } catch (error) {
            setProfileImageUpdateError(error.message || "An unexpected error occurred during image upload.");
            console.error("Error updating profile image:", error);
        } finally {
            setIsImageUploading(false);
        }
    };

    const whatTabOpen = (value) => {
        setwhattab(value);
        if (value === 'created') {
            initialRenderArticles.current = true;
        }
    };

    const handleArticleClick = async (article) => {
        navigate(`/settings/${article.article_id}`)
    };

    return {
        whattab,
        whatTabOpen,
        username,
        setUsername,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        handleUsernameUpdate,
        handlePasswordUpdate,
        createdArticles,
        isCreatedLoading,
        handleArticleClick,
        isUsernameUpdating,
        isPasswordUpdating,
        passwordErrors,
        isUsernameUpdated,
        isPasswordUpdated,
        usernameUpdateError,
        passwordUpdateError,
        showPasswordErrors,
        setShowPasswordErrors,
        profileImage,
        handleImageUpload,
        isImageUploading,
        isProfileImageUpdated,
        profileImageUpdateError,
        handleUsernameChangeCheck,
        handleLoadMoreArticles,
        hasMoreArticles,
    };
};