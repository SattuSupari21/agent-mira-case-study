"use server"

import property_basics from "@/lib/property_basics.json";

type PropertyBasics = {
    id: number,
    title: string,
    price: number,
    location: string
}

type PropertyBasicsType = PropertyBasics[];

export async function getPropertyData() {
    const properties:PropertyBasicsType = property_basics;

    return properties;
}