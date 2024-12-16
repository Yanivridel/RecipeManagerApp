import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const dishCarouselImages = [
    "https://tinyurl.com/5bbnypmh",
    "https://tinyurl.com/ys2cwcap",
    "https://tinyurl.com/2s3ucn29",
    "https://tinyurl.com/26mf6hz8",
    "https://tinyurl.com/4rwxzpbm",
];

const categories = [
    { name: "Appetizer", image: "https://tinyurl.com/4e6aba7k" },
    { name: "Main Course", image: "https://tinyurl.com/35v7zrsm" },
    { name: "Side Dish", image: "https://tinyurl.com/57evw9x7" },
    { name: "Soup", image: "https://tinyurl.com/5eyfe4x8" },
    { name: "Salad", image: "https://tinyurl.com/2s2tkrbx" },
    { name: "Dessert", image: "https://tinyurl.com/4swwh7kh" },
    { name: "Beverage", image: "https://tinyurl.com/43kws25v" },
];

export default function Home() {
    const navigate = useNavigate();
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: false })
    );


    return (
        <div className="container mx-auto pr-5">
        {/* Header Section */}
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to Forkfolio</h1>
            <p className="text-lg text-gray-500">
            Organize, explore, and manage your favorite recipes!
            </p>
        </div>

        {/* Carousel Section */}
        <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-7xl mx-auto"
            opts={{ loop: true }}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
            {dishCarouselImages.map((url, index) => (
                <CarouselItem key={index} className="relative">
                <div className="p-2">
                    <Card>
                    <CardContent className="flex aspect-video items-center justify-center p-0 overflow-hidden">
                        <img
                        src={url}
                        alt={`Dish ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                        />
                    </CardContent>
                    </Card>
                </div>
                </CarouselItem>
            ))}
            </CarouselContent>
        </Carousel>

            {/* Categories Grid */}
            <div className="text-center mb-6">
                <h2 className="text-3xl font-semibold mb-4">Explore by Categories</h2>
            </div>
            <div className="grid grid-cols-1 max-w-7xl mx-auto xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                <Card key={category.name} 
                className={`overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 
                ${category.name === 'Beverage' ? "xs:col-span-2 lg:col-span-3": ""}`}
                onClick={() => navigate(`/recipes?category=${category.name.toLowerCase()}`)}
                >
                    <div className="relative">
                    <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2">
                        <h3 className="text-lg font-semibold">{category.name}</h3>
                    </div>
                    </div>
                </Card>
                ))}
            </div>


        </div>
    );
}
