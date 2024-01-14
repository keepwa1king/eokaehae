import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import cx from "classnames";
import { useSession, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import supabase from "@/utils/supabaseClient";
import { Hasher } from "inthash";
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

export default function Home() {


  const router = useRouter();



  async function handleOnClick() {


    const resp = await supabase.auth.getUser();


    if (resp.data.user) {
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`user_id`)
        .eq('id', resp.data.user.id)
        .single()

      const encoded = hasher.encode(`${data?.user_id}`);

      router.push(`/paper/${encoded}`);
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-white py-[45px] px-[40px] ">
      <div className="font-light text-[14px] mb-[5px]">캐해 추천 서비스</div>
      <div
        className={cx(`${Dangam.className} text-[48px] text-primary mb-[5px]`)}
      >
        어캐해?
      </div>
      <div className="flex font-light text-secondary text-[12px] mb-[55px]">
        <p>나에게 맞는 건&nbsp;</p>
        <p className="font-extrabold">어</p>
        <p>떤&nbsp;</p>
        <p className="font-extrabold">캐해?</p>
      </div>
      <Image
        className="relative w-[100%] mb-[100px]"
        src="/images/tiger-1.png"
        alt=""
        width={200}
        height={37}
        priority
      />
      <button
        onClick={handleOnClick}
        className="w-full bg-grey-900 text-center py-[20px] mb-[30px] rounded-[36px] font-extrabold text-[18px] text-white"
      >
        캐해 롤링페이퍼 만들기
      </button>
    </div>
  );
}
