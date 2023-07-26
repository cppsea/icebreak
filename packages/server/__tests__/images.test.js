const request = require("supertest");
const app = require("../index");
const { v4: uuivd4 } = require("uuid");
const fs = require("fs/promises");
const path = require("path");
const { closePostgres } = require("../utils/postgres");

afterAll(() => {
  closePostgres();
});

describe("API Image Handling Tests", () => {
  test("PUT /images - Uploading an image to AWS S3", async () => {
    const res = await request(app)
      .put(`/api/media/images/user/${uuivd4()}`)
      .set("content-type", "multipart/form-data")
      .attach(
        "image",
        path.resolve(__dirname + "../../../../assets/small_banner.jpg")
      );
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.s3Response).toBeTruthy();
  });

  test("PUT /images - Uploading a guild banner image to AWS S3", async () => {
    const response = await request(app)
      .put(`/api/media/images/guild/${uuivd4()}`)
      .send();
    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data.imageUrl).toBeTruthy();
    expect(response.body.data.imageUrl).toMatch(
      /^https:\/\/icebreak-assets.s3.us-west-1.amazonaws.com/
    );
  });

  test("PUT /images - Uploading a user avatar image to AWS S3", async () => {
    const response = await request(app).put("/api/media/images/user").send({
      id: uuivd4(),
      imageData: "image data",
    });
    expect(response.statusCode).toEqual(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data.imageUrl).toBeTruthy();
    expect(response.body.data.imageUrl).toMatch(
      /^https:\/\/icebreak-assets.s3.us-west-1.amazonaws.com/
    );
  });

  test("PUT /images - Bad image upload request", async () => {
    const response = await request(app).put("/api/media/images");
    expect(response.statusCode).toEqual(400);
    expect(response.body.status).toBe("error");
    expect(response.body.message).toBeTruthy();
    expect(response.body.data).toBeFalsy();
  });

  // fetching event banner

  // fetching guild banner

  // fetching user avatar

  // updating event banner

  // updating guild banner

  // updating user avatar

  // deleting event banner

  // deleting guild banner

  // deleting user avatar
});
