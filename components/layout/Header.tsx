import Image from "next/image";
import logo from "@/assets/logo.svg";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-header">
      <div className="flex justify-center">
        <Link href="/">
          <Image src={logo} alt="Logo" width={100} />
        </Link>
      </div>
    </header>
  );
}
