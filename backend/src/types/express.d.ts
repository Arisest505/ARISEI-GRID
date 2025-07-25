// src/types/express/index.d.ts
import { Usuario } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      usuario?: {
        id: string;
        rol_id: string;
      };
    }
  }
}

export {}; // obligatorio
