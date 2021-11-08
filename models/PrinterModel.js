import mongoose from "mongoose";

const PrinterSchema = mongoose.Schema(
    {
      printerid: { type: String},
     vendorid:{ type: String},
      type: { type: String, },

printerlocation:{type: String},
    },
    {
      timestamps: true,
    }
  )

const Printer = mongoose.model("Printer", PrinterSchema);

export default Printer;