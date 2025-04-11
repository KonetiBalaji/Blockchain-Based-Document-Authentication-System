import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../contractConfig";

const HistoryView = ({ provider, address }) => {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    const fetchUploads = async () => {
      if (!provider || !address) return;

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const logs = await contract.queryFilter(contract.filters.DocumentUploaded(address));

      const parsed = logs.map(log => {
        return {
          docHash: log.args.docHash,
          ipfsHash: log.args.ipfsHash, // already a full URL
          timestamp: new Date(Number(log.args.timestamp) * 1000).toLocaleString(),
        };
      });

      setUploads(parsed);
    };

    fetchUploads();
  }, [provider, address]);

  return (
    <div className="mt-10 bg-white p-4 shadow rounded max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">📚 Upload History</h2>
      {uploads.length > 0 ? (
        <table className="w-full text-left table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-2">IPFS Link</th>
              <th className="p-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-2 text-blue-600 break-all">
                  <a href={upload.ipfsHash} target="_blank" rel="noopener noreferrer">
                    {upload.ipfsHash}
                  </a>
                </td>
                <td className="p-2">{upload.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No documents uploaded yet.</p>
      )}
    </div>
  );
};

export default HistoryView;
