export default function currencySymbolGenerator(currencyCode) {
  try {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    });
    const parts = formatter.formatToParts(1);
    const currencySymbol = parts.find((part) => part.type === "currency").value;
    return currencySymbol || "€";
  } catch (error) {
    // console.error(
    //   `Error getting currency symbol for ${currencyCode}: ${error.message}`
    // );
    return "€";
  }
}
