import { ThemedButton, ThemedText, ThemedXStack, ThemedYStack } from "@/components/ui/themed-components";
import { useProductCategoryContext } from "@/contexts";
import { ChevronsDown, ChevronsUp } from "@tamagui/lucide-icons";
import React, { useEffect } from "react";
import Animated, { LinearTransition, SlideInLeft, SlideOutDown } from "react-native-reanimated";
import { StackProps } from "tamagui";
import { ProductCategoryChips } from "../ProductCategoryChips";
import { Breadcrumbs } from "./Breadcrumbs";

export const BreadCrumbsContainer = ({ ...stackProps }: StackProps) => {

    const { productCategories, productCategory } = useProductCategoryContext();
    const [showCategories, setShowCategories] = React.useState(false);

    useEffect(() => {
        setShowCategories(false);
    }, [productCategory]);

    return (
        <ThemedYStack mih="$4" {...stackProps}>
            <ThemedXStack ai="center" f={1} mih="$4">
                <ThemedYStack f={1}>
                    <Breadcrumbs isLastClickable={true} />
                </ThemedYStack>
                <ThemedButton
                    circular
                    disabled={productCategories.length === 0}
                    onPress={() => setShowCategories(!showCategories)}>
                    <ThemedText fos="$5" bold>{showCategories ? <ChevronsUp /> : <ChevronsDown />}</ThemedText>
                </ThemedButton>
            </ThemedXStack>
            {showCategories && productCategories.length > 0 && (
                <Animated.View
                    // ✅ keep the animated container stable (no key)
                    layout={LinearTransition.springify()}
                    entering={SlideInLeft.springify().mass(0.5)}
                    exiting={SlideOutDown.duration(160)}
                    // collapsable can be omitted
                    style={{ alignSelf: 'stretch', paddingBottom: 50 }}
                >
                    {/* ✅ if you need a fresh list per category, key the CHILD, not the animated wrapper */}
                    <ProductCategoryChips
                        key={productCategory?.id ?? 'chips'}
                        productCategories={productCategories}
                    />
                </Animated.View>
            )}
        </ThemedYStack>
    );
};

