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
    <Heading
      fow="bold"
      numberOfLines={1}
      ellipsizeMode="tail" // if it still can’t fit, add …
      adjustsFontSizeToFit // shrink to fit (native)
      minimumFontScale={0.8} // don’t shrink below 80% (tweak as needed){...props}>
      {...props}
    >
      {product.name}
      {children}
    </Heading>
  );
};
