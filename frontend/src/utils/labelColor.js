// labelColor.js
export const getLabelColor = (label) => {
    return label === "REAL"
        ? {
            bg     : "bg-green-100",
            text   : "text-green-700",
            border : "border-green-300",
            dot    : "bg-green-500",
            hex    : "#22C55E"
          }
        : {
            bg     : "bg-red-100",
            text   : "text-red-700",
            border : "border-red-300",
            dot    : "bg-red-500",
            hex    : "#EF4444"
          }
}