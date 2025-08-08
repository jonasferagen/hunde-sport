import { SizableText, StackProps, XStack } from 'tamagui';
import { ThemedLinearGradient } from '../ThemedLinearGradient';

export const Chip = ({ children, ...props }: StackProps) => {

    const chipContent = (
        <XStack
            theme="secondary_alt2"
            py="$1"
            px="$2"
            br="$3"
            bw={1}
            boc="$borderColorStrong"
            ai="center"
            jc="center"
            h="$5"
            gap="$1.5"
            elevation={3}
            {...props}
        >
            <ThemedLinearGradient
                br="$3"
                colors={['$backgroundAlpha', '$backgroundElevated']}
                {...props}
            />
            <SizableText
                fos="$3"
                color="black"
                numberOfLines={1}>
                {children}
            </SizableText>
        </XStack>

    );

    return chipContent;
};
