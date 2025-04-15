import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Header() {
    return (
        <header className="w-full px-6 py-4 flex justify-between items-center bg-transparent text-white fixed top-0 left-0 z-50">
            <h1 className="text-3xl font-bold">Hotelowo</h1>
            <button className="hover:opacity-80 transition">
                <AccountCircleIcon fontSize="large" />
            </button>
        </header>
    );
}