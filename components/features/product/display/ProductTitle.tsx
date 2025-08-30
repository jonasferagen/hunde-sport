import { Heading, SizableTextProps } from "tamagui";

import { BaseProduct } from "@/types";

interface ProductTitleProps extends SizableTextProps {
  product: BaseProduct;
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
