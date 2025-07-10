import { formatPrice } from "@/utils/helpers";
import { StyleSheet, Text } from "react-native";
interface PriceProps {
    price: string;
}

export const ProductPrice: React.FC<PriceProps> = ({ price }) => {
    return <Text style={styles.price}>{formatPrice(price)}</Text>;
};

const styles = StyleSheet.create({
    price: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});