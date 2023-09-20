const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const amOrPm = hours >= 12 ? "pm" : "am";

  // Convert hours to 12-hour format
  const hours12 = hours % 12 || 12;

  return `${date.getUTCDate().toString().padStart(2, "0")}.${(
    date.getUTCMonth() + 1
  )
    .toString()
    .padStart(2, "0")}.${date.getUTCFullYear()} • ${hours12
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${amOrPm}`;
};

export default formatDate;
