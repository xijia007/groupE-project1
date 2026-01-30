import "./Auth.css";

export function ForgotPassword() {
  return (
    <div className="signin-page">
      <div className="relative bg-white rounded-lg p-[clamp(28px,5vw,56px)] flex flex-col items-center justify-center text-center gap-5">
        <img
          src="../../../public/Mail.png"
          alt="Mail Icon"
          className="w-[88px] h-[88px] object-contain block"
        />
        <h2 className="m-0 text-[clamp(22px,2.2vw,34px)] leading-[1.25] font-bold text-[#111827] max-w-[28ch]">
          We have send the update password link to your email, please check that
          !
        </h2>
      </div>
    </div>
  );
}
