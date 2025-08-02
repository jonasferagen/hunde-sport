import { LinearGradient } from '@tamagui/linear-gradient';
import React from 'react';
import { H4, YStackProps } from 'tamagui';

interface PageHeaderProps extends YStackProps {
    title?: string;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, children, ...props }) => {
    const { start, end, ...rest } = props;

    return (
        <LinearGradient
            colors={["$background", "$backgroundPress"]}
            start={[0, 0]}
            end={[1, 1]}
            padding="$3"
            borderBottomWidth={1}
            borderColor={"$borderColor"}
            gap="$3"
            {...rest}
        >
            {title && <H4>{title}</H4>}
            {children}
        </LinearGradient>
    );
}
