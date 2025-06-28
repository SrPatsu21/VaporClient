import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
            const response = await secureFetch(`/v1/user/profile/${user._id}`, {
                method: "PATCH",
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

    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="p-8 m-12 text-[var(--text_color2)] bg-[var(--background_color3)] rounded-xl shadow-xl">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>

            <div className="bg-[var(--background_color4)] p-6 rounded-xl shadow space-y-2 mb-6">
                <p><strong>ID:</strong> {user._id}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Admin:</strong> {user.isAdmin ? "Yes" : "No"}</p>
                <p><strong>Deleted:</strong> {user.deleted ? "Yes" : "No"}</p>
                <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
                <p><strong>__v:</strong> {user.__v}</p>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
                <button
                    onClick={toggleEditMode}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {editMode ? "Cancel Edit" : "Edit Profile"}
                </button>
                <button
                    onClick={togglePasswordMode}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                    {passwordMode ? "Cancel Password" : "Change Password"}
                </button>
                <button
                    onClick={handleSoftDelete}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    Delete Account
                </button>
            </div>

            {editMode && (
                <div className="space-y-3 bg-[var(--background_color4)] p-6 rounded-xl mb-6">
                    <h2 className="text-xl font-semibold mb-2">Edit Profile</h2>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="Username"
                        className="w-full p-2 rounded text-black"
                    />
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Email"
                        className="w-full p-2 rounded text-black"
                    />
                    <button
                        onClick={handleUpdateProfile}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Save Changes
                    </button>
                </div>
            )}

            {passwordMode && (
                <div className="space-y-3 bg-[var(--background_color4)] p-6 rounded-xl mb-6">
                    <h2 className="text-xl font-semibold mb-2">Change Password</h2>
                    <input
                        type="password"
                        placeholder="Old Password"
                        value={passwordData.oldPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                        className="w-full p-2 rounded text-black"
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full p-2 rounded text-black"
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={passwordData.newPasswordConfirm}
                        onChange={(e) => setPasswordData({ ...passwordData, newPasswordConfirm: e.target.value })}
                        className="w-full p-2 rounded text-black"
                    />
                    <button
                        onClick={handleChangePassword}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Save Password
                    </button>
                </div>
            )}
        </div>
    );
}