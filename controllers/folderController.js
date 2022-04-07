import Folder from "../models/FolderModel";
import File from "../models/FileModal";

import CreateNotification from "../utills/notification";
const createFolder = async (req, res) => {
  const { userid, folderName } = req.body;
  console.log("req.body", req.body);
  let doc_schedule =
    req.files &&
    req.files.doc_schedule &&
    req.files.doc_schedule[0] &&
    req.files.doc_schedule[0].path;
  try {
    const folder = new Folder({
      userid,
      fileArr: doc_schedule,
      folderName
    });
    const foldercreated = await folder.save();
    console.log("foldercreated", foldercreated);
    if (foldercreated) {
      res.status(201).json({
        foldercreated
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const createaFolder = async (req, res) => {
  const { userid, folderName,filename } = req.body;
  console.log("req.body", req.body);
  let doc_schedule =
    req.files &&
    req.files.doc_schedule &&
    req.files.doc_schedule[0] &&
    req.files.doc_schedule[0].path;
    let filetype=req.files.doc_schedule[0].mimetype;

  try {
    const folder = new Folder({
      userid,
      fileArr: [{file:doc_schedule,filename:filename,filetype:filetype}],
      folderName
    });
    const foldercreated = await folder.save();
    console.log("foldercreated", foldercreated);
    if (foldercreated) {
      res.status(201).json({
        foldercreated
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const createFile = async (req, res) => {
  const { userid, filename } = req.body;
  console.log("req.body", req.body);
  let doc_schedule =
    req.files &&
    req.files.doc_schedule &&
    req.files.doc_schedule[0] &&
    req.files.doc_schedule[0].path;
  console.log("doc_schedule", req.files.doc_schedule[0]);
  let filetype = req.files.doc_schedule[0].mimetype;
  try {
    const file = new File({
      userid,
      docfile: doc_schedule,
      filename,
      filetype
    });
    const filecreated = await file.save();
    console.log("filecreated", filecreated);

    res.status(201).json({
      filecreated
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const getallfilesfolder = async (req, res) => {
  const { userid } = req.body;
  console.log("req.body userid", req.body);

  try {
    const file = await File.find({ userid: userid });

    const folder = await Folder.find({ userid: userid });
    const userdata = [...file, ...folder];
    console.log("userdata", userdata);
    res.status(201).json({
      userdata
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    await File.findByIdAndRemove(req.params.id);
    return res.status(201).json({ message: "File Deleted" });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const deleteFolder = async (req, res) => {
  try {
    await Folder.findByIdAndRemove(req.params.id);
    return res.status(201).json({ message: "Folder Deleted" });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const folderDetails = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    await res.status(201).json({
      folder
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const uploadFilesinFolder = async (req, res) => {
  const { folderid } = req.body;
  console.log("req.body folderid", req.body);

  try {
    let doc_schedule =
      req.files &&
      req.files.doc_schedule &&
      req.files.doc_schedule[0] &&
      req.files.doc_schedule[0].path;
    console.log("doc_schedule", doc_schedule);
    const folder = await Folder.findOne({ _id: folderid });
    console.log("folder", folder, folder.fileArr);
    folder.fileArr = [...folder.fileArr, doc_schedule];
    const updatedfolder = await folder.save();
    res.status(201).json({
      updatedfolder
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const uploadFilesinaFolder = async (req, res) => {
  const { folderid,filename } = req.body;
  console.log("req.body folderid", req.body);

  try {
    let doc_schedule =
      req.files &&
      req.files.doc_schedule &&
      req.files.doc_schedule[0] &&
      req.files.doc_schedule[0].path;
      let filetype=req.files.doc_schedule[0].mimetype;
    console.log("doc_schedule", doc_schedule);
    const folder = await Folder.findOne({ _id: folderid });
    folder.fileArr = [...folder.fileArr,  {file:doc_schedule,filename:filename,filetype:filetype}];
    const updatedfolder = await folder.save();
    res.status(201).json({
      updatedfolder
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const editFolder = async (req, res) => {
  const { folder_id, name } = req.body;
  console.log("req.body folderid", req.body);

  try {
    const folder = await Folder.findOne({ _id: folder_id });
    folder.folderName = name;
    const updatedfolder = await folder.save();
    res.status(201).json({
      updatedfolder
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const recentFiles = async (req, res) => {
  try {
    const file = await File.find({ userid: req.id })
      .sort({ $natural: -1 })
      .limit(5);

    res.status(201).json({
      file
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

const deleteFileinFolder = async (req, res) => {
  const { index } = req.body;
  console.log("req.body index", req.body);
  try {
    const folder = await Folder.findOne({ _id: req.params.id });
    console.log("folder", folder);
    folder.fileArr.splice(index, 1);
    const updatedfolder = await folder.save();
    res.status(201).json({
      updatedfolder
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const searchbyFileName = async (req, res) => {
  const { searchString, userid } = req.body;
  console.log("req.body index", req.body);
  try {
    const file = await File.find({
      userid: userid,
      docfile: { $regex: searchString }
    });

    const folder = await Folder.find({ userid: userid });
    const userdata = [...file, ...folder];

    console.log("userdata", userdata);

    res.status(201).json({
      userdata
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const searchbyaFileName = async (req, res) => {
  const { searchString, userid } = req.body;
  console.log("req.body index", req.body);
  try {
    const file = await File.find({
      userid: userid,
      filename: { $regex: searchString }
    });

    const folder = await Folder.find({ userid: userid });
    const userdata = [...file, ...folder];

    console.log("userdata", userdata);

    res.status(201).json({
      userdata
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};


const searchFilesinFolder = async (req, res) => {
  const { searchString, folderid } = req.body;
  console.log("req.body index", req.body);
  try {
    const folder = await Folder.findOne({
      _id: folderid,
      fileArr: { $regex: searchString }
    });
    console.log("folder", folder);

    res.status(201).json({
      folder
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};
const searchFilesinaFolder = async (req, res) => {
  const { searchString, folderid } = req.body;
  console.log("req.body index", req.body);
  try {
    const folder = await Folder.findOne({
      _id: folderid,
      'fileArr.filename': { $regex: searchString }
    });
    console.log("folder", folder);

    res.status(201).json({
      folder
    });
  } catch (err) {
    res.status(500).json({
      message: err.toString()
    });
  }
};

export {
  createFolder,
  createFile,
  getallfilesfolder,
  deleteFile,
  deleteFolder,
  folderDetails,
  uploadFilesinFolder,
  deleteFileinFolder,
  searchbyFileName,
  searchFilesinFolder,
  editFolder,
  recentFiles,
  createaFolder,
  uploadFilesinaFolder,
  searchbyaFileName,
  searchFilesinaFolder
};
