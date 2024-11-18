// const express = require("express");
// const cors = require("cors");
// const fetch = require("node-fetch"); // To fetch the video file
// const fs = require("fs"); // To save the video file
// const path = require("path"); // To manage file paths
// const { v4: uuidv4 } = require("uuid"); // To generate unique file names
// const app = express();
// const PORT = 5000;

// // Enable CORS
// app.use(cors());
// app.use(express.json());

// app.use(
//   cors({
//     origin: ["http://savemyreels.vercel.app", "http://localhost:5173"], // Allow this origin
//     methods: "GET, POST", // Allow these HTTP methods
//     allowedHeaders: "Content-Type, Authorization", // Allow these headers
//   })
// );
// // Function to extract Instagram post ID from URL
// const getId = (url) => {
//   const regex =
//     /instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(p|reels|reel|stories)\/([A-Za-z0-9-_]+)/;
//   const match = url.match(regex);
//   return match && match[2] ? match[2] : null;
// };

// // Function to fetch Instagram GraphQL data
// const getInstagramGraphqlData = async (url) => {
//   const igId = getId(url);
//   if (!igId) {
//     return { error: "Invalid URL or unable to extract ID." };
//   }

//   const graphqlUrl = new URL("https://www.instagram.com/api/graphql");
//   graphqlUrl.searchParams.set("variables", JSON.stringify({ shortcode: igId }));
//   graphqlUrl.searchParams.set("doc_id", "10015901848480474");
//   graphqlUrl.searchParams.set("lsd", "AVqbxe3J_YA");

//   try {
//     const response = await fetch(graphqlUrl, {
//       method: "POST",
//       headers: {
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
//         "Content-Type": "application/x-www-form-urlencoded",
//         "X-IG-App-ID": "936619743392459",
//         "X-FB-LSD": "AVqbxe3J_YA",
//         "X-ASBD-ID": "129477",
//         "Sec-Fetch-Site": "same-origin",
//       },
//     });

//     const json = await response.json();
//     const items = json?.data?.xdt_shortcode_media;

//     if (!items) {
//       return { error: "Failed to retrieve data or data is unavailable." };
//     }

//     // Extract video URL from the response
//     const videoUrl = items.video_url;

//     if (!videoUrl) {
//       return { error: "No video URL found in the post." };
//     }

//     // Download the video and save it on the server
//     const videoResponse = await fetch(videoUrl);
//     const videoBuffer = await videoResponse.buffer();

//     // Generate a unique filename for the video
//     const videoFileName = `${uuidv4()}.mp4`;
//     const videoPath = path.join(__dirname, "downloads", videoFileName);

//     // Ensure the "downloads" directory exists
//     if (!fs.existsSync(path.join(__dirname, "downloads"))) {
//       fs.mkdirSync(path.join(__dirname, "downloads"));
//     }

//     // Write the video file to disk
//     fs.writeFileSync(videoPath, videoBuffer);

//     // Return the path or download URL
//     console.log(`Video saved to ${videoPath}`);
//     return {
//       videoUrl: `https://insta-video-downloader-backend.vercel.app:${PORT}/downloads/${videoFileName}`,
//       thumbnail: items.thumbnail_src,
//     };

//     // Return the video URL and thumbnail in the response
//   } catch (error) {
//     console.error("Error fetching Instagram data:", error);
//     return { error: "An error occurred while fetching Instagram data." };
//   }
// };

// // API endpoint to handle the download request
// app.get("/api/download", async (req, res) => {
//   const { url } = req.query;

//   if (!url) {
//     return res.status(400).json({ error: "URL is required." });
//   }

//   const data = await getInstagramGraphqlData(url);

//   if (data.error) {
//     return res.status(400).json(data);
//   }

//   res.json(data); // Return the video URL and thumbnail in the response
// });

// // Serve video files
// app.use("/downloads", express.static(path.join(__dirname, "downloads")));

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // To fetch the video file
const { v4: uuidv4 } = require("uuid"); // To generate unique file names
const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

app.use(
  cors({
    origin: ["http://savemyreels.vercel.app", "http://localhost:5173"], // Allow this origin
    methods: "GET, POST", // Allow these HTTP methods
    allowedHeaders: "Content-Type, Authorization", // Allow these headers
  })
);

// Function to extract Instagram post ID from URL
const getId = (url) => {
  const regex =
    /instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(p|reels|reel|stories)\/([A-Za-z0-9-_]+)/;
  const match = url.match(regex);
  return match && match[2] ? match[2] : null;
};

// Function to fetch Instagram GraphQL data
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
      method: "POST",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-IG-App-ID": "936619743392459",
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

    if (!videoUrl) {
      return { error: "No video URL found in the post." };
    }

    // Instead of saving the video, just send the video URL and thumbnail to the client
    return {
      videoUrl: videoUrl, // Return the video URL directly
      thumbnail: items.thumbnail_src, // Return the thumbnail image
    };
  } catch (error) {
    console.error("Error fetching Instagram data:", error);
    return { error: "An error occurred while fetching Instagram data." };
  }
};

// API endpoint to handle the download request
app.get("/api/download", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required." });
  }

  const data = await getInstagramGraphqlData(url);

  if (data.error) {
    return res.status(400).json(data);
  }

  res.json(data); // Return the video URL and thumbnail in the response
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
