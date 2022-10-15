export const useFormatter = () => ({
  formatPrice: (price: number) => {
    return price.toLocaleString('pt-br', {
      minimumFractionDigits: 2,
      style: 'currency',
      currency: 'BRL'
    });
  },
  formatQuantity: (quantity: number, mindigits: number) => {
    if (quantity.toString().length >= mindigits) {
      return quantity.toString();
    }
    const remain = mindigits - quantity.toString().length;
    return `${'0'.repeat(remain)}${quantity}`;
  }
});
