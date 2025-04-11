import React, { useState } from "react";
import { sha256 } from "js-sha256";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contractConfig";

const VerifyDocument = ({ signer }) => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult("");
  };

  const verifyDocument = async () => {
    if (!file || !signer) {
      alert("Please connect wallet and choose a file.");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = new Uint8Array(buffer); // ✅ Browser-compatible
      const hashHex = "0x" + sha256(hashBuffer); // ✅ Always prefix with 0x

      console.log("🔍 Verifying hash:", hashHex);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const exists = await contract.isDocumentPresent(hashHex); // ✅ Correct function

      if (exists) {
        const [ipfsHash, timestamp, issuer] = await contract.verifyDocument(hashHex);
        const date = new Date(Number(timestamp) * 1000).toLocaleString();

        setResult(
          `✅ Verified!\n\n📂 IPFS: ${ipfsHash}\n🧾 Issuer: ${issuer}\n🕒 Uploaded: ${date}`
        );
      } else {
        setResult("❌ Document not found on the blockchain.");
      }
    } catch (err) {
      console.error("❌ Verification Error:", err);
      setResult("⚠️ Error verifying the document. Check console.");
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>🔍 Verify Document</h2>
      <input type="file" onChange={handleFileChange} />
      <br />
      <button onClick={verifyDocument} style={{ marginTop: "1rem" }}>
        Check Verification
      </button>
      {result && (
        <pre style={{ marginTop: "1rem", fontWeight: "bold", whiteSpace: "pre-wrap" }}>
          {result}
        </pre>
      )}
    </div>
  );
};

export default VerifyDocument;
