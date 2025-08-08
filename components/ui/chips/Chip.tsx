import { HrefObject, Link } from 'expo-router';
import { SizableText, StackProps, XStack } from 'tamagui';
import { ThemedLinearGradient } from '../ThemedLinearGradient';

interface ChipProps {
    title?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    href?: HrefObject;
    onPress?: () => void;
    button?: boolean
    br?: string;
}

export const Chip = ({ title, icon, children, br = "$3", href, onPress, button, ...stackProps }: ChipProps & StackProps) => {


    const chipContent = (
        <XStack
            py="$1"
            px="$2"
            br={br}
            bg="$backgroundAlpha"
            bw={1}
            boc="$borderColorStrong"
            ai="center"
            jc="center"
            h="$5"
            gap="$1.5"
            onPress={onPress}
            pressStyle={onPress ? { opacity: 0.7 } : undefined}
            elevation={3}
            {...stackProps}
        >
            <ThemedLinearGradient br={br} colors={['$backgroundAlpha', '$backgroundElevated']} />
            {icon}
            {children}
            {title && !children && (
                <SizableText fontSize="$3" numberOfLines={1}>
                    {title}
                </SizableText>
            )}

        </XStack>
    );

    if (href) {
        return <Link replace href={href} asChild>
            {chipContent}
        </Link>
    }

    return chipContent;
};
