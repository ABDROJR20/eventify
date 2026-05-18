import "./globals.css";
import Chatbot from "@/components/Chatbot";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "Eventify | Seamless Event Management",
  description: "Next-generation event management platform powered by AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Chatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
