const express = require("express");
const app = express();
const port = 4000;
const bodyParser = require("body-parser");
const db = require("./src/connection");
const response = require("./src/response");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  response(200, "API Ready to go", "SUCCESS", res);
});

app.get("/mahasiswa", (req, res) => {
  const sql = "SELECT * FROM mahasiswa";
  db.query(sql, (err, fields) => {
    if (err) throw err;
    response(200, fields, "Data berhasil ditampilkan", res);
  });
});

app.get("/mahasiswa/:nim", (req, res) => {
  const nim = req.params.nim;
  const sql = `SELECT kelas, nama_lengkap FROM mahasiswa WHERE nim = ${nim}`;

  db.query(sql, (err, result) => {
    response(200, result, "Data Mahasiswa", res);
  });
});

app.get("/dosen/:nidn", (req, res) => {
  const nidn = req.params.nidn;
  const sql = `SELECT nama_lengkap, alamat FROM dosen WHERE nidn = ${nidn}`;

  db.query(sql, (err, result) => {
    response(200, result, "Data Dosen", res);
  });
});

app.post("/mahasiswa", (req, res) => {
  const { nim, namaLengkap, kelas } = req.body;
  const sql = `INSERT INTO mahasiswa (nim, nama_lengkap, kelas) values (${nim}, "${namaLengkap}", "${kelas}")`;

  db.query(sql, (err, fields) => {
    if (err) response(400, "Invalid", "error", res);

    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        id: fields.insertId,
      };
      response(200, data, "Data Berhasil Masuk", res);
    }
  });
});

app.post("/dosen", (req, res) => {
  const { nidn, namaLengkap, alamat } = req.body;
  const sql = `INSERT INTO dosen (nidn, nama_lengkap, alamat) values (${nidn}, "${namaLengkap}", "${alamat}")`;

  db.query(sql, (err, result) => {
    if (err) response(400, "Invalid", "error", res);

    if (result?.affectedRows) {
      const data = {
        isSuccess: result.affectedRows,
        id: result.insertId,
      };
      response(200, data, "success", res);
    }
  });
});

app.put("/mahasiswa", (req, res) => {
  const { nim, namaLengkap, kelas } = req.body;
  const sql = `UPDATE mahasiswa SET nama_lengkap = "${namaLengkap}", kelas = "${kelas}" WHERE nim = ${nim} `;

  db.query(sql, (err, fields) => {
    if (err) response(400, "Invalid", "error", res);

    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        message: fields.message,
      };
      response(200, data, "Data berhasil diupdate", res);
    } else {
      response(500, "Invalid Data", "Data tidak berhasil diupdate", res);
    }
  });
});

app.put("/dosen", (req, res) => {
  const { nidn, namaLengkap, alamat } = req.body;
  const sql = `UPDATE dosen SET nama_lengkap = "${namaLengkap}", alamat = "${alamat}" WHERE nidn = ${nidn} `;

  db.query(sql, (err, fields) => {
    if (err) response(400, "Invalid", "error", res);
    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        message: fields.message,
      };
      response(200, data, "Data berhasil diupdate", res);
    } else {
      response(400, "Invalid Data", "Data tidak berhasil diupdate", res);
    }
  });
});

app.delete("/mahasiswa", (req, res) => {
  const { nim } = req.body;
  const sql = `DELETE FROM mahasiswa where nim = ${nim}`;

  db.query(sql, (err, fields) => {
    if (err) response(400, "invalid", "error", res);
    if (fields?.affectedRows) {
      const data = {
        isDeleted: fields.affectedRows,
      };
      response(200, data, "Data berhasil dihapus", res);
    } else {
      response(400, "Data Invalid", "Data tidak berhasil dihapus", res);
    }
  });
});

app.delete("/dosen", (req, res) => {
  const { nidn } = req.body;
  const sql = `DELETE FROM dosen WHERE nidn = ${nidn}`;

  db.query(sql, (err, fields) => {
    if (err) response(400, "Invalid", "error", res);
    if(fields?.affectedRows) {
      const data = {
        isDeleted: fields.affectedRows,
      }
      response(200, data, "Data berhasil dihapus", res)
    } else {
      response(400, "Data Invalid", "Data tidak berhasil dihapus", res)
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
