import { FunctionComponent } from "react";
import * as api from "../common/public-api";
import { Positions } from "../components/Positions";

type Props = {
  params: {
    pool: string;
  };
};

const Home: FunctionComponent<Props> = async ({ params: { pool } }: Props) => {
  const positionsInfo = await api.get(`/positions`);

  return (
    <main className="flex flex-col justify-between w-full max-w-5xl pt-12">
      <Positions positions={positionsInfo} />
    </main>
  );
};

export default Home;
