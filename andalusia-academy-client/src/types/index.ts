export interface Course {
  id: number;
  title: string;
  category: string;
  image: string;
  duration: string;
  price: number;
  status: "open" | "coming-soon" | "closed";
}

export interface Program {
  id: number;
  title: string;
  description: string;
  courseCount: number;
  image: string;
}

export interface CareerPath {
  id: number;
  title: string;
  description: string;
  relatedProgramIds: number[];
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface Partner {
  id: number;
  name: string;
  logo: string;
}
