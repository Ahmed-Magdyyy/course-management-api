const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    image: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true,
      transform: (doc, ret)=>{
        delete ret._id;
        delete ret.__v
        return ret
      }
     },
    toObject: { virtuals: true },
  }
);


// Virtual for image URL
CourseSchema.virtual('imageUrl').get(function() {
  if (!this.image) return null;
  return `${process.env.BASE_URL}/uploads/courses/${this.image}`;
});

// Delete associated image when course is removed
CourseSchema.pre('findOneAndDelete', async function(next) {
  const course = await this.model.findOne(this.getFilter());
  if (course?.image) {
    const imagePath = path.join(__dirname, '../public/uploads/courses', course.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
  next();
});

module.exports = mongoose.model('Course', CourseSchema);
