import ProjectList from "./Projects";

const UserInfo = ({username,userInfo,projects}) => {
  console.log("userInfo",userInfo);
  return (
    <div className="userInfoWrapper">
      <div>Hello {username}</div>
      <div>Your current level: {userInfo["amount"]}</div>
      <div>Your ID: {userInfo["userId"]}</div>
      <div>Last finished project: {userInfo["object"].name}</div>
      <div>Campus: Johvi</div>
      <div className="projectsDiv">
      <ProjectList projects={projects}/>
      </div>

    </div>
  )
}

export default UserInfo