// useAddToCart.ts
import { Purchasable } from '@/domain/Product/Purchasable'
import { AddItemOptions, useCartStore } from '@/stores/cartStore'
import { useToastController } from '@tamagui/toast'

export const useAddToCart = () => {

    const addItem = useCartStore(s => s.addItem) // action identity is stable
    const toast = useToastController()

    return async (purchasable: Purchasable, qty = 1) => {
        const options = toAddItemOptions(purchasable, qty)
        await addItem(options)
        toast.show('Lagt til i handlekurv', { message: purchasable.product.name })
    }
}


const toAddItemOptions = (p: Purchasable, qty = 1): AddItemOptions => {
    if (!p.isValid) throw new Error(p.message)

    const variation = (p.productVariation?.getParsedVariation() ?? [])
        .map(v => ({ attribute: v.name, value: v.value }))

    return { id: p.product.id, quantity: qty, variation }
}