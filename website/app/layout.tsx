'use client'
import { MantineProvider } from "@mantine/core";
import "./globals.css";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { AuthProvider } from "@/context/authProvider";
import { DatesProvider } from "@mantine/dates";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>
          <DatesProvider settings={{ timezone: 'UTC' }}>
            <AuthProvider>
              {children}
            </AuthProvider>
          </DatesProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
