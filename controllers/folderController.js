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
      const notification = {
        notifiableId: null,
        notificationType: "Admin",
        title: "Folder Created",
        body: `A folder name ${folderName} has been created by user having id of ${userid}`,
        payload: {
          type: "User",
          id: userid
        }
      };
      CreateNotification(notification);

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
  const { userid } = req.body;
  console.log("req.body", req.body);
  let doc_schedule =
    req.files &&
    req.files.doc_schedule &&
    req.files.doc_schedule[0] &&
    req.files.doc_schedule[0].path;
    console.log('doc_schedule',doc_schedule)
  try {
    const file = new File({
      userid,
      docfile: doc_schedule
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
    console.log('userdata',userdata);
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
export { createFolder, createFile, getallfilesfolder ,deleteFile,deleteFolder};
