"use client";

import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useRouter } from "next/navigation";
import {Heart, Link as LinkIcon, Lightbulb, Users, Menu, X, Handshake} from "lucide-react";
import Sidebar from "@/app/components/Sidebar";

export default function DashboardPage() {
    const { signOut } = useAuth();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    const menuItems = [
        {
            title: "Liebessprachen",
            description: "Verstehe deine Liebessprachen",
            icon: Heart,
            path: "/love-languages",
            color: "bg-pink-200 hover:bg-pink-400",
        },
        {
            title: "Bindungsstil",
            description: "Verstehe deinen Bindungsstil",
            icon: LinkIcon,
            path: "/attachment-style",
            color: "bg-blue-200 hover:bg-blue-400",
        },
        {
            title: "Impuls der Woche",
            description: "Wöchentliche Impulse",
            icon: Lightbulb,
            path: "/weekly-tips",
            color: "bg-yellow-200 hover:bg-yellow-400 text-yellow-900",
        },
        {
            title: "Geteilte Profile",
            description: "Profile teilen und verwalten",
            icon: Users,
            path: "/shared-profiles",
            color: "bg-green-200 hover:bg-green-400",
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray- relative">
            {/* Desktop Sidebar */}
            <Sidebar menuItems={menuItems} currentPath="/dashboard" />

            {/* Mobile Navbar */}
            <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow-sm z-20 flex justify-between items-center px-6 py-4">
                <div className="flex items-center space-x-3 mb-6">
                    <Handshake className="w-6 h-6 text-primary-500" />
                    <h1 className="text-2xl font-bold text-gray-800">Awarely</h1>
                </div>
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                    {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="absolute top-16 left-0 w-full bg-white border-t border-gray-100 shadow-md z-10 md:hidden p-4">
                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => {
                                    router.push(item.path);
                                    setMenuOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                {item.title}
                            </button>
                        ))}
                    </nav>
                    <button
                        onClick={() => {
                            signOut();
                            setMenuOpen(false);
                        }}
                        className="mt-4 text-gray-500 hover:text-gray-700"
                    >
                        Abmelden
                    </button>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 p-8 mt-16 md:mt-0">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-2 text-gray-800">Willkommen!</h2>
                    <p className="text-gray-600 mb-8">Wähle einen Bereich, um zu starten</p>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => router.push(item.path)}
                                    className={`${item.color} text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-left flex items-start gap-4`}
                                >
                                    <Icon className="w-6 h-6 mt-1" />
                                    <div>
                                        <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                                        <p className="text-sm opacity-90 leading-snug">{item.description}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
