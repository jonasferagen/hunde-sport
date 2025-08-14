import { CallToActionButton } from '@/components/ui/CallToActionButton';
import { ExternalLink } from '@tamagui/lucide-icons';
import React from 'react';
import { ButtonProps } from 'tamagui';

interface CheckoutButtonProps extends ButtonProps {

}

export const CheckoutButton = ({ disabled, ...props }: CheckoutButtonProps) => {

    const iconAfter = <ExternalLink />
    return (
        <CallToActionButton
            disabled={disabled}
            f={0}
            icon={null}
            label={"Til kassen"}
            iconAfter={iconAfter}
            {...props}
            theme="accent12"
        />
    );
};