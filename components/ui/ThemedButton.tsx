import React from 'react';
import { YStack, YStackProps, styled } from 'tamagui';

const StyledThemedButton = styled(YStack, {
    name: 'ThemedButton',
    tag: 'button',
    // Base style
    padding: '$3',
    backgroundColor: '$background',
    borderColor: '$borderColor',
    borderWidth: '$borderWidth',
    borderRadius: '$3',

    // Interactions
    hoverStyle: {
        backgroundColor: '$backgroundHover',
        borderColor: '$borderColor',
    },

    pressStyle: {
        backgroundColor: '$backgroundPress',
        borderColor: '$borderColor',
    },

    focusStyle: {
        backgroundColor: '$backgroundFocus',
        borderColor: '$shadowColorFocus',
        outlineWidth: 2,
        outlineStyle: 'solid',
    },

    // Accent variant (optional)
    variants: {
        variant: {
            active: {
                backgroundColor: '$backgroundPress',
                borderColor: '$borderColorStrong',
                color: '$colorStrong',
            },
        },
        circular: {
            true: {
                borderRadius: 9999,
            },
        },
    },

    // Disabled
    disabledStyle: {
        opacity: .7,
        pointerEvents: 'none',
    },
});

export const ThemedButton = React.forwardRef<React.ComponentRef<typeof YStack>, YStackProps>(
    (props, ref) => {
        return <StyledThemedButton {...props} ref={ref} />;
    }
);
