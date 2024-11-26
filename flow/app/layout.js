import localFont from "next/font/local";
import "./globals.css";
import { refreshToken } from "./lib/api";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Function to handle token refresh at regular intervals
const setupTokenRefresh = () => {
  const REFRESH_INTERVAL = 25 * 60 * 1000; // 25 minutes in milliseconds
  refreshToken(); // Initial call to refresh the token immediately
  setInterval(async () => {
    try {
      console.log("Refreshing token...");
      await refreshToken();
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }, REFRESH_INTERVAL);
};

export const metadata = {
  title: "Flow",
  description: "A university social networking application",
};

export default function RootLayout({ children }) {
  // Start the token refresh when the component mounts
  React.useEffect(() => {
    setupTokenRefresh();
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
