export const priceValidation = (value) => {
  const strValue = value.toString();
  const [integerPart, fractionPart] = strValue.split(".");
  const totalDigits =
    integerPart.length + (fractionPart ? fractionPart.length : 0);
  return totalDigits <= 10 && (!fractionPart || fractionPart.length <= 3);
};
