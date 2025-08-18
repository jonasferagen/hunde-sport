import { ThemedButton, ThemedText, ThemedXStack, ThemedYStack } from "@/components/ui/themed-components";
import { useProductCategoryContext } from "@/contexts";
import React from "react";
import Animated, { LinearTransition, SlideInLeft, SlideOutDown } from "react-native-reanimated";
import { StackProps } from "tamagui";
import { ProductCategoryChips } from "../ProductCategoryChips";
import { Breadcrumbs } from "./Breadcrumbs";

export const BreadCrumbsContainer = ({ ...stackProps }: StackProps & { defaultOpen?: boolean }) => {

    const { productCategories } = useProductCategoryContext();
    const [showCategories, setShowCategories] = React.useState(false);


    return (
        <ThemedYStack  {...stackProps}>
            <ThemedXStack ai="center" f={1}>
                <ThemedYStack f={1}>
                    <Breadcrumbs isLastClickable={true} />
                </ThemedYStack>
                <ThemedButton
                    circular
                    theme="dark_primary"
                    disabled={productCategories.length === 0}
                    onPress={() => setShowCategories(!showCategories)}>
                    <ThemedText fos="$5" bold>{productCategories.length}</ThemedText>
                </ThemedButton>
            </ThemedXStack>

            {(showCategories) &&
                <Animated.View
                    layout={LinearTransition.springify()}
                    entering={SlideInLeft.springify().mass(0.5)}
                    exiting={SlideOutDown.duration(160)}
                    collapsable={false}
                    style={{ alignSelf: 'stretch' }}
                >
                    <ProductCategoryChips productCategories={productCategories} />
                </Animated.View>
            }

        </ThemedYStack>

    );
};

