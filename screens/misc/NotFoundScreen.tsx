import { routes } from '@/config/routes';
import { router } from 'expo-router';
import { Button, H4, YStack } from 'tamagui';

interface NotFoundScreenProps {
    message?: string;
}

export const NotFoundScreen = ({ message = 'Siden ble ikke funnet.' }: NotFoundScreenProps) => {
    return (
        <YStack flex={1} jc="center" ai="center">
            <H4>{message}</H4>
            <Button onPress={() => router.replace(routes.home())}>Gå tilbake til forsiden</Button>
        </YStack>
    );
};
