import { Button, SizableText, Tooltip } from "tamagui";

export default function TooltipTest() {
    return (
        <Tooltip>
            <Tooltip.Trigger>
                <Button borderColor="black" borderWidth="$1">Show tooltip</Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
                <Tooltip.Arrow />
                <SizableText size="$5" color="black">Tooltip text</SizableText>
            </Tooltip.Content>
        </Tooltip>
    );
}
