import { NavLink, Outlet, useNavigate } from "react-router-dom";

function AppLayout() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-3 rounded-lg font-medium transition-all duration-200
     ${isActive
        ? "bg-blue-600 text-white shadow-lg"
        : "text-gray-400 hover:bg-slate-800 hover:text-white"
     }`;

  return (
    <div className="flex min-h-screen bg-slate-900 text-gray-200">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col">

        <h2 className="text-2xl font-extrabold mb-10 text-blue-500 text-center">
          💰 Money Manager
        </h2>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-3 flex-1">

          <NavLink to="/app/dashboard" className={linkClass}>
            📊 Dashboard
          </NavLink>

          <NavLink to="/app/transactions" className={linkClass}>
            💳 Transactions
          </NavLink>

          <NavLink to="/app/accounts" className={linkClass}>
            🏦 Accounts
          </NavLink>

          <NavLink to="/app/trash" className={linkClass}>
            🗑 Trash
          </NavLink>

        </nav>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="mt-auto px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
        >
          🚪 Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>

    </div>
  );
}

export default AppLayout;
