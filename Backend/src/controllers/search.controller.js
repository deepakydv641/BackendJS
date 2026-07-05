import { Video } from "../models/video.model.js"
import client from "../utils/elasticsearch.js";

export const getSearchedVideos = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.json([]);
    }

    const result = await client.search({
        index: "videos",
        query: {
            multi_match: {
                query: q,
                type: "bool_prefix",
                fields: [
                    "title",
                    "title._2gram",
                    "title._3gram"
                ]
            }
        }
    });

    const matchedTitles = result.hits.hits.map(hit => hit._source.title);

    const unorderedVideos = await Video.find({
        title: { $in: matchedTitles }
    }).populate("owner", "username avatar fullName createdAt");

    // Preserve Elasticsearch's relevance sorting order
    const videos = matchedTitles.map(title =>
        unorderedVideos.find(v => v.title === title)
    ).filter(Boolean);

    res.json(videos);
};
