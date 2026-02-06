import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Transactions() {

  const categories = [
    "Salary","Business","Food","Groceries","Rent",
    "Travel","Shopping","Bills","Entertainment",
    "Health","Education","Other"
  ];

  const [editingTx, setEditingTx] = useState(null);

  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");

  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState("");


  // ======================
  // FETCH DATA
  // ======================
  const fetchTransactions = async () => {
    const res = await api.get("/transactions");
    setTransactions(res.data);
  };

  const fetchAccounts = async () => {
    const res = await api.get("/accounts");
    setAccounts(res.data);
  };

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
  }, []);

  // ======================
  // SAVE TRANSACTION
  // ======================
  const handleSave = async () => {

    if (!amount || !category || !accountId) {
      alert("Amount, category and account required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/transactions", {
        type,
        amount: Number(amount),
        category,
        description,
        accountId
      });

      setAmount("");
      setCategory("");
      setDescription("");
      setAccountId("");

      fetchTransactions();

    } catch {
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 p-6">

      {/* FORM */}
      <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl shadow mb-10 max-w-3xl">

  <h2 className="text-xl mb-4">Add Transaction</h2>

  {/* GRID ROW 1 */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

    <select
      value={type}
      onChange={(e) => setType(e.target.value)}
      className="dark-input"
    >
      <option value="income">Income</option>
      <option value="expense">Expense</option>
    </select>

    <input
      type="number"
      placeholder="Amount"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      className="dark-input"
    />

    <select
      value={accountId}
      onChange={(e) => setAccountId(e.target.value)}
      className="dark-input"
    >
      <option value="">Select Account</option>
      {accounts.map(acc => (
        <option key={acc.id} value={acc.id}>
          {acc.name}
        </option>
      ))}
    </select>

    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="dark-input"
    >
      <option value="">Select Category</option>
      {categories.map(cat => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>

  </div>

  {/* GRID ROW 2 */}
  <div className="mt-4">
    <input
      placeholder="Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="dark-input"
    />
  </div>

  {/* BUTTON */}
  <button
    onClick={handleSave}
    disabled={loading}
    className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg mt-4 disabled:opacity-50"
  >
    {loading ? "Saving..." : "Save"}
  </button>

</div>


      {/* FILTER */}
      <div className="mb-6">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="dark-input w-48"
        >
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl shadow">

        <h2 className="text-xl mb-4">Transaction History</h2>

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b border-slate-700 text-gray-400">
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>

            {transactions
              .filter(t => !month ||
                new Date(t.createdAt).getMonth() + 1 === Number(month))
              .map(t => (

              <tr key={t.id} className="border-b border-slate-800 hover:bg-slate-900">

                <td className="p-3 capitalize">{t.type}</td>
                <td className="p-3">₹ {t.amount}</td>
                <td className="p-3">{t.category}</td>
                <td className="p-3">{t.description}</td>

                <td className="p-3">
                  <div className="flex gap-3">

                    <button
                      onClick={() => setEditingTx(t)}
                      className="text-blue-400 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={async () => {
                        if (!window.confirm("Delete this transaction?")) return;
                        await api.delete(`/transactions/${t.id}`);
                        fetchTransactions();
                      }}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>

                  </div>
                </td>

              </tr>
            ))}

            {transactions.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No transactions yet
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

      {/* EDIT MODAL */}
      {editingTx && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

          <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl w-96">

            <h2 className="text-xl mb-4">Edit Transaction</h2>

            <input
              type="number"
              value={editingTx.amount}
              onChange={(e) =>
                setEditingTx({
                  ...editingTx,
                  amount: e.target.value
                })
              }
              className="dark-input"
            />

            <input
              value={editingTx.category}
              onChange={(e) =>
                setEditingTx({
                  ...editingTx,
                  category: e.target.value
                })
              }
              className="dark-input"
            />

            <input
              value={editingTx.description}
              onChange={(e) =>
                setEditingTx({
                  ...editingTx,
                  description: e.target.value
                })
              }
              className="dark-input"
            />

            <div className="flex gap-3 mt-3">

              <button
                onClick={async () => {
                  try {
                    await api.put(
                      `/transactions/${editingTx.id}`,
                      editingTx
                    );
                    setEditingTx(null);
                    fetchTransactions();
                  } catch {
                    alert("Edit window expired (12 hrs)");
                  }
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditingTx(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Transactions;
