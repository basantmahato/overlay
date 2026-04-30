// Overlay pages need a transparent background for OBS browser source.
// This layout strips out the global body styles.
export default function OverlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-transparent overflow-hidden w-screen h-screen">
      {children}
    </div>
  );
}
