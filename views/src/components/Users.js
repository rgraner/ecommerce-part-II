import React, { useState, useEffect } from 'react';
import Navbar from './Navbar.js';

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const users = await response.json();
        setUsers(users);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div>
      <Navbar />
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;