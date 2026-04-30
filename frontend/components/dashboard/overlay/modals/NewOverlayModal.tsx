'use client';

import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Template } from '@/types';

interface NewOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  newName: string;
  setNewName: (name: string) => void;
  newTemplateId: string;
  setNewTemplateId: (id: string) => void;
  templates: Template[];
  modalErr: string;
  onCreate: () => void;
}

export const NewOverlayModal = ({
  isOpen,
  onClose,
  newName,
  setNewName,
  newTemplateId,
  setNewTemplateId,
  templates,
  modalErr,
  onCreate
}: NewOverlayModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">Create New Overlay</h2>
              <button 
                title="Close Modal" 
                onClick={onClose} 
                className="text-zinc-500 hover:text-zinc-300 p-1"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <Input 
                label="Overlay Name" 
                value={newName} 
                onChange={e => setNewName(e.target.value)} 
                placeholder="e.g. Sunday Game Overlay" 
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Template</label>
                <select 
                  title="Select Template"
                  value={newTemplateId} 
                  onChange={e => setNewTemplateId(e.target.value)}
                  className="px-3 py-2 bg-zinc-800 border border-zinc-700/60 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                >
                  {templates.length === 0
                    ? <option disabled>No templates available</option>
                    : templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)
                  }
                </select>
              </div>
              {modalErr && <p className="text-red-400 text-xs">{modalErr}</p>}
            </div>
            <div className="flex gap-2 mt-5 justify-end">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button onClick={onCreate}>Create Overlay</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
