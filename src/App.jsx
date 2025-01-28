import { useState } from 'react';
import abi from './abi.json';  
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [balance, setBalance] = useState('0');
  const contractAddress = '0xd29cB566b7ea69c60920183444ddAf4835C5d818';

  async function requestAccounts() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccounts();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      try {
        const currentBalance = await contract.getBalance();
        setBalance(currentBalance.toString());
        toast.success('Balance updated successfully!');
      } catch (err) {
        toast.error('Failed to get balance: ' + err.message);
      }
    }
  }

  async function handleDeposit() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccounts();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = await contract.deposit(depositAmount);
        toast.info('Deposit transaction submitted...');
        await tx.wait();
        toast.success('Deposit successful!');
        getBalance();
        setDepositAmount('');
      } catch (err) {
        toast.error('Deposit failed: ' + err.message);
      }
    }
  }

  async function handleWithdraw() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccounts();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = await contract.withdraw(withdrawAmount);
        toast.info('Withdrawal transaction submitted...');
        await tx.wait();
        toast.success('Withdrawal successful!');
        getBalance();
        setWithdrawAmount('');
      } catch (err) {
        toast.error('Withdrawal failed: ' + err.message);
      }
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <ToastContainer position="top-right" autoClose={5000} />
      <h2>Balance: {balance}</h2>
      <button onClick={getBalance} style={{ margin: '5px' }}>Get Balance</button>
      <br />
      
      <input 
        type="number" 
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)}
        placeholder="Amount to deposit"
        style={{ margin: '5px' }}
      />
      <button onClick={handleDeposit} style={{ margin: '5px' }}>Deposit</button>
      <br />
      
      <input 
        type="number"
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(e.target.value)}
        placeholder="Amount to withdraw"
        style={{ margin: '5px' }}
      />
      <button onClick={handleWithdraw} style={{ margin: '5px' }}>Withdraw</button>
    </div>
  );
}

export default App;