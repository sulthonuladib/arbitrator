import { ChainSearchByOptions } from "@arbitrator/lister/constants";
import type { ListChainInput } from "@arbitrator/lister/types";
import { listerClient } from "@arbitrator/sdk";

import { capitalizeFirstLetter } from "../../utils";
import { AddChainModal } from "../components/AddChainModal";
import { ChainEditModal } from "../components/ChainEditModal";
import { ChainTableRow } from "../components/ChainTableRow";
import { PageButton } from "../components/PageButton";
import { PlusIcon, SearchIcon } from "../components/icons";

const LIMIT_OPTIONS = [10, 20, 50, 100];

/**
 * The whole list is ONE swap unit. `GET /chain/list` returns exactly this
 * `<section id="chain-list">`.
 */
export const ChainList = async (props: ListChainInput) => {
  const [error, data] = await listerClient.chain.list(props);

  if (error || !data) {
    return (
      <section id="chain-list" class="w-full">
        <div class="card w-full bg-base-100 shadow-xl">
          <div class="card-body p-4 sm:p-8">
            <div class="alert alert-error" role="alert">
              <span>Unable to load chains.</span>
              {error?.message ? <span safe>{error.message}</span> : null}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const active = ChainSearchByOptions.find(
    (option) => option === props.searchBy,
  );
  const hasRows = data.data.length > 0;

  return (
    <section id="chain-list" class="w-full">
      <div class="card w-full bg-base-100 shadow-xl">
        <div class="card-body p-4 sm:p-8">
          <form
            id="chain-filter"
            hx-get="/chain/list"
            hx-target="#chain-list"
            hx-swap="outerMorph"
            hx-trigger="submit, input changed delay:300ms"
            hx-sync="this:replace"
            hx-indicator="#chain-list-indicator"
            class="flex flex-wrap items-center gap-2"
          >
            <span
              id="chain-list-indicator"
              class="htmx-indicator loading loading-spinner loading-sm"
            ></span>

            <div class="join">
              <label class="input input-bordered join-item">
                <span class="sr-only">Search chains</span>
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
                  {ChainSearchByOptions.map((option) => (
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
              onclick="add_chain_modal.showModal()"
            >
              <PlusIcon /> Add chain
            </button>
          </form>

          <div class="overflow-x-auto w-full">
            <table class="table w-full table-pin-rows table-pin-cols [&_td]:px-2 [&_th]:px-2 sm:[&_td]:px-4 sm:[&_th]:px-4">
              <thead>
                <tr>
                  <th class="w-1/2 whitespace-normal">Name</th>
                  <th class="w-24">Code</th>
                  <th class="hidden md:table-cell">Created At</th>
                  <th class="hidden md:table-cell">Updated At</th>
                  <th class="w-20 text-right">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody id="chain-table-body">
                {hasRows ? (
                  data.data.map((chain) => <ChainTableRow {...chain} />)
                ) : (
                  <tr>
                    <td colspan="5" class="py-16 text-center">
                      <p class="font-medium">No chains yet</p>
                      <p class="mx-auto mt-1 max-w-prose text-sm opacity-60">
                        Add a chain to group the markets that trade on it.
                      </p>
                      <button
                        type="button"
                        class="btn btn-primary mt-4"
                        onclick="add_chain_modal.showModal()"
                      >
                        <PlusIcon /> Add chain
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {hasRows ? (
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
                chains
              </p>
              <div class="join">
                <PageButton form="chain-filter" page={1} disabled={data.meta.page === 1}>
                  First
                </PageButton>
                <PageButton
                  form="chain-filter"
                  page={data.meta.page - 1}
                  disabled={!data.meta.hasPreviousPage}
                >
                  Previous
                </PageButton>
                <button type="button" disabled class="join-item btn btn-outline">
                  Page{" "}
                  <span class="tabular-nums" safe>
                    {data.meta.page}
                  </span>
                </button>
                <PageButton
                  form="chain-filter"
                  page={data.meta.page + 1}
                  disabled={!data.meta.hasNextPage}
                >
                  Next
                </PageButton>
                <PageButton
                  form="chain-filter"
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

export const ChainPage = async (props: ListChainInput) => (
  <div class="flex flex-col gap-6">
    <AddChainModal />
    <ChainEditModal />
    <ChainList {...props} />
  </div>
);
