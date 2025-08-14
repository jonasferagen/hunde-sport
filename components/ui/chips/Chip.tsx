import { JSX } from 'react';
import { StackProps } from 'tamagui';
import { ThemedText, ThemedXStack } from '../themed-components';
import { ThemedLinearGradient } from '../themed-components/ThemedLinearGradient';


export const Chip = ({ children, ...props }: StackProps): JSX.Element => {

    const chipContent = (
        <ThemedXStack
            fs={1}
            pos="relative"
            px="$2"
            py="$1"
            br="$3"
            bw={1}
            ov="hidden"
            ai="center"
            jc="center"
            gap="$1.5"


            {...props}
        >
            <ThemedLinearGradient />
            <ThemedText fs={1}>{children}</ThemedText>
        </ThemedXStack >
    );

    return chipContent;
};
