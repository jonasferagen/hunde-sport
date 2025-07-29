import { ThemedButton } from '@/components/ui/ThemedButton';
import { CheckoutStep } from '@/config/routes';
import { Link } from 'expo-router';
import React, { JSX } from 'react';
import { Theme, XStack } from 'tamagui';

interface RouteTrailProps {
    steps: CheckoutStep[];
    currentStepName: string;
}

interface RouteStepProps {
    step: CheckoutStep;
    state: 'completed' | 'active' | 'inactive';
}

const RouteStep = ({ step, state }: RouteStepProps) => {
    const isInactive = state === 'inactive';

    const button = (
        <Link href={step.route} asChild disabled={isInactive} style={{ flex: 1 }}>
            <ThemedButton
                f={1}
                h={100}
                disabled={isInactive}
                variant={state === 'active' ? 'active' : undefined}
                borderRadius={0}
                p="$2"
                opacity={isInactive ? 0.6 : 1}
                jc="center"
                ai="center"
            >
                {step.title}
            </ThemedButton>
        </Link>
    );

    if (state === 'completed') {
        return <Theme name="tertiary">{button}</Theme>;
    }

    return button;
};

export const RouteTrail = ({ steps, currentStepName }: RouteTrailProps): JSX.Element => {
    const currentStepIndex = steps.findIndex((step) => step.name === currentStepName);

    return (
        <XStack ai="center" jc="center" w="100%" h={50}>
            {steps.map((step, index) => {
                const state =
                    index < currentStepIndex
                        ? 'completed'
                        : index === currentStepIndex
                            ? 'active'
                            : 'inactive';

                return (
                    <XStack key={step.name} f={1} ai="center">
                        <RouteStep step={step} state={state} />
                    </XStack>
                );
            })}
        </XStack>
    );
};
