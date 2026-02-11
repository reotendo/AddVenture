import { Timestamp } from "firebase/firestore";

export function timeAgo(timestamp: Timestamp) {
  const now = Date.now();
  const posted = timestamp.toDate().getTime();
  const diff = Math.floor((now - posted) / 1000);

  if (diff < 60) return `${diff}秒前`;
  if (diff < 3600) return `${Math.floor(diff / 60)}分前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`;
  return `${Math.floor(diff / 86400)}日前`;
}
