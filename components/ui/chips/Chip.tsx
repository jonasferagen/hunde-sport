import { SizableText, StackProps, XStack } from 'tamagui';

export const Chip = ({ children, ...props }: StackProps) => {

    const chipContent = (
        <XStack
            bg="$background"
            px="$2"
            py="$1"
            br="$3"
            bw={1}
            boc="$borderColor"
            ai="center"
            jc="center"
            gap="$1.5"
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
