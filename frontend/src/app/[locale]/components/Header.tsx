import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from 'next/link';

export default function Header() {
    return (
        <header
            className="w-full px-6 py-4 flex justify-between items-center bg-transparent text-white fixed top-0 left-0 z-50">
            <Link href={"/public"} className="hover:opacity-80 transition">
                <h1 className="text-3xl font-bold">Hotelowo</h1>
            </Link>
            <Link href={"/profile"} className="hover:opacity-80 transition">
                <AccountCircleIcon fontSize="large"/>
            </Link>
        </header>
    );
}