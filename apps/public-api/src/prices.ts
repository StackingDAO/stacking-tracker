export const fetchPrice = async (symbol: string): Promise<number> => {
  try {
    const bandUrl = `https://laozi1.bandchain.org/api/oracle/v1/request_prices?ask_count=16&min_count=10&symbols=${symbol}`;

    const result = await fetch(bandUrl).then((res) => res.json());

    if (result["price_results"]?.length > 0) {
      return (
        result["price_results"][0]["px"] /
        Number(result["price_results"][0]["multiplier"])
      );
    }

    return 0;
  } catch (error) {
    console.log("error", error);
    return 0;
  }
};
