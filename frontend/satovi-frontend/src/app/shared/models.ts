export class Watch {
  watch_id?: string;
  model?: string;
  color?: string;
  brand?: string;
  manufactureDate?: string;
  mechanism?: string;
  price?:number;
  available?:number;
  image?:string;
  imageUrl?:any;
}

export class UserCredentials {
  username?: string;
  password?: string;
  role?: string;
}

export class CartItem {
  itemID?: string;
  amount?: number;
  watch?: Watch;
  watchID?: Watch;
}

export class ShoppingCart {
  userID?: string;
  cartItems: CartItem[] = [];
}

export class Order {
  order_ID?: string;
  userID?: string;
  state?: string;
  address?: string;
  mail?: string;
  phone?: string;
  name?: string;
  zipCode?: string;
  dateOfOrder?: string;
  orderItems?: OrderedWatch[];
}

export class OrderedWatch {
  model?: string;
  brand?: string;
  price?: number;
  color?: string;
  amount?: number;
}

export class UserInfo {
   address?: string;
   mail?: string;
   phone?: string;
   name?: string;
   zipCode?: string;
}

export interface Request {
  subject: string;
  email: string;
  text: string;
  name: string;
}

export class Amount {
  amount?: number;
  watchId?: string;
}
