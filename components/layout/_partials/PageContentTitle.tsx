import { CustomText } from '@/components/ui';
import React from 'react';

interface PageContentTitleProps {
    title?: string;
}

export const PageContentTitle = ({ title }: PageContentTitleProps) => {
    if (!title) {
        return null;
    }

    return <CustomText>{title}</CustomText>;
};
