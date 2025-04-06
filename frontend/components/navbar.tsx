import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { inter } from "@/utils/fonts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-3 py-1 bg-[#282828] text-white">
      <Link href="/">
        <h1 className={` ${inter.className} text-sm font-bold ml-4 text-[#fff]`}>POSTBRO</h1>
      </Link>
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>

        <Link href="https://github.com/KAMAL-02/Postbro" target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon" className="p-0 bg-transparent hover:bg-transparent cursor-pointer">
            <Image
              src="/github.svg"
              alt="GitHub"
              width={24}
              height={24}
              className="object-contain invert"
            />
          </Button>
        </Link>
        </TooltipTrigger>
        <TooltipContent side="left" align="center" className="text-[#df894c] text-sm">
          GitHub
        </TooltipContent>
        </Tooltip>

        <Link href="/login">
          <Button className="text-sm bg-[#df894c] text-black hover:bg-orange-400 transition-colors duration-200 cursor-pointer font-semibold">
            Login
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
