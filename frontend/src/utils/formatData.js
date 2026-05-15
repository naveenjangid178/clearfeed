// formatDate.js
export const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
        day  : "numeric",
        month: "short",
        year : "numeric",
        hour : "2-digit",
        minute: "2-digit"
    })
}

export const timeAgo = (dateString) => {
    const now  = new Date()
    const date = new Date(dateString)
    const diff = Math.floor((now - date) / 1000)

    if (diff < 60)     return "just now"
    if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
}