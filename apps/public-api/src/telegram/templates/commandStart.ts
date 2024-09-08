import { currency } from "../../utils";

export function getMessage(params: {
  stxPrice: number;
  btcPrice: number;
  cycleNumber: number;
  daysLeftRewardPhase: number;
  blockHeightRewardPhase: number;
  stackedAmount: number;
  rewardsAmount: number;
  apy: number;
}) {
  const replyMessage =
    `<b>STX: $${currency.short.format(params.stxPrice)} - BTC: $${currency.rounded.format(params.btcPrice)}</b>%0A` +
    `%0A<b>Cycle number: ${params.cycleNumber}</b>%0A` +
    `Next cycle in ~${currency.rounded.format(params.daysLeftRewardPhase)} days at bitcoin block ${params.blockHeightRewardPhase} %0A` +
    `%0A<i>Stacked:</i> %0A` +
    `${currency.rounded.format(params.stackedAmount)} STX = ` +
    `$${currency.rounded.format(params.stackedAmount * params.stxPrice)} %0A` +
    `%0A<i>Rewards:</i> %0A` +
    `${currency.short.format(params.rewardsAmount)} BTC = ` +
    `$${currency.rounded.format(params.rewardsAmount * params.btcPrice)} %0A` +
    `%0A~${currency.short.format(params.apy)}% APY over last 4 cycles %0A`;

  return replyMessage;
}
