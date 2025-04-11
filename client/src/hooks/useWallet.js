import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";

export default function useWallet() {
  const [wallet, setWallet] = useState({
    provider: null,
    signer: null,
    address: null,
  });

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const provider = new BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();

          setWallet({ provider, signer, address });
        } catch (err) {
          console.error("Wallet connection error:", err);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };

    connectWallet();
  }, []);

  return wallet;
}
