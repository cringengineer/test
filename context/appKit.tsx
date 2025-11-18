"use client";

import { createAppKit } from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { mainnet, bsc } from "@reown/appkit/networks";
import React, { PropsWithChildren } from "react";

const projectId = "9d78057600dd182c232131373b7ce8e2";

const metadata = {
    name: "My Website",
    description: "My Website description",
    url: "https://mywebsite.com",
    icons: ["https://avatars.mywebsite.com/"],
};

createAppKit({
    adapters: [new Ethers5Adapter()],
    metadata: metadata,
    networks: [mainnet, bsc],
    projectId,
    features: {
        analytics: true,
    },
});

export function AppKit({ children }: PropsWithChildren): React.ReactNode {
    return <>{children}</>;
}