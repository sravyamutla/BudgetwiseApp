import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Camera } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        bio: 'Financial enthusiast and budget planner. Always looking for ways to optimize savings and investments.',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Your Profile</h1>
                <p>Manage your account settings and preferences.</p>
            </div>

            <div className="profile-content">
                <div className="profile-card profile-sidebar">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">
                            <User size={64} className="avatar-icon" />
                            <button className="avatar-upload-btn">
                                <Camera size={16} />
                            </button>
                        </div>
                    </div>
                    <h2 className="profile-name">{profileData.name}</h2>
                    <p className="profile-role">Pro Member</p>

                    <div className="profile-contact-info">
                        <div className="contact-item">
                            <Mail size={18} />
                            <span>{profileData.email}</span>
                        </div>
                        <div className="contact-item">
                            <Phone size={18} />
                            <span>{profileData.phone}</span>
                        </div>
                        <div className="contact-item">
                            <MapPin size={18} />
                            <span>{profileData.location}</span>
                        </div>
                    </div>
                </div>

                <div className="profile-card profile-details">
                    <div className="card-header">
                        <h3>Personal Information</h3>
                        <button
                            className={`edit-btn ${isEditing ? 'active' : ''}`}
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <Edit2 size={16} />
                            <span>{isEditing ? 'Save' : 'Edit'}</span>
                        </button>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={profileData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={!isEditing ? 'disabled-input' : ''}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={!isEditing ? 'disabled-input' : ''}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={!isEditing ? 'disabled-input' : ''}
                            />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={profileData.location}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={!isEditing ? 'disabled-input' : ''}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Bio</label>
                            <textarea
                                name="bio"
                                value={profileData.bio}
                                onChange={handleChange}
                                disabled={!isEditing}
                                rows="4"
                                className={!isEditing ? 'disabled-input' : ''}
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
