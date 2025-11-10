"use client";

import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginForm() {
    const { signIn, signUp } = useAuth();

    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "", firstName: "", lastName: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isRegister) {
                await signUp(formData.email, formData.password);
            } else {
                await signIn(formData.email, formData.password);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100 p-6">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-950 to-blue-100 bg-clip-text text-transparent">
                    Awarely
                </h2>

                {error && (
                    <div className="flex items-center gap-2 bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <>
                            <input
                                type="text"
                                placeholder="Vorname"
                                className="w-full border rounded-lg px-4 py-2"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Nachname"
                                className="w-full border rounded-lg px-4 py-2"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </>
                    )}

                    <input
                        type="email"
                        placeholder="E-Mail"
                        className="w-full border rounded-lg px-4 py-2"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Passwort"
                            className="w-full border rounded-lg px-4 py-2 pr-10"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-500"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-gradient-to-r from-blue-950 to-blue-100 text-white rounded-lg hover:shadow-md transition"
                    >
                        {loading ? "Lädt..." : isRegister ? "Registrieren" : "Einloggen"}
                    </button>
                </form>

                <p className="text-center text-sm mt-4 text-gray-600">
                    {isRegister ? "Bereits ein Konto?" : "Noch kein Konto?"}
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="ml-1 text-blue-800 hover:underline"
                    >
                        {isRegister ? "Einloggen" : "Registrieren"}
                    </button>
                </p>
            </div>
        </div>
    );
}
