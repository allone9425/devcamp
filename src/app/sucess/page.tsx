import axios from "axios";
import { format } from "date-fns";

// Payment 인터페이스 정의
interface Payment {
  orderName: string;
  approvedAt: string;
  receipt: {
    url: string;
  };
  totalAmount: number;
  method: "카드" | "가상계좌" | "계좌이체";
}

// Props 타입 정의
interface SuccessPageProps {
  payment?: Payment;
  error?: string;
}

// 서버 사이드에서 결제 정보를 불러오는 load 함수
export async function load({ request }: { request: any }) {
  const url = new URL(request.url);
  const paymentKey = url.searchParams.get("paymentKey");
  const orderId = url.searchParams.get("orderId");
  const amount = url.searchParams.get("amount");

  try {
    const response = await axios.post<Payment>(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        paymentKey,
        orderId,
        amount,
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.TOSS_PAYMENTS_SECRET_KEY}:`
          ).toString("base64")}`,
        },
      }
    );

    return {
      props: { payment: response.data },
    };
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return {
      props: {
        error: "Payment confirmation failed.",
      },
    };
  }
}

// 결제 성공 페이지 컴포넌트
export default function SuccessPage({ payment, error }: SuccessPageProps) {
  if (error) {
    return <div>오류가 발생했습니다: {error}</div>;
  }

  if (!payment) {
    return <div>결제 정보를 불러오는 데 실패했습니다.</div>;
  }

  return (
    <main>
      <h1>결제 성공</h1>
      <p>주문: {payment.orderName}</p>
      <p>결제 수단: {payment.method}</p>
      <p>결제 금액: {payment.totalAmount.toLocaleString()}원</p>
      <p>
        결제 일시:{" "}
        {payment.approvedAt
          ? format(new Date(payment.approvedAt), "yyyy/MM/dd HH:mm:ss")
          : "날짜 정보 없음"}
      </p>
      <p>
        <a href={payment.receipt.url}>영수증 확인</a>
      </p>
    </main>
  );
}
