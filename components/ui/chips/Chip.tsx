import { SizableText, styled, XStack } from 'tamagui';

export const Chip = styled(XStack, {
    name: 'Chip',
    paddingVertical: '$1',
    paddingHorizontal: '$2',
    borderRadius: '$2',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',

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
                borderColor: '$defaultBorder',
                pressStyle: {
                    backgroundColor: '$background',
                },
            },
        },
        disabled: {
            true: {
                opacity: 0.5,
            },
        },
    } as const,

    defaultVariants: {
        variant: 'default',
    },
});

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
