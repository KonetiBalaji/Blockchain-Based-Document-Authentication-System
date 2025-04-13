import React, { useState, useEffect } from "react";
import useWallet from "./hooks/useWallet";
import { uploadToIPFS } from "./utils/ipfs";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contractConfig";
import { ethers } from "ethers";
import { sha256 } from "js-sha256";
import VerifyDocument from "./components/VerifyDocument";
import HistoryView from "./components/HistoryView";
import PdfPreview from "./components/PdfPreview";
import "./App.css";


function App() {
  const { provider, signer, address } = useWallet();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [ipfsUrl, setIpfsUrl] = useState("");
  const [isIssuer, setIsIssuer] = useState(false);
  const [role, setRole] = useState("issuer"); // default tab

  // Check if the connected wallet is an issuer
  useEffect(() => {
    const checkRole = async () => {
      if (!provider || !address) return;
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const isIssuerFromContract = await contract.isIssuer(address);
      setIsIssuer(isIssuerFromContract);
    };

    checkRole();
  }, [provider, address]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !signer) return alert("Please select a file and connect MetaMask.");

    try {
      setStatus("⏳ Hashing and uploading to IPFS...");

      const buffer = await file.arrayBuffer();
      const hash = sha256(new Uint8Array(buffer));
      const ipfsUrl = await uploadToIPFS(file);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.uploadDocument("0x" + hash, ipfsUrl);
      await tx.wait();

      setIpfsUrl(ipfsUrl);
      setStatus(`✅ Uploaded successfully!\nIPFS: ${ipfsUrl}`);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      setStatus("❌ Upload failed. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 font-sans py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
          📄 Blockchain Document Verifier
        </h1>
  
        {/* Toggle View */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-medium shadow ${
              role === "issuer" ? "bg-blue-600 text-white" : "bg-white border border-blue-600 text-blue-600"
            }`}
            onClick={() => setRole("issuer")}
          >
            Issuer View
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium shadow ${
              role === "verifier" ? "bg-blue-600 text-white" : "bg-white border border-blue-600 text-blue-600"
            }`}
            onClick={() => setRole("verifier")}
          >
            Verifier View
          </button>
        </div>
  
        {/* Wallet Info */}
        <div className="text-center mb-6 text-sm text-gray-700">
          {address ? (
            <p>
              🔐 Connected Wallet: <span className="font-semibold">{address}</span>
            </p>
          ) : (
            <p className="text-red-600">🦊 Please connect MetaMask</p>
          )}
        </div>
  
        {/* Upload Section */}
        {role === "issuer" && isIssuer && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">📤 Upload Document</h2>
            <input type="file" onChange={handleFileChange} className="mb-4 p-2 border rounded w-full" />
            <button
              onClick={handleUpload}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Upload & Verify
            </button>
            {status && (
              <div className="mt-4 text-sm bg-gray-50 border p-3 rounded whitespace-pre-wrap">
                {status}
              </div>
            )}
          </div>
        )}
  
        {/* IPFS Preview */}
        {ipfsUrl && file?.name?.endsWith(".pdf") && <PdfPreview ipfsUrl={ipfsUrl} />}
  
        {/* Upload History */}
        {role === "issuer" && isIssuer && provider && address && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <HistoryView provider={provider} address={address} />
          </div>
        )}
  
        {/* Verifier */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <VerifyDocument signer={signer} />
        </div>
      </div>
    </div>
  );
}
export default App;  