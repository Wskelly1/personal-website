declare module '@/models/AdminConfig' {
  import { Model, Document } from 'mongoose';
  
  export interface IAdminConfig extends Document {
    key: string;
    passwordHash: string;
    email: string;
    updatedAt: Date;
  }
  
  const AdminConfig: Model<IAdminConfig>;
  export default AdminConfig;
} 