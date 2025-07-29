import { routes } from '@/config/routes';
import { router } from 'expo-router';
import { Button, H1, YStack } from 'tamagui';

interface NotFoundScreenProps {
    message?: string;
}

export const NotFoundScreen = ({ message = 'Siden ble ikke funnet.' }: NotFoundScreenProps) => {
    return (
        <YStack flex={1} jc="center" ai="center" gap="$4">
            <H1 lineHeight={40} padding="$5" flex={0}>404 - Siden finnes ikke</H1>
            <Button onPress={() => router.replace(routes.index.path())}>Gå tilbake til forsiden</Button>
        </YStack>
    );
};
