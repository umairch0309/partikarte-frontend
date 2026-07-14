import { Empty } from "antd";

const EmptyState = ({
  description = "No data to display",
  height = 220,
  image = Empty.PRESENTED_IMAGE_SIMPLE,
}) => {
  return (
    <div
      className="empty-state-container"
      style={{
        minHeight: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Empty image={image} description={description} />
    </div>
  );
};

export default EmptyState;
