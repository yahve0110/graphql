import { allProjectNames } from "../globals"
let totalXp = {}
let totalGrade = {}
export function getTotalXpAndGrades(resultArr) {
  let totalX = 0
  let totalG = 0
  resultArr.forEach((project) => {
    if (project.hasOwnProperty.call("xp")) {
      totalX += project.xp
    }
    if (project.hasOwnProperty.call("grade")) {
      totalG += project.grade
    }
  })
  totalXp["lifetime-total"] = totalX
  let projectsOnly = resultArr.filter((project) =>
    allProjectNames.includes(project.projectName)
  )
  let orderXp = projectsOnly.sort((a, b) => b.xp - a.xp)

  totalXp["project-total"] = Number(
    orderXp.reduce((total, num) => total + num.xp, 0).toFixed(2)
  )
  totalXp["avg-project-xp"] = Number(
    (totalXp["project-total"] / orderXp.length).toFixed(2)
  )
  totalXp.max = orderXp[0]
  totalXp.min = orderXp[orderXp.length - 1]
  totalXp["project-xp"] = []
  orderXp.forEach((project) => totalXp["project-xp"].push(project))

  let orderGrade = projectsOnly.sort((a, b) => b.grade - a.grade)
  totalGrade["lifetime-total"] = Number(totalG.toFixed(2))
  totalGrade["project-total"] = Number(
    orderGrade.reduce((total, num) => total + num.grade, 0).toFixed(2)
  )
  totalGrade.max = orderGrade[0]
  totalGrade.min = orderGrade[orderGrade.length - 1]
  totalGrade["project-grades"] = []
  orderGrade.forEach((project) => totalGrade["project-grades"].push(project))

  return [totalXp,totalGrade]
}
