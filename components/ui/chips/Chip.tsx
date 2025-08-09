import { SizableText, StackProps, XStack } from 'tamagui';

export const Chip = ({ children, ...props }: StackProps) => {

    const chipContent = (
        <XStack
            bg="$background"
            py="$1"
            px="$2"
            br="$3"
            bw={1}
            ai="center"
            jc="center"
            h="$5"
            gap="$1.5"
            elevation={3}
            {...props}
        >
            <SizableText
            >
                {children}
            </SizableText>
        </XStack>

    );

    return chipContent;
};
