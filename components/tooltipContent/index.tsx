import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";

import { ReactNode } from "react";

type TooltipProps = {
  delayDuration: number;
  children: ReactNode;
  content: string;
  side?: string;
};

const CustomTooltip = ({
  delayDuration,
  children,
  content,
  side = "top",
}: TooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent side={side === "bottom" ? "bottom" : "top"}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;
