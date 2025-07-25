import { SizableText, YStack } from 'tamagui';

interface NotFoundProps {
    message?: string;
}

export const NotFound = ({ message = 'Siden ble ikke funnet.' }: NotFoundProps) => {
    return (
        <YStack flex={1} jc="center" ai="center">
            <SizableText>{message}</SizableText>
        </YStack>
    );
};
