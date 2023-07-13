import { Tooltip } from "antd";

import React from "react";

const CustomTooltip = ({ children, title, color }) => {
  return (
    <Tooltip title={title} color={!color ? "grey" : color}>
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
