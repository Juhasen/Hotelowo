import Image from 'next/image';

import mainImage from "../../public/assets/images/hotel-main.jpg"

export default function Home() {
  return (
      <div className="relative w-screen h-screen">
          <Image
              src={mainImage}
              alt="Main Hotel Image"
              fill
              className="object-cover"
              priority
          />
      </div>
  );
}
