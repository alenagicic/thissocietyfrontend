import React, { useEffect, useRef } from "react";
import useAuthModal from "../Hooks/Auth/useAuthModal";

export default function AuthPage() {
    const modalRef = useRef(null);
    const emailInputRef = useRef(null);

    const {
        isSigningUp,
        setIsSigningUp,
        email,
        setEmail,
        password,
        setPassword,
        passwordRepeat,
        setPasswordRepeat,
        handleSignIn,
        handleSignUp,
        isLoading,
        passwordErrors,
        showPasswordErrors,
    } = useAuthModal();

    useEffect(() => {
        if (emailInputRef.current) {
            emailInputRef.current.focus();
        }
    }, []);

    const isRegisterDisabled = isLoading || passwordErrors.length > 0 || password !== passwordRepeat || password.length === 0;

    return (
        <div className="wrapper-login pages-wrapper" ref={modalRef} onClick={(e) => e.stopPropagation()}>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-content">
                        <div className="spinner"></div>
                        <p className="loading-text">Loading..</p>
                    </div>
                </div>
            )}

            <h3><i className="bi bi-person-circle"></i>{isSigningUp ? "Register Account" : "Sign In"}</h3>

            <div>
                <label>Email</label>
                <input
                    ref={emailInputRef}
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                />
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                />
                {isSigningUp && (
                    <>
                        {showPasswordErrors && passwordErrors.length > 0 && (
                            <ul className="password-errors-list">
                                {passwordErrors.map((error, index) => (
                                    <li key={index} className="text-danger small">{error}</li>
                                ))}
                            </ul>
                        )}
                        <label>Password Repeat</label>
                        <input
                            type="password"
                            value={passwordRepeat}
                            onChange={(e) => setPasswordRepeat(e.target.value)}
                            placeholder="Repeat Password"
                        />
                        {showPasswordErrors && passwordRepeat.length > 0 && password !== passwordRepeat && (
                            <ul className="password-errors-list">
                                <li className="text-danger small">Passwords do not match.</li>
                            </ul>
                        )}
                    </>
                )}
            </div>

            <div className="wrapper-account-btn">
                {!isSigningUp ? (
                    <>
                        <button onClick={handleSignIn} disabled={isLoading}>Sign In</button>
                        <span className="wrapper-no-account">
                            <span>No Account?&nbsp;</span>
                            <span
                                className="create-an-account"
                                onClick={() => {
                                    setIsSigningUp(true);
                                    if (modalRef.current) {
                                        modalRef.current.scrollTo({ top: 0, behavior: "smooth" });
                                    }
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                Create account
                            </span>
                        </span>
                    </>
                ) : (
                    <>
                        <button onClick={handleSignUp} disabled={isRegisterDisabled}>Register</button>
                        <span
                            className="create-an-account back-button-link"
                            onClick={() => {
                                setIsSigningUp(false);
                                if (modalRef.current) {
                                    modalRef.current.scrollTo({ top: 0, behavior: "smooth" });
                                }
                            }}
                        >
                            Go Back
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}