 const HDWalletProvider = require ('truffle-hdwallet-provider');
 const Web3 = require ('web3');
 const {abi, bytecode} = require('./compile');
 const { ethers } = require("ethers");


 
 const mnemonic = 'eternal chunk yellow chalk carbon hurry want interest brain artefact unlock price';
 const provider = new HDWalletProvider(mnemonic, 'HTTP://127.0.0.1:7545');
 const web3 = new Web3(provider);

 
 const deploy = async () => {
 
 const accounts = await web3.eth.getAccounts();
 const argumentsConstructor = [];
 
 const gasEstimate = await new web3.eth.Contract(abi)
		.deploy({data:bytecode, arguments: argumentsConstructor})
		.estimateGas({from: accounts[0]});
 
 const result = await new web3.eth.Contract(abi)
		.deploy({data:bytecode, arguments: argumentsConstructor})
		.send({gas: gasEstimate, from: accounts[0]});

	console.log("Contract deployed to ", result.options.address);
 };
 
 deploy();
 
