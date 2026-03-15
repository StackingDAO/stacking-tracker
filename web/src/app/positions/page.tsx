import * as api from "../common/public-api";
import { Positions } from "../components/Positions";
import { generateMetaData } from "../common/utils";

export async function generateMetadata() {
  const info = {
    title: `Stacking Tracker - Positions`,
    description:
      "All your PoX positions on Stacks in one simple overview! Connect your wallet to view your balances.",
  };
  return generateMetaData(info.title, info.description);
}

const Home = async () => {
  const positionsInfo = await api.get(`/positions`);

  return (
    <>
      <h1 className="text-2xl mb-6 lg:hidden font-semibold">Positions</h1>
      <Positions positions={positionsInfo} />
    </>
  );
};

export default Home;
