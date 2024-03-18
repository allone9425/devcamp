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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "이름은 2글자 이상이어야 합니다.",
  }),
  email: z.string().email({
    message: "올바른 이메일을 입력해주세요.",
  }),
  phone: z.string().length(11, { message: "연락처는 11자리여야 합니다" }),
  role: z.string().nonempty({ message: "역할을 선택해야 합니다." }),
});

export function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      role: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    alert(JSON.stringify(data));
  };
  return (
    <div className="w-[500px]  p-[20px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            계정을 생성합니다
          </h3>
          <p className="leading-0 [&:not(:first-child)]:mt-0">
            필수 정보를 입력해볼게요
          </p>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input placeholder="홍길동" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input placeholder="hello@sparta-devcamp.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>연락처</FormLabel>
                <FormControl>
                  <Input placeholder="01011111111" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>역할</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="역할을 선택해주세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="관리자">관리자</SelectItem>
                    <SelectItem value="일반사용자">일반사용자</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">계정 등록하기</Button>
        </form>
      </Form>
    </div>
  );
}

export default InputForm;
