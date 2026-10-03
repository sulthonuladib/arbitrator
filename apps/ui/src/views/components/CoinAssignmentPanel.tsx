import type {
  CryptocurrencySelect,
  MarketWithRelations,
} from "@arbitrator/lister/types";

import { AssignExchangeDropdown } from "./AssignExchangeDropdown";
import { ExchangeAssignmentCard } from "./ExchangeAssignmentCard";

type ListProps = {
  coinId: number;
  markets: MarketWithRelations[];
};

/** The refreshable list of exchange assignments for a coin. */
export const CoinAssignmentList = ({ coinId, markets }: ListProps) => (
  <div id="coin-assignment-list" class="flex flex-col">
    {markets.length === 0 ? (
      <p class="rounded-box border border-dashed border-base-300 p-4 text-center text-sm opacity-60">
        No exchanges assigned to this coin yet.
      </p>
    ) : (
      markets.map((market, index) => (
        <>
          {index > 0 ? <div class="divider my-1"></div> : null}
          <ExchangeAssignmentCard coinId={coinId} market={market} />
        </>
      ))
    )}
  </div>
);

type Props = {
  coin: CryptocurrencySelect;
  markets: MarketWithRelations[];
};

/**
 * Full side-panel content for a coin's exchange (and chain) assignments.
 *
 * Three visually distinct zones: the coin identity header (a rule, not a row),
 * the assign/search surface, and the assigned-exchange list.
 */
export const CoinAssignmentPanel = ({ coin, markets }: Props) => (
  <div class="flex flex-col gap-4">
    <header class="flex items-center gap-3 border-b border-base-300 pb-4">
      <div class="avatar">
        <div class="mask mask-circle size-12">
          <img src={coin.logo} alt="" loading="lazy" />
        </div>
      </div>
      <div class="min-w-0 flex-1">
        <p class="truncate text-base font-semibold" safe>
          {coin.name}
        </p>
        <p class="truncate text-sm opacity-60" safe>
          {coin.symbol.toUpperCase()} · {coin.slug}
        </p>
      </div>
      <span class="badge badge-sm whitespace-nowrap">
        {markets.length} assigned
      </span>
    </header>

    <section class="rounded-box bg-base-200/60 p-3">
      <h3 class="mb-2 text-xs font-semibold tracking-wide uppercase opacity-60">
        Assign to exchange
      </h3>
      <AssignExchangeDropdown coinId={coin.id} />
    </section>

    <section class="flex flex-col gap-1">
      <h3 class="text-xs font-semibold tracking-wide uppercase opacity-60">
        Assigned exchanges
      </h3>
      <CoinAssignmentList coinId={coin.id} markets={markets} />
    </section>
  </div>
);
