export interface Company {
  id: number;
  name: string;
  type: "recycling" | "incineration";
  location: string;
  distance: string;
  rating: number;
  verified: boolean;
  materials: string[];
  phone: string;
}

export const companies: Company[] = [
  { id: 1, name: "GreenCycle Ltd", type: "recycling", location: "Nairobi", distance: "2.1km", rating: 4.8, verified: true, materials: ["Plastic", "Metal", "Glass"], phone: "+254 712 345 678" },
  { id: 2, name: "EcoFlame Industries", type: "incineration", location: "Kiambu", distance: "5.3km", rating: 4.5, verified: true, materials: ["Medical waste", "Non-recyclable"], phone: "+254 723 456 789" },
  { id: 3, name: "CleanCity Recyclers", type: "recycling", location: "Nairobi", distance: "3.7km", rating: 4.9, verified: true, materials: ["Paper", "Cardboard", "Plastic"], phone: "+254 734 567 890" },
  { id: 4, name: "SafeBurn Solutions", type: "incineration", location: "Mombasa", distance: "12km", rating: 4.3, verified: true, materials: ["Hazardous", "Chemical waste"], phone: "+254 745 678 901" },
  { id: 5, name: "ReNew Materials Co", type: "recycling", location: "Nakuru", distance: "8.2km", rating: 4.7, verified: false, materials: ["E-waste", "Batteries", "Metal"], phone: "+254 756 789 012" },
  { id: 6, name: "ThermalWaste Kenya", type: "incineration", location: "Nairobi", distance: "4.1km", rating: 4.6, verified: true, materials: ["Industrial waste", "Organic"], phone: "+254 767 890 123" },
];
