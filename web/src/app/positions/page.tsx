import { FunctionComponent } from "react";
import * as api from "../common/public-api";
import { Positions } from "../components/Positions";
import { WalletStatus } from "../components/WalletStatus";

type Props = {
  params: {
    pool: string;
  };
};

const Home: FunctionComponent<Props> = async ({ params: { pool } }: Props) => {
  const positionsInfo = await api.get(`/positions`);

  return (
    <>
      <h1 className="text-2xl mb-6 lg:hidden font-semibold">Positions</h1>

      <WalletStatus />
      <Positions positions={positionsInfo} />
    </>
  );
};

export default Home;
