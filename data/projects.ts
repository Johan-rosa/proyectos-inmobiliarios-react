export interface Property {
  id: string
  title: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  description: string
  image: string
  latitude: number
  longitude: number
  propertyType: "apartment_building" | "house" | "condo" | "townhouse"
  amenities?: string[]
  condicion?: string
  anioEntrega?: number
  zona?: string
}

export const properties: Property[] = [
  {
    id: "405289",
    title: "Biltmore XVI",
    address: "Sector Naco, Polígono Central, Santo Domingo",
    price: 8500000,
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 12000,
    description:
      "Biltmore XVI es un exclusivo proyecto residencial ubicado en el corazón del sector Naco. Con una arquitectura moderna y elegante, ofrece apartamentos de lujo con acabados de primera calidad. El edificio cuenta con amplias áreas sociales, seguridad 24/7 y una ubicación privilegiada cerca de los principales centros comerciales, restaurantes y servicios de la zona. Fecha de entrega prevista para 2023.",
    image: "/405289.jpg",
    latitude: 18.4679,
    longitude: -69.9274,
    propertyType: "apartment_building",
    amenities: ["Gimnasio", "Piscina", "Área Social", "Seguridad 24/7", "Lobby", "Ascensores"],
    condicion: "Construccion",
    anioEntrega: 2023,
    zona: "Polígono Central",
  },
  {
    id: "405310",
    title: "Britney V",
    address: "Sector Naco, Polígono Central, Santo Domingo",
    price: 7200000,
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 10500,
    description:
      "Britney V es un moderno proyecto residencial ya finalizado en el prestigioso sector de Naco. Ofrece apartamentos con diseños contemporáneos y funcionales, perfectos para quienes buscan comodidad y exclusividad. El edificio cuenta con excelentes amenidades para el disfrute de sus residentes y una ubicación estratégica con fácil acceso a las principales vías de la ciudad. Proyecto listo para entrega inmediata.",
    image: "/405310.jpeg",
    latitude: 18.4719,
    longitude: -69.9222,
    propertyType: "apartment_building",
    amenities: ["Gimnasio", "Terraza", "Área de BBQ", "Seguridad 24/7", "Estacionamiento Privado"],
    condicion: "Listo",
    anioEntrega: 2022,
    zona: "Polígono Central",
  },
  {
    id: "406222",
    title: "MIRAGE RESIDENCE",
    address: "Sector Naco, Polígono Central, Santo Domingo",
    price: 9800000,
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 14000,
    description:
      "MIRAGE RESIDENCE es un impresionante proyecto que redefine el lujo en el sector Naco. Sus apartamentos ofrecen espacios amplios con vistas panorámicas de la ciudad y acabados de alta gama. El edificio incorpora tecnología de punta y amenidades exclusivas diseñadas para brindar una experiencia de vida excepcional. Su arquitectura vanguardista lo convierte en un ícono del desarrollo inmobiliario moderno en Santo Domingo.",
    image: "/406222.jpg",
    latitude: 18.4725,
    longitude: -69.9205,
    propertyType: "apartment_building",
    amenities: [
      "Piscina Infinity",
      "Gimnasio Equipado",
      "Spa",
      "Salón de Eventos",
      "Cine Privado",
      "Seguridad 24/7",
      "Lobby de Lujo",
    ],
    condicion: "Construccion",
    anioEntrega: 2024,
    zona: "Polígono Central",
  },
  {
    id: "406235",
    title: "Rubi Naco",
    address: "Sector Naco, Polígono Central, Santo Domingo",
    price: 6800000,
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 9800,
    description:
      "Rubi Naco es un proyecto residencial que combina funcionalidad y elegancia en una de las mejores ubicaciones del sector Naco. Sus apartamentos están diseñados con espacios eficientes y acabados modernos que garantizan confort y estilo. El edificio ofrece amenidades pensadas para el bienestar de sus residentes y una excelente relación calidad-precio, ideal para inversión o para establecer su hogar.",
    image: "/406235.jpeg",
    latitude: 18.4801,
    longitude: -69.9262,
    propertyType: "apartment_building",
    amenities: ["Gimnasio", "Área Social", "Seguridad 24/7", "Estacionamiento Techado"],
    condicion: "Construccion",
    anioEntrega: 2022,
    zona: "Polígono Central",
  },
  {
    id: "406363",
    title: "Aitana Suites",
    address: "Sector Naco, Polígono Central, Santo Domingo",
    price: 8900000,
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 11500,
    description:
      "Aitana Suites presenta un concepto innovador de apartamentos tipo suite en el exclusivo sector de Naco. Con un diseño arquitectónico que maximiza la luz natural y las vistas, ofrece espacios sofisticados y funcionales. El proyecto incluye amenidades premium y servicios que elevan la experiencia de vida urbana. Su ubicación privilegiada permite acceso rápido a los principales puntos de interés de la ciudad.",
    image: "/406363.jpg",
    latitude: 18.4789,
    longitude: -69.9304,
    propertyType: "apartment_building",
    amenities: ["Piscina", "Gimnasio", "Coworking", "Lounge", "Seguridad 24/7", "Recepción"],
    condicion: "Construccion",
    anioEntrega: 2024,
    zona: "Polígono Central",
  },
  {
    id: "410298",
    title: "Liberty Place",
    address: "Sector Naco, Polígono Central, Santo Domingo",
    price: 11500000,
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 16000,
    description:
      "Liberty Place es un proyecto residencial de alto standing que redefine el concepto de lujo en Naco. Con apartamentos de generosas dimensiones y acabados importados, ofrece un nivel de exclusividad sin precedentes. El edificio incorpora las últimas tendencias en diseño y tecnología, junto con amenidades de clase mundial que garantizan una experiencia de vida extraordinaria en uno de los sectores más codiciados de Santo Domingo.",
    image: "/410298.jpeg",
    latitude: 18.4778,
    longitude: -69.9312,
    propertyType: "apartment_building",
    amenities: [
      "Piscina Infinity",
      "Gimnasio de Última Generación",
      "Spa Completo",
      "Salón de Eventos",
      "Wine Cellar",
      "Concierge 24/7",
      "Helipuerto",
    ],
    condicion: "Construccion",
    anioEntrega: 2026,
    zona: "Polígono Central",
  },
  {
    id: "412671",
    title: "ONZE LUXURY SUITES",
    address: "Sector Naco, Polígono Central, Santo Domingo",
    price: 8700000,
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 11000,
    description:
      "ONZE LUXURY SUITES ofrece un concepto boutique de apartamentos de lujo en el corazón de Naco. Con solo once unidades exclusivas, garantiza privacidad y exclusividad a sus residentes. Cada apartamento cuenta con acabados de alta gama, amplios espacios y vistas privilegiadas. El edificio incorpora amenidades selectas y servicios personalizados que complementan perfectamente su carácter exclusivo y sofisticado.",
    image: "/412671.jpeg",
    latitude: 18.4704,
    longitude: -69.924,
    propertyType: "apartment_building",
    amenities: ["Piscina", "Gimnasio Privado", "Terraza Panorámica", "Seguridad 24/7", "Servicio de Concierge"],
    condicion: "Construccion",
    anioEntrega: 2024,
    zona: "Polígono Central",
  },
]
