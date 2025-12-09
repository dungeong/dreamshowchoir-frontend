import { Sidebar } from '@/components/layout/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-64 transition-all duration-300">
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
