import { LinearGradient } from '@tamagui/linear-gradient';
import { styled } from 'tamagui';

export const ThemedLinearGradient = styled(LinearGradient, {
    name: 'ThemedLinearGradient',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    start: [0, 0],
    end: [1, 1],
    colors: ['$background', '$backgroundPress'],
    f: 1,
});

