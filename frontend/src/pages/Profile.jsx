import React from 'react';
import Header from '../components/Header.jsx';

const Profile = () => {
    return (
        <div>
            <Header />
            <div className="profile-container">
                <h1>Profile Page</h1>
                <p>Welcome to your profile!</p>
            </div>
        </div>
    );
};

export default Profile;