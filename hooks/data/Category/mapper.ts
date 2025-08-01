import { Category } from '@/models/Category';
export const mapToCategory = (item: any): Category => new Category({
    id: item.id,
    name: item.name,
    parent: item.parent,
    image: item.image,
    description: item.description,
});
