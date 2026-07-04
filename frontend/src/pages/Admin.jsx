import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://expensetracker-backend-yfkd.onrender.com/api/users/admin/users', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      console.log("Users received:", response.data); // This will log to your console
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data?.message || error.message);
      alert("Failed to load users: " + (error.response?.data?.message || "Check console"));
    }
  };
  const deleteUser = async (id) => {
    if (window.confirm('Are you sure?')) {
      await axios.delete(`https://expensetracker-backend-yfkd.onrender.com/api/users/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      fetchUsers();
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">
                <button onClick={() => deleteUser(u._id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}