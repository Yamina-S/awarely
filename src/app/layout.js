import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './components/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Awarely",
  description: "Deine Beziehungs-App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <AuthProvider>
            {children}
          </AuthProvider>
      </body>
    </html>
  );
}
