const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // To fetch Instagram data and video
const cloudinary = require("cloudinary").v2; // Cloudinary integration
const { v4: uuidv4 } = require("uuid"); // For unique file names
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Replace with your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Replace with your API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Replace with your API secret
});

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests

// Function to extract Instagram post ID from URL
const getId = (url) => {
  const regex =
    /instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(p|reels|reel|stories)\/([A-Za-z0-9-_]+)/;
  const match = url.match(regex);
  return match && match[2] ? match[2] : null;
};

// Function to fetch Instagram GraphQL data and upload video to Cloudinary
const getInstagramGraphqlData = async (url) => {
  const igId = getId(url);
  if (!igId) {
    return { error: "Invalid URL or unable to extract ID." };
  }

  const graphqlUrl = new URL("https://www.instagram.com/api/graphql");
  graphqlUrl.searchParams.set("variables", JSON.stringify({ shortcode: igId }));
  graphqlUrl.searchParams.set("doc_id", "10015901848480474");
  graphqlUrl.searchParams.set("lsd", "AVqbxe3J_YA");

  try {
    const response = await fetch(graphqlUrl, {
      cors: [
        "http://localhost:5000",
        "https://savemyreeels.vercel.app, https://insta-video-downloader-backend.vercel.app:5000",
      ],
      method: "POST",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-IG-App-ID": `${process.env.X_IG_APP_ID}`,

        "X-FB-LSD": "AVqbxe3J_YA",
        "X-ASBD-ID": "129477",
        "Sec-Fetch-Site": "same-origin",
      },
    });

    const json = await response.json();
    const items = json?.data?.xdt_shortcode_media;

    if (!items) {
      return { error: "Failed to retrieve data or data is unavailable." };
    }

    // Extract video URL from the response
    const videoUrl = items.video_url;

    console.log(videoUrl);

    if (!videoUrl) {
      return { error: "No video URL found in the post." };
    }

    // Fetch the video file
    const videoFile = await fetch(videoUrl);
    if (!videoFile.ok) {
      return { error: "Failed to fetch video file." };
    }

    const videoBuffer = await videoFile.buffer();

    // Upload the video to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "video", folder: "savemyreels", public_id: uuidv4() },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );

      const stream = require("stream");
      const bufferStream = new stream.PassThrough();
      bufferStream.end(videoBuffer);
      bufferStream.pipe(uploadStream);
    });

    // Return the Cloudinary URL and thumbnail

    return {
      videoUrl: uploadResponse.secure_url, // Cloudinary URL
      // videoUrl: uploadResponse.secure_url, // Cloudinary URL
      // thumbnail: items.thumbnail_src, // Thumbnail from Instagram
    };
  } catch (error) {
    console.error("Error fetching Instagram data:", error);
    return { error: "An error occurred while processing the request." };
  }
};

// API endpoint to handle the video download request
app.get("/api/download", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required." });
  }

  const data = await getInstagramGraphqlData(url);

  if (data.error) {
    return res.status(400).json(data);
  }

  res.json(data); // Return the video Cloudinary URL and thumbnail

  console.log(data);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
