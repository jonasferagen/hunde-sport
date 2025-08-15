import { JSX } from 'react';
import { StackProps } from 'tamagui';
import { ThemedText, ThemedXStack } from '../themed-components';


export const Chip = ({ children, ...props }: StackProps): JSX.Element => {

    const chipContent = (
        <ThemedXStack
            chip
            {...props}
            br="$5"
        >
            <ThemedText fs={1} >{children}</ThemedText>
        </ThemedXStack >
    );

    return chipContent;
};
