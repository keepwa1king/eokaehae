import cx from "classnames";

interface AnswerButtonProps {
  isSelected: boolean;
  answerString: string;
}

export default function AnswerButton({
  isSelected,
  answerString,
}: AnswerButtonProps) {
  const classes = cx(
    "whitespace-pre-wrap w-full py-[25px] rounded-[24px] bg-white mb-[20px] mx-auto",
    isSelected && "border-[#003483]",
    !isSelected && "border-[#CBCBCD]",
    isSelected && "border-[2px]",
    !isSelected && "border-[1px]",
    isSelected && "text-[#003483]",
    !isSelected && "text-[#1F1F21]",
    isSelected && "font-black",
    !isSelected && "font-semibold"
  );

  return <div className={classes}>{answerString}</div>;
}
