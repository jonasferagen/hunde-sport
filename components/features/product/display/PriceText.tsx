import { SizableText, styled } from 'tamagui';

export const PriceText = styled(SizableText, {
    name: 'PriceText',
    fos: '$4',
    fow: 'bold',
    variants: {
        variant: {
            default: {},
            disabled: {
                fow: 'normal',
                textDecorationLine: 'line-through',
                opacity: 0.7,
                color: '$colorSubtle'
            },
        },
    } as const
});
