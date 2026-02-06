import { useEffect, useState } from "react";
import api from "../api/axios";

function Accounts() {

  const [accounts, setAccounts] = useState([]);
  const [name, setName] = useState("");
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");

  // ======================
  // FETCH ACCOUNTS
  // ======================
  const fetchAccounts = async () => {
    const res = await api.get("/accounts");
    setAccounts(res.data);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // ======================
  // CREATE ACCOUNT
  // ======================
  const createAccount = async () => {
    if (!name) return;

    await api.post(`/accounts?name=${name}`);
    setName("");
    fetchAccounts();
  };

  // ======================
  // TRANSFER MONEY
  // ======================
  const transfer = async () => {
    if (!fromId || !toId || !amount) {
      alert("Select accounts and amount");
      return;
    }

    try {
      await api.post(
        `/accounts/transfer?fromId=${fromId}&toId=${toId}&amount=${amount}`
      );

      setAmount("");
      setFromId("");
      setToId("");
      fetchAccounts();
      alert("Transfer successful");

    } catch {
      alert("Transfer failed");
    }
  };

  return (
    <div className="p-6 text-gray-200">

      <h1 className="text-3xl font-bold mb-8">Accounts</h1>

      {/* CREATE ACCOUNT */}
      <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl shadow mb-8 max-w-md">

        <h2 className="text-xl font-semibold mb-4">Create Account</h2>

        <input
          placeholder="Account Name (Cash, Bank, Wallet)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700
                     text-white placeholder-gray-400 focus:outline-none
                     focus:ring-2 focus:ring-blue-600 mb-4"
        />

        <button
          onClick={createAccount}
          className="w-full bg-blue-600 hover:bg-blue-700
                     text-white py-2 rounded-lg font-semibold"
        >
          Create Account
        </button>

      </div>

      {/* TRANSFER MONEY */}
      <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl shadow mb-10 max-w-md">

        <h2 className="text-xl font-semibold mb-4">Transfer Money</h2>

        <select
          value={fromId}
          onChange={(e) => setFromId(e.target.value)}
          className="w-full p-3 mb-3 rounded-lg bg-slate-900 border border-slate-700
                     text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">From Account</option>
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>

        <select
          value={toId}
          onChange={(e) => setToId(e.target.value)}
          className="w-full p-3 mb-3 rounded-lg bg-slate-900 border border-slate-700
                     text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">To Account</option>
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-slate-900 border border-slate-700
                     text-white placeholder-gray-400 focus:outline-none
                     focus:ring-2 focus:ring-blue-600"
        />

        <button
          onClick={transfer}
          className="w-full bg-green-600 hover:bg-green-700
                     text-white py-2 rounded-lg font-semibold"
        >
          Transfer
        </button>

      </div>

      {/* ACCOUNT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {accounts.map(acc => (
          <div
            key={acc.id}
            className="bg-slate-950 border border-slate-800 p-6
                       rounded-xl shadow hover:scale-[1.02]
                       transition-transform"
          >

            <h2 className="text-xl font-semibold mb-1">
              {acc.name}
            </h2>

            <p className="text-gray-400 text-sm">Balance</p>

            <p className="text-3xl font-bold text-blue-400 mt-2">
              ₹ {acc.balance}
            </p>

          </div>
        ))}

        {accounts.length === 0 && (
          <p className="text-gray-500">No accounts created yet</p>
        )}

      </div>

    </div>
  );
}

export default Accounts;
