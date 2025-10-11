export const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function formatDateString(dateString: string | undefined) {
  if (dateString === undefined) return "";

  const date = new Date(dateString);

  return [weekday[date.getDay()], date.getDate(), month[date.getMonth()]].join(
    " "
  );
}
