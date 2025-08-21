// useAddToCart.ts
import { Purchasable } from '@/domain/Product/Purchasable'
import { haptic } from '@/lib/haptics'
import { AddItemOptions, useCartStore } from '@/stores/cartStore'
import { useToastController } from '@tamagui/toast'
import React from 'react'

type AddResult = { ok: true } | { ok: false; error?: string }

export const useAddToCart = () => {
    const addItem = useCartStore(s => s.addItem)   // stable
    const toast = useToastController()

    return React.useCallback(async (p: Purchasable, qty = 1): Promise<AddResult> => {
        try {
            const options = toAddItemOptions(p, qty)   // throws if !p.isValid
            await addItem(options)
            haptic.success()
            toast.show('Lagt til i handlekurv', { message: p.product.name })
            return { ok: true }
        } catch (e: any) {
            const msg = e?.message ?? 'Kunne ikke legge til'
            haptic.error()
            toast.show('Feil', { message: msg })
            return { ok: false, error: msg }
        }
    }, [addItem, toast])
}

const toAddItemOptions = (p: Purchasable, qty = 1): AddItemOptions => {
    if (!p.isValid) throw new Error(p.message || 'Velg variant')
    const variation = (p.productVariation?.getParsedVariation() ?? [])
        .map(v => ({ attribute: v.name, value: v.value }))
    return { id: p.product.id, quantity: qty, variation }
}
