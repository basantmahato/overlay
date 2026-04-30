import { useEffect, useState } from 'react';
import { Layout as TemplateIcon } from 'lucide-react';
import api from '../lib/api';

export default function TemplateManagement() {
  const [templates, setTemplates] = useState<any[]>([]);

  const fetchTemplates = async () => {
    try {
      const res = await api.get('/templates');
      setTemplates(res.data);
    } catch (e) {
      console.error('Failed to fetch templates:', e);
    }
  };

  useEffect(() => { fetchTemplates(); }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Templates</h1>
        <p className="text-zinc-500 mt-1">View available overlay templates. Templates are managed via seed scripts.</p>
      </div>

      <div className="glass-card border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">
              <th className="px-8 py-4 font-bold">Template Name</th>
              <th className="px-8 py-4 font-bold">Status</th>
              <th className="px-8 py-4 font-bold">Usage</th>
              <th className="px-8 py-4 font-bold">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {templates.map((t) => (
              <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <TemplateIcon size={20} />
                    </div>
                    <span className="font-bold">{t.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${t.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {t.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm text-zinc-500 font-medium">
                  {t._count?.overlays || 0} Instances
                </td>
                <td className="px-8 py-5 text-sm text-zinc-500">
                  {new Date(t.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
