import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Search, Trash2, 
  Edit2, Plus, Key 
} from 'lucide-react';
import api from '../lib/api';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  // loading state removed as it was unused
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'USER'
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (e) {} finally { /* loading finish */ }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSave = async () => {
    try {
      if (editingUser) {
        // Only include password if it's being changed
        const payload = { 
          email: formData.email, 
          role: formData.role,
          ...(formData.password ? { password: formData.password } : {})
        };
        await api.patch(`/admin/users/${editingUser.id}`, payload);
      } else {
        await api.post('/admin/users', formData);
      }
      setShowModal(false);
      setEditingUser(null);
      setFormData({ email: '', password: '', role: 'USER' });
      fetchUsers();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Request failed');
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure? This will delete all of this user\'s overlays.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (e) {}
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({ email: user.email, password: '', role: user.role });
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-zinc-500 mt-1">Review registered broadcasters and manage permissions.</p>
        </div>
        <button 
          onClick={() => { setEditingUser(null); setFormData({ email: '', password: '', role: 'USER' }); setShowModal(true); }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl premium-gradient text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
        >
          <Plus size={20} />
          Create User
        </button>
      </div>

      <div className="glass-card border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Search users..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none"
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">
              <th className="px-8 py-4 font-bold">User</th>
              <th className="px-8 py-4 font-bold">Role</th>
              <th className="px-8 py-4 font-bold">Joined</th>
              <th className="px-8 py-4 font-bold">Overlays</th>
              <th className="px-8 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center font-bold text-xs text-white">
                      {u.email.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold">{u.email}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">{u.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${u.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-zinc-500/10 text-zinc-500'}`}>
                    {u.role === 'ADMIN' && <Shield size={10} />}
                    {u.role}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm text-zinc-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-5 text-sm text-zinc-500 font-medium">
                  {u._count?.overlays || 0} Created
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      title="Edit user" aria-label="Edit user"
                      onClick={() => openEditModal(u)}
                      className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      title="Delete user" aria-label="Delete user"
                      onClick={() => deleteUser(u.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-card w-full max-w-md p-8 border-white/10 z-10"
            >
              <h2 className="text-2xl font-bold mb-6">{editingUser ? 'Edit User' : 'Create New User'}</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="user@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                    {editingUser ? 'New Password (optional)' : 'Password'}
                    <Key size={14} className="text-zinc-600" />
                  </label>
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder={editingUser ? "••••••••" : "Set password"}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">System Role</label>
                  <select 
                    title="System Role" aria-label="System Role"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary/50 appearance-none"
                  >
                    <option value="USER" className="bg-bg-dark">Standard User</option>
                    <option value="ADMIN" className="bg-bg-dark">Administrator</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 font-bold hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex-1 py-4 rounded-2xl premium-gradient text-white font-bold shadow-lg shadow-primary/20"
                  >
                    {editingUser ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
