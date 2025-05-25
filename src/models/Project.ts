import mongoose, { Document, Model } from 'mongoose';

// Define the interface for the document
export interface IProject extends Document {
  title: string;
  summaryTitle?: string;
  summaryDescription?: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  link?: string;
  pdfUrl?: string;
  zipUrl?: string;
  githubUrl?: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  createdAt: Date;
  featured?: boolean;
}

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  summaryTitle: {
    type: String,
    maxlength: 40,
    required: false,
  },
  summaryDescription: {
    type: String,
    maxlength: 100,
    required: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: false,
  },
  pdfUrl: {
    type: String,
    required: false,
  },
  zipUrl: {
    type: String,
    required: false,
  },
  githubUrl: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'upcoming'],
    default: 'in-progress',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);

export default Project; 