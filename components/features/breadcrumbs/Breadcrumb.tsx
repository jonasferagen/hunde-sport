import { Link } from 'expo-router';
import React from 'react';
import { SizableText, Stack, XStack } from 'tamagui';

import { routes } from '@/config/routes';
import { Category } from '@/models/Category';
import { ChevronRight } from '@tamagui/lucide-icons';

interface BreadcrumbProps {
  category?: Category;
  isLast?: boolean;
  isLastClickable?: boolean;
  loading?: boolean;
}

export const Breadcrumb = React.memo(({ category,
  isLast = false,
  isLastClickable = false,
  loading = false
}: BreadcrumbProps) => {

  const breadcrumbText = (
    <SizableText fontSize="$5" fontWeight={isLast && !isLastClickable ? 'normal' : 'bold'} textDecorationLine={isLast && !isLastClickable ? 'none' : 'underline'}>
      {category?.name}
    </SizableText>
  );

  if (loading) {
    return <SizableText fontSize="$5" color="$colorTransparent">Placeholder</SizableText>;
  }

  if (!category) {
    return null;
  }

  return (
    <XStack ai="center">
      {isLast && !isLastClickable ? (
        breadcrumbText
      ) : (
        <Link replace href={routes.category.path(category)} asChild>
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
