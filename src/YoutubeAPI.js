// this is availabe share-comment.web.app and my home ip address
const key = "AIzaSyBDwf9EHvdy5ESV5Verx4wi8n-1ZgMtk9w";

export function getVideoTitle(videoIds) {
  if (!Array.isArray(videoIds)) videoIds = [videoIds];
  const URL = `https://www.googleapis.com/youtube/v3/videos?key=${key}&part=id,snippet&id=${videoIds.join(
    ","
  )}`;
  return fetch(URL)
    .then((res) => res.json())
    .then((json) => json.items)
    .then((items) => items.map((i) => i.snippet.title));
}
