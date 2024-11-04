import { useState } from "react"
import { getUserData } from "./requests/getData"
import { getTransactionData } from "./requests/getTransactions"
import { getTotalSkills } from "./requests/getTotalSkills"
import { getLevels } from "./requests/getLevels"
import {
  getProgressData,
  projectTransactions,
} from "./requests/getProgressData"
import { getTotalXpAndGrades } from "./requests/getTotalXpAndGrades"
import SkillChart from "./components/Skills"
import ProjectXPChart from "./components/Graph"
import { SigninForm } from "./SigninForm"
import UserInfo from "./components/UserInfo"

const App = () => {
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [error, setError] = useState("")
  const [loaded, setLoaded] = useState(false)
  const [totalSkill, setTotalSKill] = useState([])
  const [totalxp, setTotalxp] = useState([])
  const [username, setUsername] = useState("")
  const [userInfo,setUserInfo] = useState([])
  const [projects,setProjects] = useState([])


  let ID
  const limit = 50

  function getToken(encodedCredentials) {
    return fetch("https://01.kood.tech/api/auth/signin", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error != null) {
          console.log("Error: ", response.error)
          setError("Invalid credentials")
        } else {
          return response
        }
      })
  }

  const logOut = ()=>{
    location.reload()
  }

  const logData = async () => {
    let credentials = `${email}:${password}`
    const encodedCredentials = btoa(credentials)
    const token = await getToken(encodedCredentials)
    let data = await getUserData(token)
    ID = data[0]
    let Username = data[1]

    const transactionArr = await getTransactionData(token, ID, limit)
    const skillsData = await getTotalSkills(token, limit, ID)
    const totalSkill = skillsData[0]
    const skills = skillsData[1]

    const totalLevel = await getLevels(token, limit, ID)

    const progressArr = await getProgressData(token, limit, ID)

    const xpAndGrades = await getTotalXpAndGrades(
      projectTransactions(transactionArr, progressArr, skills)
    )

    const totalXp = xpAndGrades[0]
    const totalGrade = xpAndGrades[1]



    setTotalSKill(totalSkill)
    setTotalxp(totalXp)
    setUsername(Username)
    setUserInfo(totalLevel["current-level"])
    setProjects(totalXp["project-xp"])
    setLoaded(true)
  }

  return (
    <div>
      {!loaded && (
        <SigninForm
          email={email}
          setemail={setemail}
          password={password}
          setpassword={setpassword}
          logData={logData}
          error={error}
        />
      )}

      {loaded && (
        <div className="infoWrapper">
          <UserInfo username={username} userInfo={userInfo} projects={projects}/>
          <SkillChart totalSkill={totalSkill} />
          <ProjectXPChart projects={totalxp} />
          <button onClick={logOut} className="logoutBtn">Logout</button>

        </div>

      )}
    </div>
  )
}

export default App
