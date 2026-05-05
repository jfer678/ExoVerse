import { type FormData } from "../../hooks/useAuth";

interface LoginInputProps {
  formData: FormData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement| HTMLSelectElement>) => void;
  label: string;
  name: string;
  type: string;
}

export const LoginInput = ({
  formData,
  handleChange,
  label,
  name,
  type,
}: LoginInputProps) => {
  return (
    <div className="form-group col-md-7">
      <label htmlFor={name}>{label}</label>
      <input
        onChange={handleChange}
        name={name}
        type={type}
        value={formData[name as keyof FormData] || ''}
        className="form-control"
        id={name}
        placeholder={label}
      />
    </div>
  );
};
