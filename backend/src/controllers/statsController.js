import { Song } from "../models/songModel.js";
import { User } from "../models/userModel.js";
import { Album } from "../models/albumModel.js";

export const getStats = async (req, res, next) => {
  try {
    const [totalSongs, totalUsers, totalAlbums, totalArtists, totalGenres] =
      await Promise.all([
        Song.countDocuments(),
        User.countDocuments(),
        Album.countDocuments(),

        Song.aggregate([
          {
            $unionWith: {
              coll: "albums",
              pipeline: [],
            },
          },
          {
            $group: {
              _id: "$artist",
            },
          },
          {
            $count: "count",
          },
        ]),
      ]);

    res.status(200).json({
      totalUsers,
      totalAlbums,
      totalSongs,
      totalArtists: totalArtists[0]?.count || 0,
      totalGenres: totalGenres[0]?.count || 0,
    });
  } catch (error) {
    console.error("Error fetching all stats:", error);
    next(error);
  }
};
