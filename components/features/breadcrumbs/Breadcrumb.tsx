import { Link } from 'expo-router';
import React from 'react';
import { Spinner, Stack, Text, XStack } from 'tamagui';

import { Icon } from '@/components/ui/icon/Icon';
import { routes } from '@/config/routes';
import { Category } from '@/models/Category';

interface BreadcrumbProps {
  category?: Category;
  isLast?: boolean;
  isLastClickable?: boolean;
  loading?: boolean;
}

export const Breadcrumb = React.memo(({ category, isLast = false, isLastClickable = false, loading = false }: BreadcrumbProps) => {
  if (loading) {
    return <Spinner size="small" marginRight="$2" />;
  }

  if (!category) {
    return null;
  }

  const breadcrumbText = (
    <Text fontWeight={isLast && !isLastClickable ? 'bold' : 'normal'} textDecorationLine={isLast && !isLastClickable ? 'none' : 'underline'}>
      {category.name}
    </Text>
  );

  return (
    <XStack alignItems="center">
      {isLast && !isLastClickable ? (
        breadcrumbText
      ) : (
        <Link replace href={routes.category(category)} asChild>
          {breadcrumbText}
        </Link>
      )}
      {!isLast && (
        <Stack marginHorizontal="$1" marginTop="$1">
          <Icon
            name="breadcrumbSeparator"
            size="md"
          />
        </Stack>
      )}
    </XStack>
  );
});
