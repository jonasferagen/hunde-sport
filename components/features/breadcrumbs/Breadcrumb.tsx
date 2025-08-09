import { Link } from 'expo-router';
import React from 'react';
import { SizableText, Stack, XStack } from 'tamagui';

import { routes } from '@/config/routes';
import { ProductCategory } from '@/models/ProductCategory';
import { ChevronRight } from '@tamagui/lucide-icons';

interface BreadcrumbProps {
  productCategory?: ProductCategory;
  isLast?: boolean;
  isLastClickable?: boolean;
}

export const Breadcrumb = React.memo(({ productCategory,
  isLast = false,
  isLastClickable = false,

}: BreadcrumbProps) => {

  const breadcrumbText = (
    <SizableText
      fos="$5"
      fow={isLast && !isLastClickable ? 'normal' : 'bold'}
      textDecorationLine={isLast && !isLastClickable ? 'none' : 'underline'}>
      {productCategory?.name}
    </SizableText>
  );

  if (!productCategory) {
    return null;
  }

  return (
    <XStack ai="center">
      {isLast && !isLastClickable ? (
        breadcrumbText
      ) : (
        <Link replace href={routes['product-category'].path(productCategory)} asChild>
          {breadcrumbText}
        </Link>
      )}
      {!isLast && (
        <Stack  >
          <ChevronRight size="$4" />
        </Stack>
      )}
    </XStack>
  );
});
