import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      token?: string
    }
  }

  interface Error {
    status?: number;
  }
}

// middleware types:
type ErrorMiddleware = (err: Error | undefined, req: Request, res: Response, next: NextFunction) => void;

type Middleware = (req: Request, res: Response, next: NextFunction) => void

// data types:
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    categor_id: number;
    created_at: Date;
}

interface Category {
    id: number;
    name: string;
    description: string;
    image_url: string;
    created_at: Date;
}

interface Image {
    id: number;
    product_id: number;
    image_url: string;
}

export { User, Product, Category, Image, ErrorMiddleware, Middleware };
