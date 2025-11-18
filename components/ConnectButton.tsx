import {useAppKit, useAppKitAccount} from "@reown/appkit/react";

export default function ConnectButton() {
    const { open } = useAppKit();
    const { isConnected, status } = useAppKitAccount();

    return (
        <div className='flex flex-col items-center justify-center gap-4'>
            <p className={`text-xl font-semibold  ${isConnected ? 'text-green-900' : 'text-red-900'}`}>
                {status}
            </p>

            <button
                className='bg-blue-950 text-white px-4 py-2 rounded-2xl text-xl cursor-pointer hover:bg-blue-900'
                onClick={() => open()}
            >
                {isConnected ? "Your Wallet" : "Connect Wallet"}
            </button>

            <button
                className='bg-blue-950 text-white px-4 py-2 rounded-2xl text-xl cursor-pointer hover:bg-blue-900'
                onClick={() => open({ view: "Networks" })}
            >
                Networks
            </button>
        </div>
    );
}