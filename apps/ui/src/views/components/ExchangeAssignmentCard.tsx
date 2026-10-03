import type { MarketWithRelations } from "@arbitrator/lister/types";

import { ChevronDownIcon, PencilIcon, XIcon } from "./icons";

type Props = {
  coinId: number;
  market: MarketWithRelations;
};

/**
 * One exchange assignment for a coin. The trade toggle and unassign button
 * refresh the whole list (outerMorph); the chain container is a sibling of the
 * header row (not inside it) so expanding chains can never move the logo.
 *
 * The pencil reveals an inline editor for `exchangeSymbol` (the per-exchange
 * trading pair symbol, e.g. `BTCUSDT`).
 */
export const ExchangeAssignmentCard = ({ coinId, market }: Props) => {
  return (
    <div
      id={`market-card-${market.id}`}
      class="flex flex-col rounded-box px-2 py-2 transition-colors hover:bg-base-200/40"
    >
      <div class="flex items-start gap-2 sm:gap-3">
        <div class="avatar">
          <div class="mask mask-circle size-8">
            <img src={market.exchange.logo} alt="" loading="lazy" />
          </div>
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="truncate font-medium" safe>
                  {market.exchange.name}
                </span>
                <span
                  class="badge badge-outline font-mono text-xs"
                  title="Exchange symbol"
                  safe
                >
                  {market.exchangeSymbol}
                </span>
              </div>
              <div class="truncate text-sm opacity-60" safe>
                {market.exchange.slug}
              </div>
            </div>

            <div class="flex shrink-0 items-center gap-1">
              <button
                type="button"
                class="btn btn-square btn-ghost btn-xs"
                aria-label={`Edit exchange symbol for ${market.exchange.name}`}
                title="Edit exchange symbol"
                _={`on click toggle .hidden on #symbol-editor-${market.id}`}
              >
                <PencilIcon />
              </button>

              <button
                type="button"
                id={`expand-chains-button-${market.id}`}
                class="btn btn-square btn-ghost btn-xs"
                aria-label={`Show or hide chains for ${market.exchange.name}`}
                aria-expanded="false"
                title="Show / hide chains"
                hx-get={`/coins/${coinId}/assignments/${market.id}/chains`}
                hx-trigger="click once"
                hx-target={`#market-chains-${market.id}`}
                hx-swap="innerHTML"
                hx-indicator="#coin-assignment-indicator"
                hx-morph-skip="true"
                hx-on:click={`const p=document.getElementById('market-chains-${market.id}');p.classList.toggle('hidden');const i=document.getElementById('expand-chains-icon-${market.id}');i&&i.classList.toggle('rotate-180');document.getElementById('expand-chains-button-${market.id}').setAttribute('aria-expanded',p.classList.contains('hidden')?'false':'true');`}
              >
                <ChevronDownIcon
                  id={`expand-chains-icon-${market.id}`}
                  class="size-4 transition-transform duration-150 ease-out"
                />
              </button>

              <button
                type="button"
                class="btn btn-square btn-ghost btn-xs btn-error"
                aria-label={`Unassign ${market.exchange.name}`}
                title={`Unassign ${market.exchange.name}`}
                hx-delete={`/coins/${coinId}/assignments/${market.id}`}
                hx-confirm={`Unassign ${market.exchange.name} from this coin?`}
                hx-target="#coin-assignment-list"
                hx-swap="outerMorph"
                hx-indicator="#coin-assignment-indicator"
              >
                <XIcon />
              </button>
            </div>
          </div>

          <div id={`symbol-editor-${market.id}`} class="hidden mt-2">
            <form
              class="flex items-center gap-2"
              hx-patch={`/coins/${coinId}/assignments/${market.id}`}
              hx-target="#coin-assignment-list"
              hx-swap="outerMorph"
              hx-indicator="#coin-assignment-indicator"
            >
              <input
                name="exchangeSymbol"
                value={market.exchangeSymbol}
                required
                maxlength="255"
                autocomplete="off"
                aria-label="Exchange symbol"
                class="input input-bordered input-sm w-32 font-mono"
              />
              <button type="submit" class="btn btn-sm btn-primary">
                Save
              </button>
              <button
                type="button"
                class="btn btn-sm btn-ghost"
                _={`on click add .hidden to #symbol-editor-${market.id}`}
              >
                Cancel
              </button>
            </form>
          </div>

          <label class="label mt-1 w-fit cursor-pointer gap-2">
            <span class="label-text">Trade</span>
            <input
              type="checkbox"
              class="toggle toggle-sm"
              checked={market.tradeEnabled}
              hx-patch={`/coins/${coinId}/assignments/${market.id}`}
              hx-trigger="change"
              hx-vals="js:{ tradeEnabled: event.target.checked }"
              hx-target="#coin-assignment-list"
              hx-swap="outerMorph"
              hx-indicator="#coin-assignment-indicator"
            />
          </label>
        </div>
      </div>

      <div
        id={`market-chains-${market.id}`}
        class="hidden mt-2 pl-11"
        hx-morph-skip="true"
      ></div>
    </div>
  );
};
