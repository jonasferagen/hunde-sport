import { Button, styled } from 'tamagui';

export const ThemedButton = styled(Button, {
    name: 'ThemedButton',
    color: '$color',
    backgroundColor: '$background',
    borderColor: '$borderColor',
    borderWidth: '$borderWidth',
    borderRadius: '$3',
    fontWeight: 'bold',
    disabledStyle: {
        opacity: 0.5,
    }
});