"use client";

import { useState } from "react";
import { useAppKitProvider } from "@reown/appkit/react";
import { Contract, providers } from "ethers";
import ConnectButton from "@/components/ConnectButton";

const CONTRACT_ADDRESS = "0xfe60de5f174202651342bad0df79e2ff667713e4";
const ABI = [
    "function interval() view returns (uint256)",
    "function startDate() view returns (uint256)",
    "function token() view returns (address)",
];


export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [contractData, setContractData] = useState({
        interval: "",
        startDate: "",
        token: "",
    });
    const appKitProviderObject = useAppKitProvider("eip155");

    let provider: providers.Provider | undefined;

    if (appKitProviderObject && appKitProviderObject.walletProvider) {
        try {
            provider = new providers.Web3Provider(
                appKitProviderObject.walletProvider as providers.ExternalProvider
            );
        } catch (e) {
            console.error("Error creating Web3Provider:", e);
        }
    }

    const isWalletConnected = !!provider;

    const fetchContractData = async () => {
        if (!provider) {
            console.error("No provider available. Please connect your wallet.");
            return;
        }

        setLoading(true);
        try {
            const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);

            const [interval, startDate, token] = await Promise.all([
                contract.interval(),
                contract.startDate(),
                contract.token()
            ]);

            const intervalSeconds = interval.toNumber();
            const intervalDays = (intervalSeconds / (60 * 60 * 24)).toFixed(2);

            const startDateTimestamp = startDate.toNumber();
            const startDateReadable = new Date(startDateTimestamp * 1000).toLocaleString();

            setContractData({
                interval: `${intervalSeconds.toLocaleString()} seconds (~${intervalDays} days)`,
                startDate: startDateReadable,
                token,
            });

            setShowModal(true);

        } catch (error) {
            console.error("Error fetching contract data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-100">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex flex-col gap-5">
                <p className="flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8
                backdrop-blur-2xl dark:border-neutral-800
                dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4
                lg:dark:bg-zinc-800/30"
                >
                    Wallet Connection and Contract Interaction
                </p>

                <div className="flex w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
                    <ConnectButton />
                </div>

                <button
                    onClick={fetchContractData}
                    disabled={loading || !isWalletConnected}
                    className={`px-4 py-2 mt-3 rounded-xl text-lg transition-colors ${
                        isWalletConnected
                            ? loading
                                ? 'bg-gray-400 text-black cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-red-600/50 text-white cursor-not-allowed'
                    }`}
                >
                    {loading ? "Loading..." : isWalletConnected ? "LOAD Contract Data" : "Connect Wallet to Load"}
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
                    <div className="p-8 bg-white rounded-lg min-w-[400px]">
                        <h2 className="mb-4 text-xl font-bold text-gray-800">Contract Data:</h2>
                        <p className="mb-2 font-bold">Interval:
                            <span className="font-medium text-gray-700"> {contractData.interval}</span>
                        </p>

                        <p className="mb-2 font-bold">Start Date:
                            <span className="font-medium text-gray-700"> {contractData.startDate}</span>
                        </p>

                        <p className="mb-4 font-bold">Token Address:
                            <a href={`https://bscscan.com/address/${contractData.token}`}
                               target="_blank" rel="noopener noreferrer"
                               className="text-blue-800 font-medium">
                                 <span> {contractData.token}</span>
                            </a>
                        </p>

                        <button
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 mt-4 w-full font-bold text-white bg-red-700 rounded hover:bg-red-700 cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}