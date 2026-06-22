export interface INotification {
  _id: string;
  user?: string;
  title: string;
  message: string;
  type: 'Order' | 'System' | 'Payment' | 'Chat' | 'Wishlist' | 'Restock';
  isRead: boolean;
  orderId?: string;
  conversationId?: string;
  link?: string;
  createdAt: string;
}
