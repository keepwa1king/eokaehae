// KeywordBox 컴포넌트
interface KeywordBoxProps {
    index: number;
    keyword: string;
}

export default function KeywordBox({ keyword, index }: KeywordBoxProps) {
    return (
        <div key={index} className="bg-white border-[1px] border-grey-900 rounded-[10px] py-[8px] px-[10px] text-center font-bold text-[12px] mr-[4px] mb-[6px]">
            {`#${keyword}`}
        </div>
    );
}
