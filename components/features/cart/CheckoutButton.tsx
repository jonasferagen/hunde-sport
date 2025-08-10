import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { THEME_CHECKOUT_BUTTON } from '@/config/app';
import { ExternalLink } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { ButtonProps } from 'tamagui';

interface CheckoutButtonProps extends ButtonProps { }

export const CheckoutButton = (props: CheckoutButtonProps): JSX.Element => {


    const theme = THEME_CHECKOUT_BUTTON;

    return (
        <CallToActionButton
            theme={theme}
            iconAfter={<ExternalLink />}
            {...props}
        >
            Til kassen
        </CallToActionButton>
    );
};