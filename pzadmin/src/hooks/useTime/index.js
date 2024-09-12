export default function formatTimestamp(ts) {
  // 创建一个新的Date对象
  const date = new Date(ts);
  // 格式化日期时间字符串
  // 注意：这里的格式化方式可以根据你的需求进行调整
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 使用24小时制
  });
}
