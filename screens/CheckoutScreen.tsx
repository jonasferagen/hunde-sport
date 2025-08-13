import { PageBody, PageHeader, PageView } from '@/components/layout';
import { DefaultTextContent } from '@/components/ui/DefaultTextContent';
import { useCartStore } from '@/stores/cartStore';
import { JSX } from 'react';
import { Linking } from 'react-native';
import { SizableText } from 'tamagui';

export const CheckoutScreen = (): JSX.Element => {
    const { checkout } = useCartStore();

    const init = async () => {
        const checkoutUrl = await checkout();
        console.log(checkoutUrl);
        await Linking.openURL(checkoutUrl.toString());
    };

    init();

    return (
        <PageView>
            <PageHeader>
                <SizableText>Kassen</SizableText>
            </PageHeader>
            <PageBody>
                <DefaultTextContent>
                    Forbereder kassen...
                </DefaultTextContent>
            </PageBody>
        </PageView>
    );
};
