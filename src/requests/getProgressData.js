import { allProjectNames,URL } from "../globals"


let progressOffset = 0
let progressArr = []
let resultArr = []
let lengthOfProjectNames = allProjectNames.length

export function getProgressData(token, limit,ID) {
  return fetch(URL, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query {
                        progress (limit:${limit},
                            offset:${progressOffset},
                            where:{
                                _and:[
                                    {userId:{_eq:${ID}}},
                                    {object:{name:{_eq:"${
                                      allProjectNames[lengthOfProjectNames - 1]
                                    }"}}}
                                ]
                            }
                            ){
                            userId
                            objectId
                            object{
                                name
                                }
                            grade
                            createdAt
                            updatedAt
                            }
                        }`,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      if (lengthOfProjectNames > 0) {
        if (response["data"]["progress"].length != 0) {
          progressArr.push(response["data"]["progress"][0])
        }
        lengthOfProjectNames--
        return getProgressData(token, limit,ID)
      } else {
        return progressArr
      }
    })

}

// groups attributes
export function projectTransactions(transactionArr, progressArr,skills) {

  progressArr.forEach((progress) => {
    resultArr.push({ projectName: progress["object"]["name"] })
    let obj = resultArr.find(
      (project) => project.projectName === progress["object"]["name"]
    )
    transactionArr
      .filter(
        (transaction) =>
          transaction["object"]["name"] === progress["object"]["name"]
      )
      .forEach((transaction) => {
        skills.forEach((skill) => {
          if (transaction["type"] === skill) {
            if (obj.hasOwnProperty.call(skill)) {
              obj[skill] += transaction["amount"]
            } else {
              obj[skill] = transaction["amount"]
            }
          } else {
            return
          }
        })
        obj.path = transaction["path"]
      })
    obj.updated = progress.updatedAt
    obj.created = progress.createdAt
    obj.grade = progress.grade
  })
  return resultArr
}
