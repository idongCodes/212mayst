import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 py-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
      <div className="flex flex-col gap-2">
        <p>&copy; {new Date().getFullYear()} 212 May Street</p>
        <p>
          Built by{" "}
          <Link 
            href="https://idong-essien.vercel.app" 
            target="_blank" 
            className="font-bold text-[var(--sandy-brown)] transition-colors hover:text-[var(--sky-blue)]"
          >
            idongCodes
          </Link>
        </p>
      </div>
    </footer>
  );
}