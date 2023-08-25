import mongoose from "mongoose";
import "./init/db";

beforeAll((done) => {
  mongoose.connection.on("connected", async () => {
    done();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
