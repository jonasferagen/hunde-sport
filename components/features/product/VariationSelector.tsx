import { Chip, CustomText } from '@/components/ui';
import { SPACING } from '@/styles';
import { Attribute } from '@/types';
import { StyleSheet, View } from 'react-native';

interface VariationSelectorProps {
    attribute: Attribute;
    onSelectOption: (option: string) => void;
    selectedOption: string | null;
};

export const VariationSelector = ({ attribute, onSelectOption, selectedOption }: VariationSelectorProps) => {

    if (!attribute.options.length) {
        return null;
    }

    return (
        <View style={styles.container}>
            <CustomText bold size="md">{attribute.name}</CustomText>
            <View style={styles.chipsContainer}>
                {attribute.options.map(option => (
                    <Chip
                        key={option}
                        label={option}
                        onPress={() => onSelectOption(option)}
                        variant={selectedOption === option ? 'primary' : 'secondary'}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: SPACING.md,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginTop: SPACING.sm,
    },
});
