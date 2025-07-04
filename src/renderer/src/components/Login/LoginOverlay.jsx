import { useState } from "react";
import { API_BASE_URL } from "../../apiConfig";

export default function LoginOverlay({ onClose, setToken, setTokenTime }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);

    
    async function handleLogin(e) {
        e.preventDefault();

        const res = await fetch(`${API_BASE_URL}/v1/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            setError("Login failed");
            return;
        }

        const data = await res.json();
        setToken(data.token);
        setTokenTime(Date.now());
        localStorage.setItem("refreshToken", data.refreshToken);
        window.dispatchEvent(new Event("login-success"));
        onClose();
    }

    async function handleCreateAccount(e) {
        e.preventDefault();

        if (password !== passwordConfirmation) {
            setError("Passwords do not match");
            return;
        }

        const res = await fetch(`${API_BASE_URL}/v1/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
            body: JSON.stringify({
                username,
                email,
                password,
                passwordConfirm: passwordConfirmation,
            }),
        });

        if (!res.ok) {
            const errData = await res.json();
            setError(errData.message || "Account creation failed");
            return;
        }

        const data = await res.json();
        setToken(data.token);
        setTokenTime(Date.now());
        localStorage.setItem("refreshToken", data.refreshToken);
        window.dispatchEvent(new Event("login-success"));
        onClose();
    }

    return (
        <div className="fixed inset-0 z-100 backdrop-blur-xs bg-[var(--background_color3)]/10 flex items-center justify-center">
            {isCreatingAccount ? (
                <div className="p-8 bg-[var(--background_color1)] rounded-xl">
                    <h3 className="text-xl text-[var(--text_color1)] font-semibold text-center mb-3">Create account</h3>
                    <form
                        onSubmit={handleCreateAccount}
                        className="bg-[var(--background_color3)] p-6 rounded-xl shadow-lg w-80 flex flex-col gap-4"
                    >
                        <input
                            className="border px-3 py-2 rounded outline-none focus:ring-2 ring-blue-400"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <input
                            className="border px-3 py-2 rounded outline-none focus:ring-2 ring-blue-400"
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            className="border px-3 py-2 rounded outline-none focus:ring-2 ring-blue-400"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <input
                            className="border px-3 py-2 rounded outline-none focus:ring-2 ring-blue-400"
                            placeholder="Confirm Password"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="w-full font-bold text-center px-4 py-2 rounded text-[var(--text_color1)] hover:text-[var(--hover_text_color1)] bg-[var(--danger_color)] hover:bg-[var(--hover_danger_color)]"
                        >
                            Create
                        </button>

                        <button
                            type="button"
                            className="w-full font-bold text-center px-4 py-2 text-[var(--background_color2)] rounded hover:text-[var(--hover_background_color2)] bg-[var(--background_color4)] hover:bg-[var(--hover_background_color4)] hover:underline text-center"
                            onClick={() => setIsCreatingAccount(false)}
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            className="w-full font-bold text-center px-4 py-2 text-[var(--danger_color)] rounded hover:text-[var(--hover_danger_color)] bg-[var(--background_color4)] hover:bg-[var(--hover_background_color4)] hover:underline text-center"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                    </form>
                </div>
            ) : (
                <div className="p-8 bg-[var(--background_color1)] rounded-xl">
                    <h3 className="text-xl text-[var(--text_color1)] font-semibold text-center mb-3">Login</h3>
                    <form
                        onSubmit={handleLogin}
                        className="bg-[var(--background_color3)] p-6 rounded-xl shadow-lg w-80 flex flex-col gap-4"
                    >
                        <input
                            className="border px-3 py-2 rounded outline-none focus:ring-2 ring-blue-400"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <input
                            className="border px-3 py-2 rounded outline-none focus:ring-2 ring-blue-400"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="w-full font-bold text-center px-4 py-2 rounded text-[var(--text_color1)] hover:text-[var(--hover_text_color1)] bg-[var(--danger_color)] hover:bg-[var(--hover_danger_color)]"
                        >
                        Login
                        </button>

                        <button
                            type="button"
                            className="w-full font-bold text-center px-4 py-2 text-[var(--background_color2)] rounded hover:text-[var(--hover_background_color2)] bg-[var(--background_color4)] hover:bg-[var(--hover_background_color4)] hover:underline text-center"
                            onClick={() => setIsCreatingAccount(true)}
                        >
                        Create Account
                        </button>

                        <button
                            type="button"
                            className="w-full font-bold text-center px-4 py-2 text-[var(--danger_color)] rounded hover:text-[var(--hover_danger_color)] bg-[var(--background_color4)] hover:bg-[var(--hover_background_color4)] hover:underline text-center"
                            onClick={onClose}
                        >
                        Cancel
                        </button>

                        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                    </form>
                </div>
            )}
        </div>
    );
}
