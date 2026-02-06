import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

function Dashboard() {

  // =======================
  // STATE
  // =======================

  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0
  });

  const [recent, setRecent] = useState([]);

  const [period, setPeriod] = useState("month"); 
  const [categoryFilter, setCategoryFilter] = useState("");

  const [categoryData, setCategoryData] = useState([]);

  const COLORS = ["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#f59e0b"];

  const formatMoney = (n) =>
    new Intl.NumberFormat("en-IN").format(n);

  // =======================
  // FETCH SUMMARY
  // =======================

  const fetchSummary = async () => {
    try {
      const res = await api.get(
        `/transactions/summary/${period}`
      );
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =======================
  // FETCH RECENT
  // =======================

  const fetchRecent = async () => {
    try {
      const res = await api.get("/transactions");

      const filtered = res.data.filter(t => {
        if (categoryFilter && t.category !== categoryFilter)
          return false;
        return true;
      });

      const sorted = [...filtered].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setRecent(sorted.slice(0, 5));

    } catch (err) {
      console.error(err);
    }
  };

  // =======================
  // FETCH CATEGORY PIE
  // =======================

  const fetchCategories = async () => {
    try {
      const res = await api.get("/transactions/categories");

      const formatted = Object.keys(res.data).map(key => ({
        name: key,
        value: res.data[key]
      }));

      setCategoryData(formatted);

    } catch (err) {
      console.error(err);
    }
  };

  // =======================
  // EFFECTS
  // =======================

  useEffect(() => {
    fetchSummary();
    fetchRecent();
    fetchCategories();
  }, [period, categoryFilter]);

  // =======================
  // UI
  // =======================

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6 text-white">
        Dashboard Overview
      </h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 mb-8">

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-gray-200 p-2 rounded-lg"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-gray-200 p-2 rounded-lg"
        >
          <option value="">All Categories</option>
          {categoryData.map(c => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl shadow">
          <p className="text-gray-400">Total Income</p>
          <h2 className="text-3xl font-bold text-green-400 mt-2">
            ₹ {formatMoney(summary.income)}
          </h2>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl shadow">
          <p className="text-gray-400">Total Expense</p>
          <h2 className="text-3xl font-bold text-red-400 mt-2">
            ₹ {formatMoney(summary.expense)}
          </h2>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl shadow">
          <p className="text-gray-400">Balance</p>
          <h2 className="text-3xl font-bold text-blue-400 mt-2">
            ₹ {formatMoney(summary.balance)}
          </h2>
        </div>

      </div>

      {/* BAR CHART */}
      <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl shadow mb-10">

        <h2 className="text-xl font-semibold mb-3 text-gray-200">
          Income vs Expense
        </h2>

        <div className="h-64">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "Income", value: summary.income },
                { name: "Expense", value: summary.expense }
              ]}
              barSize={70}
            >

              <CartesianGrid stroke="#1f2933" strokeDasharray="3 3" />

              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid #1f2933",
                  borderRadius: "8px",
                  color: "#e5e7eb"
                }}
                formatter={(value) => [`₹ ${value}`, "Amount"]}
              />

              <Bar
                dataKey="value"
                fill="#3b82f6"
                radius={[10, 10, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* PIE CHART */}
      <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl shadow mb-10">

        <h2 className="text-xl font-semibold mb-3 text-gray-200">
          Expense by Category
        </h2>

        {categoryData.length === 0 ? (
          <p className="text-gray-400">No expense data</p>
        ) : (
          <div className="h-64">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>
        )}

      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-4">
          Recent Transactions
        </h2>

        <table className="w-full text-gray-300">

          <thead>
            <tr className="border-b border-slate-800 text-gray-400">
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Category</th>
            </tr>
          </thead>

          <tbody>

            {recent.map(t => (
              <tr key={t.id} className="border-b border-slate-800">
                <td className="p-2 capitalize">{t.type}</td>
                <td className="p-2">
                  ₹ {formatMoney(t.amount)}
                </td>
                <td className="p-2">{t.category}</td>
              </tr>
            ))}

            {recent.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No data
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Dashboard;
