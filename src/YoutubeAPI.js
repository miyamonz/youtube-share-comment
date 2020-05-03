// this is availabe share-comment.web.app and my home ip address
const key = "AIzaSyBDwf9EHvdy5ESV5Verx4wi8n-1ZgMtk9w";

export function getVideoTitle(videoId) {
  const URL = `https://www.googleapis.com/youtube/v3/videos?key=${key}&part=id,snippet&id=${videoId}`;
  return fetch(URL)
    .then((res) => res.json())
    .then((json) => json.items[0].snippet.title);
}
