import { JSX } from 'react';
import { StackProps } from 'tamagui';
import { ThemedText, ThemedXStack } from '../themed-components';
import { ThemedLinearGradient } from '../themed-components/ThemedLinearGradient';


export const Chip = ({ children, ...props }: StackProps): JSX.Element => {

    const chipContent = (
        <ThemedXStack
            chip
            {...props}
            br="$5"
        >
            <ThemedLinearGradient />
            <ThemedText fs={1} >{children}</ThemedText>
        </ThemedXStack >
    );

    return chipContent;
};
