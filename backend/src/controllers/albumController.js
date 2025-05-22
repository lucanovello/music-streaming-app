import { Album } from "../models/albumModel.js";

export const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (error) {
    console.error("Error fetching all albums:", error);
    next(error);
  }
};

export const getAlbumById = async (req, res) => {
  const { id } = req.params;
  try {
    const album = await Album.findById(id).populate("songs");
    // Check if the album exists
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    res.status(200).json(album);
  } catch (error) {
    console.error("Error fetching album by id:", error);
    next(error);
  }
};
