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
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
        <p className="text-muted-foreground text-sm">System-wide overlay templates available to broadcasters.</p>
      </div>

      <div className="shadcn-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border bg-secondary/10">
                <th className="px-6 py-3 font-bold">Template Name</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold">Usage</th>
                <th className="px-6 py-3 font-bold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {templates.map((t) => (
                <tr key={t.id} className="hover:bg-secondary/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded border border-border bg-background flex items-center justify-center text-muted-foreground">
                        <TemplateIcon size={16} />
                      </div>
                      <span className="text-sm font-medium">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tight border ${t.isActive ? 'border-foreground text-foreground bg-foreground/10' : 'border-border text-muted-foreground bg-secondary/50'}`}>
                      {t.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium">
                    <span className="text-foreground">{t._count?.overlays || 0}</span>
                    <span className="text-muted-foreground text-[10px] ml-1 uppercase">instances</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
