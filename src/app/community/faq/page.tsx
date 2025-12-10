'use client';

import { Suspense, useState, useEffect } from 'react';
import { getFaqList, Faq } from '@/api/faqApi';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, HelpCircle } from 'lucide-react';

function FaqContent() {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const data = await getFaqList();
                setFaqs(data);
            } catch (error) {
                console.error("Failed to fetch FAQs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    return (
        <div className="max-w-3xl mx-auto space-y-8 py-8 px-4">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">자주 묻는 질문</h1>
                <p className="text-gray-500">드림쇼콰이어에 대해 자주 묻는 질문들을 모았습니다.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin h-10 w-10 text-primary" />
                </div>
            ) : faqs.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={faq.faqId} value={`item-${index}`}>
                                <AccordionTrigger className="hover:no-underline hover:text-primary text-left">
                                    <div className="flex items-center gap-3">
                                        <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                                        <span className="font-medium text-lg">{faq.question}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-4 pb-4 pl-11 pr-4 text-gray-600 bg-gray-50/50 rounded-b-lg">
                                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    등록된 FAQ가 없습니다.
                </div>
            )}
        </div>
    );
}

export default function FaqPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>}>
            <FaqContent />
        </Suspense>
    );
}
