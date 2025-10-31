import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import { useEffect, useState } from "react";

interface Property {
    id: string;
    image_url: string;
    title: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    size_sqft: number;
    amenities: string[];
}

export default function PropertiesComponent() {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        setProperties(JSON.parse(localStorage.getItem("properties")!));
    }, []);

    if (properties.length === 0) {
        return <div className="min-h-screen bg-background flex text-center items-center justify-center">
            <h1 className="text-4xl mb-2 text-foreground">No Properties available, Try some different filters.</h1>
        </div>
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-2 text-foreground">Available Properties</h1>
                <p className="text-muted-foreground mb-8">Browse our curated selection of properties</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property: any) => (
                        <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <img
                                src={property.image_url}
                                alt={property.title}
                                className="w-full h-48 object-cover"
                            />
                            <CardContent className="p-4">
                                <h3 className="text-xl font-semibold mb-2 text-foreground">{property.title}</h3>
                                <p className="text-2xl font-bold text-primary mb-3">
                                    ${property.price.toLocaleString()}
                                </p>

                                <div className="flex items-center text-muted-foreground mb-3">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    <span className="text-sm">{property.location}</span>
                                </div>

                                <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <Bed className="w-4 h-4 mr-1" />
                                        <span>{property.bedrooms} Bed</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Bath className="w-4 h-4 mr-1" />
                                        <span>{property.bathrooms} Bath</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Maximize className="w-4 h-4 mr-1" />
                                        <span>{property.size_sqft} sqft</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {property.amenities.map((amenity: any) => (
                                        <Badge key={amenity} variant="secondary" className="text-xs">
                                            {amenity}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};