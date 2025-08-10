import { Toast, useToastState } from '@tamagui/toast';
import { useWindowDimensions } from 'react-native';

export const AppToast = () => {
    const toast = useToastState()

    const { width: windowWidth, height: windowHeight } = useWindowDimensions();



    if (!toast || toast.isHandledNatively || toast.hide) return <></>



    return (
        <Toast
            key={toast.id}
            duration={toast.duration}
            viewportName={toast.viewportName}
            theme={toast.theme ?? 'primary'}
            animation="medium"
            enterStyle={{ y: 40, opacity: 0 }}
            exitStyle={{ y: 40, opacity: 0 }}
            borderRadius="$4"
            borderColor="$borderColor"
            borderWidth={1}
            backgroundColor="$background"
            opacity={1}
            position="absolute"
            bottom={0}
            right={-windowWidth / 2 + 20}
            zIndex={1000}



        >
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.Description>{toast.message}</Toast.Description>
        </Toast>
    )
}
