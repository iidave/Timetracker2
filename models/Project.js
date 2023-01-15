const mongoose = require('mongoose');
const slugify = require('slugify');
// const geocoder = require('../utils/geocoder'); - OK to remove

const ProjectSchema = new mongoose.Schema(
  {
    client: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [50, 'Description can not be more than 500 characters'],
    },
    jobNo: {
      type: String,
      require: true,
    },
    acctExec: {
      type: String,
      required: true,
    },
    pm: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create Bootcamp Slug from the name
ProjectSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// //Geocode & Create location field
// ProjectSchema.pre('save', async function (next) {
//   const loc = await geocoder.geocode(this.address);
//   this.location = {
//     type: 'Point',
//     coordinates: [loc[0].longitude, loc[0].latitude],
//     formattedAddress: loc[0].formattedAddress,
//     street: loc[0].streetName,
//     city: loc[0].city,
//     state: loc[0].stateCode,
//     zipcode: loc[0].zipcode,
//     country: loc[0].countryCode,
//   };

//Do not save address in DB
//   this.address = undefined;
//   next();
// });

//Cascade delete courses when a bootcamp is deleted
ProjectSchema.pre('remove', async function (next) {
  console.log(`Tasks being removed for project ${this._id}`);
  await this.model('Task').deleteMany({ project: this._id });
  next();
});

//Reverse populate with virtuals
ProjectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  justOne: false,
});

module.exports = mongoose.model('Project', ProjectSchema);
