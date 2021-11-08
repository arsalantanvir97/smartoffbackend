import Printer from "../models/PrinterModel";

const createPrinter = async (req, res) => {
    const { vendorid,type, printerlocation } = req.body;
console.log('req.body',req.body)
const printerid= Math.floor(10000 + Math.random() * 900000);
    try {
      const printer =new Printer ({
        printerid,
        vendorid,
        type,
        printerlocation,
        
        }
      )
      console.log('printer',printer)
    //   const feedbackcreated = await Feedback.create(
    //     feedback
    //   );
    //   console.log('feedbackcreated',feedbackcreated)
    const printercreated=await printer.save()
    console.log('printercreated',printercreated)
      if (printercreated) {
        res.status(201).json({
            printercreated
        });
    } }catch (err) {
      res.status(500).json({
        message: err.toString(),
      });
    }
  };
  export {createPrinter};
