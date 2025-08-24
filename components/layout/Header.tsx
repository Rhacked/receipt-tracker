import Image from "next/image";
import logo from "@/assets/logo.svg";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-header">
      <nav className="flex justify-center items-center font-semibold">
        <Link href="/">Upload</Link>
        <Link href="/">
          <Image src={logo} alt="Logo" width={100} />
        </Link>
        <Link href="/receipts">Receipts</Link>
      </nav>
    </header>
  );
}
