export type CartAddItemOptions = {
  id: number;
  quantity: number;
  variation?: Record<string, string>[];
  extensions?: {
    app_fpf?: {
      values: Record<string, string>;
    };
  };
};
