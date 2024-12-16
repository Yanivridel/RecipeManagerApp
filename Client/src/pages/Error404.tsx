import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Error404 = () => {
    return (
        <div className="flex items-center justify-center mx-auto h-screen">
        <Card className="w-full max-w-md shadow-lg p-6">
            <CardHeader className="text-center">
            <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            </CardHeader>
            <CardContent className="text-center space-y-4">
            <p className="text-gray-500">
                Sorry, the page you are looking for does not exist or has been moved.
            </p>
            <Link to="/">
                <Button className="w-full md:w-auto mt-4">Go to Home</Button>
            </Link>
            </CardContent>
        </Card>
        </div>
    );
};

export default Error404;