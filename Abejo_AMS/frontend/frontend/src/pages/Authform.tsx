interface AuthFormProps {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  linkText: string;
  linkHref: string;
  linkMessage: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  onSubmit,
  children,
  linkText,
  linkHref,
  linkMessage,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-xl px-10 py-8 w-full max-w-md">
      <h1 className="text-xl font-bold text-center mb-6">{title}</h1>
      <form onSubmit={onSubmit} className="space-y-5">
        {children}
        <button
          type="submit"
          className="w-full h-11 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition"
        >
          {title}
        </button>
        <p className="text-sm text-center mt-3">
          {linkMessage}{" "}
          <a href={linkHref} className="text-blue-600 hover:underline">
            {linkText}
          </a>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
