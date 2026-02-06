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

  const [allTransactions, setAllTransactions] = useState([]);
  const [recent, setRecent] = useState([]);

  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0
  });

  const [period, setPeriod] = useState("month"); // week | month | year
  const [categoryFilter, setCategoryFilter] = useState("");

  const COLORS = ["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#f59e0b"];

  const formatMoney = (n) =>
    new Intl.NumberFormat("en-IN").format(n);

  // =======================
  // FETCH ALL TRANSACTIONS
  // =======================

  const fetchData = async () => {
    try {
      const res = await api.get("/transactions");
      setAllTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =======================
  // PERIOD FILTER
  // =======================

  const filterByPeriod = (tx) => {
    const date = new Date(tx.createdAt);
    const now = new Date();

    if (period === "week") {
      const diff =
        (now - date) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }

    if (period === "month") {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }

    if (period === "year") {
      return date.getFullYear() === now.getFullYear();
    }

    return true;
  };

  // =======================
  // CALCULATE DASHBOARD
  // =======================

  const calculateDashboard = () => {

    const filtered = allTransactions.filter(t => {

      if (!filterByPeriod(t)) return false;

      if (categoryFilter && t.category !== categoryFilter)
        return false;

      return true;
    });

    let income = 0;
    let expense = 0;

    filtered.forEach(t => {
      if (t.type === "income") income += t.amount;
      if (t.type === "expense") expense += t.amount;
    });

    setSummary({
      income,
      expense,
      balance: income - expense
    });

    const sorted = [...filtered].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setRecent(sorted.slice(0, 5));
  };

  // =======================
  // CATEGORY PIE DATA
  // =======================

  const categoryMap = {};

  recent.forEach(t => {
    if (t.type === "expense") {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + t.amount;
    }
  });

  const categoryData = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  }));

  // =======================
  // EFFECTS
  // =======================

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateDashboard();
  }, [allTransactions, period, categoryFilter]);

  // =======================
  // UI
  // =======================

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6 text-white">
        Dashboard Overview
      </h1>

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

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 mb-8">

        {/* PERIOD */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-gray-200 p-2 rounded-lg"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>

        {/* CATEGORY */}
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
              {/* Gradient */}
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#1f2933"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#9ca3af"
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
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
                fill="url(#barGradient)"
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
                <Legend />
                <Tooltip />
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
            <tr className="text-left border-b border-slate-800 text-gray-400">
              <th className="p-2">Type</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Category</th>
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
