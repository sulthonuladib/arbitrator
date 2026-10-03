import { CryptocurrencySearchByOptions } from "@arbitrator/lister/constants";
import type { ListCryptocurrencyInput } from "@arbitrator/lister/types";
import { listerClient } from "@arbitrator/sdk";

import { capitalizeFirstLetter } from "../../utils";
import { AddCoinModal } from "../components/AddCoinModal";
import { CoinTableRow } from "../components/CoinTableRow";
import { CryptocurrencyEditModal } from "../components/CryptocurrencyEditModal";
import { PlusIcon, SearchIcon } from "../components/icons";
import { PageButton } from "../components/PageButton";
import { SortableHeader } from "../components/SortableHeader";

const LIMIT_OPTIONS = [10, 20, 50, 100];

/**
 * The whole list is ONE swap unit.
 *
 * `GET /coins/list` returns exactly this `<section id="coin-list">`, so the
 * card, the filter form, the table and the pagination can never drift apart.
 * Everything that changes the query lives inside the form and the form
 * serializes itself.
 */
export const CoinList = async (props: ListCryptocurrencyInput) => {
  const [error, data] = await listerClient.cryptocurrency.list(props);

  if (error || !data) {
    return (
      <section id="coin-list" class="w-full">
        <div class="card w-full bg-base-100 shadow-xl">
          <div class="card-body p-4 sm:p-8">
            <div class="alert alert-error" role="alert">
              <span>Unable to load cryptocurrencies.</span>
              {error?.message ? <span safe>{error.message}</span> : null}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const active = CryptocurrencySearchByOptions.find(
    (option) => option === props.searchBy,
  );
  const hasCoins = data.data.length > 0;

  return (
    <section id="coin-list" class="w-full">
      <div class="card w-full bg-base-100 shadow-xl">
        <div class="card-body p-4 sm:p-8">
          <form
            id="coin-filter"
            hx-get="/coins/list"
            hx-target="#coin-list"
            /* outerMorph: same single swap unit, but the focused search input
               and its caret survive the swap. */
            hx-swap="outerMorph"
            /* submit handles the pagination buttons; `input` covers both the
               text field and the <select>s. */
            hx-trigger="submit, input changed delay:300ms"
            /* abort the in-flight request when a newer one starts */
            hx-sync="this:replace"
            hx-indicator="#coin-list-indicator"
            class="flex flex-wrap items-center gap-2"
          >
            <span
              id="coin-list-indicator"
              class="htmx-indicator loading loading-spinner loading-sm"
            ></span>

            {/* Carried through pagination and search so the sort survives. */}
            <input type="hidden" name="orderBy" value={props.orderBy} />
            <input type="hidden" name="order" value={props.order} />

            <div class="join">
              <label class="input input-bordered join-item">
                <span class="sr-only">Search coins</span>
                <SearchIcon />
                <input
                  type="search"
                  name="search"
                  value={props.search}
                  placeholder="Search"
                  autocomplete="off"
                />
              </label>
              <label class="select select-bordered join-item">
                <span class="sr-only">Search by</span>
                <select name="searchBy">
                  {CryptocurrencySearchByOptions.map((option) => (
                    <option value={option} selected={active === option}>
                      {capitalizeFirstLetter(option)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label class="select select-bordered w-40">
              <span class="sr-only">Rows per page</span>
              <select name="limit">
                {LIMIT_OPTIONS.map((option) => (
                  <option
                    value={option.toString()}
                    selected={props.limit === option}
                  >
                    {option} rows
                  </option>
                ))}
              </select>
            </label>

            {/* type=button so it never submits the filter form */}
            <button
              type="button"
              class="btn btn-primary ml-auto"
              onclick="add_coin_modal.showModal()"
            >
              <PlusIcon /> Add coin
            </button>
          </form>

          <div class="overflow-x-auto w-full">
            <table class="table w-full table-pin-rows table-pin-cols [&_td]:px-2 [&_th]:px-2 sm:[&_td]:px-4 sm:[&_th]:px-4">
              <thead>
                <tr>
                  <SortableHeader
                    form="coin-filter"
                    url="/coins/list"
                    target="#coin-list"
                    indicator="#coin-list-indicator"
                    field="name"
                    name="Name / Slug"
                    orderBy={props.orderBy}
                    order={props.order}
                    class="w-1/2 whitespace-normal"
                  >
                    Name / Slug
                  </SortableHeader>
                  <SortableHeader
                    form="coin-filter"
                    url="/coins/list"
                    target="#coin-list"
                    indicator="#coin-list-indicator"
                    field="symbol"
                    name="Symbol"
                    orderBy={props.orderBy}
                    order={props.order}
                    class="w-20"
                  >
                    Symbol
                  </SortableHeader>
                  <SortableHeader
                    form="coin-filter"
                    url="/coins/list"
                    target="#coin-list"
                    indicator="#coin-list-indicator"
                    field="cmcId"
                    name="CMC ID"
                    orderBy={props.orderBy}
                    order={props.order}
                    class="hidden w-24 sm:table-cell"
                  >
                    CMC ID
                  </SortableHeader>
                  <SortableHeader
                    form="coin-filter"
                    url="/coins/list"
                    target="#coin-list"
                    indicator="#coin-list-indicator"
                    field="createdAt"
                    name="Created At"
                    orderBy={props.orderBy}
                    order={props.order}
                    class="hidden lg:table-cell"
                  >
                    Created At
                  </SortableHeader>
                  <SortableHeader
                    form="coin-filter"
                    url="/coins/list"
                    target="#coin-list"
                    indicator="#coin-list-indicator"
                    field="updatedAt"
                    name="Updated At"
                    orderBy={props.orderBy}
                    order={props.order}
                    class="hidden lg:table-cell"
                  >
                    Updated At
                  </SortableHeader>
                  <th class="w-20 text-right">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody id="coin-table-body">
                {hasCoins ? (
                  data.data.map((coin) => <CoinTableRow {...coin} />)
                ) : (
                  <tr>
                    <td colspan="6" class="py-16 text-center">
                      <p class="font-medium">No coins yet</p>
                      <p class="mx-auto mt-1 max-w-prose text-sm opacity-60">
                        Add a coin to make it available to your signals.
                      </p>
                      <button
                        type="button"
                        class="btn btn-primary mt-4"
                        onclick="add_coin_modal.showModal()"
                      >
                        <PlusIcon /> Add coin
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {hasCoins ? (
            <div class="flex flex-wrap items-center justify-between gap-4">
              <p class="text-sm opacity-70">
                Showing{" "}
                <span class="tabular-nums" safe>
                  {data.meta.from}
                </span>{" "}
                to{" "}
                <span class="tabular-nums" safe>
                  {data.meta.to}
                </span>{" "}
                of{" "}
                <span class="tabular-nums" safe>
                  {data.meta.items}
                </span>{" "}
                coins
              </p>
              <div class="join">
                <PageButton
                  form="coin-filter"
                  page={1}
                  disabled={data.meta.page === 1}
                >
                  First
                </PageButton>
                <PageButton
                  form="coin-filter"
                  page={data.meta.page - 1}
                  disabled={!data.meta.hasPreviousPage}
                >
                  Previous
                </PageButton>
                <button
                  type="button"
                  disabled
                  class="join-item btn btn-outline"
                >
                  Page{" "}
                  <span class="tabular-nums" safe>
                    {data.meta.page}
                  </span>
                </button>
                <PageButton
                  form="coin-filter"
                  page={data.meta.page + 1}
                  disabled={!data.meta.hasNextPage}
                >
                  Next
                </PageButton>
                <PageButton
                  form="coin-filter"
                  page={data.meta.pages}
                  disabled={
                    data.meta.page === data.meta.pages || data.meta.items === 0
                  }
                >
                  Last
                </PageButton>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

/**
 * The full page. Modals live here, outside the swap unit, so refreshing the
 * list never destroys an open dialog.
 */
export const CoinPage = async (props: ListCryptocurrencyInput) => (
  <div class="flex flex-col gap-6">
    <AddCoinModal />
    <CryptocurrencyEditModal />
    <CoinList {...props} />
  </div>
);
