import { createBrowserRouter } from "react-router";
import { Home } from "../pages/Home";
import { MainLayout } from "../layouts/MainLayout";
import { Album } from "../pages/Album";
import { Misiones } from "../pages/Misiones";
import { Animales } from "../pages/Animales";
import { NotFound } from "../pages/NotFound";
import MemoryPairs from "../pages/MemoryPairs";
import QuestionsGame from "../pages/QuestionsGame";
import Puzzles from "../pages/Puzzles";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/animales",
        element: <Animales />,
      },
      {
        path: "/album",
        element: <Album />,
      },
      {
        path: "/misiones",
        element: <Misiones />,
      },
      {
        path: "/misiones/memory-pairs",
        element: <MemoryPairs />,
      },
       {
        path: "/misiones/questions-game",
        element: <QuestionsGame />,
      },
      {
        path: "/misiones/puzzles",
        element: <Puzzles />,
      },
      {
        path: "*",
        element: <NotFound />,
      }
      
    ],
  },
]);
