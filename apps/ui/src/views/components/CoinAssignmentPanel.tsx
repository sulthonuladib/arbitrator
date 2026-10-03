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
  <div id="coin-assignment-list" class="flex flex-col gap-3">
    {markets.length === 0 ? (
      <div class="rounded-box bg-base-100 p-6 text-center">
        <p class="text-sm font-medium">No exchanges assigned</p>
        <p class="mt-1 text-sm opacity-60">
          Use the search above to assign this coin to an exchange.
        </p>
      </div>
    ) : (
      markets.map((market) => (
        <ExchangeAssignmentCard coinId={coinId} market={market} />
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
 * Grouped with space rather than rules: identity header, the assign/search
 * control as its own surface, then the assigned-exchange list.
 */
export const CoinAssignmentPanel = ({ coin, markets }: Props) => (
  <div class="flex flex-col gap-4">
    <header class="flex items-center gap-4 px-1">
      <div class="avatar">
        <div class="mask mask-circle size-14">
          <img src={coin.logo} alt="" loading="lazy" />
        </div>
      </div>
      <div class="min-w-0 flex-1">
        <h2 class="truncate text-xl font-semibold" safe>
          {coin.name}
        </h2>
        <p class="truncate text-sm opacity-60" safe>
          {coin.symbol.toUpperCase()} · {coin.slug}
        </p>
      </div>
      <span class="badge badge-ghost whitespace-nowrap">
        {markets.length} assigned
      </span>
    </header>

    <section class="rounded-box bg-base-200 p-4">
      <h3 class="mb-3 text-xs font-semibold tracking-wide uppercase opacity-60">
        Assign to exchange
      </h3>
      <AssignExchangeDropdown coinId={coin.id} />
    </section>

    <section class="flex flex-col gap-3 rounded-box bg-base-300/40 p-4">
      <h3 class="text-xs font-semibold tracking-wide uppercase opacity-60">
        Assigned exchanges
      </h3>
      <CoinAssignmentList coinId={coin.id} markets={markets} />
    </section>
  </div>
);
