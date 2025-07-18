// AddressForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { z } from 'zod';

import { PageContent, PageSection } from '@/components/layout';
import { Button } from '@/components/ui/button/Button';
import { FormField } from '@/components/ui/form/FormField';
import { FormRow } from '@/components/ui/form/FormRow';
import { SPACING } from '@/styles/Dimensions';

const addressSchema = z.object({
    first_name: z.string().min(1, { message: 'Fornavn er påkrevd' }),
    last_name: z.string().min(1, { message: 'Etternavn er påkrevd' }),
    address_1: z.string().min(1, { message: 'Adresse er påkrevd' }),
    city: z.string().min(1, { message: 'By er påkrevd' }),
    postcode: z.string().min(1, { message: 'Postnummer er påkrevd' }),
    email: z.string().email({ message: 'Ugyldig e-postadresse' }),
    phone: z.string().min(8, { message: 'Telefonnummer er påkrevd' }),
});

type AddressFormData = z.infer<typeof addressSchema>;

export const AddressForm = ({ onSubmit }: { onSubmit: (data: AddressFormData) => void }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
    });

    return (
        <PageSection scrollable>
            <PageContent>
                <FormRow>
                    <FormField
                        name="first_name"
                        label="Fornavn"
                        control={control}
                        errors={errors}
                    />
                    <FormField
                        name="last_name"
                        label="Etternavn"
                        control={control}
                        errors={errors}
                    />
                </FormRow>

                <FormField
                    name="address_1"
                    label="Adresse"
                    control={control}
                    errors={errors}
                    containerStyle={styles.singleField}
                />

                <FormRow>
                    <FormField name="city" label="By" control={control} errors={errors} />
                    <FormField
                        name="postcode"
                        label="Postnummer"
                        control={control}
                        errors={errors}
                        keyboardType="numeric"
                    />
                </FormRow>


                <FormField
                    name="email"
                    label="E-post"
                    control={control}
                    errors={errors}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    containerStyle={styles.singleField}
                />
                <FormField
                    name="phone"
                    label="Telefon"
                    control={control}
                    errors={errors}
                    keyboardType="phone-pad"
                    containerStyle={styles.singleField}
                />

                <View style={styles.buttonContainer}>
                    <Button title="Send inn" onPress={handleSubmit(onSubmit)} />
                </View>
            </PageContent>
        </PageSection>
    );
};

const styles = StyleSheet.create({
    singleField: {
        marginBottom: SPACING.md,
    },
    buttonContainer: {
        marginTop: SPACING.lg,
    },
});
