// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DocumentStore {
    address public owner;

    struct Document {
        address issuer;
        string ipfsHash;
        uint256 timestamp;
    }

    mapping(bytes32 => Document) public documents;
    mapping(address => bool) public isIssuer;

    event DocumentUploaded(address indexed issuer, bytes32 indexed docHash, string ipfsHash, uint256 timestamp);

    constructor() {
        owner = msg.sender;
        isIssuer[msg.sender] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can perform this action.");
        _;
    }

    modifier onlyIssuer() {
        require(isIssuer[msg.sender], "Only issuers can upload documents.");
        _;
    }

    function addIssuer(address _issuer) external onlyOwner {
        isIssuer[_issuer] = true;
    }

    function uploadDocument(bytes32 _docHash, string memory _ipfsHash) external onlyIssuer {
        require(documents[_docHash].timestamp == 0, "Document already exists.");
        documents[_docHash] = Document(msg.sender, _ipfsHash, block.timestamp);
        emit DocumentUploaded(msg.sender, _docHash, _ipfsHash, block.timestamp);
    }

    function verifyDocument(bytes32 _docHash) external view returns (string memory ipfsHash, uint256 timestamp, address issuer) {
        Document memory doc = documents[_docHash];
        require(doc.timestamp != 0, "Document not found.");
        return (doc.ipfsHash, doc.timestamp, doc.issuer);
    }

    function isDocumentPresent(bytes32 _docHash) external view returns (bool) {
        return documents[_docHash].timestamp != 0;
    }
}
