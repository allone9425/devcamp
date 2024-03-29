"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  PaymentWidgetInstance,
  loadPaymentWidget,
} from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface PointInfo {
  totalPoints: number;
  usedPoints: number;
  isUsed: boolean;
}

interface PaymentInfo {
  orderId: string;
  orderName: string;
  customerName: string;
  customerEmail: string;
  successUrl: string;
  failUrl: string;
  amount: number; // 새로운 속성 추가
}

function Pay() {
  const [userInfo, setUserInfo] = useState({ name: "", phone: "" });
  const [couponCode, setCouponCode] = useState("");
  // 쿠폰 할인 금액
  const [discount, setDiscount] = useState(0);
  // 최종 결제 금액
  const [finalPrice, setFinalPrice] = useState(32500);

  //적립금 정보
  const [pointInfo, setPointInfo] = useState<PointInfo>({
    totalPoints: 3000,
    usedPoints: 0,
    isUsed: false,
  });
  const [inputPoints, setInputPoints] = useState(0);
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  //주문자정보 불러오기
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      setUserInfo({
        name: parsedUserInfo.username,
        phone: parsedUserInfo.phone,
      });
    }
  }, []);

  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(
        "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm",
        "YbX2HuSlsC9uVJW6NMRMj"
      );
      paymentWidgetRef.current = paymentWidget;

      // 결제 방법 렌더링
      paymentWidget.renderPaymentMethods(
        "#payment-widget",
        { value: finalPrice },
        { variantKey: "DEFAULT" }
      );
      // 이용약관 렌더링
      //paymentWidget.renderAgreement("#agreement");
    })();
  }, []);

  const form = useForm();
  const { toast } = useToast();
  const router = useRouter();
  // Mockup 쿠폰 데이터
  const coupons = [
    { code: "DISCOUNT50", type: "flatRate", value: 5000 },
    { code: "DISCOUNT30", type: "rate", value: 30 },
  ];

  const applyCoupon = () => {
    const coupon = coupons.find((c) => c.code === couponCode.toUpperCase());
    // 배송비
    const deliveryCharge = 2500;
    if (coupon) {
      let message = "";
      let discountAmount = 0;

      const priceAfterPoints = 30000 - pointInfo.usedPoints;

      if (coupon.type === "flatRate") {
        discountAmount = coupon.value;
        message = `₩${discountAmount} 할인이 적용되었습니다.`;
      } else if (coupon.type === "rate") {
        discountAmount = priceAfterPoints * (coupon.value / 100);
        message = `${coupon.value}% 할인이 적용되었습니다.`;
      }

      setDiscount(discountAmount);

      setFinalPrice(priceAfterPoints - discountAmount + deliveryCharge);

      toast({
        variant: "default",
        title: "할인 적용 성공",
        description: message,
      });
    } else {
      toast({
        variant: "destructive",
        title: "할인 적용 실패",
        description: "유효하지 않은 쿠폰 코드입니다.",
      });
    }
  };

  const applyPoints = (): void => {
    if (inputPoints <= pointInfo.totalPoints && inputPoints <= finalPrice) {
      setPointInfo({
        ...pointInfo,
        usedPoints: inputPoints,
        isUsed: true,
      });
      setFinalPrice(finalPrice - inputPoints);
    } else {
      setInputPoints(0);
      toast({
        variant: "destructive",
        title: "적립금 사용 실패",
        description:
          "사용 가능한 적립금이 부족하거나 결제 금액을 초과했습니다.",
      });
    }
  };
  const handlePayment = async () => {
    const paymentWidget = paymentWidgetRef.current;

    try {
      // 쿠폰과 적립금을 반영한 최종 결제 금액 계산
      const finalAmount = calculateFinalAmount();

      // 최종 결제 금액을 사용하여 결제 정보 생성
      const paymentInfo: PaymentInfo = {
        orderId: nanoid(),
        orderName: "상품명 예시",
        customerName: "고객 이름",
        customerEmail: "customer@example.com",
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
        amount: finalAmount,
      };

      // 결제 요청 보내기
      await paymentWidget?.requestPayment(paymentInfo);
    } catch (error) {
      console.error(error);
    }
  };

  // 쿠폰 및 적립금이 적용된 최종 결제 금액 계산 함수
  // 쿠폰 및 적립금이 적용된 최종 결제 금액을 계산합니다.
  const calculateFinalAmount = () => {
    let finalAmount = finalPrice; // 기본적으로 finalPrice로 초기화합니다.

    // 쿠폰이 적용되었을 경우
    if (discount > 0) {
      finalAmount -= discount; // 쿠폰 할인 금액을 최종 결제 금액에서 차감합니다.
    }

    // 적립금이 적용되었을 경우
    if (pointInfo.isUsed && pointInfo.usedPoints > 0) {
      finalAmount -= pointInfo.usedPoints; // 적립금 사용 금액을 최종 결제 금액에서 차감합니다.
    }

    // 최종 결제 금액이 음수가 되지 않도록 보장합니다.
    if (finalAmount < 0) {
      finalAmount = 0;
    }

    return finalAmount;
  };

  // 로그아웃  함수
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    router.push("/");
  };
  return (
    <div className="w-1/2 mx-auto">
      <Form {...form}>
        <div className="border-2 my-[30px] pt-[20px]">
          <FormField
            name="productDetails"
            render={() => (
              <FormItem>
                <FormLabel className="my-[20px] text-xl font-bold ml-[20px]">
                  주문 상품
                </FormLabel>
                <FormControl>
                  <>
                    <div className="flex flex-wrap ">
                      <p className="mx-[30px]">
                        <img
                          src="https://placehold.co/150x150"
                          alt="상품 이미지"
                        />
                      </p>
                      <div className="leading-9">
                        <div className="flex w-[300px] items-center ">
                          <Label className="mr-[10px]">품명</Label>
                          <p>땡땡땡 셔츠</p>
                        </div>
                        <div className="flex w-[300px] items-center">
                          <Label className="mr-[10px]">색상</Label>
                          <p>레드</p>
                        </div>
                        <div className="flex w-[300px] items-center">
                          <Label className="mr-[10px]">수량</Label>
                          <p>1개</p>
                        </div>
                        <div className="flex w-[300px] items-center">
                          <Label className="mr-[10px]">가격</Label>
                          <p>30,000원</p>
                        </div>
                      </div>
                    </div>
                    <FormMessage />
                  </>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="shippingFee"
            render={({ field }) => (
              <FormItem className="flex bg-gray-100 pl-[20px] py-[10px] mt-[20px] justify-between items-center">
                <FormLabel className="w-[150px]">배송비</FormLabel>
                <FormControl>
                  <p className="pr-[20px] translate-y-[-3px]">+ 2500원</p>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="customerInfo"
          render={() => (
            <FormItem className="border-2 my-[30px] leading-9 pt-[20px]">
              <FormLabel className="mt-[20px] mb-[10px] text-xl font-bold ml-[20px]">
                주문자 정보
              </FormLabel>
              <FormControl>
                <>
                  <h4 className=" ml-[20px]">{userInfo.name}</h4>
                  <h4 className=" ml-[20px] pb-[20px]">{userInfo.phone}</h4>
                  <FormMessage />
                </>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="pointInfo"
          render={() => (
            <FormItem className="border-2 my-[30px] leading-9 pt-[20px]">
              <FormLabel className="mt-[20px] mb-[10px] text-xl font-bold ml-[20px]">
                적립금
              </FormLabel>
              <FormControl>
                <div className="flex flex-wrap items-center justify-between w-full ml-[20px] mb-[20px]">
                  <p className="w-[60px] ">적립금</p>
                  <div className="flex  w-[calc(100%-60px)] ">
                    <Input
                      type="text"
                      value={inputPoints.toString()}
                      onChange={(e) => {
                        const enteredPoints = parseInt(e.target.value, 10);
                        if (!isNaN(enteredPoints) && enteredPoints >= 0) {
                          setInputPoints(enteredPoints);
                        } else {
                          setInputPoints(0);
                        }
                      }}
                      placeholder="사용할 포인트 입력"
                      disabled={pointInfo.isUsed || finalPrice === 0}
                    />
                    <Button
                      type="button"
                      onClick={applyPoints}
                      className="mr-[40px]  ml-[10px]"
                    >
                      적립금 사용
                    </Button>
                  </div>{" "}
                  <div className="w-full flex justify-end mr-[40px]">
                    <p className="mr-[10px] mb-[20px]">보유 적립금</p>
                    <p>{pointInfo.totalPoints.toLocaleString()}원</p>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="couponInfo"
          render={() => (
            <FormItem className="border-2 my-[30px] leading-9 pt-[20px] pb-[40px]">
              <FormLabel className="mt-[20px] mb-[10px] text-xl font-bold ml-[20px]">
                쿠폰
              </FormLabel>
              <FormControl>
                <div className="flex mb-[20px]">
                  <h4 className=" ml-[20px] mr-[10px]">쿠폰</h4>
                  <Input
                    className="w-[calc(100%-180px)]"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="쿠폰 코드 입력"
                  />
                  <Button
                    type="button"
                    className="ml-[10px] mb-[10px]"
                    onClick={applyCoupon}
                  >
                    쿠폰 적용
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="payInfo"
          render={() => (
            <FormItem className="border-2 my-[30px] leading-9 pt-[20px]">
              <FormLabel className="mt-[20px] mb-[10px] text-xl font-bold ml-[20px]">
                결제 정보
              </FormLabel>
              <FormControl>
                <>
                  <div className="leading-9 flex flex-wrap justify-center mx-[20px]">
                    <div className="flex w-full justify-between ">
                      <h4 className="mr-[10px]">주문 상품</h4>
                      <h4>30,000원</h4>
                    </div>
                    <div className="flex w-full justify-between">
                      <p className="mr-[10px]">배송비</p>
                      <p>+2,500원</p>
                    </div>
                    <div className="flex w-full justify-between">
                      <p className="mr-[10px]">쿠폰할인</p>
                      <p>
                        {discount > 0
                          ? `-${discount.toLocaleString()}원`
                          : "0원"}
                      </p>
                    </div>
                    <div className="flex w-full justify-between">
                      <p className="mr-[20px]">적립금 사용</p>
                      <p>
                        {pointInfo.usedPoints > 0
                          ? `-${pointInfo.usedPoints.toLocaleString()}원`
                          : "0원"}
                      </p>
                    </div>
                  </div>
                  <div className="flex bg-gray-100 font-bold pl-[20px] py-[10px] px-[10px] mt-[20px] justify-between">
                    <h4 className="mr-[10px]">최종 결제 금액</h4>
                    <h4>{finalPrice.toLocaleString()}원</h4>
                  </div>
                </>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="border-2 mt-[30px] leading-9 py-[20px]">
              <FormLabel className="mt-[20px] mb-[20px] text-xl font-bold ml-[20px]">
                결제 수단
              </FormLabel>
              <FormControl>
                <div
                  className="flex items-center mb-[10px]"
                  id="payment-widget"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          onClick={handlePayment}
          className="w-full my-[20px]"
        >
          결제하기
        </Button>
      </Form>
      <Button type="button" onClick={handleLogout} className="float-right">
        로그아웃
      </Button>
    </div>
  );
}

export default Pay;
