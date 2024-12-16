import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function About() {
    return (
        <div className="container mx-auto p-6 max-w-4xl">
        <Card className="shadow-lg">
            <CardHeader className="text-center">
            <h1 className="text-4xl font-bold mb-2">About Us</h1>
            <p className="text-gray-500">
                Learn more about our mission, team, and the story behind our recipes.
            </p>
            </CardHeader>
            <CardContent className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
                At <span className="font-bold">Forkfolio</span>, we believe that cooking is more than just preparing
                meals—it's about sharing moments, experimenting with flavors, and creating memories. Our platform was
                built to connect food lovers, home cooks, and professional chefs alike.
            </p>

            <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20">
                <AvatarImage src="https://tinyurl.com/2k2kphtv" alt="Team Leader" />
                <AvatarFallback>YR</AvatarFallback>
                </Avatar>
                <div>
                <h3 className="text-xl font-semibold">Yaniv Ridel</h3>
                <p className="text-gray-500">Head Chef & Founder</p>
                </div>
            </div>

            <Button className="w-full md:w-auto">Explore Recipes</Button>
            </CardContent>
        </Card>
        </div>
    );
}
