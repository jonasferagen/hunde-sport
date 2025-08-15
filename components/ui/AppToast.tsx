// AppToast.tsx
import { Toast, useToastState } from '@tamagui/toast';

export const AppToast = () => {
    const toast = useToastState();

    if (!toast || toast.isHandledNatively || toast.hide) return null;

    return (
        <Toast
            key={toast.id}
            duration={toast.duration}
            theme={toast.theme ?? 'primary'}
            animation="medium"
            enterStyle={{ y: 40, opacity: 0 }}
            exitStyle={{ y: 40, opacity: 0 }}
            br="$4"
            bw={1}
            boc="$borderColor"
            bg="$background"
            position="relative"
        >
            <Toast.Title>{toast.title}</Toast.Title>
            {toast.message ? <Toast.Description>{toast.message}</Toast.Description> : null}
        </Toast>
    );
};
