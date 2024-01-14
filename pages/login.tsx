import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import cx from "classnames";
import supabase from "@/utils/supabaseClient";
import { useRouter } from "next/router";
import { useState } from "react";
import nextBase64 from 'next-base64';
import { hasher } from "@/data/hasher";

const Dangam = localFont({
    src: [
        {
            path: "./ChangwonDangamAsac.otf",
            weight: "700",
            style: "normal",
        },
    ],
});

export default function Login() {

    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();

    const router = useRouter();

    async function signInWithEmail() {
        try {
            if (email && password) {
                const resp = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });
                if (resp.error) throw resp.error;

                let { data, error, status } = await supabase
                    .from('profiles')
                    .select(`user_id`)
                    .eq('id', resp.data.user?.id)
                    .single()

                if (data) {
                    const encoded = hasher.encode(`${data?.user_id}`);


                    router.replace(`/paper/${encoded}`);

                }

            } else {
                throw Error("이메일, 비밀번호를 확인해 주세요.");
            }

        } catch (error) {

        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center bg-white py-[45px] px-[40px]">
            <div
                className={cx(`${Dangam.className} text-[32px] text-primary mb-[5px]`)}
            >
                어캐해?
            </div>
            <div className="flex font-light text-secondary text-[10px] mb-[30px]">
                <p>나에게 맞는 건&nbsp;</p>
                <p className="font-extrabold">어</p>
                <p>떤&nbsp;</p>
                <p className="font-extrabold">캐해?</p>
            </div>
            <Image
                className="relative w-[80%] mb-[20px]"
                src="/images/tiger-3.png"
                alt=""
                width={200}
                height={37}
                priority
            />
            <div className="text-grey-900 font-bold text-center text-[20px] mb-[30px]">
                지금 어캐해와<br />캐해 롤링페이퍼를 만들어 보세요!
            </div>
            <div className="flex flex-col w-full mb-[25px]">
                <input
                    id="input-email"
                    type="email"
                    placeholder="이메일"
                    className="appearance-none w-full px-[18px] py-[16px] border border-grey-300 rounded-[16px] placeholder-grey-500 focus:outline-none focus:ring-primary focus:border-primary mb-[15px]"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    id="input-password"
                    type="password"
                    placeholder="패스워드"
                    className="appearance-none w-full px-[18px] py-[16px] border border-grey-300 rounded-[16px] placeholder-grey-500 focus:outline-none focus:ring-primary focus:border-primary"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button onClick={signInWithEmail} className="w-full bg-grey-900 text-center py-[14px] mb-[15px] rounded-[24px] font-bold text-[20px] text-white">
                로그인
            </button>
            <Link href="/join" className="w-full text-center py-[14px] mb-[30px] font-semibold text-[16px] text-grey-900">
                회원가입
            </Link>
        </div>
    );
}
