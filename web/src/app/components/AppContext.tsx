import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserData } from "@stacks/auth";

interface AppContextProps {
  stxPrice?: string;
  btcPrice?: string;

  setStxAddress: Dispatch<SetStateAction<string>>;
  setOkxProvider: Dispatch<SetStateAction<any>>;

  userData?: UserData;
}

export const AppContext = createContext<AppContextProps>({
  stxPrice: undefined,
  btcPrice: undefined,

  setStxAddress: () => {},
  setOkxProvider: () => {},

  userData: undefined,
});

const fetchStxPrice = async (): Promise<number> => {
  const url = "https://api.exchange.coinbase.com/products/STX-USD/ticker";
  const result = await fetch(url).then((res) => res.json());
  return result.bid;
};

const fetchBtcPrice = async (): Promise<number> => {
  const url = "https://api.exchange.coinbase.com/products/BTC-USD/ticker";
  const result = await fetch(url).then((res) => res.json());
  return result.bid;
};

function useAppContextData(userData: any): AppContextProps {
  const [, setStxAddress] = useState("");
  const [, setOkxProvider] = useState({});
  const [stxPrice, setStxPrice] = useState<number>(0.0);
  const [btcPrice, setBtcPrice] = useState<number>(0.0);

  useEffect(() => {
    async function fetchData() {
      await Promise.all([
        fetchStxPrice().then(setStxPrice),
        fetchBtcPrice().then(setBtcPrice),
      ]).catch(console.error);
    }

    fetchData();
  }, []);

  return {
    stxPrice: `${stxPrice}`,
    btcPrice: `${btcPrice}`,
    setStxAddress,
    setOkxProvider,
    userData,
  };
}

export const useAppContext = () => useContext(AppContext);

interface AppContextProviderProps {
  userData: any;
}

export const AppContextProvider = ({
  userData,
  children,
}: PropsWithChildren<AppContextProviderProps>) => {
  const context = useAppContextData(userData);

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};
