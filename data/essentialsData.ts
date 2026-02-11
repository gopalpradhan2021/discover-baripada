export type ServiceItem = {
  id: string;
  name: string;
  type: string;
  price: string;
  area: string;
  phone: string;
  whatsapp?: string;
};

export type EssentialsCategory = {
  title: string;
  items: ServiceItem[];
};

export const essentialsData: EssentialsCategory[] = [
  {
    title: "Home Services",
    items: [
      {
        id: "home-plumber",
        name: "Sahu Plumbing",
        type: "Plumber",
        price: "₹250",
        area: "Baripada Town",
        phone: "+919337000101",
        whatsapp: "+919337000101",
      },
      {
        id: "home-electric",
        name: "Mishra Electricals",
        type: "Electrician",
        price: "₹300",
        area: "Rangamatia",
        phone: "+919337000102",
      },
      {
        id: "home-carpenter",
        name: "Nayak Carpentry",
        type: "Carpenter",
        price: "₹350",
        area: "Kalama",
        phone: "+919337000103",
        whatsapp: "+919337000103",
      },
    ],
  },
  {
    title: "Transport",
    items: [
      {
        id: "transport-auto",
        name: "City Auto Stand",
        type: "Auto / Local Ride",
        price: "₹60",
        area: "Main Road",
        phone: "+919337000201",
      },
      {
        id: "transport-taxi",
        name: "Mayurbhanj Taxi",
        type: "Taxi",
        price: "₹350",
        area: "NH-18",
        phone: "+919337000202",
        whatsapp: "+919337000202",
      },
    ],
  },
  {
    title: "Rentals",
    items: [
      {
        id: "rental-bike",
        name: "Baripada Bike Rentals",
        type: "Bike Rental",
        price: "₹500",
        area: "Station Road",
        phone: "+919337000301",
      },
      {
        id: "rental-car",
        name: "City Car Rentals",
        type: "Car Rental",
        price: "₹1800",
        area: "Bhanjpur",
        phone: "+919337000302",
        whatsapp: "+919337000302",
      },
    ],
  },
  {
    title: "Emergency",
    items: [
      {
        id: "emergency-ambulance",
        name: "Ambulance Helpline",
        type: "Emergency",
        price: "₹0",
        area: "Baripada",
        phone: "108",
      },
      {
        id: "emergency-police",
        name: "Police Control Room",
        type: "Emergency",
        price: "₹0",
        area: "Baripada",
        phone: "112",
      },
    ],
  },
  {
    title: "Domestic Help",
    items: [
      {
        id: "domestic-cleaning",
        name: "Sahoo Home Care",
        type: "Cleaning",
        price: "₹400",
        area: "Jubel Town",
        phone: "+919337000401",
      },
      {
        id: "domestic-cooking",
        name: "Panda Cook Services",
        type: "Cooking",
        price: "₹700",
        area: "Ramdihi",
        phone: "+919337000402",
        whatsapp: "+919337000402",
      },
    ],
  },
];
