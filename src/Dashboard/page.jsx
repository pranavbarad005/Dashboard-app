import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaUsers } from "react-icons/fa";


function Dashboard() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");

  const roles = ["Admin", "Editor", "User"];

  // Fetch user data
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        const dataWithRoles = data.map((user) => ({
          ...user,
          role: roles[Math.floor(Math.random() * roles.length)],
        }));
        setUsers(dataWithRoles);
        setFiltered(dataWithRoles);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);


  // Filter logic
  useEffect(() => {
    let updated = users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
    if (role !== "All") updated = updated.filter((u) => u.role === role);
    setFiltered(updated);
  }, [search, role, users]);


  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <h1 className="flex items-center justify-center gap-3 text-3xl font-bold text-blue-700 mb-10 tracking-tight">
        <FaUsers className="text-4xl text-blue-600" />
        <span>User Management Dashboard</span>
      </h1>


      {/* Search & Filter */}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 max-w-5xl mx-auto w-full text-black">
        {/* Search Box with Icon */}
        <div className="relative w-full sm:w-2/3">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <FiSearch className="text-lg" />
          </span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-400 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base shadow-sm text-black placeholder-gray-500"
          />
        </div>

        {/* Role Filter Dropdown */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-gray-400 rounded-lg px-4 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base shadow-sm text-black"
        >
          <option value="All">All Roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>


      {/* Loading / Error */}
      {loading && (
        <p className="text-center text-gray-600 animate-pulse">
          ⏳ Loading users...
        </p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* User Cards Grid */}
      {loading ? (
        <p className="text-center text-gray-600 text-lg">Loading users...</p>
      ) : error ? (
        <p className="text-center text-red-600 text-lg">Failed to load data. Please try again.</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {filtered.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center border border-gray-100 hover:-translate-y-1"
            >
              <img
                src={`https://i.pravatar.cc/150?u=${user.id}`}
                alt={user.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 shadow-lg border-2 border-blue-100 object-cover"
              />
              <h2 className="text-lg font-semibold text-gray-800 mb-1">{user.name}</h2>
              <p className="text-sm text-gray-500 truncate px-2">{user.email}</p>

              <span
                className={`inline-block px-4 py-1 mt-3 rounded-full text-white text-xs sm:text-sm font-medium shadow-md ${user.role === "Admin"
                  ? "bg-blue-600"
                  : user.role === "Editor"
                    ? "bg-green-600"
                    : "bg-gray-700"
                  }`}
              >
                {user.role}
              </span>
            </div>
          ))}
        </div>
      )}


    </div>
  );
}

export default Dashboard;
