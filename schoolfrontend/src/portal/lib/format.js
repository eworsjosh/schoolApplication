export const formatMoney = (value, currency = "NGN", locale = "en-NG") => {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(value ?? 0));
  } catch {
    return `${currency} ${Number(value ?? 0).toLocaleString()}`;
  }
};

export const naira = (value) => formatMoney(value, "NGN", "en-NG");
