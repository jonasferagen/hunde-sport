import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { ExternalLink } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { ButtonProps, H5 } from 'tamagui';


interface CheckoutButtonProps extends ButtonProps { }

export const CheckoutButton = (props: CheckoutButtonProps): JSX.Element => {

    return (
        <CallToActionButton
            theme="secondary_strong"
            iconAfter={<ExternalLink />}
            {...props}
        >
            <H5 f={1} >Til kassen</H5>
        </CallToActionButton>
    );
};