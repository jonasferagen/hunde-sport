import { X } from "@tamagui/lucide-icons";
import { Sheet, SizableText } from "tamagui";
import { ThemedButton } from "../ThemedButton";

export const Modal = ({
    children,
    open,
    onOpenChange
}: { children: React.ReactNode, open: boolean, onOpenChange: (open: boolean) => void }) => {

    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}
            modal={true}
            dismissOnSnapToBottom
        >
            <Sheet.Overlay />
            <Sheet.Handle />
            <Sheet.Frame f={1} p="$4"
                jc="center"
                ai="center"
                gap="$4"
                boc="black"
                bw={1}>

                <ThemedButton
                    pos="absolute"
                    top="$3"
                    right="$3"
                    size="$5"

                    circular
                    icon={<X size="$3" />}
                    onPress={() => onOpenChange(false)}
                />

                <SizableText size="$5" fow="bold" tt="capitalize">Velg variant</SizableText>
                {children}

            </Sheet.Frame>
        </Sheet>
    );
}