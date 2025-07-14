import { Chip, Heading } from '@/components/ui';
import { SPACING } from '@/styles';
import { Attribute } from '@/types';
import { StyleSheet, View } from 'react-native';

type VariationSelectorProps = {
    attribute: Attribute;
    onSelectOption: (option: string) => void;
    selectedOption: string | null;
};

export const VariationSelector = ({ attribute, onSelectOption, selectedOption }: VariationSelectorProps) => {
    return (
        <View style={styles.container}>
            <Heading title={attribute.name} size="md" />
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
        borderWidth: 1,
        borderColor: 'red',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginTop: SPACING.sm,
    },
});
