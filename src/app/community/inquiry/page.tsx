'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { getInquiries, Inquiry } from '@/api/inquiryApi';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, ChevronRight, MessageCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

function InquiryListContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 0;

    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchInquiries(currentPage);
    }, [currentPage]);

    const fetchInquiries = async (page: number) => {
        setLoading(true);
        try {
            const data = await getInquiries(page, 10);
            setInquiries(data.content || []);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Failed to fetch inquiries", error);
            setInquiries([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">문의하기</h1>
                    <p className="text-gray-500 mt-2">궁금한 점을 남겨주시면 답변해드립니다.</p>
                </div>
                <Link href="/community/inquiry/write">
                    <Button>문의글 작성</Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin h-10 w-10 text-primary" />
                    </div>
                ) : inquiries.length > 0 ? (
                    <>
                        <div className="divide-y divide-gray-100">
                            {inquiries.map((inquiry) => (
                                <div
                                    key={inquiry.inquiryId} // Assuming API returns inquiryId based on my api definition
                                    onClick={() => router.push(`/community/inquiry/${inquiry.inquiryId}`)}
                                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group flex items-center justify-between"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            {inquiry.isSecret && <Lock className="w-4 h-4 text-gray-400" />}
                                            <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                                                {inquiry.title}
                                            </h3>
                                            {inquiry.status === 'ANSWERED' && (
                                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">답변완료</span>
                                            )}
                                            {inquiry.status === 'WAITING' && (
                                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">대기중</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <span>{inquiry.authorName}</span>
                                            <span>•</span>
                                            <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="p-4 border-t border-gray-100 flex justify-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                                    disabled={currentPage === 0}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="flex items-center px-4 font-medium text-sm">
                                    {currentPage + 1} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                                    disabled={currentPage === totalPages - 1}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        등록된 문의가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}

export default function InquiryListPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>}>
            <InquiryListContent />
        </Suspense>
    );
}
