import React, { Component } from 'react';

import ERC20_ABI from "./ABI.json";

import { ethers } from "ethers";
// const ethers = require("ethers");

class Metamask extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  async connectToMetamask() {
    //const provider = new ethers.providers.JsonRpcProvider('https://cloudflare-eth.com/');
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", []);
    const balance = await provider.getBalance(accounts[0]);
    const balanceInEther = ethers.utils.formatEther(balance);
    const block = await provider.getBlockNumber();

    provider.on("block", (block) => {
      this.setState({ block })
    })

    const daiContract = new ethers.Contract('0x8F4d66009AB4f3a02f33A96e0B4e3b87d1033173', ERC20_ABI, provider);
    const tokenName = await daiContract.getOwners();
    //const tokenBalance = await daiContract.balanceOf(accounts[0]);
    //const tokenUnits = await daiContract.decimals();
    //const tokenBalanceInEther = ethers.utils.formatUnits(tokenBalance, tokenUnits);

    this.setState({ selectedAddress: accounts[0], balance: balanceInEther, block, tokenName})//, tokenBalanceInEther })
  }

  handleMintButtonClick = () => {
    const { to, signature } = this.state;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()

    const daiContract = new ethers.Contract('0x8F4d66009AB4f3a02f33A96e0B4e3b87d1033173', ERC20_ABI, provider);
    const daiContractWithSigner = daiContract.connect(signer);

    daiContractWithSigner.submitMint(to, signature)
      .then(() => {
        console.log('Mint transaction submitted successfully');
        // Add any additional logic or UI updates you need here
      })
      .catch((error) => {
        console.error('Error submitting mint transaction:', error);
        // Add any error handling or UI updates you need here
      });
  };

  handleConfirmTransactionButtonClick = () => {
    const { txindex, signature } = this.state;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()

    const daiContract = new ethers.Contract('0x8F4d66009AB4f3a02f33A96e0B4e3b87d1033173', ERC20_ABI, provider);
    const daiContractWithSigner = daiContract.connect(signer);

    daiContractWithSigner.confirmTransaction(txindex, signature)
      .then(() => {
        console.log(' Transaction confirmed successfully');
        // Add any additional logic or UI updates you need here
      })
      .catch((error) => {
        console.error('Error confirming transaction:', error);
        // Add any error handling or UI updates you need here
      });
  };

  handleExecuteTransactionButtonClick = () => {
    const { txindex, signature } = this.state;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()

    const daiContract = new ethers.Contract('0x8F4d66009AB4f3a02f33A96e0B4e3b87d1033173', ERC20_ABI, provider);
    const daiContractWithSigner = daiContract.connect(signer);

    daiContractWithSigner.executeTransaction(txindex, signature)
      .then(() => {
        console.log(' Transaction executed successfully');
        // Add any additional logic or UI updates you need here
      })
      .catch((error) => {
        console.error('Error executing transaction:', error);
        // Add any error handling or UI updates you need here
      });
  };

  renderMetamask() {
    if (!this.state.selectedAddress) {
      return (
        <button onClick={() => this.connectToMetamask()}>Connect to Metamask</button>
      )
    } else {
      return (
        <div>
            <p>Welcome {this.state.selectedAddress}</p>
            <p>Your ETH Balance is: {this.state.balance}</p>
            <p>Current ETH Block is: {this.state.block}</p>
            <p>Contract Owner: {this.state.tokenName}</p>
            <label htmlFor="signatureInput">Signature:<br /></label>
            <textarea
                id="signatureInput" 
                value={this.state.signature}
                onChange={(event) => this.setState({ signature: event.target.value })}
            ></textarea><br /><br />
            <label htmlFor="toInput">To:<br /></label>
            <input
                type="text"
                id="toInput"
                value={this.state.to}
                onChange={(event) => this.setState({ to: event.target.value })}
            /><br />
            <button onClick={() => this.handleMintButtonClick()}>Submit Mint Transaction</button><br /><br />
            <label htmlFor="TransactionIdInput">TransactionId:<br /></label>
            <input
                type="number"
                id="txIdInput"
                value={this.state.txId}
                onChange={(event) => this.setState({ txindex: event.target.value })}
            /><br />
            <button onClick={() => this.handleConfirmTransactionButtonClick()}>Confirm Transaction</button><br /><br />
            <button onClick={() => this.handleExecuteTransactionButtonClick()}>Execute Transaction</button><br />


        </div>
      );
    }
  }

  render() {
    return(
      <div>
        {this.renderMetamask()}
      </div>
    )
  }
}

export default Metamask;