import { LoginInput } from "./LoginInput";
// import LoginBackground from "../../assets/ComEvoV.png";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

type FormType = "login" | "register";

export const LoginForm = () => {
  const [formType, setFormType] = useState<FormType>("login");
  const { handleChange, formData, handleLogin, handleSignUp } = useAuth();

  const toggleFormType = (type: FormType) => {
    setFormType(type);
  };

  return (
    <form
      onSubmit={formType === "login" ? handleLogin : handleSignUp}
      className="bg-dark py-4 rounded text-white  position-fixed"
      style={{
        top: formType === "register" ? "38%" : "28%",
        left: "85%",
        zIndex: 1000,
        transform: "translate(-50%, -50%)",
        maxWidth: "400px",
        width: "100%",
      }}
    >
      <div className="form-row mb-3 w-100 d-flex flex-column align-items-center gap-3 ">
        {formType === "register" && (
          <LoginInput
            formData={formData}
            handleChange={handleChange}
            label={"Nombre"}
            name={"name"}
            type={"text"}
          />
        )}
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
        {formType === "register" && (
          <LoginInput
            formData={formData}
            handleChange={handleChange}
            label={"ConfirmPassword"}
            name={"confirmPassword"}
            type={"password"}
          />
        )}
        <div className="d-flex gap-2">
          {formType === "register" ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => toggleFormType("login")}
            >
              Inicio de Sesión
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => toggleFormType("register")}
            >
              Registro
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {formType === "login" ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </div>
      </div>
    </form>
  );
};
