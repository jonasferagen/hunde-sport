import { ThemedButton } from "@/components/ui/ThemedButton";
import { useProductContext, useShoppingCartContext } from "@/contexts";
import { AlertCircle, ShoppingCart } from "@tamagui/lucide-icons";

export const BuyButton = () => {
    const { product, productVariation } = useProductContext();
    const { increaseQuantity } = useShoppingCartContext();

    const activeProduct = productVariation || product;

    const needsVariant = product.hasVariations() && !productVariation;
    const buttonTheme = needsVariant ? 'secondary' : 'primary';
    const buttonText = needsVariant ? 'Velg variant' : 'Legg til i handlekurv';
    const buttonIcon = needsVariant ? <AlertCircle /> : <ShoppingCart />;
    const isDisabled = needsVariant || !activeProduct.isInStock();

    const handleAddToCart = () => {
        increaseQuantity({ product, productVariation });
    };

    return (
        <ThemedButton
            theme={buttonTheme}
            icon={buttonIcon}
            onPress={handleAddToCart}
            disabled={isDisabled}
            fontWeight="bold"
        >
            {buttonText}
        </ThemedButton>
    );
};

