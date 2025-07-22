import { Button, styled, Text } from 'tamagui';

export const StyledButton = styled(Button, {
    name: 'StyledButton',
    variants: {
        variant: {
            primary: {
                backgroundColor: '$primary',
                borderColor: '$primaryBorder',
                pressStyle: {
                    backgroundColor: '$primary',
                },
            },
            secondary: {
                backgroundColor: '$secondary',
                borderColor: '$secondaryBorder',
                pressStyle: {
                    backgroundColor: '$secondary',
                },
            },
            accent: {
                backgroundColor: '$accent',
                borderColor: '$accentBorder',
                pressStyle: {
                    backgroundColor: '$accent',
                },
            },
            default: {
                backgroundColor: '$background',
                borderColor: '$borderColor',
                pressStyle: {
                    backgroundColor: '$background',
                },
            },
        },
    } as const,
});

export const StyledButtonText = styled(Text, {
    name: 'StyledButtonText',
    variants: {
        variant: {
            primary: {
                color: '$primaryText',
            },
            secondary: {
                color: '$secondaryText',
            },
            accent: {
                color: '$accentText',
            },
            default: {
                color: '$color',
            },
        },
    } as const,
});
