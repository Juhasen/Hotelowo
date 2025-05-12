import Image from 'next/image';

const categories = [
    { name: 'Beach', image: '/assets/images/dummyImg.jpg' },
    { name: 'Luxury', image: '/assets/images/dummyImg.jpg' },
    { name: 'Family', image: '/assets/images/dummyImg.jpg' },
    { name: 'Adventure', image: '/assets/images/dummyImg.jpg' },
];

export default function CategoriesSection() {
    return (
        <div className="w-full px-4 py-12">
            <h2 className="text-3xl font-bold text-center mb-8">Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105"
                    >
                        <div className="relative w-full h-48">
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4 text-center text-black">
                            <h3 className="text-lg font-semibold">{category.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
