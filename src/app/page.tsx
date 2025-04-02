import Link from 'next/link';

export default function Home() {
  return (
      <div className="flex w-full bg-red-500">
        <h1>Hotelowo HOME PAGE</h1>
          <Link href="/about" className="text-blue-500" >O mnie</Link>
      </div>
  );
}
