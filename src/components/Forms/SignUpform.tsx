import { LoginInput } from "./LoginInput";
// import LoginBackground from "../../assets/ComEvoV.png";
import { useAuth } from "../../hooks/useAuth";

export const SignUpForm = () => {
  const {
    authError,
    setAuthError,
    handleChange,
    formData,
    handleSignUp,
  } = useAuth()


   if (authError.trim() !== "") {
    return (
      <div>
        <h1>Authentication</h1>
        <p>Authentication failed</p>
        <p>{authError}</p>
        <button
          onClick={() => {
            setAuthError("")
            window.history.replaceState({}, document.title, '/')
          }}
        >
          Return to login
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSignUp}
    >
      <div className="form-row">
        <LoginInput
          formData={formData}
          handleChange={handleChange}
          label={"Nombre"}
          name={"name"}
          type={"text"}
        />
        <LoginInput
          formData={formData}
          handleChange={handleChange}
          label={"Email"}
          name={"email"}
          type={"email"}
        />
        <LoginInput
          formData={formData}
          handleChange={handleChange}
          label={"Password"}
          name={"password"}
          type={"password"}
        />
        <LoginInput
          formData={formData}
          handleChange={handleChange}
          label={"ConfirmPassword"}
          name={"confirmPassword"}
          type={"password"}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Sign in
      </button>
    </form>
  );
};
