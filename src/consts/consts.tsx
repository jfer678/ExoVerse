import Book from "../components/Icons/Book";
import { House } from "../components/Icons/House";
import Task from "../components/Icons/Task";
import Animals from "../components/Icons/Animals";



export const NAV_ELEMENTS = [
  { label: "Inicio", to: "/", icon: <House /> },
  { label: "Animales", to: "/animales", icon: <Animals/>},
  { label: "Album", to: "/album", icon:<Book/> },
  { label: "Misiones", to: "/misiones", icon:<Task/> },
];

