

export const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
};

export const formatPrice = (price: string): string => {
    return Number(price).toFixed(0).replace('.', ',') + ',-';
};
