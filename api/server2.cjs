// const express = require("express");
// const fetch = require("node-fetch"); // Ensure to install this with npm if not available
// const cors = require("cors");

// const app = express();
// const PORT = 5000;

// app.use(cors());

// // Required headers
// const _userAgent =
//   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36";
// const _xIgAppId = "936619743392459"; // Required! Get your X-Ig-App-Id from your browser

// // Middleware to parse JSON bodies
// app.use(express.json());

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
//         "User-Agent": _userAgent,
//         "Content-Type": "application/x-www-form-urlencoded",
//         "X-IG-App-ID": _xIgAppId,
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

//     // Return custom JSON object
//     return {
//       __typename: items.__typename,
//       shortcode: items.shortcode,
//       dimensions: items.dimensions,
//       display_url: items.display_url,
//       display_resources: items.display_resources,
//       has_audio: items.has_audio,
//       video_url: items.video_url,
//       video_view_count: items.video_view_count,
//       is_video: items.is_video,
//       caption: items?.edge_media_to_caption?.edges[0]?.node?.text,
//       is_paid_partnership: items.is_paid_partnership,
//       location: items.location,
//       owner: items.owner,
//       product_type: items.product_type,
//       video_duration: items.video_duration,
//       thumbnail_src: items.thumbnail_src,
//       clips_music_attribution_info: items.clips_music_attribution_info,
//       sidecar: items?.edge_sidecar_to_children?.edges,
//     };
//   } catch (error) {
//     console.error("Error fetching Instagram data:", error);
//     return { error: "An error occurred while fetching Instagram data." };
//   }
// };

// // Endpoint to handle Instagram URL requests
// app.get("/api/download", async (req, res) => {
//   const { url } = req.query;

//   if (!url) {
//     return res.status(400).json({ error: "URL is required." });
//   }

//   const data = await getInstagramGraphqlData(url);
//   res.json(data);
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
