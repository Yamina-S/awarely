"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/AuthContext";
import { Handshake } from "lucide-react";

export default function Sidebar({ menuItems = [], currentPath = "/dashboard" }) {
    const router = useRouter();
    const { signOut } = useAuth();

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white p-6 shadow-lg">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
                <Handshake className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">Awarely</h1>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 flex-1">
                {menuItems.length > 0 ? (
                    menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                currentPath === item.path
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-gray-700 hover:bg-gray-100"
                            }`}>
                            {item.title}
                        </button>
                    ))
                ) : (
                    <p className="text-gray-400 text-sm italic px-2">Keine Menüpunkte</p>
                )}
            </nav>

            <button
                onClick={signOut}
                className="mt-8 text-gray-500 hover:text-gray-700 transition-colors">
                Abmelden
            </button>
        </aside>
    );
}
