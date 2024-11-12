const express = require("express");
const axios = require("axios");
const app = express();

app.get("/api/download", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Make the request to RapidAPI and get the video stream
    const response = await axios.get(
      "https://instagram-story-downloader-media-downloader.p.rapidapi.com/index?url=" +
        encodeURIComponent(url),
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host":
            "instagram-story-downloader-media-downloader.p.rapidapi.com",
        },
        responseType: "stream", // Ensure the response is a stream of data
      }
    );

    // Set the correct headers to prompt the file download on the client-side
    res.setHeader("Content-Type", "video/mp4"); // Set the content type to video
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="downloaded_video.mp4"'
    ); // Suggest the filename for download

    // Pipe the response stream to the client
    response.data.pipe(res);
  } catch (error) {
    console.error("Error fetching data from RapidAPI:", error);
    res.status(500).json({ error: "Failed to fetch data from Instagram" });
  }
});

// Example port setup (ensure your server is listening)
app.listen(3000, () => {
  console.log("Server running....   ");
});
