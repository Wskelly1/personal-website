import mongoose, { Document, Model } from 'mongoose';

// Define the interface for the document
export interface IAdminConfig extends Document {
  key: string;
  passwordHash: string;
  email: string;
  updatedAt: Date;
}

const AdminConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the timestamp when document is modified
AdminConfigSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const AdminConfig: Model<IAdminConfig> = mongoose.models.AdminConfig || mongoose.model<IAdminConfig>('AdminConfig', AdminConfigSchema);

export default AdminConfig; 