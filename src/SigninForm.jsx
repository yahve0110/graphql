import PropTypes from "prop-types"

export const SigninForm = ({
  email,
  setemail,
  password,
  setpassword,
  logData,
  error,
}) => {
  return (
    <div className="signInWrapper">
      <div className="SignInForm">
        <input
          type="email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          placeholder="email"
          name=""
          id=""
          autoComplete="username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          placeholder="password"
          name=""
          id=""
          autoComplete="password"
        />
        {error && <div className="loginErr">{error}</div>}

        <button onClick={logData}>Log in</button>
      </div>
    </div>
  )
}

SigninForm.propTypes = {
  email: PropTypes.string.isRequired,
  setemail: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setpassword: PropTypes.func.isRequired,
  logData: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
}
