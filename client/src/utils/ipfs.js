export async function uploadToIPFS(file) {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`, // use environment-safe key
        },
        body: formData,
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        // 🔍 This logs the actual issue from Pinata
        
        console.error("📦 Pinata Response:", data);
        throw new Error(data.error?.message || data.message || "Upload failed.");
      }
  
      return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    } catch (error) {
      console.error("❌ Pinata Upload Error:", error.message || error);
      throw error;
    }
  }
  