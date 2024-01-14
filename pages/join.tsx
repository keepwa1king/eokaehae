import Image from "next/image";
import localFont from "next/font/local";
import cx from "classnames";
import { useState } from "react";
import supabase from "@/utils/supabaseClient";
import { useRouter } from "next/router";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
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


export default function Join() {

    const mbtiTypes = [
        "ENFJ",
        "ENFP",
        "ENTJ",
        "ENTP",
        "ESFJ",
        "ESFP",
        "ESTJ",
        "ESTP",
        "INFJ",
        "INFP",
        "INTJ",
        "INTP",
        "ISFJ",
        "ISFP",
        "ISTJ",
        "ISTP",
    ];

    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();
    const [passwordConfirm, setPasswordConfirm] = useState<string | undefined>();
    const [username, setUsername] = useState<string | undefined>();

    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function signUpWithEmail() {
        if (isLoading) return;
        try {
            if (email && password && (password == passwordConfirm)) {

                var mbtiType = mbtiTypes[Math.floor(Math.random() * mbtiTypes.length)];

                setIsLoading(true);

                const resp = await supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: { username: username, mbti: mbtiType },
                    }
                });
                if (resp.error) throw resp.error;

                let { data, error, status } = await supabase
                    .from('profiles')
                    .select(`user_id`)
                    .eq('id', resp.data.user?.id)
                    .single()

                if (data) {
                    let encoded = "";



                    encoded = hasher.encode(`${data?.user_id}`);

                    setIsLoading(false);


                    router.replace(`/paper/${encoded}`);
                }

            } else {
                setIsLoading(false);
                throw Error("이메일, 비밀번호, 닉네임을 확인해 주세요.");
            }
        } catch (e) {
            setIsLoading(false);
            alert("이메일, 비밀번호, 닉네임 (두 글자 이상)을 확인해 주세요.");
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
                className="relative w-[80%] mb-[60px]"
                src="/images/tiger-4.png"
                alt=""
                width={200}
                height={37}
                priority
            />
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
                    className="appearance-none w-full px-[18px] py-[16px] border border-grey-300 rounded-[16px] placeholder-grey-500 focus:outline-none focus:ring-primary focus:border-primary mb-[15px]"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    id="input-passwordConfirm"
                    type="password"
                    placeholder="패스워드 확인"
                    className="appearance-none w-full px-[18px] py-[16px] border border-grey-300 rounded-[16px] placeholder-grey-500 focus:outline-none focus:ring-primary focus:border-primary mb-[15px]"
                    required
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                <input
                    id="input-username"
                    type="text"
                    placeholder="닉네임 (두 글자 이상)"
                    className="appearance-none w-full px-[18px] py-[16px] border border-grey-300 rounded-[16px] placeholder-grey-500 focus:outline-none focus:ring-primary focus:border-primary"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <button onClick={signUpWithEmail} className="w-full bg-grey-900 text-center py-[14px] mb-[30px] rounded-[24px] font-bold text-[20px] text-white">
                {
                    isLoading ?
                        (
                            <div role="status" className="w-full flex flex-col justify-center items-center">
                                <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        ) :
                        (
                            <div>
                                회원가입
                            </div>
                        )
                }
            </button>
        </div>
    );
}
