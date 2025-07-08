import React from 'react';
import { Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import type { Category } from '../../../types';

interface CategoryListItemProps {
    category: Category;
}
const CategoryListItem: React.FC<CategoryListItemProps> = ({ category }) => {
    console.log(category);
    return (
        <View>
            <SvgUri 
                uri={category.image!.src}
            />
            <Text>{category.name}</Text>
        </View>
    );
};


export default CategoryListItem;
