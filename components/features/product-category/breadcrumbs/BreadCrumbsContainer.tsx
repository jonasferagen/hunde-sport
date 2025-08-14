import { ThemedButton, ThemedXStack, ThemedYStack } from "@/components/ui/themed-components";
import { useProductCategoryContext } from "@/contexts";
import { ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
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
                <ThemedButton
                    fs={0}
                    circular
                    disabled={productCategories.length === 0}
                    onPress={() => setShowCategories(!showCategories)}>
                    {showCategories ? <ChevronUp /> : <ChevronDown />}
                </ThemedButton>
                <ThemedXStack fs={1}>
                    <Breadcrumbs isLastClickable={true} />
                </ThemedXStack>

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

