# 📄 Blockchain Document Verifier

A decentralized application (dApp) to securely upload, store, and verify documents using **IPFS** and **Ethereum Blockchain**.

---

## 🚀 Features

- 🔐 Connects with MetaMask for wallet authentication
- 📤 Uploads documents to IPFS (via Pinata)
- 📑 Stores document hash on Ethereum smart contract
- ✅ Verifies uploaded documents
- 📚 Maintains upload history (per wallet)
- 🔄 Multi-role access: Issuers & Verifiers
- 🖼️ PDF preview using `pdf.js`


---

## 🧱 Tech Stack

| Layer        | Technology                       |
|--------------|----------------------------------|
| Frontend     | React, Tailwind CSS              |
| Blockchain   | Solidity, Hardhat, Ethers.js     |
| Storage      | IPFS via Pinata                  |
| Wallet       | MetaMask                         |
| Dev Tools    | Vite / Webpack, VS Code          |

---

## 🛠️ Installation

```bash
git clone https://github.com/KonetiBalaji/Blockchain-Based-Document-Authentication-System.git
cd blockchain-doc-verifier
npm install

⚙️ Start Local Blockchain
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

▶️Run React App
cd client
npm install
npm start

📝 Smart Contract
contracts/DocumentStore.sol
Implements functions for upload, verification, and access control.

📂 Folder Structure
project-root/
│
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI + logic (upload, verify, history)
│   │   ├── hooks/           # MetaMask connection logic
│   │   ├── utils/           # IPFS integration
│   ├── public/
│   ├── App.js
│   └── index.js
│
├── contracts/               # Solidity contract
├── scripts/                 # Hardhat deployment script
├── .env                     # Pinata JWT key
├── README.md

🔒 Environment Variables
Create a .env file:
REACT_APP_PINATA_JWT=your-pinata-jwt-token

API KEY: https://app.pinata.cloud/developers/api-keys
MetaMask: https://developer.metamask.io/