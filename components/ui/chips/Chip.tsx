import { SizableText, StackProps, XStack } from 'tamagui';
import { ThemedLinearGradient } from '../ThemedLinearGradient';

export const Chip = ({ icon, children, ...props }: StackProps & { icon?: JSX.Element }) => {

    const chipContent = (
        <XStack
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
            <ThemedLinearGradient elevated {...props} />
            {icon}
            <SizableText>
                {children}
            </SizableText>
        </XStack>
    );

    return chipContent;
};
