import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/redux/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TasteTrail - Discover Recipes & Plan Meals",
  description:
    "Discover recipes, plan meals efficiently, track cooking activities, and receive personalized food recommendations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
        <ReduxProvider>
        {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
