import { Loader } from "@/components/ui";
import Chip from "@/components/ui/Chip";
import { useBreadcrumbs } from "@/hooks/Breadcrumb/BreadcrumbProvider";
import { useCategories } from "@/hooks/Category/Category";
import { SPACING } from "@/styles/Dimensions";
import { Category } from "@/types";
import { memo, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";


interface CategoryProps {
    categoryId: number;
    limit?: number;
};

interface CategoryListItemProps {
    category: Category;
    style?: StyleProp<ViewStyle>;
}

// Memoized list item component with areEqual comparison
export const CategoryListItem = memo<CategoryListItemProps>(
    ({ category, style }) => {
        const { breadcrumbs, setTrail } = useBreadcrumbs();

        const handlePress = () => {
            const newTrail = [...breadcrumbs];
            newTrail.push({ id: category.id, name: category.name, type: "category" as const });
            setTrail(newTrail, true);
        };

        return (
            <Chip
                label={category.name}
                onPress={handlePress}
                variant="secondary"
                style={style}
            />
        );
    },
    (prevProps, nextProps) => {
        return prevProps.category.id === nextProps.category.id && prevProps.category.name === nextProps.category.name;
    }
);

export const CategoryList = ({ ...props }: CategoryProps) => {

    const { categoryId, limit } = props;
    const { categories, isFetchingNextPage } = useCategories(categoryId);
    const [showAll, setShowAll] = useState(false);

    const limitedCategories = limit ? categories.slice(0, limit) : categories;
    const displayedCategories = showAll ? categories : limitedCategories;

    console.log("category list rendered for", categoryId);
    return (
        <View style={styles.container}>
            {categories.length > 0 && (
                <View style={styles.listContainer}>

                    {displayedCategories.map((category) => (
                        <CategoryListItem key={category.id} category={category} />
                    ))}
                    {isFetchingNextPage && <Loader size="small" />}
                    {!showAll && limit && categories.length > limit && (
                        <Chip
                            label={`Mer..(${categories.length - limit})`}
                            onPress={() => setShowAll(true)}
                            variant="accent"
                        />
                    )}

                    {showAll && (
                        <>

                            {limit && (
                                <Chip
                                    label={"Skjul.."}
                                    onPress={() => setShowAll(false)}
                                    variant="accent"
                                />
                            )}
                        </>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
    },
    listContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: SPACING.sm,
    },
});