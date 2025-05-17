// @ts-nocheck

"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/app/components/AppContext";
import { Connect } from "@stacks/connect-react";
import { AuthOptions } from "@stacks/connect";
import { UserSession, AppConfig } from "@stacks/auth";
import { RootLayout } from "@/app/components/RootLayout";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [userData, setUserData] = useState({});

  const appConfig = new AppConfig(
    ["store_write", "publish_data"],
    "https://app.stackingdao.com"
  );
  const userSession = new UserSession({ appConfig });
  const authOptions: AuthOptions = {
    redirectTo: "/",
    userSession,
    onFinish: ({ userSession }) => {
      const userData = userSession.loadUserData();
      setUserData(userData);
    },
    appDetails: {
      name: "Stacking Tracker - All your PoX needs in one place",
      icon: "https://stackingdao.com/_next/static/media/logo.00ae0d9a.png",
    },
  };

  useEffect(() => {
    try {
      if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData();
        setUserData(userData);
      }
    } catch (error) {
      // If there's an error with the session data, clear it
      console.warn('Invalid session data detected, clearing...');
      userSession.signUserOut();
      localStorage.removeItem('stacking-tracker-sign-provider');
      setUserData({});
    }
  }, []);

  const signOut = () => {
    try {
      userSession.signUserOut();
      localStorage.removeItem("stacking-tracker-sign-provider");
      window.location = "/";
    } catch (error) {
      console.error('Error signing out:', error);
      // Force clear everything
      localStorage.removeItem("stacking-tracker-sign-provider");
      window.location = "/";
    }
  };

  const handleRedirectAuth = async () => {
    try {
      if (userSession.isSignInPending()) {
        const userData = await userSession.handlePendingSignIn();
        setUserData(userData);
      }
    } catch (error) {
      console.error('Error handling redirect auth:', error);
      // Clear invalid session data
      userSession.signUserOut();
      localStorage.removeItem("stacking-tracker-sign-provider");
      setUserData({});
    }
  };

  React.useEffect(() => {
    void handleRedirectAuth();
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en">
      <head>
        <Script
          strategy="lazyOnload"
          data-domain="stacking-tracker.com"
          src="https://plausible.io/js/script.outbound-links.js"
        />
        <Script id="plausible-init" strategy="lazyOnload">
          {`window.plausible = window.plausible || function() { 
                        (window.plausible.q = window.plausible.q || []).push(arguments) 
                    }`}
        </Script>
      </head>
      <body
        className={`${inter.className} relative flex min-h-screen flex-col text-white bg-black`}
      >
        <Connect authOptions={authOptions}>
          {isClient && (
            <AppContextProvider userData={userData}>
              <RootLayout signOut={signOut}>{children}</RootLayout>
            </AppContextProvider>
          )}
        </Connect>
      </body>
    </html>
  );
}
