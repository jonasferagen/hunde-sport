import { router } from 'expo-router';

import { Chip } from './Chip';


type CategoryChipProps = {
    category: {
        id: number;
        name: string;
    };
};

export const CategoryChip = ({ category }: CategoryChipProps) => {
    return (
        <Chip
            label={category.name}
            onPress={() => router.push(`/category?id=${category.id}&name=${category.name}`)}
            variant="primary"
        />
    );
};
