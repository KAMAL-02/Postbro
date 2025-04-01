import Link from "next/link";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { jetbrainsMono, inter } from "@/utils/fonts";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-3 py-1 bg-[#282828] text-white">
      <Link href="/">
        <h1 className={` ${inter.className} text-lg font-bold ml-4 text-[#fff]`}>Postbro</h1>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon">
            <Github className="w-6 h-6" />
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
