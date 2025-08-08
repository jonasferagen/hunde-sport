import React from 'react';
import { Button, ButtonProps, styled } from 'tamagui';

const StyledThemedButton = styled(Button, {
    name: 'ThemedButton',
    // Base style
    color: '$color',
    backgroundColor: '$background',
    borderColor: '$borderColor',
    borderWidth: '$borderWidth',
    borderRadius: '$3',
    fontWeight: 'bold',

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

export const ThemedButton = React.forwardRef<React.ComponentRef<typeof Button>, ButtonProps>(
    (props, ref) => {
        return <StyledThemedButton {...props} ref={ref} />;
    }
);
