'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/overlays');
  }, [router]);

  return (
    <div className="h-full flex items-center justify-center text-zinc-600 italic text-sm">
      Redirecting to overlays...
    </div>
  );
}
