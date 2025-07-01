export const BASE_URL = "https://vaporapi.onrender.com";
export const API_BASE_URL = BASE_URL + "/api";

let token = null;
let tokenTime = null;

export function setToken(newToken) {
    token = newToken;
    tokenTime = Date.now();
}

export function getTokenTime() {
    return tokenTime;
}

export function clearToken() {
    token = null;
    tokenTime = null;
    localStorage.removeItem("refreshToken");
}

function handleInvalidSession() {
    clearToken();
    window.dispatchEvent(new Event("open-login"));
}

export async function getToken() {
    const now = Date.now();
    const age = now - (tokenTime || 0);

    if (!token || age > 9 * 60 * 1000) {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            handleInvalidSession();
            return null;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/v1/refreshtoken`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!res.ok) {
                handleInvalidSession();
                return null;
            }

            const data = await res.json();
            setToken(data.token);
            return data.token;
        } catch (err) {
            console.error("Error on token:", err);
            handleInvalidSession();
            return null;
        }
    }

    return token;
}

export async function secureFetch(path, options = {}) {
    let authToken = await getToken();

    if (!authToken) {
        authToken = await waitForLogin();
        if (!authToken) throw new Error("User not authenticated after login");
    }

    return fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${authToken}`,
        },
    });
}

function waitForLogin(timeout = 60000, interval = 100) {
    return new Promise((resolve) => {
        let timePassed = 0;

        const checkToken = async () => {
            const newToken = await getToken();
            if (newToken) {
                resolve(newToken);
            } else if (timePassed >= timeout) {
                resolve(null);
            } else {
                timePassed += interval;
                setTimeout(checkToken, interval);
            }
        };

        const onLogin = () => {
            window.removeEventListener("login-success", onLogin);
            checkToken();
        };

        window.addEventListener("login-success", onLogin);

        checkToken();
    });
}

export async function openFetch(path, options = {}) {
    return fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
}