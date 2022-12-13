import PinInputItem from "./PinInputItem";
import { FC, memo, ReactNode, useMemo } from "react";

interface PinInputProps {
  cells: number;
  text: string;
  highlight: string[];
  children?: ReactNode;
}

const PinInput: FC<PinInputProps> = ({ cells, text, highlight }) => {
  const inputSize = useMemo(() => {
    return cells < 0 ? 1 : cells > 10 ? 10 : cells;
  }, [cells]);
  return (
    <div className="board-row">
      {Array(inputSize)
        .fill("")
        .map((_, index) => (
          <PinInputItem key={index} value={text[index] ?? ""} highlight={highlight[index]} />
        ))}
    </div>
  );
};

const pinInputEqualize = (prev, next) => {
  return prev.text === next.text && prev.highlight === next.hightlight;
};

export const MemoPinInput = memo(PinInput, pinInputEqualize);
