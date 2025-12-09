'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJoinApplications, updateJoinStatus, JoinApplication } from '@/api/adminApi';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function JoinApplicationPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);

    const { data, isLoading } = useQuery({
        queryKey: ['join-applications', page],
        queryFn: () => getJoinApplications(page, 10)
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ joinId, status }: { joinId: number; status: 'APPROVED' | 'REJECTED' }) =>
            updateJoinStatus(joinId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['join-applications'] });
            Swal.fire('처리완료', '신청이 처리되었습니다.', 'success');
        },
        onError: () => {
            Swal.fire('실패', '처리에 실패했습니다.', 'error');
        }
    });

    const handleAction = (joinId: number, status: 'APPROVED' | 'REJECTED') => {
        Swal.fire({
            title: status === 'APPROVED' ? '가입을 승인하시겠습니까?' : '가입을 거절하시겠습니까?',
            icon: status === 'APPROVED' ? 'question' : 'warning',
            showCancelButton: true,
            confirmButtonColor: status === 'APPROVED' ? '#3085d6' : '#d33',
            cancelButtonColor: '#9ca3af',
            confirmButtonText: status === 'APPROVED' ? '승인' : '거절',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                updateStatusMutation.mutate({ joinId, status });
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">가입 신청 관리</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[80px]">No</TableHead>
                            <TableHead>신청자 / 이메일</TableHead>
                            <TableHead>희망 파트</TableHead>
                            <TableHead>메시지</TableHead>
                            <TableHead className="w-[150px]">신청일</TableHead>
                            <TableHead className="w-[180px] text-right">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-40 text-center">
                                    <div className="flex justify-center items-center h-full">
                                        <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data?.content && data.content.length > 0 ? (
                            data.content.map((app, index) => (
                                <TableRow key={app.joinId}>
                                    <TableCell className="font-medium">
                                        {/* Calculate index based on page */}
                                        {data.totalElements - (page * data.size) - index}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900">{app.userName}</span>
                                            <span className="text-xs text-gray-500">{app.userEmail}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded text-xs border border-gray-200">
                                            {app.part}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 text-sm text-gray-600 truncate max-w-[200px]">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger className="truncate text-left">
                                                        {app.myDream || app.interests || '-'}
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <div className="max-w-xs p-2">
                                                            <p className="font-bold mb-1">나의 꿈:</p>
                                                            <p className="mb-2 text-xs">{app.myDream || '-'}</p>
                                                            <p className="font-bold mb-1">관심 분야:</p>
                                                            <p className="text-xs">{app.interests || '-'}</p>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-500">
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                className="h-8 bg-blue-600 hover:bg-blue-700 text-white"
                                                onClick={() => handleAction(app.joinId, 'APPROVED')}
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                                승인
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                onClick={() => handleAction(app.joinId, 'REJECTED')}
                                            >
                                                <XCircle className="w-4 h-4 mr-1" />
                                                거절
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-40 text-center text-gray-500">
                                    대기 중인 가입 신청이 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {data && data.totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 flex justify-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage(Math.max(0, page - 1))}
                            disabled={page === 0}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="flex items-center px-4 font-medium text-sm">
                            {page + 1} / {data.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage(Math.min(data.totalPages - 1, page + 1))}
                            disabled={page === data.totalPages - 1}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
