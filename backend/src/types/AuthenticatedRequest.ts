import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  usuario: {
    id: string;
    rol_id: string;
  };
}
