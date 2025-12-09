'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

import { getMyProfile } from '@/api/memberApi';
import { Loader2 } from 'lucide-react';

const menuItems = [
    { name: '공지사항', href: '/members/notice' },
    { name: '연습일정', href: '/members/schedule' },
    { name: '악보/자료실', href: '/members/library' },
    { name: '자유게시판', href: '/members/board' },
];

export function MembersLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const profile = await getMyProfile();
                if (profile.role === 'MEMBER' || profile.role === 'ADMIN') {
                    setIsAuthorized(true);
                } else {
                    alert('단원만 접근할 수 있는 페이지입니다.');
                    router.push('/mypage');
                }
            } catch (error) {
                console.error('Failed to verify role:', error);
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
    }

    if (!isAuthorized) {
        return null;
    }

    // Find current page name for header
    const currentPage = menuItems.find(item => pathname.startsWith(item.href)) || menuItems[0];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="bg-primary py-20 text-center text-primary-foreground">
                <h1 className="text-4xl font-bold mb-4">단원 전용</h1>
                <p className="opacity-90">Members Only Area</p>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 px-4 border-b pb-4">메뉴</h2>
                            <nav className="space-y-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "block px-4 py-3 rounded-lg transition-colors font-medium",
                                            pathname.startsWith(item.href)
                                                ? "bg-primary text-primary-foreground"
                                                : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 bg-white rounded-xl shadow-sm p-8 min-h-[500px]">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-gray-100 text-primary">
                                {currentPage.name}
                            </h2>
                            {children}
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );
}
