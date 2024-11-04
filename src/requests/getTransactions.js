import { URL } from "../globals";

let transactionOffset = 0;
let transactionArr = [];

// fetch transaction data
export async function getTransactionData(token, ID, limit) {
  try {

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query {
          transaction(
            limit: ${limit},
            offset: ${transactionOffset},
            where: {
              _and: [
                { userId: { _eq: ${ID} } },
                { _not: { _or: [{ type: { _ilike: "%level%" } }] } }
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

    if (jsonResponse.errors) {
      throw new Error(jsonResponse.errors.map(err => err.message).join(", "));
    }

    const transactions = jsonResponse.data?.transaction;

    if (!transactions) {
      throw new Error("Transaction data is undefined.");
    }


    if (transactions.length > 0) {
      transactionArr = transactionArr.concat(transactions);
      transactionOffset += limit;
      return getTransactionData(token, ID, limit);
    } else {
      return transactionArr;
    }
  } catch (error) {
    console.error("Error fetching transaction data:", error);
    return transactionArr;
  }
}
