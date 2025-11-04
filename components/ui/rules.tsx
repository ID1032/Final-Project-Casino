'use client';

import * as React from 'react';


interface ModalProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export default function Modal({ title, children, isOpen, onClose }: ModalProps) {
    return (
        isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl ">
                    <div className="px-6 py-6 md:px-10 md:py-8">
                        <h2 className="text-black text-center text-2xl md:text-3xl font-extrabold mb-6">{title}</h2>
                        <div className="mt-2 text-black">
                            {children}
                        </div>
                        <div className="mt-8 flex items-center justify-center">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
                                aria-label="Close"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}