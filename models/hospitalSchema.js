import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  doctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  }],
  specialties: [{type: String, required: true}],
  location: {
    type: String,
    required: true
  },
  logo: String,
  coverPhoto: String
})


const Hospital = mongoose.model('Hospital', hospitalSchema);

export { Hospital };
