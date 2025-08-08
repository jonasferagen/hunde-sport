import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { ExternalLink } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { ButtonProps } from 'tamagui';

interface CheckoutButtonProps extends ButtonProps { }

export const CheckoutButton = (props: CheckoutButtonProps): JSX.Element => {

    return (
        <CallToActionButton
            theme="primary"
            iconAfter={<ExternalLink />}
            {...props}
        >
            {"Til kassen"}

        </CallToActionButton>
    );
};