import "./globals.css";
import Chatbot from "@/components/Chatbot";

export const metadata = {
  title: "Eventify | Seamless Event Management",
  description: "Next-generation event management platform powered by AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
