import { Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="pl-[240px]"><div className="max-w-6xl mx-auto px-8 py-8">{children}</div></main>
    </>
  );
}
