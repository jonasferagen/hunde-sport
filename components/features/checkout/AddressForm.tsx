// AddressForm.tsx
import { ThemedButton } from '@/components/ui/ThemedButton';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Control, Controller, useForm } from 'react-hook-form';
import { Form, Input, Label, ScrollView, Text, XStack, YStack } from 'tamagui';
import { z } from 'zod';

const addressSchema = z.object({
    first_name: z.string().min(1, { message: 'Fornavn er påkrevd' }),
    last_name: z.string().min(1, { message: 'Etternavn er påkrevd' }),
    address_1: z.string().min(1, { message: 'Adresse er påkrevd' }),
    address_2: z.string().optional(),
    city: z.string().min(1, { message: 'By er påkrevd' }),
    postcode: z.string().min(1, { message: 'Postnummer er påkrevd' }),
    email: z.string().email({ message: 'Ugyldig e-postadresse' }),
    phone: z.string().min(8, { message: 'Telefonnummer er påkrevd' }),
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
    onSubmit: (data: AddressFormData) => void;
    initialData?: Partial<AddressFormData>;
    name: string;
}

type ControlledInputProps = {
    control: Control<any>;
    name: string;
    label: string;
    placeholder?: string;
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
    idPrefix: string;
};

const ControlledInput = ({
    control,
    name,
    label,
    placeholder,
    keyboardType = 'default',
    idPrefix,
}: ControlledInputProps) => (
    <YStack gap="$2" flex={1}>
        <Label htmlFor={`${idPrefix}-${name}`}>{label}</Label>
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <>
                    <Input
                        id={`${idPrefix}-${name}`}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder={placeholder}
                        keyboardType={keyboardType}
                        borderColor={error ? '$red10' : undefined}
                    />
                    {error && <Text color="$red10" fontSize="$2">{error.message}</Text>}
                </>
            )}
        />
    </YStack>
);

export const AddressForm = ({ onSubmit, initialData, name }: AddressFormProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: initialData,
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    return (
        <Form onSubmit={handleSubmit(onSubmit)} flex={1}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <YStack gap="$4" padding="$4">
                    <XStack gap="$4">
                        <ControlledInput
                            control={control}
                            name="first_name"
                            label="Fornavn"
                            placeholder="Fornavn"
                            idPrefix={name}
                        />
                        <ControlledInput
                            control={control}
                            name="last_name"
                            label="Etternavn"
                            placeholder="Etternavn"
                            idPrefix={name}
                        />
                    </XStack>

                    <ControlledInput
                        control={control}
                        name="address_1"
                        label="Adresse"
                        placeholder="Adresse"
                        idPrefix={name}
                    />
                    { /*
                    <ControlledInput
                        control={control}
                        name="address_2"
                        label="Leilighet, suite, etc. (valgfritt)"
                        placeholder="Leilighet, suite, etc."
                        idPrefix={name}
                    />

*/}

                    <XStack gap="$4">
                        <ControlledInput
                            control={control}
                            name="city"
                            label="By"
                            placeholder="By"
                            idPrefix={name}
                        />
                        <ControlledInput
                            control={control}
                            name="postcode"
                            label="Postnummer"
                            placeholder="Postnummer"
                            keyboardType="numeric"
                            idPrefix={name}
                        />
                    </XStack>
                    {/*
                    <ControlledInput
                        control={control}
                        name="state"
                        label="Fylke"
                        placeholder="Fylke"
                        idPrefix={name}
                    />
*/}
                    <ControlledInput
                        control={control}
                        name="email"
                        label="E-post"
                        placeholder="E-post"
                        keyboardType="email-address"
                        idPrefix={name}
                    />

                    <ControlledInput
                        control={control}
                        name="phone"
                        label="Telefon"
                        placeholder="Telefon"
                        keyboardType="phone-pad"
                        idPrefix={name}
                    />

                    <Form.Trigger asChild>
                        <ThemedButton theme='primary' marginTop="$4">Send inn</ThemedButton>
                    </Form.Trigger>
                </YStack>
            </ScrollView>
        </Form>
    );
};
