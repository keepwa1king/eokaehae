import cx from "classnames";

interface KeywordButtonProps {
    index: number;
    keyword: string;
    isSelected: boolean;
    onClick: () => void;
}

export default function KeywordButton({ keyword, index, isSelected, onClick }: KeywordButtonProps) {

    const classes = cx("py-[18px] font-bold text-[12px] text-grey-900 w-full text-center rounded-[10px] bg-white border-[1px]",
        isSelected && "border-grey-900",
        !isSelected && "border-[#ECECEC]",
    );

    return (
        <div key={index} className={classes} onClick={onClick}>
            {keyword}
        </ div>
    );
}