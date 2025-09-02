import { Heading, type SizableTextProps } from "tamagui";

import { Product } from "@/domain/product/Product";

interface ProductTitleProps extends SizableTextProps {
  product: Product;
}

export const ProductTitle = ({
  product,
  children,
  ...props
}: ProductTitleProps) => {
  return (
    <Heading fow="bold" {...props}>
      {product.name}
      {children}
    </Heading>
  );
};
