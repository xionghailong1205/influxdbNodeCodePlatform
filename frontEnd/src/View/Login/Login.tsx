import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./login.module.css"


const Login = () => {
    const [username, setUsername] = useState("");
    const [token, setToken] = useState("");
    const [orgId, setOrgId] = useState("");  // Add organization ID state
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, token, orgId }),  // Send organization ID with login request
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", token);  // Store token
                localStorage.setItem("orgId", orgId);  // Store organization ID
                alert("Login successful!");
                navigate("/dashboard");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Login failed. Please check API token and Organization ID.");
            }
        } catch (error) {
            setError("Network error. Please try again.");
        }
    };

    return (
        <div className={classes["login-container"]}>
            <form className={classes["login-form"]} onSubmit={handleSubmit}>
                <input
                    type="text"
                    className={classes["input-field"]}
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="text"
                    className={classes["input-field"]}
                    placeholder="API Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                />
                <input
                    type="text"
                    className={classes["input-field"]}
                    placeholder="Organization ID"  // Input for organization ID
                    value={orgId}
                    onChange={(e) => setOrgId(e.target.value)}
                />
                <button type="submit" className={classes["submit-button"]}>
                    Login
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Login