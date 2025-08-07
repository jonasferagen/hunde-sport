import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { ExternalLink } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';


export const CheckoutButton = (): JSX.Element | null => {

    return (
        <CallToActionButton
            theme="secondary_strong"
            iconAfter={<ExternalLink />}
        >
            Til kassen
        </CallToActionButton>

    );
};