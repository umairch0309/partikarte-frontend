const DateTimeLocalConverter = (string) => {
  const date = new Date(string);
  const formattedDateTime = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}T${date
    .getUTCHours()
    .toString()
    .padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}`;
  return formattedDateTime;
};

export default DateTimeLocalConverter;
