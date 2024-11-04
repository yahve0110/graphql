import { URL } from "../globals"


export function getUserData(token) {
    let ID
    let Username
    return fetch(URL, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query {
                          user,{
                              id
                              login
                          }
                      }`,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
       ID = response["data"]["user"][0]["id"]
       Username =
          response["data"]["user"][0]["login"].charAt(0).toUpperCase() +
          response["data"]["user"][0]["login"].slice(1)

          return [ ID, Username]
      })

  }
