export const dynamic = "force-dynamic";
import orderService from "@/lib/firebase/order";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("body:", body);
  const paymentKey = body.paymentKey as string;
  const orderId = body.orderId as string;
  const amount = Number(body.amount);
  if (!paymentKey || !orderId || !amount) {
    return Response.json({
      status: 400,
      body: {
        message: "Invalid request",
      },
    });
  }

  const order = await orderService.getOrder(orderId);
  if (!order) {
    return Response.json({
      status: 404,
      body: {
        message: "Order not found",
      },
    });
  }

  if (order.totalAmount !== amount) {
    return Response.json({
      status: 400,
      body: {
        message: "Invalid amount",
      },
    });
  }

  if (order.status === "completed") {
    return Response.json({
      status: 400,
      body: {
        message: "Order already completed",
      },
    });
  }

  const secretKey = process.env.NEXT_TOSS_SECRET_KEY;
  const basicToken = Buffer.from(`${secretKey}:`, "utf-8").toString("base64");
  const confirmRes = await fetch(
    "https://api.tosspayments.com/v1/payments/confirm",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicToken}`,
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    },
  );

  if (confirmRes.status >= 400) {
    return Response.json({
      status: 500,
      body: {
        message: "Failed to confirm payment",
      },
    });
  }

  try {
    await orderService.completeOrder({ orderId, paymentKey });
  } catch (e) {
    return Response.json({
      status: 500,
      body: {
        message: "Failed to complete order",
      },
    });
  }

  return Response.json({
    status: 200,
    body: {
      message: "Payment confirmed",
    },
  });
}
