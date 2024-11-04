import { goProjectNames, jsProjectNames } from "../globals";

let lvlOffset = 0;
let levelArr = [];
let totalLevel = {};

export async function getLevels(token, limit, ID) {
  try {
    const response = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query {
          transaction(
            limit: ${limit},
            offset: ${lvlOffset},
            where: {
              _and: [
                { userId: { _eq: ${ID} } },
                { type: { _ilike: "%level%" } }
              ]
            }
          ) {
            type
            amount
            objectId
            object {
              name
            }
            userId
            createdAt
            path
          }
        }`,
      }),
    });

    const jsonResponse = await response.json();
    const transactions = jsonResponse.data?.transaction || [];

    if (transactions.length > 0) {
      levelArr = levelArr.concat(transactions);
      lvlOffset += limit;
      return getLevels(token, limit, ID); // Recursive call
    } else {
      levelArr = levelArr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      totalLevel["current-level"] = levelArr[levelArr.length - 1];

      totalLevel["piscine-go"] = levelArr
        .filter(transaction => transaction.path.startsWith("/johvi/piscine-go/"))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      totalLevel["go-projects"] = levelArr
        .filter(transaction =>
          (transaction.path.startsWith("/johvi/div-01/") && goProjectNames.includes(transaction.object.name)) ||
          transaction.path.startsWith("/johvi/div-01/check-points/")
        )
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      totalLevel["piscine-js"] = levelArr
        .filter(transaction =>
          transaction.path.startsWith("/johvi/div-01/piscine-js") &&
          new Date(transaction.createdAt).getTime() >= new Date("2022-07-01T00:00:00Z").getTime()
        );

      totalLevel["js-projects"] = levelArr
        .filter(transaction =>
          transaction.path.startsWith("/johvi/div-01/") &&
          jsProjectNames.some(name => transaction.path.includes(name))
        )
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      return totalLevel;
    }
  } catch (error) {
    console.error("Error fetching levels data:", error);
    return totalLevel;
  }
}
