// AddressForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Form, Input, Label, ScrollView, Text, XStack, YStack } from 'tamagui';
import { z } from 'zod';

const addressSchema = z.object({
    first_name: z.string().min(1, { message: 'Fornavn er påkrevd' }),
    last_name: z.string().min(1, { message: 'Etternavn er påkrevd' }),
    address_1: z.string().min(1, { message: 'Adresse er påkrevd' }),
    address_2: z.string().optional(),
    city: z.string().min(1, { message: 'By er påkrevd' }),
    state: z.string().min(1, { message: 'Stat/fylke er påkrevd' }),
    postcode: z.string().min(1, { message: 'Postnummer er påkrevd' }),
    email: z.string().email({ message: 'Ugyldig e-postadresse' }),
    phone: z.string().min(8, { message: 'Telefonnummer er påkrevd' }),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
    onSubmit: (data: AddressFormData) => void;
    initialData?: Partial<AddressFormData>;
}

export const AddressForm = ({ onSubmit, initialData }: AddressFormProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: initialData,
    });

    return (
        <Form onSubmit={handleSubmit(onSubmit)} flex={1}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <YStack gap="$4" padding="$4">
                    <XStack gap="$4">
                        <YStack flex={1} gap="$2">
                            <Label htmlFor="first_name">Fornavn</Label>
                            <Controller
                                control={control}
                                name="first_name"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        id="first_name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Fornavn"
                                        borderColor={errors.first_name ? '$red10' : undefined}
                                    />
                                )}
                            />
                            {errors.first_name && (
                                <Text color="$red10" fontSize="$2">
                                    {errors.first_name.message}
                                </Text>
                            )}
                        </YStack>

                        <YStack flex={1} gap="$2">
                            <Label htmlFor="last_name">Etternavn</Label>
                            <Controller
                                control={control}
                                name="last_name"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        id="last_name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Etternavn"
                                        borderColor={errors.last_name ? '$red10' : undefined}
                                    />
                                )}
                            />
                            {errors.last_name && (
                                <Text color="$red10" fontSize="$2">
                                    {errors.last_name.message}
                                </Text>
                            )}
                        </YStack>
                    </XStack>

                    <YStack gap="$2">
                        <Label htmlFor="address_1">Adresse</Label>
                        <Controller
                            control={control}
                            name="address_1"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    id="address_1"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Adresselinje 1"
                                    borderColor={errors.address_1 ? '$red10' : undefined}
                                />
                            )}
                        />
                        {errors.address_1 && (
                            <Text color="$red10" fontSize="$2">
                                {errors.address_1.message}
                            </Text>
                        )}
                    </YStack>

                    <YStack gap="$2">
                        <Label htmlFor="address_2">Adresselinje 2 (valgfritt)</Label>
                        <Controller
                            control={control}
                            name="address_2"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    id="address_2"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Adresselinje 2"
                                    borderColor={errors.address_2 ? '$red10' : undefined}
                                />
                            )}
                        />
                        {errors.address_2 && (
                            <Text color="$red10" fontSize="$2">
                                {errors.address_2.message}
                            </Text>
                        )}
                    </YStack>

                    <XStack gap="$4">
                        <YStack flex={1} gap="$2">
                            <Label htmlFor="city">By</Label>
                            <Controller
                                control={control}
                                name="city"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        id="city"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="By"
                                        borderColor={errors.city ? '$red10' : undefined}
                                    />
                                )}
                            />
                            {errors.city && (
                                <Text color="$red10" fontSize="$2">
                                    {errors.city.message}
                                </Text>
                            )}
                        </YStack>

                        <YStack flex={1} gap="$2">
                            <Label htmlFor="postcode">Postnummer</Label>
                            <Controller
                                control={control}
                                name="postcode"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        id="postcode"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Postnummer"
                                        keyboardType="numeric"
                                        borderColor={errors.postcode ? '$red10' : undefined}
                                    />
                                )}
                            />
                            {errors.postcode && (
                                <Text color="$red10" fontSize="$2">
                                    {errors.postcode.message}
                                </Text>
                            )}
                        </YStack>
                    </XStack>

                    <YStack gap="$2">
                        <Label htmlFor="email">E-post</Label>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    id="email"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="E-post"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    borderColor={errors.email ? '$red10' : undefined}
                                />
                            )}
                        />
                        {errors.email && (
                            <Text color="$red10" fontSize="$2">
                                {errors.email.message}
                            </Text>
                        )}
                    </YStack>

                    <YStack gap="$2">
                        <Label htmlFor="phone">Telefon</Label>
                        <Controller
                            control={control}
                            name="phone"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    id="phone"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Telefon"
                                    keyboardType="phone-pad"
                                    borderColor={errors.phone ? '$red10' : undefined}
                                />
                            )}
                        />
                        {errors.phone && (
                            <Text color="$red10" fontSize="$2">
                                {errors.phone.message}
                            </Text>
                        )}
                    </YStack>

                    <Form.Trigger asChild>
                        <Button marginTop="$4">
                            Send inn
                        </Button>
                    </Form.Trigger>
                </YStack>
            </ScrollView>
        </Form>
    );
};
