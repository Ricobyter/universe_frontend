import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { HiUsers } from 'react-icons/hi';
import { MdAdminPanelSettings, MdVerified } from 'react-icons/md';
import SideNavBar from '../../components/dashboard/SideNavBar';

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 0 });

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  const fetchUsers = async (page = 1) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (filterRole) params.append('role', filterRole);

      const response = await fetch(`http://localhost:3000/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      setUsers(data.users || []);
      setPagination(data.pagination || { total: 0, page: 1, pages: 0 });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-500';
      case 'moderator':
        return 'bg-blue-500/20 text-blue-500';
      default:
        return 'bg-teal-500/20 text-teal-500';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0A0A0A]">
        <SideNavBar />
        <div className="ml-64 flex-1 p-4 md:p-8">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <SideNavBar />
      
      <div className="ml-0 md:ml-64 flex-1 p-4 md:p-8 w-full">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Users</h1>
          <p className="text-gray-400 text-sm md:text-base">Manage user accounts and roles</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-[#121212] p-4 rounded-lg border border-[#004F4F] mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
                />
              </div>
            </form>
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#121212] p-4 rounded-lg border border-[#004F4F]">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-[#00FF00]/20 p-3 rounded-lg">
                <HiUsers className="text-2xl text-teal-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-white text-2xl font-bold">{pagination.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black p-4 rounded-lg border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <MdAdminPanelSettings className="text-2xl text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Admins</p>
                <p className="text-white text-2xl font-bold">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#121212] p-4 rounded-lg border border-[#004F4F]">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-[#00FF00]/20 p-3 rounded-lg">
                <MdVerified className="text-2xl text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Today</p>
                <p className="text-white text-2xl font-bold">
                  {users.filter(u => {
                    const today = new Date().toDateString();
                    return new Date(u.createdAt).toDateString() === today;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-[#121212] rounded-lg border border-[#004F4F] overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-[#004F4F]">
            <div className="w-1 h-6 bg-[#00FF00] rounded-full"></div>
            <h2 className="text-xl font-bold text-white">All Users</h2>
          </div>

          {users.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No users found
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#0A0A0A]">
                    <tr>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">User</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Email</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Role</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">University</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Reviews</th>
                      <th className="text-left p-4 text-gray-400 text-sm font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-t border-gray-800 hover:bg-[#0A0A0A] transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                              style={{ 
                                backgroundImage: user.userImageUrl 
                                  ? `url('${user.userImageUrl}')` 
                                  : `url('https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}')`
                              }}
                            ></div>
                            <span className="text-white font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300 text-sm">{user.email}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300 text-sm">
                          {user.University !== 'none' ? user.University : '-'}
                        </td>
                        <td className="p-4 text-gray-300 text-sm">{user.reviewCount || 0}</td>
                        <td className="p-4 text-gray-400 text-sm">{formatDate(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-800">
                {users.map((user) => (
                  <div key={user._id} className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 flex-shrink-0"
                        style={{ 
                          backgroundImage: user.userImageUrl 
                            ? `url('${user.userImageUrl}')` 
                            : `url('https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}')`
                        }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium mb-1">{user.name}</h3>
                        <p className="text-gray-400 text-sm mb-2 truncate">{user.email}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">University: </span>
                        <span className="text-gray-300">
                          {user.University !== 'none' ? user.University : '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Reviews: </span>
                        <span className="text-gray-300">{user.reviewCount || 0}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400">Joined: </span>
                        <span className="text-gray-300">{formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="p-4 border-t border-gray-800 flex items-center justify-between">
                  <p className="text-gray-400 text-sm">
                    Page {pagination.page} of {pagination.pages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchUsers(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-700 transition text-sm"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => fetchUsers(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-700 transition text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
