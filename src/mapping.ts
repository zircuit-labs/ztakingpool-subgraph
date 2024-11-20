import {
  ethereum, BigInt,
  Address
} from '@graphprotocol/graph-ts'

import {
  Migrate   as MigrateEvent,
  Deposit   as DepositEvent,
  Withdraw  as WithdrawEvent,
} from '../generated/ZtakingPool/ZtakingPool'

import {
  BalanceChange,
} from '../generated/schema'

export function handleMigrate(ev: MigrateEvent): void
{
  for (let i = 0; i < ev.params.tokens.length; ++i) {
    processEvent(ev, ev.params.user, ev.params.tokens[i], -ev.params.amounts[i]);
  }
}

export function handleDeposit(ev: DepositEvent): void
{
  processEvent(ev, ev.params.depositor, ev.params.token, ev.params.amount);
}

export function handleWithdraw(ev: WithdrawEvent): void
{
  processEvent(ev, ev.params.withdrawer, ev.params.token, -ev.params.amount);
}

function createEventID(event: ethereum.Event): string
{
  return event.block.number.toString().concat('-').concat(event.logIndex.toString());
}

function processEvent(ev: ethereum.Event, user: Address, token: Address, amount: BigInt): void
{
  let balanceChange = new BalanceChange(createEventID(ev));
  balanceChange.user = user.toHexString().toLowerCase();
  balanceChange.amount = amount;
  balanceChange.token = token.toHexString().toLowerCase();
  balanceChange.save();
}
