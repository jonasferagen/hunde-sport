import { CheckoutStep } from '@/config/routes';
import { Link } from 'expo-router';
import React, { JSX } from 'react';
import { SizableText, XStack } from 'tamagui';

interface RouteTrailProps {
    steps: CheckoutStep[];
    currentStepName: string;
}

export const RouteTrail = ({ steps, currentStepName }: RouteTrailProps): JSX.Element => {
    const currentStepIndex = steps.findIndex(step => step.name === currentStepName);

    return (
        <XStack ai="center" jc="center" paddingVertical="$space.sm">
            {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                    <React.Fragment key={step.name}>
                        <Link href={step.route} disabled={!isCompleted && !isCurrent} asChild>
                            <SizableText
                                color={isCompleted || isCurrent ? '$color.primary' : '$color.secondary'}
                                textDecorationLine={isCurrent ? 'underline' : 'none'}
                            >
                                {step.title}
                            </SizableText>
                        </Link>
                        {index < steps.length - 1 && (
                            <SizableText marginHorizontal="$space.sm" color="$color.secondary">
                                &gt;
                            </SizableText>
                        )}
                    </React.Fragment>
                );
            })}
        </XStack>
    );
};
