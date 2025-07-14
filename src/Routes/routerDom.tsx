import { createBrowserRouter } from "react-router-dom";

import EditarDisciplina from "../pages/EditarDisciplina";
import ListaDisciplinas from "../pages/ListaDisciplinas";
import NovaDisciplina from "../pages/NovaDisciplina";

export const router = createBrowserRouter([

    {
        path: "/",
        element: <ListaDisciplinas />
    },
    {
        path: "/nova",
        element: <NovaDisciplina />
    },
    { 
        path: "/editar/:id",
        element: <EditarDisciplina />
    },

]);