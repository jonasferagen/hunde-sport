import type { Category } from '../../../types';

export const mapToCategory = (item: any): Category => ({
    id: item.id,
    name: item.name,
    parent: item.parent,
    image: item.image,
});


export default mapToCategory;