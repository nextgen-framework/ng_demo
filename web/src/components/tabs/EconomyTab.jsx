import React, { useState } from 'react';
import { fetchNui } from '../../utils/fetchNui';

function EconomyTab({ addLog }) {
  const [amount, setAmount] = useState(1000);
  const [accountType, setAccountType] = useState('cash');

  const handleAddMoney = async () => {
    addLog('info', `Adding $${amount} to ${accountType}...`);
    await fetchNui('addMoney', { amount, account: accountType });
    addLog('success', `Added $${amount} to ${accountType}`);
  };

  const handleRemoveMoney = async () => {
    addLog('info', `Removing $${amount} from ${accountType}...`);
    await fetchNui('removeMoney', { amount, account: accountType });
    addLog('success', `Removed $${amount} from ${accountType}`);
  };

  const handleGetBalance = async () => {
    addLog('info', 'Getting account balances...');
    const result = await fetchNui('getBalance');
    addLog('success', `Cash: $${result.cash || 0} | Bank: $${result.bank || 0}`);
  };

  const handleResetMoney = async () => {
    addLog('info', 'Resetting all accounts...');
    await fetchNui('resetMoney');
    addLog('success', 'All accounts reset');
  };

  return (
    <div className="tab-content">
      <h2>Economy Management</h2>

      <div className="card">
        <h3>Money Management</h3>
        <div className="form-group">
          <label>Amount: ${amount}</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
            min="0"
            step="100"
          />
        </div>

        <div className="form-group">
          <label>Account Type</label>
          <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
            <option value="black_money">Black Money</option>
          </select>
        </div>

        <div className="button-grid">
          <button className="test-btn" onClick={handleAddMoney}>
            Add Money
          </button>
          <button className="test-btn" onClick={handleRemoveMoney}>
            Remove Money
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Account Information</h3>
        <div className="button-grid">
          <button className="test-btn" onClick={handleGetBalance}>
            Get Balance
          </button>
          <button className="test-btn danger" onClick={handleResetMoney}>
            Reset All Money
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Quick Actions</h3>
        <div className="button-grid">
          <button className="test-btn" onClick={() => { setAmount(10000); setAccountType('cash'); handleAddMoney(); }}>
            Give $10,000 Cash
          </button>
          <button className="test-btn" onClick={() => { setAmount(50000); setAccountType('bank'); handleAddMoney(); }}>
            Give $50,000 Bank
          </button>
        </div>
      </div>
    </div>
  );
}

export default EconomyTab;
