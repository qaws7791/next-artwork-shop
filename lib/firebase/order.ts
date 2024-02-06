import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  OrderItem,
  OrderStatus,
  orderCollection,
  orderItemCollection,
} from ".";
import ArtworkService from "./artwork";
import CartService from "./cart";

const createOrderItem = async (orderItem: Omit<OrderItem, "amount">) => {
  const discountAmount = (orderItem.price * orderItem.discountRate) / 100;
  const discountedPrice = orderItem.price - discountAmount;
  const amount = Math.floor(discountedPrice * orderItem.quantity * 100) / 100;

  const docRef = await addDoc(orderItemCollection, {
    ...orderItem,
    amount,
  });

  return {
    id: docRef.id,
    ...orderItem,
    amount,
  };
};

type CreateOrderDto = Omit<OrderItem, "amount">[];

const createOrder = async (dto: CreateOrderDto) => {
  if (dto.length === 0) {
    throw new Error("Order items are empty");
  }
  const orderItems = await Promise.all(
    dto.map((item) => {
      return createOrderItem(item);
    }),
  );

  const totalAmount = orderItems.reduce((acc, item) => acc + item.amount, 0);
  const orderItemIds = orderItems.map((item) => item.id);

  const order = await addDoc(orderCollection, {
    totalAmount: totalAmount,
    createdAt: serverTimestamp(),
    itemIds: orderItemIds,
    status: "pending",
    userId: dto[0].userId,
  });

  return order.id;
};

const fetchOrderItemWithArtwork = async (orderItemId: string) => {
  const orderItemSnap = await getDoc(doc(orderItemCollection, orderItemId));
  if (!orderItemSnap.exists()) return null;

  const orderItem = {
    id: orderItemSnap.id,
    ...orderItemSnap.data(),
  };

  const artwork = await ArtworkService.fetchArtworkById(orderItem.artworkId);

  if (!artwork) return null;

  return {
    ...orderItem,
    artwork,
  };
};

const getOrder = async (orderId: string) => {
  const orderSnap = await getDoc(doc(orderCollection, orderId));
  if (!orderSnap.exists()) {
    return null;
  }
  const order = {
    id: orderSnap.id,
    ...orderSnap.data(),
  };

  return order;
};

const getOrderWithItems = async (orderId: string) => {
  const orderSnap = await getDoc(doc(orderCollection, orderId));
  if (!orderSnap.exists()) {
    throw new Error("Order not found");
  }

  const order = {
    id: orderSnap.id,
    ...orderSnap.data(),
  };

  const orderItemsSnap = await getDocs(
    query(orderItemCollection, where("orderId", "==", orderId)),
  );

  const orderItems = await Promise.all(
    order.itemIds.map(async (orderItemId) => {
      const data = await fetchOrderItemWithArtwork(orderItemId);
      if (!data) throw new Error("Order item not found");
      return data;
    }),
  );

  return {
    ...order,
    orderItems,
  };
};

const completeOrder = async ({
  orderId,
  paymentKey,
}: {
  orderId: string;
  paymentKey: string;
}) => {
  const order = await getOrder(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status === "completed") {
    throw new Error("Order already completed");
  }

  await updateDoc(doc(orderCollection, orderId), {
    status: "completed",
    paymentKey,
  });

  const orderItemsSnap = await getDocs(
    query(orderItemCollection, where("orderId", "==", orderId)),
  );

  const orderItems = orderItemsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  await Promise.all(
    orderItems.map((item) => {
      return CartService.removeCartItemByArtworkId(
        order.userId,
        item.artworkId,
      );
    }),
  );

  return orderId;
};

const orderService = {
  createOrder,
  getOrderWithItems,
  getOrder,
  completeOrder,
};

export default orderService;
