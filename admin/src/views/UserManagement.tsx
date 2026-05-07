import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Search, Trash2, 
  Edit2, Plus, Key, MoreHorizontal 
} from 'lucide-react';
import api from '../lib/api';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
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
    } catch (e) {}
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSave = async () => {
    try {
      if (editingUser) {
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
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground text-sm">Manage registered broadcasters and their system roles.</p>
        </div>
        <button 
          onClick={() => { setEditingUser(null); setFormData({ email: '', password: '', role: 'USER' }); setShowModal(true); }}
          className="shadcn-button bg-foreground text-background hover:bg-foreground/90 font-bold text-xs uppercase tracking-widest gap-2"
        >
          <Plus size={14} />
          Create User
        </button>
      </div>

      <div className="shadcn-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/20">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <input 
              type="text" 
              placeholder="Filter users..."
              className="shadcn-input pl-9 h-8 bg-background border-border"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="shadcn-button h-8 px-2 border border-border text-muted-foreground hover:text-foreground">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border bg-secondary/10">
                <th className="px-6 py-3 font-bold">Account</th>
                <th className="px-6 py-3 font-bold">Role</th>
                <th className="px-6 py-3 font-bold">Created</th>
                <th className="px-6 py-3 font-bold text-center">Resources</th>
                <th className="px-6 py-3 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded border border-border bg-background flex items-center justify-center font-bold text-[10px] text-foreground">
                        {u.email.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{u.email}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tight border ${u.role === 'ADMIN' ? 'border-foreground text-foreground bg-foreground/10' : 'border-border text-muted-foreground bg-secondary/50'}`}>
                      {u.role === 'ADMIN' && <Shield size={8} />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-xs text-center font-medium">
                    <span className="text-foreground">{u._count?.overlays || 0}</span>
                    <span className="text-muted-foreground text-[10px] ml-1 uppercase">overlays</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        title="Edit user"
                        onClick={() => openEditModal(u)}
                        className="p-1.5 hover:bg-secondary rounded border border-transparent hover:border-border text-muted-foreground hover:text-foreground transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        title="Delete user"
                        onClick={() => deleteUser(u.id)}
                        className="p-1.5 hover:bg-destructive/10 rounded border border-transparent hover:border-destructive/20 text-muted-foreground hover:text-destructive transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="shadcn-card w-full max-w-md p-6 z-10"
            >
              <div className="flex flex-col gap-1 mb-6">
                <h2 className="text-lg font-bold tracking-tight">{editingUser ? 'Edit User' : 'Create Account'}</h2>
                <p className="text-xs text-muted-foreground">Configure system access and permissions.</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="user@example.com"
                    className="shadcn-input h-10"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 flex items-center justify-between">
                    {editingUser ? 'New Password (optional)' : 'Password'}
                    <Key size={10} />
                  </label>
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder={editingUser ? "••••••••" : "Set password"}
                    className="shadcn-input h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">System Role</label>
                  <div className="relative">
                    <select 
                      title="System Role"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="shadcn-input h-10 appearance-none bg-background cursor-pointer"
                    >
                      <option value="USER">Standard User</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <MoreHorizontal size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="flex-1 shadcn-button border border-border text-foreground hover:bg-secondary text-xs uppercase font-bold tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex-1 shadcn-button bg-foreground text-background hover:bg-foreground/90 text-xs uppercase font-bold tracking-widest"
                  >
                    {editingUser ? 'Save Changes' : 'Create User'}
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
