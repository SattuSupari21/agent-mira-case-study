"use server"

import property_basics from "@/lib/property_basics.json";
import property_characteristics from "@/lib/property_characteristics.json";
import properyImages from "@/lib/property_images.json";

type PropertyBasics = {
    id: number,
    title: string,
    price: number,
    location: string
}

type PropertyCharacteristics = {
    id: number,
    bedrooms: number,
    bathrooms: number,
    size_sqft: number,
    amenities: string[]
}

type PropertyImages = {
    id: number,
    image_url: string
}

type GetPropertyDataParameterType = {
    price?: number,
    location?: string,
    numberOfBedrooms?: number,
    numberOfBathrooms?: number,
    propertySize?: number,
    amenities?: [],
}

type PropertyBasicsType = PropertyBasics[];
type PropertyCharacteristicsType = PropertyCharacteristics[];
type PropertyImagesType = PropertyImages[];

const properties: PropertyBasicsType = property_basics;
const propertyCharacteristics: PropertyCharacteristicsType = property_characteristics;
const propertyImages: PropertyImagesType = properyImages;

export async function getPropertyData({
    ids,
    locations,
    numberOfBedrooms,
    numberOfBathrooms,
    size_sqft,
    amenities
}: {
    ids: number[],
    locations: string[],
    numberOfBedrooms: number,
    numberOfBathrooms: number,
    size_sqft: number,
    amenities: string[]
}) {

    const result = ids.map((id) => {
        const base = properties.find((b) => b.id === id);
        const characteristic = propertyCharacteristics.find((c) => c.id === id);
        const image = propertyImages.find((img) => img.id === id);

        if (!base && !characteristic && !image) return null;

        return { ...base, ...characteristic, ...image };
    })
        .filter(Boolean)
        .filter((property) =>
            numberOfBedrooms ? property!.bedrooms! <= numberOfBedrooms : true
        )
        .filter((property) =>
            numberOfBathrooms ? property!.bathrooms! <= numberOfBathrooms : true
        )
        .filter((property) =>
            size_sqft ? property!.size_sqft! <= size_sqft : true
        );

    const filteredRes = result.filter(
        (res) =>
            locations.includes(res!.location!) &&
            res!.amenities?.some((a: string) => amenities.includes(a))
    );

    return filteredRes;
}

export async function getAvailablePropertyLocations({ price }: GetPropertyDataParameterType) {
    let availableProperties: PropertyBasicsType = []

    if (price) {
        properties.map(property => {
            if (property.price <= price) {
                availableProperties.push(property)
            }
        })
    }

    let response: string[] = [];

    availableProperties.map(property => {
        response.push(property.location)
    })

    const propertyList = [...new Set(response)];

    return { "data": availableProperties, "property_list": propertyList };
}