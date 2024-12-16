import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Contact() {
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const subject = encodeURIComponent("New Message From Contact Form");
        const body = encodeURIComponent(message);
        const mailtoLink = `mailto:yanivridel@gmail.com?subject=${subject}&body=${body}%0A%0AFrom: ${encodeURIComponent(email)}`;

        window.location.href = mailtoLink;

        setMessage("");
        setEmail("");
    };


    return (
        <div className="container mx-auto p-6 max-w-4xl">
        <Card className="shadow-lg">
            <CardHeader className="text-center">
            <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
            <p className="text-gray-500">We'd love to hear from you! Reach out with any questions or feedback.</p>
            </CardHeader>
            <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
                <Input type="text" placeholder="Your Name" required />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" required />
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)}placeholder="Your Message" rows={6} required />
                <Button type="submit" className="w-full md:w-auto">
                Send Message
                </Button>
            </form>
            </CardContent>
        </Card>
        </div>
    );
}
