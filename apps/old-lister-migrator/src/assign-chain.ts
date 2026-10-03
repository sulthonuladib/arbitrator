import { listerClient } from "@arbitrator/sdk";

const [error, coins] = await listerClient.market.list({});

if (error) {
  process.exit(1);
}

const [umappedChainExistsError, unmappedChainExists] =
  await listerClient.chain.list({
    searchBy: "code",
    search: "unmapped",
  });
if (umappedChainExistsError) {
  process.exit(1);
}

if (unmappedChainExists.data.length > 0) {
  await listerClient.chain.add({
    name: "Unmapped Chain",
    code: "UNMPD",
  });
}

const [error, targetChain] = await listerClient.chain.list({
  searchBy: "code",
  search: "UNMPD",
});

for (const coin of coins) {
}
