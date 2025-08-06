import { HrefObject, Link } from 'expo-router';
import { SizableText, StackProps, ThemeName, XStack } from 'tamagui';
import { ThemedLinearGradient } from '../ThemedLinearGradient';

interface ChipProps extends Omit<StackProps, 'href'> {
    title?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    theme?: ThemeName;
    href?: HrefObject;
    onPress?: () => void;
    button?: boolean
}

export const Chip = ({ title, icon, children, theme, href, onPress, button, ...props }: ChipProps) => {


    const br = onPress || href ? "$3" : "$5";

    const chipContent = (
        <XStack
            theme={theme}
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
            {...props}
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
