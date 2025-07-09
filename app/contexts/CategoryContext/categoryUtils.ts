import type { Category } from '../../../types';

export const mapToCategory = (item: any): Category => ({
    id: item.id,
    name: item.name,
    parent: item.parent,
    image: item.image,
});

export const getKey = (parentId: number | null): string =>
    parentId?.toString() ?? 'root';

export default mapToCategory;