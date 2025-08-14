import { Link } from 'expo-router';
import React from 'react';

import { ThemedText, ThemedXStack } from '@/components/ui';
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
    <ThemedText
      size="$6"
      fow={isLast && !isLastClickable ? 'normal' : 'bold'}
      textDecorationLine={isLast ? 'none' : 'underline'}>
      {productCategory?.name}
    </ThemedText>
  );

  if (!productCategory) {
    return null;
  }

  return (
    <ThemedXStack gap="none">
      {isLast && !isLastClickable ? (
        breadcrumbText
      ) : (
        <Link replace href={routes['product-category'].path(productCategory)} asChild>
          {breadcrumbText}
        </Link>
      )}
      {!isLast && (
        <ChevronRight size="$2" />
      )}
    </ThemedXStack>
  );
});
