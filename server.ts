import express, { Express } from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import path from "path";
import fs from "fs";

const app: Express = express();

app.use(express.json());

// multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// API to compare pdf files
app.post("/api/find-match", upload.array("files", 2), async (req, res) => {
  try {
    const files: any = req.files;

    const bufferDataOne = fs.readFileSync(path.join(__dirname, files[0].path));
    const bufferDataTwo = fs.readFileSync(path.join(__dirname, files[1].path));

    fs.unlinkSync(path.join(__dirname, files[0].path));
    fs.unlinkSync(path.join(__dirname, files[1].path));

    const resultOne = await pdfParse(bufferDataOne);
    const resultTwo = await pdfParse(bufferDataTwo);

    let match = false;
    if (resultOne.text === resultTwo.text) match = true;
    return res
      .status(200)
      .json({ match, textOne: resultOne.text, textTwo: resultTwo.text });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// serve html file on this path
app.use(express.static(path.join(__dirname, "client")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
