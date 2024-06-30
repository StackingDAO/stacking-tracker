import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { callReadOnlyFunction, contractPrincipalCV } from '@stacks/transactions';
import { coreApiUrl, getRPCClient, stacksNetwork } from '@/app/common/utils';
import { UserData } from '@stacks/auth';

const DENOMINATOR = 1000000;

interface AppContextProps {
  stxAddress: string | undefined;
  setStxAddress: Dispatch<SetStateAction<string>>;

  stxBalance: number;
  stStxBalance: number;
  stxPrice?: string;
  stxRatio?: string;
  stackingApy: number;

  stackedStx?: string;
  stackingCycle?: string;
  cycleDaysLeft?: string;
  nextRewardCycleBlocks?: number;
  bitcoinBlocksLeft?: string;

  currentTxStatus?: string;
  setCurrentTxStatus: Dispatch<SetStateAction<string>>;
  currentTxId?: string;
  setCurrentTxId: Dispatch<SetStateAction<string>>;
  currentTxMessage?: string;
  setCurrentTxMessage: Dispatch<SetStateAction<string>>;

  userData?: UserData;
  okxProvider?: any;
  setOkxProvider: Dispatch<SetStateAction<any>>;
}

export const AppContext = createContext<AppContextProps>({
  stxBalance: 0,
  stStxBalance: 0,
  sDaoBalance: undefined,
  stxPrice: undefined,
  stxRatio: undefined,
  stackingApy: 0,

  stackedStx: undefined,
  stackingCycle: undefined,
  cycleDaysLeft: undefined,
  bitcoinBlocksLeft: undefined,

  currentTxStatus: undefined,
  setCurrentTxStatus: () => {},
  currentTxId: undefined,
  setCurrentTxId: () => {},
  currentTxMessage: undefined,
  setCurrentTxMessage: () => {},

  userData: undefined,
  okxProvider: undefined,
  setOkxProvider: () => {},

  stxAddress: undefined,
  setStxAddress: () => {},
});

interface IBalances {
  total: number;
  stacked: number;
  dao: number;
}

const fetchBalances = async (stxAddress: string): Promise<IBalances> => {
  const client = getRPCClient();
  const stStxAddress = `${process.env.NEXT_PUBLIC_STSTX_ADDRESS}.ststx-token::ststx`;
  const url = `${client.url}/extended/v1/address/${stxAddress}/balances`;
  const response = await fetch(url, { credentials: 'omit' });
  const data = await response.json();

  const balance = Number(data['stx']['balance']);
  const lockedBalance = Number(data['stx']['locked']);
  const totalBalance = (balance - lockedBalance) / DENOMINATOR;

  let stackedBalance = 0;
  if (data['fungible_tokens'][stStxAddress]) {
    stackedBalance = data['fungible_tokens'][stStxAddress]['balance'] / DENOMINATOR;
  }

  return { total: totalBalance, stacked: stackedBalance };
};

export const fetchStxPrice = async (): Promise<number> => {
  const bandUrl =
    'https://laozi1.bandchain.org/api/oracle/v1/request_prices?ask_count=16&min_count=10&symbols=STX';

  const result = await fetch(bandUrl).then(res => res.json());

  if (result['price_results']?.length > 0) {
    return result['price_results'][0]['px'] / Number(result['price_results'][0]['multiplier']);
  }

  return 0;
};

interface IStackingCycleInfo {
  currentCycle: number;
  stackedStx: number;
  btcBlocksLeft: number;
  nextRewardCycleBlocks: number;
  cycleDaysLeft: number;
}

const fetchStackingCycle = async (): Promise<IStackingCycleInfo> => {
  const metaInfoUrl = coreApiUrl + `/v2/pox`;
  const result: any = await fetch(metaInfoUrl).then(res => res.json());

  const currentCycle: number = result['current_cycle']['id'];
  const stackedStx: number = result['current_cycle']['stacked_ustx'];
  const blocksUntilNextCycle: number = result['next_cycle']['blocks_until_prepare_phase'];
  const btcBlocksLeft = Math.max(0, blocksUntilNextCycle);
  const nextRewardCycleBlocks: number = result['next_reward_cycle_in'];

  const currentTimestamp = Date.now(); // in milliseconds
  const endTimestamp = currentTimestamp + result['next_reward_cycle_in'] * 10 * 60000;
  const daysLeft = Math.max(
    0,
    Math.round((endTimestamp - currentTimestamp) / (1000 * 60 * 60 * 24))
  );

  return {
    currentCycle,
    stackedStx,
    btcBlocksLeft,
    nextRewardCycleBlocks,
    cycleDaysLeft: daysLeft,
  };
};

function useAppContextData(userData: any): AppContextProps {
  const [stxAddress, setStxAddress] = useState('');
  const [okxProvider, setOkxProvider] = useState({});
  const [stxPrice, setStxPrice] = useState<number>(0.0);
  const [currentTxStatus, setCurrentTxStatus] = useState('');
  const [currentTxId, setCurrentTxId] = useState('');
  const [currentTxMessage, setCurrentTxMessage] = useState('');

  const [balances, setBalances] = useState<IBalances>({ total: 0, stacked: 0, dao: 0 });
  const [stackingCycle, setStackingCycle] = useState<IStackingCycleInfo>({
    currentCycle: 0,
    stackedStx: 0,
    btcBlocksLeft: 0,
    nextRewardCycleBlocks: 0,
    cycleDaysLeft: 0,
  });

  useEffect(() => {
    if (!userData) return;

    const env = process.env.NEXT_PUBLIC_NETWORK_ENV;

    let network = userData?.profile?.stxAddress?.testnet;
    if (env == 'mainnet') {
      network = userData?.profile?.stxAddress?.mainnet;
    }

    setStxAddress(network);
  }, [userData]);

  useEffect(() => {
    async function fetchData(stxAddress: string) {
      await Promise.all([
        fetchStackingCycle().then(setStackingCycle),
        fetchStxPrice().then(setStxPrice),
        ...(!stxAddress
          ? []
          : [
              fetchBalances(stxAddress).then(setBalances),
            ]),
      ]).catch(console.error);
    }

    fetchData(stxAddress);
  }, [stxAddress]);

  return {
    stxBalance: balances.total,
    stStxBalance: balances.stacked,
    sDaoBalance: `${balances.dao}`,
    stxPrice: `${stxPrice}`,
    stxRatio: `${stxRatio}`,
    stxAddress: stxAddress,
    setStxAddress: setStxAddress,
    okxProvider: okxProvider,
    setOkxProvider: setOkxProvider,
    stackingApy: stackingApy,
    stackingCycle: `${stackingCycle.currentCycle}`,
    stackedStx: `${stackingCycle.stackedStx}`,
    cycleDaysLeft: `${stackingCycle.cycleDaysLeft}`,
    bitcoinBlocksLeft: `${stackingCycle.btcBlocksLeft}`,
    nextRewardCycleBlocks: stackingCycle.nextRewardCycleBlocks,
    currentTxId: currentTxId,
    currentTxStatus: currentTxStatus,
    currentTxMessage: currentTxMessage,
    setCurrentTxId: setCurrentTxId,
    setCurrentTxStatus: setCurrentTxStatus,
    setCurrentTxMessage: setCurrentTxMessage,
    userData: userData,
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
