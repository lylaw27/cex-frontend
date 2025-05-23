import {useState} from "react";
import {ethers, AbstractProvider,BrowserProvider, Signer} from "ethers";

declare let window: any;

const useEthereum = () => {
    const [address, setAddress] = useState<string>("");
    const [balance, setBalance] = useState<bigint>(BigInt(0));
    const [provider, setProvider] = useState<BrowserProvider | AbstractProvider>();

    let signer: Signer | null = null;

    const getBalance = async () => {
        if (provider) {
            const balance = await provider.getBalance(address);
            setBalance(balance);
        }
    }
    const connect = async() => {
        if (window.ethereum) {
            const provider = new ethers.WebSocketProvider("ws://127.0.0.1:8545");
            setProvider(provider);
            signer = await provider.getSigner();
            await provider.on('block',getBalance);
            console.log("Wallet Connected!");
            const address = await signer.getAddress();
            setAddress(address);
            return address;
        } else {
            console.log("Metamask not installed; using read-only defaults");
            const provider = ethers.getDefaultProvider();
            setProvider(provider);
        }
    }

    return {
        provider,connect, address, balance, getBalance
    };
};

export default useEthereum;
