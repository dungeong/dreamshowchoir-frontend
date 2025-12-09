'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getMyProfile } from '@/api/memberApi';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) return;

            try {
                const profile = await getMyProfile();

                // If user is GUEST and not on signup page, redirect to signup
                if (profile.role === 'GUEST' && pathname !== '/signup') {
                    console.log('GUEST user attempted to access restricted page, redirecting to /signup');
                    router.replace('/signup');
                }

                // Optional: If user is NOT GUEST but tries to access signup, redirect to mypage
                // if (profile.role !== 'GUEST' && pathname === '/signup') {
                //     router.replace('/mypage');
                // }
            } catch (error) {
                console.error('Auth check failed:', error);
            }
        };

        checkAuth();
    }, [pathname, router]);

    return <>{children}</>;
}
