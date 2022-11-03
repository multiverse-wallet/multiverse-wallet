import { useState, useEffect } from "react"
import useSWR from "swr";

export function useCurrencyConvert(fromValue: number, fromSymbol: string, toSymbol: string) {
    const [value, setValue] = useState<number>()
    const [rate, setRate] = useState<number>()
    const { data, error, isValidating } = useSWR(fromValue ? `https://min-api.cryptocompare.com/data/price?fsym=${fromSymbol}&tsyms=${toSymbol}` : null)
    useEffect(() => {
        if (!data) {
            return
        }
        const rate = data && data[toSymbol]
        setRate(rate)
        setValue(fromValue * rate)
    }, [data])
    return {
        value,
        rate,
        isValidating,
        error,
    }
}