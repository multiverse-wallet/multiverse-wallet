import { useMemo } from "react";

export interface IssuedCurrencyAmount {
  currency: string;
  issuer: string;
  amount: string;
}

export interface XRPLAmountProps {
  amount: string | IssuedCurrencyAmount;
  children: (props: { value: string; currency: string }) => JSX.Element;
}

export function XRPLAmount({ children, amount }: XRPLAmountProps) {
  const currency = typeof amount === "string" ? "XRP" : amount.currency;
  const value = typeof amount === "string" ? amount : amount.amount;
  return children({ value, currency });
}

XRPLAmount.Value = XRPLAmountValue;
XRPLAmount.Currency = XRPLAmountCurrency;

interface XRPLAmountValueProps {
  children: React.ReactNode;
  decimalPlaces?: number;
  scale: number;
}

function XRPLAmountValue({ children, decimalPlaces, scale }: XRPLAmountValueProps) {
  const value = Number(children) / scale;
  return <>{value.toFixed(decimalPlaces)}</>;
}

XRPLAmountValue.defaultProps = {
  decimalPlaces: 2,
  scale: 1e6,
};

interface XRPLAmountCurrencyProps {
  unicodeSymbol: boolean;
  children: string;
}

function XRPLAmountCurrency({
  unicodeSymbol,
  children,
}: XRPLAmountCurrencyProps): JSX.Element {
  const currencyToDisplay = useMemo(() => {
    if (children.length !== 40) {
      return children;
    }
    // Split the currency into two digit character codes and convert them to characters
    const currencyChars = children.match(/.{2}/g);
    if (!currencyChars) {
      return children;
    }
    return currencyChars
      .map((charCode) => String.fromCharCode(parseInt(charCode, 16)))
      .join("");
  }, [children]);
  if (unicodeSymbol && currencyToDisplay === "XRP") {
    return <></>;
  }
  return <>{currencyToDisplay}</>;
}

XRPLAmountCurrency.defaultProps = {
  unicodeSymbol: false,
};
