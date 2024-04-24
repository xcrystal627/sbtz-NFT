"use client";

import {
  ThirdwebProvider,
  embeddedWallet,
  metamaskWallet,
} from "@thirdweb-dev/react";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider
      sdkOptions={{
        gasless: {
          openzeppelin: {
            relayerUrl: process.env.NEXT_PUBLIC_OPENZEPPELIN_URL || "",
          },
        },
      }}
      activeChain={
        process.env.NODE_ENV !== "production" ||
        process.env.NEXT_PUBLIC_BASE_URL ==
          "https://sbtz-git-refactor-sbtz.vercel.app"
          ? "mumbai"
          : "polygon"
      }
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      supportedWallets={[embeddedWallet(), metamaskWallet()]}
      authConfig={{
        domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN as string,
        authUrl: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_URL as string,
      }}
    >
      {children}
    </ThirdwebProvider>
  );
}
