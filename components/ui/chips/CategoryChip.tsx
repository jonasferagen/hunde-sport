
import { useBreadcrumbs } from '@/contexts/BreadcrumbContext';
import { Category } from '@/types';
import { Chip } from './Chip';


interface CategoryChipProps {
    category: Category;

};

export const CategoryChip = ({ category }: CategoryChipProps) => {
    const { addCategory } = useBreadcrumbs();

    return (
        <Chip
            label={category.name}
            onPress={() => addCategory(category)}
            variant="primary"
        />
    );
};
