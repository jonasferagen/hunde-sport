import {
  PageBody,
  PageFooter,
  PageSection,
  PageView,
} from "@/components/chrome/layout";
import { CartList } from "@/components/features/cart/CartList";
import { CheckoutButton } from "@/components/features/cart/CheckoutButton";
import { useScreenReady } from "@/hooks/ui/useScreenReady";

export const CartScreen = () => {
  const ready = useScreenReady(); // or useScreenReady(50) to push a frame
  return (
    <PageView>
      <PageBody>
        <PageSection fill mih={0} f={1}>
          {ready && <CartList />}
        </PageSection>
      </PageBody>
      <PageFooter>{ready && <CheckoutButton />}</PageFooter>
    </PageView>
  );
};
