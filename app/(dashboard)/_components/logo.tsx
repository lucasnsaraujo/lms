import Image from "next/image";

export const Logo = () => {
  return (
    <Image
      height={130}
      width={130}
      className="my-0 mx-auto"
      alt="Logo"
      src="/logo.svg"
    />
  );
};
