import { useRouter } from "next/router";
import Image from "next/image";
import localFont from "next/font/local";
import KeywordBox from "@/components/KeywordBox";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabaseClient";
import { get } from "http";
import Link from "next/link";
import nextBase64 from 'next-base64';
import { hasher } from "@/data/hasher";


const RollingPaper = () => {
    const { query: { id }, isReady } = useRouter();
    const router = useRouter();

    function handleOnClick() {
        router.push("/login");
    }

    function handleOnClickLogout() {
        supabase.auth.signOut();
        router.push("/");
    }

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | undefined>("");
    const [encodedCurrentUserId, setEncodedCurrentUserId] = useState<string | null>(null);
    const [userPaperId, setUserPaperId] = useState<string | undefined>();
    const [username, setUsername] = useState<string | undefined>();
    const [image, setImage] = useState<string | undefined>();

    const [images, setImages] = useState<string[]>([]);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [decodedId, setDecodedId] = useState<string | undefined>();

    useEffect(() => {
        const getCurrentUser = async () => {
            const user = await supabase.auth.getUser();
            if (user) {

                let { data, error, status } = await supabase
                    .from('profiles')
                    .select(`user_id`)
                    .eq('id', user.data.user?.id)
                    .single()

                if (user.data.user !== null) {
                    setIsAuthenticated(true);
                }
                setUserId(`${data?.user_id}`);


                if (typeof data?.user_id !== "undefined") {
                    setEncodedCurrentUserId(`${hasher.encode(`${data?.user_id}`)}`);
                }
            }
        }

        const getPaperUser = async (userId: string | string[] | undefined) => {

            let decoded = "";



            let decodedForSetting;

            if (!isNaN(parseInt(`${userId}`))) {
                decodedForSetting = hasher.decode(parseInt(`${userId}`));
                decoded = `${hasher.decode(parseInt(userId as string))}`;
            }
            else {
                decoded = nextBase64.decode(userId as string);
            }

            setDecodedId(decoded);



            const { data, error } = await supabase
                .from('profiles')
                .select()
                .eq('user_id', decoded);

            const { data: paper_id } = await supabase
                .from('profiles')
                .select('paper_id')
                .eq('user_id', decoded)
                .single();


            if (data !== null) {
                setUsername(`${data![0].username}`);
                setImage(`${data![0].mbti}`);
                setUserPaperId(`${paper_id?.paper_id}`);
            }


            const { data: paperInfo } = await supabase
                .from('paper')
                .select(`keywords, images`)
                .eq('id', paper_id?.paper_id).single();

            setKeywords(paperInfo?.keywords ?? []);
            setImages(paperInfo?.images ?? []);
        }



        if (!isReady) return;

        getCurrentUser();
        getPaperUser(id);



    }, [isReady, userId, router.asPath]);

    const links = "https://eokaehae.vercel.app" + router.asPath;
    const copylink = () => {
        navigator.clipboard.writeText(links);
        alert("링크가 복사되었습니다.");
    }



    return (
        <div>
            <div className="w-full bg-grey-100 border-[1px] border-[#ECECEC] h-[48px] px-[14px] flex justify-between">
                <div className="flex justify-between items-center">
                    {
                        isAuthenticated ?
                            (
                                <button onClick={handleOnClickLogout}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[16px] h-[16px]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                    </svg>
                                </button>
                            ) : (
                                <button onClick={handleOnClick}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[16px] h-[16px]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                    </svg>

                                </button>
                            )

                    }
                </div>
                <div className="flex justify-between items-center">
                    {
                        isAuthenticated ?
                            (
                                <Link href={`/paper/${encodedCurrentUserId}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[16px] h-[16px]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </Link>
                            ) : (
                                <div>
                                </div>
                            )

                    }
                </div>
            </div>
            <div className="flex min-h-screen flex-col bg-grey-100 py-[56px] px-[24px]">
                <div className="relative z-0 w-full mb-[24px]">
                    <Image
                        className="absolute w-[15%] z-10 top-[-35px] left-[45%]"
                        src="/images/sticker.png"
                        alt=""
                        width={200}
                        height={37}
                    />
                    <div className="flex flex-col items-center px-[25px] py-[35px] bg-white w-full rounded-[8px] border-[1px] border-[#ECECEC]">
                        <div className="flex justify-center bg-[#F4F4F4] w-full rounded-[8px] py-[24px] mb-[20px]">
                            <Image
                                className="w-[80%]"
                                src={`/images/${image}.png`}
                                alt=""
                                width={200}
                                height={37}
                                priority
                            />
                        </div>
                        <div className="font-extrabold text-[16px] text-grey-900">
                            {username}
                        </div>
                    </div>
                </div>
                {
                    userId === decodedId ? (
                        <button onClick={copylink}
                            className="w-full flex bg-grey-900 text-center rounded-[28px] py-[20px] justify-center font-extrabold text-[14px] text-white mb-[48px]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                                <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                            </svg>
                            <div className="ml-[8px]">링크 공유하기</div>
                        </button>
                    ) :
                        (
                            <Link href={{ pathname: `/paper/create/${decodedId}tg${userPaperId}` }}
                                className="w-full flex bg-grey-900 text-center rounded-[28px] py-[20px] justify-center font-extrabold text-[14px] text-white mb-[48px]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                                <div className="ml-[8px]">캐해 작성하기</div>
                            </Link>
                        )
                }
                <div className="flex flex-col mb-[56px]">
                    <div className="font-extrabold text-[16px] text-grey-900 mb-[14px]">지인들의 캐해 키워드는?</div>
                    <div className="flex flex-wrap">
                        {keywords.map((keyword, index) => (
                            <div key={index}>
                                <KeywordBox index={index} keyword={keyword} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col mb-[56px]">
                    <div className="font-extrabold text-[16px] text-grey-900 mb-[14px]">지인들의 캐해 짤은?</div>
                    {
                        images.length === 0 ?
                            (
                                <div className="flex flex-col self-center items-center w-full mt-[48px]">
                                    <Image
                                        className="w-[45%] mb-[12px]"
                                        src="/images/no-image.svg"
                                        alt=""
                                        width={200}
                                        height={37}
                                        priority
                                    />
                                    <div className="text-grey-900 font-extrabold text-[14px] mb-[8px]">캐해 짤이 없어요!</div>
                                    <div className="text-center text-[#A6A6A6] font-medium text-[12px]">친구들에게 링크를 공유하고<br />내 캐해 짤을 받아보세요.</div>
                                </div>
                            ) :
                            (
                                <div className="w-full grid grid-cols-2 gap-[9px]">
                                    {images.map((image, index) => (
                                        <Image key={index}
                                            className="w-[100%] rounded-[10px] object-cover"
                                            src={image}
                                            alt=""
                                            width={200}
                                            height={37}
                                        />
                                    ))}
                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    );
};

export default RollingPaper;
