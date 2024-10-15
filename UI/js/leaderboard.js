// Share game on social media
function shareGame(platform) {
  let url = "";
  if (platform === "facebook") {
    url =
      "https://www.facebook.com/sharer/sharer.php?u=" + document.location.href;
  } else if (platform === "twitter") {
    url = "https://twitter.com/intent/tweet?url=" + document.location.href;
  } else if (platform === "linkedin") {
    url =
      "https://www.linkedin.com/shareArticle?mini=true&url=" +
      document.location.href;
  }
  window.open(url, "_blank");
}
