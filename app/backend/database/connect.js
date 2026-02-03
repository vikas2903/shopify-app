import mongoose from "mongoose";

const connectDatabase = async () => {
  const MONGOURL = process.env.MONGO_URI || "mongodb+srv://vikasprasad2903:vikas2903@cluster0.nq7t1.mongodb.net/testmongodb+srv://vikasprasad2903:O3R7PnVQUr0DZO7g@cluster0.pyizi.mongodb.net/?appName=Cluster0";
  
  if (!MONGOURL) {
    console.error("MongoDB URI is not defined in environment variables");
    process.exit(1); 
  } else {
    console.log("MongoDB URI is defined in environment variables: ", MONGOURL);
  }

  try { 
    await mongoose.connect(MONGOURL);
    
    console.log("MongoDB Connected Successfully :file connect.js");
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });

  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDatabase;
