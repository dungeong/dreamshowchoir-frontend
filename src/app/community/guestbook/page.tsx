'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { getGuestbookEntries, createGuestbookEntry, deleteGuestbookEntry, GuestbookEntry } from '@/api/guestbookApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ChevronLeft, ChevronRight, User, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const guestbookSchema = z.object({
    authorName: z.string().min(1, '이름을 입력해주세요.'),
    password: z.string().min(4, '비밀번호는 4자 이상이어야 합니다.'),
    content: z.string().min(1, '내용을 입력해주세요.').max(500, '500자 이내로 입력해주세요.')
});

type GuestbookForm = z.infer<typeof guestbookSchema>;

function GuestbookContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 0;

    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<GuestbookForm>({
        resolver: zodResolver(guestbookSchema)
    });

    useEffect(() => {
        fetchEntries(currentPage);
    }, [currentPage]);

    const fetchEntries = async (page: number) => {
        setLoading(true);
        try {
            const data = await getGuestbookEntries(page, 10);
            setEntries(data.content || []); // Fallback if content null
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Failed to fetch guestbook entries", error);
            setEntries([]);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: GuestbookForm) => {
        setSubmitting(true);
        try {
            await createGuestbookEntry(data);
            alert('방명록이 등록되었습니다.');
            reset();
            fetchEntries(0); // Refresh to first page
            // Reset URL page to 0
            if (currentPage !== 0) {
                router.push(pathname);
            }
        } catch (error) {
            console.error("Failed to create entry", error);
            alert('등록에 실패했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        const password = prompt('비밀번호를 입력하세요:');
        if (!password) return;

        try {
            await deleteGuestbookEntry(id, password);
            alert('삭제되었습니다.');
            fetchEntries(currentPage);
        } catch (error) {
            console.error("Failed to delete entry", error);
            alert('삭제에 실패했습니다. 비밀번호를 확인해주세요.');
        }
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-8 px-4">
            <div className="space-y-4 text-center">
                <h1 className="text-3xl font-bold text-gray-900">방명록</h1>
                <p className="text-gray-500">드림쇼콰이어에게 응원의 한마디를 남겨주세요!</p>
            </div>

            {/* Write Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                            <Input placeholder="이름 (작성자)" {...register('authorName')} />
                            {errors.authorName && <p className="text-xs text-red-500">{errors.authorName.message}</p>}
                        </div>
                        <div className="flex-1 space-y-2">
                            <Input type="password" placeholder="비밀번호 (삭제시 필요)" {...register('password')} />
                            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Textarea placeholder="응원의 메시지를 남겨주세요" className="min-h-[100px] resize-none" {...register('content')} />
                        {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={submitting} className="w-full md:w-auto">
                            {submitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                            등록하기
                        </Button>
                    </div>
                </form>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin h-10 w-10 text-primary" />
                </div>
            ) : entries.length > 0 ? (
                <div className="space-y-4">
                    {entries.map((entry) => (
                        <div key={entry.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{entry.authorName}</p>
                                        <p className="text-xs text-gray-400">{new Date(entry.createdAt).toLocaleDateString()} {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => handleDelete(entry.id)}>
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap pl-10">{entry.content}</p>
                        </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
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
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    아직 등록된 방명록이 없습니다.
                </div>
            )}
        </div>
    );
}

export default function GuestbookPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>}>
            <GuestbookContent />
        </Suspense>
    );
}
