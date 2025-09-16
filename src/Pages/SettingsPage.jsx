import React, { memo } from 'react';
import image from '../Images/vite.svg'
import { useSettingsModal } from "../Hooks/Settings/useSettingsModal";
import { Outlet } from 'react-router-dom'

const SettingsPage = memo(() => {

    const {
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
        hasMoreArticles
    } = useSettingsModal();

    return (
        <div className="pages-wrapper">

            <h3 style={{paddingLeft: '0.2rem'}}>
                <i className='bi bi-gear'></i> Account
            </h3>
            
            <div className="wrapper-create">
                <div className="tab-menu">
                    <div className="tab-header">
                        <button onClick={() => whatTabOpen("created")} className={`tab-button ${whattab === "created" ? "active" : ""}`}>Created</button>
                        <button onClick={() => whatTabOpen("settings")} className={`tab-button ${whattab === "settings" ? "active" : ""}`}>Account Settings</button>
                    </div>
                    <div className="tab-content">
                        <div className={`tab-pane ${whattab === "settings" ? "active" : ""}`} id="account-settings">
                            <div className="form-section">
                                <h5>Profile Image</h5>
                                <div className="profile-image-section">
                                    <div className="image-preview-container">
                                        <img
                                            src={profileImage || image}
                                            alt="Profile Preview"
                                            className="profile-image-preview"
                                        />
                                    </div>
                                    <input
                                        type="file"
                                        id="profile-image-upload"
                                        className="d-none"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        hidden
                                    />
                                    <label htmlFor="profile-image-upload" className="btn btn-secondary mt-2">
                                            {isImageUploading ? "Uploading..." : "Select New Image"}
                                    </label>
                                    {isProfileImageUpdated && !isImageUploading && <span className="bi bi-check-circle-fill text-success ms-2"></span>}
                                    {profileImageUpdateError && !isImageUploading && <span className="bi bi-exclamation-circle-fill text-danger ms-2"></span>}
                                </div>
                                {profileImageUpdateError && (
                                    <p className="text-danger mt-1 small">{profileImageUpdateError}</p>
                                )}
                            </div>
                            <hr />
                            <div className="form-section">
                                <h5>Set Username</h5>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            handleUsernameChangeCheck(e.target.value)
                                        }}
                                        placeholder="Enter new username"
                                        className="form-control"
                                        autoComplete="username-off-autofill"
                                    />
                                    <button
                                        onClick={handleUsernameUpdate}
                                        className="btn btn-primary"
                                        disabled={isUsernameUpdating}
                                    >
                                        {isUsernameUpdating ? "Updating..." : "Update Username"}
                                        {isUsernameUpdated && !isUsernameUpdating && <span className="bi bi-check-circle-fill text-success ms-2"></span>}
                                    </button>
                                </div>
                                {usernameUpdateError && (
                                    <p className="text-danger error-username mt-1 small">{usernameUpdateError}</p>
                                )}
                            </div>
                            <hr />
                            <div className="form-section">
                                <h5>Change Password</h5>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setShowPasswordErrors(true);
                                    }}
                                    placeholder="New Password"
                                    className="form-control"
                                    autoComplete="new-password"
                                />
                                {showPasswordErrors && passwordErrors.length > 0 && (
                                    <ul className="password-errors-list">
                                        {passwordErrors.map((error, index) => (
                                            <li key={index} className="text-danger small">{error}</li>
                                        ))}
                                    </ul>
                                )}
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setShowPasswordErrors(true);
                                    }}
                                    placeholder="Confirm New Password"
                                    className="form-control mt-2"
                                    autoComplete="new-password"
                                />
                                <button
                                    onClick={handlePasswordUpdate}
                                    className="btn btn-primary mt-2"
                                    disabled={isPasswordUpdating || passwordErrors.length > 0 || password.length === 0 || password !== confirmPassword}
                                >
                                    {isPasswordUpdating ? "Changing..." : "Change Password"}
                                    {isPasswordUpdated && !isPasswordUpdating && <span className="bi bi-check-circle-fill text-success ms-2"></span>}
                                    {passwordUpdateError && !isPasswordUpdating && <span className="bi bi-exclamation-circle-fill text-danger ms-2"></span>}
                                </button>
                                {passwordUpdateError && (
                                    <p className="text-danger mt-1 small">{passwordUpdateError}</p>
                                )}
                            </div>
                        </div>
                        <div className={`tab-pane ${whattab === "created" ? "active" : ""}`} id="created">
                            {isCreatedLoading && createdArticles.length === 0 ? (
                                <div className='spinner'></div>                
                            ) : createdArticles.length > 0 ? (
                                <>
                                    <ul className="notification-list">
                                        {createdArticles.map((article) => (
                                            <li
                                                key={article.article_id}
                                                className="notification-item"
                                                onClick={() => handleArticleClick(article)}
                                            >
                                                <span className="notification-message">{article.heading}</span>
                                                <span className="notification-timestamp">{new Date(article.created_at).toLocaleDateString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {hasMoreArticles && (
                                        <div className="text-center mt-3">
                                            <button
                                                onClick={handleLoadMoreArticles}
                                                className="btn btn-secondary load-more-btn"
                                                disabled={isCreatedLoading}
                                            >
                                                {isCreatedLoading ? "Loading..." : "Load More"}
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="no-content">No created articles found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <Outlet />

        </div>
    );
});

export default SettingsPage;