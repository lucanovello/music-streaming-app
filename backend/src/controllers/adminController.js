import { Song } from "../models/songModel.js";
import { Album } from "../models/albumModel.js";
import cloudinary from "../lib/cloudinary.js";

// Cloudinary helper for uploading files
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: auto,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Upload failed");
  }
};

export const createSong = async (req, res, next) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: "Please upload all files" });
    }
    if (!req.files.audioFile) {
      return res.status(400).json({ message: "Please upload audio file" });
    }
    if (!req.files.imageFile) {
      return res.status(400).json({ message: "Please upload image file" });
    }

    const { title, artist, albumId, duration, genre } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    // Validate input
    if (!title) {
      return res.status(400).json({ message: "Song title required" });
    }
    if (!artist) {
      return res.status(400).json({ message: "Song artist required" });
    }
    if (!duration) {
      return res.status(400).json({ message: "Song duration required" });
    }
    if (!genre) {
      return res.status(400).json({ message: "Song genre required" });
    }

    const audioUrl = uploadToCloudinary(audioFile);
    const imageUrl = uploadToCloudinary(imageFile);

    // Create a new song
    const newSong = new Song({
      title,
      artist,
      audioFile,
      imageFile,
      duration,
      genre,
      albumId: albumId || null,
    });

    await newSong.save();

    // add to album if albumId is provided
    if (albumId) {
      const album = await Album.findByIdAndUpdate(albumId, {
        $push: { songs: newSong._id },
      });
    }
    res.status(201).json(newSong);
  } catch (error) {
    console.error("Error in createSong:", error);
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.error("Error in deleteSong:", error);
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;

    // Validate input
    if (!title) {
      return res.status(400).json({ message: "Album title required" });
    }
    if (!artist) {
      return res.status(400).json({ message: "Album artist required" });
    }
    if (!releaseYear) {
      return res.status(400).json({ message: "Album release date required" });
    }
    if (!imageFile) {
      return res.status(400).json({ message: "Please upload image file" });
    }

    const imageUrl = await uploadToCloudinary(imageFile);

    // Create a new album
    const newAlbum = new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
    });

    await newAlbum.save();

    res.status(201).json(newAlbum);
  } catch (error) {
    console.error("Error in createAlbum:", error);
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const album = await Album.findById(id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);
    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAlbum:", error);
    next(error);
  }
};

export const checkAdmin = async (req, res, next) => {
  res.status(200).json({ message: "User is admin" });
};
