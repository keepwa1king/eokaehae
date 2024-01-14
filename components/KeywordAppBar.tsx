import { useRouter } from "next/router";

interface AppBarProps {
    name: string;
}


export default function KeywordAppBar({ name }: AppBarProps) {

    const router = useRouter();

    const handleBackButtonClick = () => {
        router.back();
    };

    return (
        <div className="w-full bg-grey-100 border-[1px] border-[#ECECEC] h-[48px] px-[14px] flex flex-col justify-center">
            <div className="flex justify-between items-center">
                <button onClick={handleBackButtonClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]">
                        <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                    </svg>
                </button>
                <div className="text-center flex-grow text-[14px] font-extrabold text-grey-900">{`${name} 캐해 작성`}</div>
                <div className="w-[16px]"></div>
            </div>
        </div>
    );
}