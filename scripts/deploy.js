const hre = require("hardhat");

async function main() {
  const DocumentStore = await hre.ethers.getContractFactory("DocumentStore");
  const documentStore = await DocumentStore.deploy();

  await documentStore.deployed();

  console.log("✅ DocumentStore deployed to:", documentStore.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
