import { ThemedButton, ThemedXStack, ThemedYStack } from "@/components/ui/";
import { useProductCategoryContext } from "@/contexts";
import { ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import React from "react";
import Animated, { LinearTransition, SlideInLeft, SlideOutRight } from "react-native-reanimated";
import { StackProps } from "tamagui";
import { ProductCategoryChips } from "../product-category/ProductCategoryChips";
import { Breadcrumbs } from "./Breadcrumbs";

export const BreadCrumbsContainer = ({ defaultOpen = false, ...stackProps }: StackProps & { defaultOpen?: boolean }) => {

    const { productCategories } = useProductCategoryContext();
    const [showCategories, setShowCategories] = React.useState(defaultOpen);

    React.useEffect(() => {
        setShowCategories(defaultOpen);
    }, [defaultOpen]);


    return (
        <ThemedYStack {...stackProps}>
            <ThemedXStack split>
                <Breadcrumbs isLastClickable={true} />
                <ThemedButton
                    circular
                    disabled={productCategories.length === 0}
                    onPress={() => setShowCategories(!showCategories)}>
                    {showCategories ? <ChevronUp /> : <ChevronDown />}
                </ThemedButton>

            </ThemedXStack>
            {(showCategories) &&
                <Animated.View
                    key="product-category-chips"
                    layout={LinearTransition.springify()}
                    entering={SlideInLeft.springify().mass(0.7)}
                    exiting={SlideOutRight.duration(160)}
                    collapsable={false}
                    style={{ alignSelf: 'stretch' }}
                >
                    <ProductCategoryChips productCategories={productCategories} />
                </Animated.View>
            }
        </ThemedYStack>

    );
};

