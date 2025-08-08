import { CallToActionButton } from '@/components/ui/button/CallToActionButton';
import { ExternalLink } from '@tamagui/lucide-icons';
import React, { JSX } from 'react';
import { Pressable } from 'react-native';
import { H5 } from 'tamagui';


export const CheckoutButton = (): JSX.Element | null => {

    return (
        <Pressable>
            <CallToActionButton
                theme="secondary_strong"
                iconAfter={<ExternalLink />}

            >
                <H5 f={1} >Til kassen</H5>
            </CallToActionButton>
        </Pressable>
    );
};