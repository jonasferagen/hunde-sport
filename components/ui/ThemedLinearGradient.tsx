import { LinearGradient } from '@tamagui/linear-gradient';
import { styled } from 'tamagui';

export const ThemedLinearGradient = styled(LinearGradient, {
    name: 'ThemedLinearGradient',
    fullscreen: true,
    start: [0, 0],
    end: [1, 1],
    colors: ['$background', '$backgroundFocus'],
    f: 1,
});

