import React, { FC, memo, useRef } from "react";

interface PinInputItemProps {
  value: string;
  highlight: string;
}

const PinInputItem: FC<PinInputItemProps> = ({ value, highlight }) => {
  const inputRef = useRef({} as HTMLInputElement);

  return (
    <input
      role={"img"}
      ref={inputRef}
      name="letter"
      type="text"
      disabled
      className={`prevent-select cell ${highlight}`}
      maxLength={1}
      value={value}
    />
  );
};

export default memo(PinInputItem);
