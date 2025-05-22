import mongoose from "mongoose";

const connectDatabase = async () => {
  const MONGOURL = process.env.MONGO_URI;
  try {
    await mongoose.connect(MONGOURL, {
      newUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");

  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDatabase;
