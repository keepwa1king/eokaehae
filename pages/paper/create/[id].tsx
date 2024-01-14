import KeywordAppBar from "@/components/KeywordAppBar";
import KeywordButton from "@/components/KeywordButton";
import { KEYWORDS } from "@/data/keywords";
import supabase from "@/utils/supabaseClient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import nextBase64 from 'next-base64';
import { hasher } from "@/data/hasher";

export default function CreatePaper() {

    const { query: { id }, isReady } = useRouter();
    const router = useRouter();

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | undefined>();
    const [paperId, setPaperId] = useState<string | undefined>();
    const [username, setUsername] = useState<string | undefined>();

    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);


    const handleKeywordClick = (keyword: string) => {
        setSelectedKeywords((prevSelectedKeywords) => {
            if (prevSelectedKeywords.includes(keyword)) {
                return prevSelectedKeywords.filter((k) => k !== keyword);
            } else {
                return [...prevSelectedKeywords, keyword];
            }
        });
    };

    useEffect(() => {
        const getCurrentUser = async () => {
            const user = await supabase.auth.getUser();



            if (user) {

                let { data, error, status } = await supabase
                    .from('profiles')
                    .select(`user_id`)
                    .eq('id', user.data.user?.id)
                    .single()


                setIsAuthenticated(true);
                setUserId(`${data?.user_id}`);
            }
        }

        const getPaperUser = async (userId: string | string[] | undefined) => {
            const realId = id?.toString().split('tg')[0];
            const paperId = id?.toString().split('tg')[1];

            const { data, error } = await supabase
                .from('profiles')
                .select()
                .eq('user_id', realId);

            setUsername(`${data![0].username}`);
            setPaperId(`${paperId}`);
        }

        if (!isReady) return;

        getCurrentUser();
        getPaperUser(id);

    }, [isReady]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);

            // Create a URL for the selected file
            const fileURL = URL.createObjectURL(file);
            setPreviewURL(fileURL);
        }
    };

    function handleOnCompleted() {
        if (isLoading) return;

        upload();

    }

    async function upload() {

        setIsLoading(true);

        let url = null;

        if (selectedFile !== null) {
            const { data: resp } = await supabase
                .storage
                .from('avatars')
                .upload(`public/${paperId}/${Date.now()}.${selectedFile!.type.split("/")[1]}`, selectedFile as File, {
                    cacheControl: '3600',
                    upsert: false
                });

            const { data: pUrl } = supabase
                .storage
                .from('avatars')
                .getPublicUrl(`${resp?.path}`, {
                });

            url = pUrl;
        }

        const parsedId = parseInt(paperId!, 10);

        const args = {
            image_url: url?.publicUrl ?? null, paper_id_arg: parsedId, keywords_arg: selectedKeywords,
        };



        const { data, error } = await supabase.rpc('add_paper_image_and_keywords',
            args,
        );



        const realId = id?.toString().split('tg')[0];
        const encoded = hasher.encode(`${realId}`);

        setIsLoading(false);

        router.push(`/paper/${encoded}`);
    }





    return (
        <div>
            <div className="flex min-h-screen flex-col items-center bg-grey-100">
                <KeywordAppBar name={`${username}`} />
                <div className="bg-grey-100 px-[24px] py-[35px] flex flex-col w-full items-start">
                    <div className="flex flex-col w-full items-center mb-[48px]">
                        <div className="font-bold text-[14px] mb-[10px] text-grey-900 text-center">{`${username}을(를) 설명할 수 있는 키워드는?`}</div>
                        <div className="font-semibold text-[#A6A6A6] text-[10px] mb-[24px]">3개 이상 선택해 주세요</div>
                        <div className="grid grid-cols-3 gap-[4.5px] w-full">
                            {
                                KEYWORDS.map((keyword, index) => (
                                    <KeywordButton
                                        index={index}
                                        keyword={keyword}
                                        isSelected={selectedKeywords.includes(keyword)}
                                        onClick={() => handleKeywordClick(keyword)}
                                    />
                                ))
                            }
                        </div>
                    </div>
                    <div className="flex flex-col w-full items-start pb-[100px]">
                        <div className="font-bold text-[14px] mb-[12px] text-grey-900">
                            <span>캐해 짤 선택&nbsp;&nbsp;</span>
                            <span className="font-medium text-[#A6A6A6] text-[11px]">*옵션</span>
                        </div>
                        <div className="w-full">
                            <label className="flex flex-col items-center py-[45px] bg-[#EEEEEE] w-full text-[#818181] rounded-[10px] border-[1px] border-[#DBDBDB]">
                                {
                                    previewURL ?
                                        (
                                            <label>
                                                <img src={previewURL} alt="Preview" className="w-full h-auto" />
                                                <input onChange={handleFileChange} className="hidden" type="file" accept="image/*" />
                                            </label>
                                        ) :
                                        (
                                            <div>
                                                <div className="flex flex-col items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mb-[10px]">
                                                        <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                                                        <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                                    </svg>
                                                    <div className="text-[12px] font-medium">이미지 업로드</div>
                                                </div>
                                                <input onChange={handleFileChange} className="hidden" type="file" accept="image/*" />
                                            </div>
                                        )
                                }
                            </label>
                        </div>
                    </div>
                </div>
            </div>




            <div onClick={handleOnCompleted} className={`fixed rounded-[28px] left-1/2 -translate-x-1/2 text-center items-center justify-center py-[16px] bg-grey-900 text-white font-bold text-[13px] w-[85%] bottom-[35px] ${(selectedKeywords.length >= 3) ? 'block' : 'hidden'}`}>
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
                        )
                        :
                        (
                            "작성 완료"
                        )
                }
            </div>


        </div >
    );
}