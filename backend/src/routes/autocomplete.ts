// routes/autocomplete.ts
import express from "express";
import { buscarColegios, buscarAutores } from "../controllers/autocompleteController";

const router = express.Router();

router.get("/colegios", buscarColegios);
router.get("/autores", buscarAutores);

export default router;
