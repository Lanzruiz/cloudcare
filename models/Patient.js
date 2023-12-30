const mongoose = require('mongoose')

const PatientSchema = new mongoose.Schema({
    nurse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    firstname: {
      type: String,
      required: true
    },
    middlename: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    age: {
        type: Number,
        required: true
    },
    house: {

    },
    characteristics: [
      {
        mood: {
          type: String,
          required: false
        },
        behavior: {
          type: String,
          required: false
        },
        spotted: {
            type: Date,
            required: false
        },
      }
    ],
    illnes: [
      {
        name: {
          type: String,
          required: true
        },
        hospitalize: {
          type: Date,
          required: true
        },
        discharge: {
          type: Date,
          required: true
        },
        current: {
          type: Boolean,
          default: false
        }
      }
    ],
    date: {
      type: Date,
      default: Date.now
    }
  });

  module.exports = mongoose.model('patient', PatientSchema);