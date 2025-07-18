import { CustomText } from '@/components/ui';
import { CheckoutStep } from '@/config/routes';
import { useTheme } from '@/contexts';
import { SPACING } from '@/styles';
import { Link } from 'expo-router';
import React, { JSX } from 'react';
import { StyleSheet, View } from 'react-native';

interface RouteTrailProps {
    steps: CheckoutStep[];
    currentStepName: string;
}

export const RouteTrail = ({ steps, currentStepName }: RouteTrailProps): JSX.Element => {
    const { themeManager } = useTheme();
    const currentStepIndex = steps.findIndex(step => step.name === currentStepName);

    return (
        <View style={styles.container}>
            {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;

                const textStyle = {
                    color: isCompleted || isCurrent ? themeManager.getVariant('default').text.primary : themeManager.getVariant('default').text.secondary,
                    textDecorationLine: isCurrent ? 'underline' : 'none',
                };

                return (
                    <React.Fragment key={step.name}>
                        <Link href={step.route} disabled={!isCompleted && !isCurrent} asChild>
                            <CustomText style={textStyle}>{step.title}</CustomText>
                        </Link>
                        {index < steps.length - 1 && (
                            <CustomText style={[styles.separator, { color: themeManager.getVariant('default').text.secondary }]}>
                                &gt;
                            </CustomText>
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.sm,
    },
    separator: {
        marginHorizontal: SPACING.sm,
    },
});
