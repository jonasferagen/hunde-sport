import { H4, YStack } from 'tamagui';

interface NotFoundScreenProps {
    message?: string;
}

export const NotFoundScreen = ({ message = 'Siden ble ikke funnet.' }: NotFoundScreenProps) => {
    return (
        <YStack flex={1} jc="center" ai="center">
            <H4>{message}</H4>
        </YStack>
    );
};
