import { HrefObject, Link } from 'expo-router';
import { SizableText, ThemeName, XStack, XStackProps } from 'tamagui';
import { ThemedLinearGradient } from '../ThemedLinearGradient';

interface ChipProps extends Omit<XStackProps, 'href'> {
    title?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    theme: ThemeName;
    href?: HrefObject;
    onPress?: () => void;
}

export const Chip = ({ title, icon, children, theme, href, onPress, ...rest }: ChipProps) => {
    const chipContent = (
        <XStack
            theme={theme}
            py="$1"
            px="$2"
            br="$3"
            bg="$backgroundPress"
            bw={1}
            boc="$borderColorStrong"
            ai="center"
            jc="center"
            h="$5"
            gap="$1.5"
            onPress={onPress}
            pressStyle={onPress ? { opacity: 0.7 } : undefined}
            elevation={3}
            {...rest}
        >
            <ThemedLinearGradient br="$3" colors={['$background', '$backgroundPress']} />
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
