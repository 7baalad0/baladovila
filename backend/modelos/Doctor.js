//modelo doctor

import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
{
    //iddoc: {type: String, required: true, unique: true}, // uso el _id de mongodb como iddoc
    nomedoc: {type: String, required: true},
    apeldoc: {type: String, required: true},
    coledoc: {type: Boolean, required: true},
    movildoc: {type: String, required: true},
    maildoc: {type: String, required: false},
    espedoc: {type: String, required: true},
},

{
    collection: "doctores"
}
)
export default mongoose.model("Doctor", DoctorSchema);