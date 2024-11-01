// @ts-nocheck

"use client";

import React, { useEffect, useState } from "react";
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
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setUserData(userData);
    }
  }, []);

  const signOut = () => {
    userSession.signUserOut();
    localStorage.removeItem("stacking-tracker-sign-provider");
    window.location = "/";
  };

  const handleRedirectAuth = async () => {
    if (userSession.isSignInPending()) {
      const userData = await userSession.handlePendingSignIn();
      setUserData(userData);
    }
  };

  React.useEffect(() => {
    void handleRedirectAuth();
  }, []);

  useEffect(() => {
    document.title = "Stacking Tracker";
    document.description =
      "All your data needs on PoX, Signers and Miners on Stacks!";

    setIsClient(true);
  }, []);

  return (
    <html lang="en">
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
