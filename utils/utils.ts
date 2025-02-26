export const parseIndianFormat = (value: string): number => {
  const cleanValue = value.replace(/[₹\s]/g, "");

  if (cleanValue.includes(",")) {
    const parts = cleanValue.split(",").reverse();

    let result = 0;
    let multiplier = 1;

    parts.forEach((part, index) => {
      if (index === 0) {
        result += parseInt(part) * multiplier;
        multiplier *= 1000;
      } else {
        result += parseInt(part) * multiplier;
        multiplier *= 100;
      }
    });

    return result;
  }

  return parseFloat(cleanValue);
};

export const getTenderValueCategory = (value: string): string => {
  const numericValue = parseIndianFormat(value);
  if (numericValue < 1000000) return "1"; // Less than 10L
  if (numericValue >= 1000000 && numericValue < 10000000) return "2";
  if (numericValue >= 10000000 && numericValue < 1000000000) return "3";
  return "4";
};

export const formatTenderValue = (value: string): string => {
  const categories: { [key: string]: string } = {
    "1": "Less than ₹10L",
    "2": "₹10L - ₹1Cr",
    "3": "₹1Cr - ₹100Cr",
    "4": "More than ₹100Cr",
  };

  const category = getTenderValueCategory(value);
  return categories[category] || value;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
