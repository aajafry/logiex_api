"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceValidation = void 0;
const priceValidation = (value) => {
    const strValue = value.toString();
    const [integerPart, fractionPart] = strValue.split(".");
    const totalDigits = integerPart.length + (fractionPart ? fractionPart.length : 0);
    return totalDigits <= 10 && (!fractionPart || fractionPart.length <= 3);
};
exports.priceValidation = priceValidation;
