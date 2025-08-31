// components/features/product/purchase/ProductCustomizationForm.tsx
import * as React from "react";
import { Label } from "tamagui";

import {
  ThemedInput,
  ThemedXStack,
  ThemedYStack,
} from "@/components/ui/themed-components";
import type { CustomField } from "@/domain/extensions/CustomField";

type Props = {
  fields: CustomField[]; // initial fields (from Purchasable.product.customFields)
  onChange: (next: CustomField[]) => void; // emits full array on each edit
};

/** Single field row (no validation; single-line only) */
function CustomFieldRow({
  field,
  onChange,
}: {
  field: CustomField;
  onChange: (updated: CustomField) => void;
}) {
  const handleChange = React.useCallback(
    (text: string) => {
      // choose one: immutable or mutable
      // const updated = field.withValue(text);    // immutable
      const updated = field.setValue(text); // mutable (practical)
      onChange(updated);
    },
    [field, onChange]
  );

  return (
    <ThemedYStack key={field.key}>
      <ThemedXStack split mb="$1.5">
        <Label htmlFor={field.key} size="$3">
          {field.label}
        </Label>
      </ThemedXStack>
      <ThemedInput
        id={field.key}
        value={field.value ?? ""}
        onChangeText={handleChange}
        numberOfLines={1}
        multiline={false}
      />
    </ThemedYStack>
  );
}

/** Form that manages an array of CustomField and returns it on change */
export const ProductCustomizationForm: React.FC<Props> = ({
  fields,
  onChange,
}) => {
  const [items, setItems] = React.useState<CustomField[]>(fields);

  // If parent replaces `fields` (e.g., product changes), sync local state.
  React.useEffect(() => {
    setItems(fields);
  }, [fields]);

  const handleFieldChange = React.useCallback(
    (updated: CustomField) => {
      // Replace by key; create a new array ref
      const next = items.map((f) => (f.key === updated.key ? updated : f));
      setItems(next);
      onChange(next);
    },
    [items, onChange]
  );

  return (
    <ThemedYStack gap="$3">
      {items.map((f) => (
        <CustomFieldRow key={f.key} field={f} onChange={handleFieldChange} />
      ))}
    </ThemedYStack>
  );
};
