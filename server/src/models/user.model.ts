import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
      required: [true, 'User Email is required'],
      trim: true,
      type: String,
      unique: true,
    },
    name: {
      maxLength: 50,
      minLength: 2,
      required: [true, 'User Name is required'],
      trim: true,
      type: String,
    },
    password: {
      minLength: 6,
      required: [true, 'User Password is required'],
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
