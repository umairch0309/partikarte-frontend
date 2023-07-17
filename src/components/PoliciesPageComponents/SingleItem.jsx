import React from "react";
import { Dropdown } from "antd";
import "./SingleItem.scss";

const items = [
  {
    label: "1St menu item",
    key: "0",
  },
  {
    label: "2nd menu item",
    key: "1",
  },
  {
    label: "3rd menu item",
    key: "3",
  },
];

const SingleItem = () => {
  return (
    <Dropdown
      menu={{
        items,
      }}
      trigger={["click"]}
    >
      <div className="policy-single-item-trigger">Privacy and Policy</div>
    </Dropdown>
  );
};

export default SingleItem;
