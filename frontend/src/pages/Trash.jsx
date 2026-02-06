import { useEffect, useState } from "react";
import api from "../api/axios";

function Trash() {

  const [items, setItems] = useState([]);

  // ======================
  // LOAD TRASH
  // ======================
  const loadTrash = async () => {
    const res = await api.get("/transactions/trash");
    setItems(res.data);
  };

  // ======================
  // RESTORE TRANSACTION
  // ======================
  const restore = async (id) => {
    if (!window.confirm("Restore this transaction?")) return;

    await api.post(`/transactions/${id}/restore`);
    loadTrash();
  };

  useEffect(() => {
    loadTrash();
  }, []);

  return (
    <div className="p-6 text-gray-200">

      <h1 className="text-3xl font-bold mb-8">Trash</h1>

      {/* EMPTY STATE */}
      {items.length === 0 && (
        <div className="bg-slate-950 border border-slate-800
                        p-6 rounded-xl shadow text-gray-400">
          Trash is empty
        </div>
      )}

      {/* TABLE */}
      {items.length > 0 && (

      <div className="bg-slate-950 border border-slate-800
                      rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-slate-900 text-gray-300">
            <tr>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>

            {items.map(t => (
              <tr
                key={t.id}
                className="border-b border-slate-800 hover:bg-slate-900 transition"
              >

                <td className="p-4 capitalize">
                  {t.type}
                </td>

                <td className="p-4">
                  ₹ {t.amount}
                </td>

                <td className="p-4">
                  {t.category}
                </td>

                <td className="p-4">
                  <button
                    onClick={() => restore(t.id)}
                    className="bg-green-600 hover:bg-green-700
                               text-white px-4 py-1.5 rounded-lg
                               font-medium"
                  >
                    Restore
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      )}

    </div>
  );
}

export default Trash;
