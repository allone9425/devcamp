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
import { useToast } from "@/components/ui/use-toast";
import { login } from "@/utils/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const FormSchema = z.object({
  email: z.string().email({
    message: "올바른 이메일을 입력해주세요.",
  }),
  password: z.string().min(6, { message: "비밀번호는 6자 이상이어야 합니다." }),
});

export default function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loginMessage, setLoginMessage] = useState("");
  const { toast } = useToast(); // Toast 사용을 위한 Hook 호출

  const router = useRouter();
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const isLoggedIn = await login(data.email, data.password);

    if (isLoggedIn) {
      localStorage.setItem("userInfo", JSON.stringify(isLoggedIn));
      toast({
        variant: "default",
        title: "로그인 성공",
        description: "환영합니다!",
      });

      router.push("/pay");
    } else {
      toast({
        variant: "destructive",
        title: "로그인 실패",
        description: "이메일 또는 비밀번호가 잘못되었습니다.",
      });
    }
  }
  return (
    <div className="w-[350px]  p-[20px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 rounded-xl border-slate-200">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full leading-8"
        >
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-[20px]" type="submit">
            로그인
          </Button>
          <Button
            type="button"
            className="ml-[20px]"
            onClick={() => router.replace("join")}
          >
            회원가입
          </Button>
          {loginMessage && <p>{loginMessage}</p>}
        </form>
      </Form>
    </div>
  );
}
