import mongoose from 'mongoose';

const readingListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  link: {
    type: String,
    required: false,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: false,
    trim: true,
  },
  notes: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['Reading', 'Completed', 'Want to Read'],
    default: 'Want to Read',
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  dateCompleted: {
    type: Date,
    required: false,
  },
  isTopRead: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.ReadingList || mongoose.model('ReadingList', readingListSchema); 