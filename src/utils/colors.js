const brandColors = {
  suzuki: "#f2df23",
  ktm: "#ff6600",
  triumph: "#0e0e0e",
  kawasaki: "#69be28",
  yamaha: "#0000FF",
  husqvarna: "#eeeeee",
  fantic: "#d4d4d4",
  tm: "#00a3e0",
  gasgas: "#f2001c",
  beta: "#e60000",
  stark: "#ff1818",
  honda: "#cc0000",
};

export function getColor(brand) {
  return brandColors[brand] || "#cbd5e1"; // default gray-300
}
