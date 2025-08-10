import { JSX } from 'react';
import { SizableText, StackProps, XStack } from 'tamagui';
import { ThemedLinearGradient } from '../themed-components/ThemedLinearGradient';


export const Chip = ({ children, ...props }: StackProps): JSX.Element => {

    const chipContent = (
        <XStack
            fs={1}
            pos="relative"
            px="$2"
            py="$1"
            br="$3"
            bw={1}
            ov="hidden"
            boc="$borderColor"
            ai="center"
            jc="center"
            gap="$1.5"

            {...props}
        >
            <ThemedLinearGradient />
            <SizableText
                color="$color"
                fow="bold"
                fs={1}
            >
                {children}
            </SizableText>
        </XStack >
    );

    return chipContent;
};
