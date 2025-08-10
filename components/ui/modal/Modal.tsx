import { X } from "@tamagui/lucide-icons";
import { Sheet } from "tamagui";
import { ThemedButton } from "../themed-components/ThemedButton";
import { ThemedXStack, ThemedYStack } from "../themed-components/ThemedStack";
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

                <ThemedYStack w="100%" h="100%" bg="blue" pos="relative" f={1} >
                    <ThemedXStack fs={1} bg="red" ai="flex-start" jc="flex-end">
                        <ThemedButton
                            my="$3"
                            mr="$3"
                            size="$6"
                            circular
                            icon={<X size="$4" />}
                            onPress={() => onOpenChange(false)}
                        />
                    </ThemedXStack>
                    <ThemedXStack>
                        {children}
                    </ThemedXStack>
                </ThemedYStack>
            </Sheet.Frame>
        </Sheet>
    );
}