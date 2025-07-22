
import { SizableText, styled } from 'tamagui';
export const ChipText = styled(SizableText, {
    name: 'ChipText',
    size: '$2',
    numberOfLines: 1,

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
        disabled: {
            true: {
                textDecorationLine: 'line-through',
            },
        },
    } as const,

    defaultVariants: {
        variant: 'default',
    },
});
