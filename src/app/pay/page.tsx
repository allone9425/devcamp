import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
function pay() {
  return (
    <div className="w-1/2">
      <section className="border-2 my-[30px]">
        <h3 className="my-[20px] text-xl font-bold ml-[20px]">주문 상품</h3>
        <div className="flex flex-wrap justify-center ">
          <p className="mr-[30px]">
            <img src="https://placehold.co/150x150" />
          </p>
          <div className="leading-9">
            <div className="flex  w-[300px] ">
              <h4 className="mr-[10px]">상품명</h4>
              <h4>땡땡땡 셔츠</h4>
            </div>
            <div className="flex w-[300px] ">
              <p className="mr-[10px]">색상 </p>
              <p>레드</p>
            </div>
            <div className="flex w-[300px]">
              <p className="mr-[10px]">수량 </p>
              <p> 1개</p>
            </div>
            <div className="flex w-[300px]">
              <p className="mr-[10px]">가격 </p>
              <p> 30,000원</p>
            </div>
          </div>
        </div>
        <div className="flex bg-gray-100 pl-[20px] py-[10px] mt-[20px]">
          <h4 className="mr-[10px]">배송비</h4>
          <h4> 2,500원</h4>
        </div>
      </section>
      <section className="border-2 my-[30px] leading-9">
        <h3 className="mt-[20px] mb-[10px] text-xl font-bold ml-[20px]">
          주문자 정보
        </h3>
        <h4 className=" ml-[20px]">김나나</h4>
        <h4 className=" ml-[20px] mb-[10px]">010-1234-5678</h4>
      </section>
      <section className="border-2 my-[30px] leading-9">
        <h3 className="my-[20px] text-xl font-bold ml-[20px]">쿠폰 / 적립금</h3>
        <div className="flex mb-[20px]">
          <h4 className=" ml-[20px] mr-[10px]">쿠폰</h4>
          <h4 className=" ">미사용</h4>
          <Button type="button" className="ml-[10px] ">
            쿠폰 적용
          </Button>
        </div>
        <div className="flex  flex-wrap  items-center  ml-[20px] mb-[20px] ">
          <p className="w-[100px] ">적립금</p>
          <Input type="text" className="w-[260px] text-right" />
          <Button type="button" className="mr-[20px] ml-[10px]">
            적립금 사용
          </Button>
          <div className="w-full flex justify-end mr-[25px]">
            <p className="mr-[10px]">보유 적립금</p>
            <p>3,000</p>
          </div>
        </div>
      </section>
      <section className="border-2 my-[30px] leading-9">
        <h3 className="mt-[20px] mb-[20px] text-xl font-bold ml-[20px]">
          결제 정보
        </h3>
        <div className="leading-9  flex flex-wrap justify-center mx-[20px]">
          <div className="flex  w-full justify-between ">
            <h4 className="mr-[10px]">주문 상품</h4>
            <h4>30,000원</h4>
          </div>
          <div className="flex w-full justify-between ">
            <p className="mr-[10px]">배송비 </p>
            <p>+2,500원</p>
          </div>
          <div className="flex w-full justify-between">
            <p className="mr-[10px]">쿠폰할인 </p>
            <p> -1,000원</p>
          </div>
          <div className="flex w-full justify-between">
            <p className="mr-[20px]">적립금 사용 </p>
            <p> -3,000원</p>
          </div>
        </div>
        <div className="flex bg-gray-100 font-bold pl-[20px] py-[10px] px-[10px] mt-[20px] justify-between">
          <h4 className="mr-[10px]">최종 결제 금액</h4>
          <h4> 28,500원</h4>
        </div>
      </section>
      <section className="border-2 my-[30px] leading-9">
        <h3 className="mt-[20px] mb-[20px] text-xl font-bold ml-[20px]">
          결제 수단
        </h3>
        <div className="ml-[20px]">
          <RadioGroup defaultValue="deposit">
            <div className="flex items-center space-x-2 mb-[10px]">
              <RadioGroupItem value="card" id="r1" />
              <Label htmlFor="r1">신용카드</Label>
            </div>
            <div className="flex items-center space-x-2 mb-[10px]">
              <RadioGroupItem value="deposit" id="r2" />
              <Label htmlFor="r2">무통장 입금</Label>
            </div>
            <div className="flex items-center space-x-2 mb-[20px]">
              <RadioGroupItem value="phone_payment" id="r3" />
              <Label htmlFor="r3">핸드폰 결제</Label>
            </div>
          </RadioGroup>
        </div>
      </section>
      <Button type="submit" className="w-full">
        결제하기
      </Button>
    </div>
  );
}

export default pay;
