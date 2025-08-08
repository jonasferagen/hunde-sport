import { SizableText, StackProps, XStack } from 'tamagui';
import { ThemedLinearGradient } from '../ThemedLinearGradient';
interface ChipProps {
    title?: string;
    onPress?: () => void;
}

export const Chip = ({ title, onPress, children, ...stackProps }: ChipProps & StackProps) => {

    const chipContent = (
        <XStack
            t={stackProps.t}
            onPress={onPress}
            py="$1"
            px="$2"
            bg="$backgroundAlpha"
            br="$3"
            bw={1}
            boc="$borderColorStrong"
            ai="center"
            jc="center"
            h="$5"
            gap="$1.5"
            elevation={3}
            {...stackProps}
        >
            <ThemedLinearGradient br="$3" colors={['$backgroundAlpha', '$backgroundElevated']} />
            <SizableText fos="$3" color="black" numberOfLines={1}>
                {children}
            </SizableText>
        </XStack>

    );

    return chipContent;
};
