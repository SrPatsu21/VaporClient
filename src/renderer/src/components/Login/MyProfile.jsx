import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { secureFetch } from "../../apiConfig";

export default function MyProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [passwordMode, setPasswordMode] = useState(false);
    const [formData, setFormData] = useState({ username: "", email: "" });
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        newPasswordConfirm: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await secureFetch("/v1/user/me", {
                    method: "GET",
                    headers: { Accept: "application/json" },
                });

                if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
                const data = await response.json();
                setUser(data);
                setFormData({ username: data.username, email: data.email });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            const response = await secureFetch(`/v1/user/${user._id}`, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to update profile");

            const updatedUser = await response.json();
            setUser(updatedUser);
            setEditMode(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleChangePassword = async () => {
        try {
            const response = await secureFetch(`/v1/user/changepassword/${user._id}`, {
                method: "PATCH",
                headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(passwordData),
            });

            if (!response.ok) throw new Error("Password change failed");

            alert("Password updated successfully!");
            setPasswordMode(false);
            setPasswordData({
                oldPassword: "",
                newPassword: "",
                newPasswordConfirm: ""
            });
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSoftDelete = async () => {
        if (!confirm("Are you sure you want to delete your account?")) return;

        try {
            const response = await secureFetch(`/v1/user/softdelete/${user._id}`, {
                method: "PATCH",
                headers: { Accept: "application/json" },
            });

            if (!response.ok) throw new Error("Account deletion failed");

            alert("Account marked as deleted.");
            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
        if (!editMode) setPasswordMode(false);
    };

    const togglePasswordMode = () => {
        setPasswordMode(!passwordMode);
        if (!passwordMode) setEditMode(false);
    };

    if (loading) return <div style={{ color: 'var(--text_color1)' }}>Loading...</div>;
    if (error) return <div style={{ color: 'var(--danger_color)' }}>Error: {error}</div>;

    return (
        <div className="p-8 m-12 bg-[var(--background_color3)] text-[var(--text_color2)] rounded-xl shadow-xl">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>

            <div className="p-6 rounded-xl mb-6" style={{ backgroundColor: 'var(--background_color4)' }}>
                {Object.entries(user).map(([key, value]) => (
                    <p key={key}>
                        <strong>{key}:</strong> {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
                    </p>
                ))}
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
                <Link to={`/manageproducts/${user._id}`}
                    className="bg-[var(--background_color1)] text-[var(--text_color1)] px-4 py-2 rounded-lg hover:bg-[var(--hover_background_color1)] transition-colors"
                >
                    Manage Products
                </Link>

                <button
                    onClick={toggleEditMode}
                    className="bg-[var(--background_color1)] text-[var(--text_color1)] px-4 py-2 rounded-lg hover:bg-[var(--hover_background_color1)] transition-colors"
                >
                    {editMode ? "Cancel Edit" : "Edit Profile"}
                </button>

                <button
                    onClick={togglePasswordMode}
                    className="bg-[var(--warning_color)] text-[var(--text_color2)] px-4 py-2 rounded-lg hover:bg-[var(--hover_warning_color)] transition-colors"
                >
                    {passwordMode ? "Cancel Password" : "Change Password"}
                </button>

                <button
                    onClick={handleSoftDelete}
                    className="bg-[var(--danger_color)] text-[var(--text_color1)] px-4 py-2 rounded-lg hover:bg-[var(--hover_danger_color)] transition-colors"
                >
                    Delete Account
                </button>
            </div>

            {editMode && (
                <div className="space-y-3 p-6 rounded-xl mb-6" style={{ backgroundColor: 'var(--background_color4)' }}>
                    <h2 className="text-xl font-semibold mb-2">Edit Profile</h2>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="Username"
                        className="w-full p-2 rounded"
                        style={{ color: 'var(--text_color2)', backgroundColor: 'var(--background_color3)' }}
                    />
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Email"
                        className="w-full p-2 rounded"
                        style={{ color: 'var(--text_color2)', backgroundColor: 'var(--background_color3)' }}
                    />
                    <button
                        onClick={handleUpdateProfile}
                        style={{
                            backgroundColor: 'var(--background_color2)',
                            color: 'var(--text_color1)',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = 'var(--hover_background_color2)'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'var(--background_color2)'}
                    >
                        Save Changes
                    </button>
                </div>
            )}

            {passwordMode && (
                <div className="space-y-3 p-6 rounded-xl mb-6" style={{ backgroundColor: 'var(--background_color4)' }}>
                    <h2 className="text-xl font-semibold mb-2">Change Password</h2>
                    <input
                        type="password"
                        placeholder="Old Password"
                        value={passwordData.oldPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                        className="w-full p-2 rounded"
                        style={{ color: 'var(--text_color2)', backgroundColor: 'var(--background_color3)' }}
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full p-2 rounded"
                        style={{ color: 'var(--text_color2)', backgroundColor: 'var(--background_color3)' }}
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={passwordData.newPasswordConfirm}
                        onChange={(e) => setPasswordData({ ...passwordData, newPasswordConfirm: e.target.value })}
                        className="w-full p-2 rounded"
                        style={{ color: 'var(--text_color2)', backgroundColor: 'var(--background_color3)' }}
                    />
                    <button
                        onClick={handleChangePassword}
                        style={{
                            backgroundColor: 'var(--background_color2)',
                            color: 'var(--text_color1)',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = 'var(--hover_background_color2)'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'var(--background_color2)'}
                    >
                        Save Password
                    </button>
                </div>
            )}
        </div>
    );
}
