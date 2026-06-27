import {
  BadRequestError,
  STATUS_CODE,
  UnauthorisedError,
} from "../errors/error.js";
import Note from "../models/Note.js";
import { noteSchema } from "../validations/NoteSchema.js";

// get all my notes
export const getNotes = async (req, res) => {
  const user = req.user;

  // fetch all notes belonging to user
  const notes = Note.find({ createdBy: user._id });

  // return response
  res.status(STATUS_CODE.SUCCESS).json({
    message: "Notes Retrieved Successfully",
    notes,
  });
};
// get a note
export const getNote = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  // fetch note by id
  const note = await Note.findById(id);

  //   check if it belongs to user
  if (note.createdBy != user._id) {
    throw new UnauthorisedError("You don't have access to this Note");
  }

  // return response
  res.status(STATUS_CODE.SUCCESS).json({
    message: "Note Retrieved Successfully",
    note,
  });
};
// create a note
export const createNote = async (req, res) => {
  const user = req.user;

  // collect data
  const { title, content } = noteSchema.parse(req.body);

  const note = new Note({
    title,
    content,
    createdBy: user._id,
  });
  await note.save();

  res.status(STATUS_CODE.CREATED).json({
    message: "Note Created Successfully",
    note,
  });
};
// edit a note
export const editNote = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  // fetch note by id
  const note = await Note.findById(id);

  //   check if it belongs to user
  if (note.createdBy != user._id) {
    throw new UnauthorisedError("You don't have access to this Note");
  }

  const { title, content } = req.body;

  //   check that atleast one is provided
  const titleTrimmed = typeof title === "string" ? title.trim() : "";
  const contentTrimmed = typeof content === "string" ? content.trim() : "";

  if (titleTrimmed === "" && contentTrimmed === "") {
    throw new BadRequestError("Title or content is required");
  } else if (contentTrimmed !== "" && titleTrimmed === "") {
    note.content = contentTrimmed;
  } else if (titleTrimmed !== "" && contentTrimmed === "") {
    note.title = titleTrimmed;
  } else {
    note.title = titleTrimmed;
    note.content = contentTrimmed;
  }

  await note.save();
  // return response
  res.status(STATUS_CODE.SUCCESS).json({
    message: "Note Edited Successfully",
    note,
  });
};
// delete a note
export const deleteNote = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  // fetch note by id
  const note = await Note.findById(id);
  const noteName = note.title;

  //   check if it belongs to user
  if (note.createdBy != user._id) {
    throw new UnauthorisedError("You don't have access to this Note");
  }

  //   delete note
  await Note.findByIdAndDelete(id);

  // return response
  res.status(STATUS_CODE.SUCCESS).json({
    message: `${noteName} Deleted Successfully`,
  });
};
